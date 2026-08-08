import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Download,
  Maximize2,
  Play,
  Pause,
  FileText,
  Share2,
  Star,
  Info
} from 'lucide-react';
import { useUI } from '../../context/UIContext.jsx';
import { useDrive } from '../../context/DriveContext.jsx';
import { getFileMeta } from '../../utils/fileTypes';
import { formatBytes, formatDate } from '../../utils/format';
import { useToast } from '../Toast/ToastProvider.jsx';

function PreviewBody({ file }) {
  const [playing, setPlaying] = useState(false);
  const meta = getFileMeta(file.type);

  if (file.type === 'image') {
    return (
      <img
        src={`https://picsum.photos/seed/${file.id}/900/600`}
        alt={file.name}
        className="w-full h-full object-cover rounded-xl2"
      />
    );
  }

  if (file.type === 'video') {
    return (
      <div className="relative w-full h-full rounded-xl2 overflow-hidden bg-black flex items-center justify-center">
        <img
          src={`https://picsum.photos/seed/${file.id}vid/900/600`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <button
          onClick={() => setPlaying((p) => !p)}
          className="relative z-10 w-16 h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center hover:scale-105 transition-transform"
        >
          {playing ? <Pause size={26} className="text-white" /> : <Play size={26} className="text-white ml-1" />}
        </button>
      </div>
    );
  }

  if (file.type === 'audio') {
    return (
      <div className="w-full h-full rounded-xl2 bg-aurora-gradient-soft flex flex-col items-center justify-center gap-6">
        <div className="flex items-end gap-1 h-16">
          {Array.from({ length: 28 }).map((_, i) => (
            <motion.span
              key={i}
              animate={playing ? { height: [8, 10 + ((i * 37) % 40), 8] } : { height: 8 }}
              transition={{ duration: 0.9, repeat: playing ? Infinity : 0, delay: i * 0.03 }}
              className="w-1.5 rounded-full bg-aurora-gradient"
              style={{ height: 8 }}
            />
          ))}
        </div>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="w-14 h-14 rounded-full bg-aurora-gradient shadow-glow flex items-center justify-center text-white"
        >
          {playing ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
        </button>
      </div>
    );
  }

  if (file.type === 'text') {
    return (
      <div className="w-full h-full rounded-xl2 bg-white/[0.03] p-6 overflow-y-auto font-mono text-xs text-ink-muted leading-relaxed">
        {'# ' + file.name}
        {'\n\n'}
        This is a preview placeholder for a text file. In production, DriveX streams the actual
        file content from `GET /api/files/download/{'{id}'}` and renders it here.
        {'\n\n'}
        - Line one of the changelog
        {'\n'}- Line two of the changelog
        {'\n'}- Line three of the changelog
      </div>
    );
  }

  // pdf and document and zip fallback
  return (
    <div className="w-full h-full rounded-xl2 bg-white/[0.03] flex flex-col items-center justify-center gap-4">
      <div className="w-20 h-24 rounded-lg glass flex items-center justify-center">
        <meta.icon size={34} style={{ color: meta.color }} />
      </div>
      <p className="text-sm text-ink-faint">Preview not available inline — download to view</p>
    </div>
  );
}

export default function PreviewModal() {
  const { previewItem, setPreviewItem, openDialog } = useUI();
  const { toggleStarFile } = useDrive();
  const { push } = useToast();
  const [fullscreen, setFullscreen] = useState(false);
  if (!previewItem) return null;
  const file = previewItem;
  const meta = getFileMeta(file.type);

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
        onClick={() => setPreviewItem(null)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className={`glass-panel !bg-void-900/95 w-full ${
            fullscreen ? 'max-w-6xl h-[92vh]' : 'max-w-3xl h-[70vh]'
          } flex flex-col p-4 transition-all duration-300`}
        >
          <div className="flex items-center gap-3 mb-3 px-1">
            <meta.icon size={18} style={{ color: meta.color }} />
            <h3 className="font-medium truncate flex-1">{file.name}</h3>
            <button onClick={() => toggleStarFile(file.id)} className="p-1.5 rounded-lg hover:bg-white/[0.08]">
              <Star size={16} className={file.starred ? 'text-aurora-amber' : 'text-ink-faint'} fill={file.starred ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => push({ type: 'success', message: `Downloading ${file.name}` })}
              className="p-1.5 rounded-lg hover:bg-white/[0.08]"
            >
              <Download size={16} className="text-ink-faint" />
            </button>
            <button
              onClick={() => push({ type: 'info', message: 'Share link ready' })}
              className="p-1.5 rounded-lg hover:bg-white/[0.08]"
            >
              <Share2 size={16} className="text-ink-faint" />
            </button>
            <button onClick={() => setFullscreen((f) => !f)} className="p-1.5 rounded-lg hover:bg-white/[0.08]">
              <Maximize2 size={16} className="text-ink-faint" />
            </button>
            <button onClick={() => setPreviewItem(null)} className="p-1.5 rounded-lg hover:bg-white/[0.08]">
              <X size={16} className="text-ink-faint" />
            </button>
          </div>

          <div className="flex-1 min-h-0">
            <PreviewBody file={file} />
          </div>

          <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-5 px-1 text-xs text-ink-faint flex-wrap">
            <span className="flex items-center gap-1.5">
              <Info size={12} /> {formatBytes(file.size)}
            </span>
            <span>Owner: {file.owner}</span>
            <span>Created {formatDate(file.createdAt)}</span>
            <span>Modified {formatDate(file.modifiedAt)}</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
