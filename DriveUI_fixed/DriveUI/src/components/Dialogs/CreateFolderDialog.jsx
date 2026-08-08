import { useState } from 'react';
import { FolderPlus, Check } from 'lucide-react';
import ModalShell from './ModalShell.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { useDrive } from '../../context/DriveContext.jsx';
import { FOLDER_COLORS } from '../../data/mockData';
import { FOLDER_COLOR_HEX } from '../../utils/fileTypes';

export default function CreateFolderDialog() {
  const { dialog, closeDialog } = useUI();
  const { createFolder } = useDrive();
  const open = dialog?.type === 'createFolder';
  const [name, setName] = useState('');
  const [color, setColor] = useState('violet');

  const confirm = () => {
    if (!name.trim()) return;
    createFolder({ name: name.trim(), color, parentId: dialog?.payload?.parentId ?? null });
    setName('');
    setColor('violet');
    closeDialog();
  };

  return (
    <ModalShell open={open} onClose={closeDialog}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-aurora-gradient-soft flex items-center justify-center">
          <FolderPlus size={16} className="text-aurora-violet" />
        </div>
        <h3 className="font-display font-semibold text-lg">New folder</h3>
      </div>

      <label className="text-xs text-ink-faint mb-1.5 block">Folder name</label>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && confirm()}
        placeholder="Untitled folder"
        className="w-full glass !bg-white/[0.05] rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-aurora-violet/50"
      />

      <label className="text-xs text-ink-faint mb-2 block">Folder color</label>
      <div className="flex gap-2.5 mb-6">
        {FOLDER_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            style={{ background: FOLDER_COLOR_HEX[c] }}
            className="w-8 h-8 rounded-full flex items-center justify-center ring-offset-2 ring-offset-void-900 transition-all"
          >
            {color === c && <Check size={15} className="text-white" />}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={closeDialog} className="btn-ghost flex-1 justify-center bg-white/[0.04]">
          Cancel
        </button>
        <button onClick={confirm} className="btn-primary flex-1 justify-center">
          Create
        </button>
      </div>
    </ModalShell>
  );
}
