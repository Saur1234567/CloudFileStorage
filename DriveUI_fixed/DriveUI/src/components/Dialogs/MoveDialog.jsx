import { useMemo, useState } from 'react';
import { Folder, FolderInput, HardDrive, Search } from 'lucide-react';
import ModalShell from './ModalShell.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { useDrive } from '../../context/DriveContext.jsx';
import { FOLDER_COLOR_HEX } from '../../utils/fileTypes';

export default function MoveDialog() {
  const { dialog, closeDialog } = useUI();
  const { folders, moveFile } = useDrive();
  const open = dialog?.type === 'move';
  const { item } = dialog?.payload || {};
  const [query, setQuery] = useState('');
  const [target, setTarget] = useState(undefined);

  const visibleFolders = useMemo(
    () => folders.filter((f) => !f.trashed && f.name.toLowerCase().includes(query.toLowerCase())),
    [folders, query]
  );

  const confirm = () => {
    if (!item || target === undefined) return;
    moveFile(item.id, target);
    closeDialog();
    setTarget(undefined);
  };

  return (
    <ModalShell open={open} onClose={closeDialog}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-aurora-gradient-soft flex items-center justify-center">
          <FolderInput size={16} className="text-aurora-violet" />
        </div>
        <h3 className="font-display font-semibold text-lg">Move "{item?.name}"</h3>
      </div>

      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search folders..."
          className="w-full glass !bg-white/[0.05] rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aurora-violet/50"
        />
      </div>

      <div className="max-h-56 overflow-y-auto flex flex-col gap-1 mb-5 pr-1">
        <button
          onClick={() => setTarget(null)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left hover:bg-white/[0.07] ${
            target === null ? 'bg-aurora-violet/15 text-ink' : 'text-ink-muted'
          }`}
        >
          <HardDrive size={15} />
          My Drive (root)
        </button>
        {visibleFolders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => setTarget(folder.id)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left hover:bg-white/[0.07] ${
              target === folder.id ? 'bg-aurora-violet/15 text-ink' : 'text-ink-muted'
            }`}
          >
            <Folder size={15} style={{ color: FOLDER_COLOR_HEX[folder.color] }} />
            {folder.name}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={closeDialog} className="btn-ghost flex-1 justify-center bg-white/[0.04]">
          Cancel
        </button>
        <button
          onClick={confirm}
          disabled={target === undefined}
          className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:pointer-events-none"
        >
          Move here
        </button>
      </div>
    </ModalShell>
  );
}
