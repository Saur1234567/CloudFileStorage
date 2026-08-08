import { Trash2, RotateCcw, XCircle } from 'lucide-react';
import { useDrive } from '../context/DriveContext.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { getFileMeta } from '../utils/fileTypes';
import { formatBytes, timeAgo } from '../utils/format';

export default function TrashPage() {
  const { files, restoreFile, permanentlyDeleteFile } = useDrive();
  const trashed = files.filter((f) => f.trashed);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-semibold text-xl">Trash</h1>
        {trashed.length > 0 && (
          <p className="text-xs text-ink-faint">Items are kept for 30 days before permanent deletion</p>
        )}
      </div>

      {trashed.length === 0 ? (
        <EmptyState
          icon={Trash2}
          title="Trash is empty"
          description="Deleted files and folders will show up here before they're gone for good."
        />
      ) : (
        <div className="glass-panel divide-y divide-white/[0.04]">
          {trashed.map((file) => {
            const meta = getFileMeta(file.type);
            return (
              <div key={file.id} className="flex items-center gap-4 px-4 py-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${meta.color}22` }}>
                  <meta.icon size={17} style={{ color: meta.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-[11px] text-ink-faint">{formatBytes(file.size)} · deleted {timeAgo(file.modifiedAt)}</p>
                </div>
                <button
                  onClick={() => restoreFile(file.id)}
                  className="btn-ghost !py-1.5 !px-3 text-xs"
                >
                  <RotateCcw size={13} /> Restore
                </button>
                <button
                  onClick={() => permanentlyDeleteFile(file.id)}
                  className="flex items-center gap-1.5 text-xs text-aurora-rose hover:bg-aurora-rose/10 px-3 py-1.5 rounded-xl"
                >
                  <XCircle size={13} /> Delete forever
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
