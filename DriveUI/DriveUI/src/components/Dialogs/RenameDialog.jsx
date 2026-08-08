import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import ModalShell from './ModalShell.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { useDrive } from '../../context/DriveContext.jsx';

export default function RenameDialog() {
  const { dialog, closeDialog } = useUI();
  const { renameFile, renameFolder } = useDrive();
  const open = dialog?.type === 'rename';
  const { item, kind } = dialog?.payload || {};
  const [name, setName] = useState('');

  useEffect(() => {
    if (item) setName(item.name);
  }, [item]);

  const confirm = () => {
    if (!name.trim() || !item) return;
    if (kind === 'folder') renameFolder(item.id, name.trim());
    else renameFile(item.id, name.trim());
    closeDialog();
  };

  return (
    <ModalShell open={open} onClose={closeDialog}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-aurora-gradient-soft flex items-center justify-center">
          <Pencil size={16} className="text-aurora-violet" />
        </div>
        <h3 className="font-display font-semibold text-lg">Rename {kind === 'folder' ? 'folder' : 'file'}</h3>
      </div>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && confirm()}
        className="w-full glass !bg-white/[0.05] rounded-xl px-4 py-2.5 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-aurora-violet/50"
      />
      <div className="flex gap-3">
        <button onClick={closeDialog} className="btn-ghost flex-1 justify-center bg-white/[0.04]">
          Cancel
        </button>
        <button onClick={confirm} className="btn-primary flex-1 justify-center">
          Save
        </button>
      </div>
    </ModalShell>
  );
}
