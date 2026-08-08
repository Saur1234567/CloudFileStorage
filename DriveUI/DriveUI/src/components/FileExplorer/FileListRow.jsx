import { Star, MoreVertical } from 'lucide-react';
import { useUI } from '../../context/UIContext.jsx';
import { useDrive } from '../../context/DriveContext.jsx';
import { getFileMeta } from '../../utils/fileTypes';
import { formatBytes, formatDate } from '../../utils/format';

export default function FileListRow({ file, folderName }) {
  const { openContextMenu, setPreviewItem } = useUI();
  const { toggleStarFile, selectedIds, toggleSelect } = useDrive();
  const meta = getFileMeta(file.type);
  const selected = selectedIds.includes(file.id);

  return (
    <div
      onDoubleClick={() => setPreviewItem(file)}
      onContextMenu={(e) => openContextMenu(e, file, 'file')}
      className={`group grid grid-cols-[auto_auto_1fr_90px_80px_120px_120px_110px_110px_40px] items-center gap-4 px-4 py-2.5 rounded-xl hover:bg-white/[0.05] cursor-pointer text-sm ${
        selected ? 'bg-aurora-violet/10' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onClick={(e) => e.stopPropagation()}
        onChange={() => toggleSelect(file.id)}
        className="w-4 h-4 rounded accent-[#8b7cfa]"
      />
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${meta.color}22` }}>
        <meta.icon size={15} style={{ color: meta.color }} />
      </div>
      <span className="truncate font-medium">{file.name}</span>
      <span className="text-ink-faint text-xs hidden sm:block">{meta.label}</span>
      <span className="text-ink-faint text-xs hidden md:block">{formatBytes(file.size)}</span>
      <span className="text-ink-faint text-xs truncate hidden lg:block">{folderName || '—'}</span>
      <span className="text-ink-faint text-xs truncate hidden lg:block">{file.owner}</span>
      <span className="text-ink-faint text-xs hidden xl:block">{formatDate(file.createdAt)}</span>
      <span className="text-ink-faint text-xs hidden xl:block">{formatDate(file.modifiedAt)}</span>
      <div className="flex items-center gap-0.5 justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleStarFile(file.id);
          }}
          className="p-1.5 rounded-md hover:bg-white/[0.08]"
        >
          <Star size={13} className={file.starred ? 'text-aurora-amber' : 'text-ink-faint'} fill={file.starred ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={(e) => openContextMenu(e, file, 'file')}
          className="p-1.5 rounded-md hover:bg-white/[0.08]"
        >
          <MoreVertical size={14} className="text-ink-faint" />
        </button>
      </div>
    </div>
  );
}
