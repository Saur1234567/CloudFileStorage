import { AlertTriangle } from 'lucide-react';
import ModalShell from './ModalShell.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { useDrive } from '../../context/DriveContext.jsx';

export default function DeleteDialog() {
  const { dialog, closeDialog } = useUI();
  const { deleteFile, deleteFolder } = useDrive();
  const open = dialog?.type === 'delete';
  const { item, kind } = dialog?.payload || {};

  const confirm = () => {
    if (!item) return;
    if (kind === 'folder') deleteFolder(item.id);
    else deleteFile(item.id);
    closeDialog();
  };

  return (
    <ModalShell open={open} onClose={closeDialog}>
      <div className="flex flex-col items-center text-center gap-3 pt-2">
        <div className="w-14 h-14 rounded-full bg-aurora-rose/15 flex items-center justify-center">
          <AlertTriangle size={26} className="text-aurora-rose" />
        </div>
        <h3 className="font-display font-semibold text-lg">Delete "{item?.name}"?</h3>
        <p className="text-sm text-ink-faint max-w-xs">
          {kind === 'folder'
            ? 'This folder and everything inside it will move to Trash.'
            : 'This file will move to Trash. You can restore it anytime before it is permanently removed.'}
        </p>
        <div className="flex gap-3 w-full mt-3">
          <button onClick={closeDialog} className="btn-ghost flex-1 justify-center bg-white/[0.04]">
            Cancel
          </button>
          <button
            onClick={confirm}
            className="flex-1 justify-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white bg-aurora-rose hover:brightness-110 active:scale-[0.97] transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
