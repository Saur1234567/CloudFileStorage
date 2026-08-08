import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDrive } from '../../context/DriveContext.jsx';
import { getFileMeta } from '../../utils/fileTypes';

const RECENT_KEY = 'drivex-recent-searches';

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-aurora-violet/30 text-ink rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchBar() {
  const { files, folders } = useDrive();
  const navigate = useNavigate();
  const [raw, setRaw] = useState('');
  const [debounced, setDebounced] = useState('');
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const containerRef = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(raw.trim()), 250);
    return () => clearTimeout(id);
  }, [raw]);

  useEffect(() => {
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const results = useMemo(() => {
    if (!debounced) return { files: [], folders: [] };
    const q = debounced.toLowerCase();
    return {
      files: files.filter((f) => !f.trashed && f.name.toLowerCase().includes(q)).slice(0, 5),
      folders: folders.filter((f) => !f.trashed && f.name.toLowerCase().includes(q)).slice(0, 4)
    };
  }, [debounced, files, folders]);

  const commitSearch = (term) => {
    if (!term) return;
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const hasResults = results.files.length > 0 || results.folders.length > 0;

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl">
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === 'Enter' && commitSearch(raw.trim())}
          placeholder="Search files and folders..."
          className="w-full glass !bg-white/[0.05] rounded-xl2 pl-10 pr-9 py-2.5 text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-aurora-violet/50 transition-shadow"
        />
        {raw && (
          <button
            onClick={() => setRaw('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (raw || recent.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute mt-2 w-full glass-panel p-2 z-50 max-h-96 overflow-y-auto"
          >
            {debounced ? (
              hasResults ? (
                <div className="flex flex-col gap-1">
                  {results.folders.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => commitSearch(f.name)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.06] text-left text-sm"
                    >
                      <FileText size={15} className="text-aurora-teal shrink-0" />
                      <span className="truncate">{highlight(f.name, debounced)}</span>
                      <span className="ml-auto text-[11px] text-ink-faint">Folder</span>
                    </button>
                  ))}
                  {results.files.map((f) => {
                    const meta = getFileMeta(f.type);
                    return (
                      <button
                        key={f.id}
                        onClick={() => commitSearch(f.name)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.06] text-left text-sm"
                      >
                        <meta.icon size={15} style={{ color: meta.color }} className="shrink-0" />
                        <span className="truncate">{highlight(f.name, debounced)}</span>
                        <span className="ml-auto text-[11px] text-ink-faint">{meta.label}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-ink-faint px-3 py-4 text-center">No matches for "{debounced}"</p>
              )
            ) : (
              recent.length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-ink-faint px-3 py-1.5">
                    Recent searches
                  </p>
                  {recent.map((term) => (
                    <button
                      key={term}
                      onClick={() => commitSearch(term)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.06] text-left text-sm"
                    >
                      <Clock size={14} className="text-ink-faint" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
