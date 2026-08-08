import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal, ArrowUpDown, Grid2x2, List, Check, Trash2, X } from 'lucide-react';
import { useDrive } from '../../context/DriveContext.jsx';
import { useToast } from '../Toast/ToastProvider.jsx';
import { getFileMeta } from '../../utils/fileTypes';

const TYPE_OPTIONS = ['pdf', 'image', 'video', 'document', 'audio', 'zip'];
const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'createdAt', label: 'Date created' },
  { value: 'modifiedAt', label: 'Date modified' },
  { value: 'size', label: 'Size' }
];

export default function FilterBar() {
  const {
    activeFilters,
    setActiveFilters,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    viewMode,
    setViewMode,
    selectedIds,
    clearSelection,
    deleteFile
  } = useDrive();
  const { push } = useToast();
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const toggleFilter = (type) =>
    setActiveFilters((f) => (f.includes(type) ? f.filter((t) => t !== type) : [...f, type]));

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative">
        <button
          onClick={() => {
            setFilterOpen((v) => !v);
            setSortOpen(false);
          }}
          className={`btn-ghost !py-2 !px-3 text-xs ${activeFilters.length ? '!text-ink bg-white/[0.06]' : ''}`}
        >
          <SlidersHorizontal size={14} />
          Filter {activeFilters.length > 0 && `(${activeFilters.length})`}
        </button>
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute mt-2 w-52 glass-panel p-2 z-40"
            >
              {TYPE_OPTIONS.map((type) => {
                const meta = getFileMeta(type);
                const active = activeFilters.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleFilter(type)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.07] text-sm"
                  >
                    <meta.icon size={14} style={{ color: meta.color }} />
                    <span className="flex-1 text-left">{meta.label}</span>
                    {active && <Check size={14} className="text-aurora-teal" />}
                  </button>
                );
              })}
              {activeFilters.length > 0 && (
                <button
                  onClick={() => setActiveFilters([])}
                  className="w-full text-center text-xs text-ink-faint py-1.5 hover:text-ink"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        <button
          onClick={() => {
            setSortOpen((v) => !v);
            setFilterOpen(false);
          }}
          className="btn-ghost !py-2 !px-3 text-xs"
        >
          <ArrowUpDown size={14} />
          Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
        </button>
        <AnimatePresence>
          {sortOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute mt-2 w-48 glass-panel p-2 z-40"
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.07] text-sm"
                >
                  <span className="flex-1 text-left">{opt.label}</span>
                  {sortBy === opt.value && <Check size={14} className="text-aurora-teal" />}
                </button>
              ))}
              <div className="border-t border-white/[0.06] my-1" />
              <button
                onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.07] text-sm"
              >
                {sortDir === 'asc' ? 'Ascending' : 'Descending'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-1.5 glass-panel !rounded-xl px-2 py-1">
          <span className="text-xs text-ink-faint px-1.5">{selectedIds.length} selected</span>
          <button
            onClick={() => {
              selectedIds.forEach((id) => deleteFile(id));
              push({ type: 'success', message: `${selectedIds.length} file(s) moved to trash` });
              clearSelection();
            }}
            className="flex items-center gap-1.5 text-xs text-aurora-rose hover:bg-aurora-rose/10 px-2.5 py-1.5 rounded-lg"
          >
            <Trash2 size={13} /> Delete
          </button>
          <button
            onClick={clearSelection}
            className="flex items-center gap-1.5 text-xs text-ink-faint hover:text-ink px-2 py-1.5 rounded-lg"
          >
            <X size={13} /> Clear
          </button>
        </div>
      )}

      <div className="ml-auto flex items-center gap-1 glass-panel p-1">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-aurora-gradient text-white' : 'text-ink-faint hover:text-ink'}`}
          aria-label="Grid view"
        >
          <Grid2x2 size={15} />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-aurora-gradient text-white' : 'text-ink-faint hover:text-ink'}`}
          aria-label="List view"
        >
          <List size={15} />
        </button>
      </div>
    </div>
  );
}
