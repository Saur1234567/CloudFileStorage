import { motion } from 'framer-motion';
import { Folder, Star, MoreVertical } from 'lucide-react';
import { useDrive } from '../../context/DriveContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { FOLDER_COLOR_HEX } from '../../utils/fileTypes';
import { timeAgo } from '../../utils/format';

export default function FolderCard({ folder }) {
  const { setCurrentFolderId, files, folders } = useDrive();
  const { openContextMenu } = useUI();
  const color = FOLDER_COLOR_HEX[folder.color] || FOLDER_COLOR_HEX.violet;
  const childCount =
    files.filter((f) => f.folderId === folder.id && !f.trashed).length +
    folders.filter((f) => f.parentId === folder.id && !f.trashed).length;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      onDoubleClick={() => setCurrentFolderId(folder.id)}
      onContextMenu={(e) => openContextMenu(e, folder, 'folder')}
      className="group relative glass-panel p-4 text-left flex items-center gap-3 hover:shadow-glow transition-shadow duration-300"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
        style={{ background: `${color}22` }}
      >
        <Folder size={22} style={{ color }} fill={`${color}33`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{folder.name}</p>
        <p className="text-[11px] text-ink-faint">{childCount} items · {timeAgo(folder.modifiedAt)}</p>
      </div>
      {folder.starred && <Star size={13} className="text-aurora-amber shrink-0" fill="currentColor" />}
      <span
        onClick={(e) => {
          e.stopPropagation();
          openContextMenu(e, folder, 'folder');
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-white/[0.08] shrink-0"
      >
        <MoreVertical size={15} className="text-ink-faint" />
      </span>
    </motion.button>
  );
}
