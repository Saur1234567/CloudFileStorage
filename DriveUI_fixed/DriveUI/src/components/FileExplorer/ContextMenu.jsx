import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  Pencil,
  Download,
  FolderInput,
  Copy,
  Trash2,
  Share2,
  Info,
  Star
} from 'lucide-react';
import { useUI } from '../../context/UIContext.jsx';
import { useDrive } from '../../context/DriveContext.jsx';
import { useToast } from '../Toast/ToastProvider.jsx';

export default function ContextMenu() {
  const { contextMenu, closeContextMenu, openDialog, setPreviewItem } = useUI();
  const { setCurrentFolderId, toggleStarFile, toggleStarFolder, deleteFile, deleteFolder } = useDrive();
  const { push } = useToast();
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) closeContextMenu();
    };
    const onEsc = (e) => e.key === 'Escape' && closeContextMenu();
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [closeContextMenu]);

  if (!contextMenu) return null;
  const { x, y, item, kind } = contextMenu;
  const isFolder = kind === 'folder';

  const items = [
    !isFolder && {
      label: 'Open / Preview',
      icon: FolderOpen,
      onClick: () => setPreviewItem(item)
    },
    isFolder && {
      label: 'Open',
      icon: FolderOpen,
      onClick: () => setCurrentFolderId(item.id)
    },
    {
      label: item.starred ? 'Remove from starred' : 'Add to starred',
      icon: Star,
      onClick: () => (isFolder ? toggleStarFolder(item.id) : toggleStarFile(item.id))
    },
    { label: 'Rename', icon: Pencil, onClick: () => openDialog('rename', { item, kind }) },
    !isFolder && { label: 'Download', icon: Download, onClick: () => push({ type: 'success', message: `Downloading ${item.name}` }) },
    !isFolder && { label: 'Move', icon: FolderInput, onClick: () => openDialog('move', { item }) },
    !isFolder && {
      label: 'Copy link',
      icon: Copy,
      onClick: () => {
        navigator.clipboard?.writeText(`https://drivex.app/f/${item.id}`).catch(() => {});
        push({ type: 'success', message: 'Link copied to clipboard' });
      }
    },
    !isFolder && { label: 'Share', icon: Share2, onClick: () => push({ type: 'info', message: `Share link ready for ${item.name}` }) },
    { label: 'Properties', icon: Info, onClick: () => setPreviewItem(isFolder ? null : item) },
    {
      label: 'Delete',
      icon: Trash2,
      danger: true,
      onClick: () => openDialog('delete', { item, kind })
    }
  ].filter(Boolean);

  const clampedX = Math.min(x, window.innerWidth - 220);
  const clampedY = Math.min(y, window.innerHeight - items.length * 40 - 20);

  return createPortal(
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.12 }}
      style={{ top: clampedY, left: clampedX }}
      className="fixed z-[90] w-52 glass-panel p-1.5"
    >
      {items.map(({ label, icon: Icon, onClick, danger }) => (
        <button
          key={label}
          onClick={() => {
            onClick();
            closeContextMenu();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-white/[0.07] ${
            danger ? 'text-aurora-rose' : 'text-ink'
          }`}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </motion.div>,
    document.body
  );
}
