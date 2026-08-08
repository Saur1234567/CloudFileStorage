import { motion } from 'framer-motion';
import { Star, MoreVertical, Share2 } from 'lucide-react';
import { useUI } from '../../context/UIContext.jsx';
import { useDrive } from '../../context/DriveContext.jsx';
import { getFileMeta } from '../../utils/fileTypes';
import { formatBytes, timeAgo } from '../../utils/format';

export default function FileGridCard({ file }) {
  const { openContextMenu, setPreviewItem } = useUI();
  const { toggleStarFile, selectedIds, toggleSelect } = useDrive();
  const meta = getFileMeta(file.type);
  const selected = selectedIds.includes(file.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      onDoubleClick={() => setPreviewItem(file)}
      onContextMenu={(e) => openContextMenu(e, file, 'file')}
      className={`group relative glass-panel p-4 cursor-pointer transition-shadow duration-300 hover:shadow-glow ${
        selected ? 'ring-2 ring-aurora-violet' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
          style={{ background: `${meta.color}22` }}
        >
          <meta.icon size={20} style={{ color: meta.color }} />
        </div>
        <div className="flex items-center gap-1">
          {file.shared && <Share2 size={13} className="text-aurora-teal" />}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleStarFile(file.id);
            }}
            className="p-1 rounded-md hover:bg-white/[0.08]"
          >
            <Star
              size={14}
              className={file.starred ? 'text-aurora-amber' : 'text-ink-faint opacity-0 group-hover:opacity-100'}
              fill={file.starred ? 'currentColor' : 'none'}
            />
          </button>
          <button
            onClick={(e) => openContextMenu(e, file, 'file')}
            className="p-1 rounded-md hover:bg-white/[0.08] opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={14} className="text-ink-faint" />
          </button>
        </div>
      </div>
      <p className="text-sm font-medium truncate" title={file.name}>
        {file.name}
      </p>
      <p className="text-[11px] text-ink-faint mt-1">
        {formatBytes(file.size)} · {timeAgo(file.modifiedAt)}
      </p>

      <label
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 has-[:checked]:opacity-100 transition-opacity"
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={() => toggleSelect(file.id)}
          className="w-4 h-4 rounded accent-[#8b7cfa]"
        />
      </label>
    </motion.div>
  );
}
