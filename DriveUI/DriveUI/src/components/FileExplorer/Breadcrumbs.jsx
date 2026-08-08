import { ChevronRight, HardDrive } from 'lucide-react';
import { useDrive } from '../../context/DriveContext.jsx';

export default function Breadcrumbs() {
  const { breadcrumbs, setCurrentFolderId } = useDrive();

  return (
    <div className="flex items-center gap-1.5 text-sm overflow-x-auto no-scrollbar py-1">
      <button
        onClick={() => setCurrentFolderId(null)}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/[0.06] shrink-0 ${
          breadcrumbs.length === 0 ? 'text-ink font-medium' : 'text-ink-faint'
        }`}
      >
        <HardDrive size={14} />
        My Drive
      </button>
      {breadcrumbs.map((folder, i) => (
        <span key={folder.id} className="flex items-center gap-1.5 shrink-0">
          <ChevronRight size={13} className="text-ink-faint" />
          <button
            onClick={() => setCurrentFolderId(folder.id)}
            className={`px-2 py-1 rounded-lg hover:bg-white/[0.06] ${
              i === breadcrumbs.length - 1 ? 'text-ink font-medium' : 'text-ink-faint'
            }`}
          >
            {folder.name}
          </button>
        </span>
      ))}
    </div>
  );
}
