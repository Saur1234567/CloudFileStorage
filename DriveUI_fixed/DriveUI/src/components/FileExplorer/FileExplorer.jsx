import { motion } from 'framer-motion';
import { useDrive } from '../../context/DriveContext.jsx';
import FolderCard from './FolderCard.jsx';
import FileGridCard from './FileGridCard.jsx';
import FileListRow from './FileListRow.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { GridSkeletonGroup, FileRowSkeleton } from '../common/Skeletons.jsx';
import { FolderOpen } from 'lucide-react';

export default function FileExplorer({ folders = [], files = [], loading, emptyIcon = FolderOpen, emptyTitle = 'Nothing here yet', emptyDescription = 'Upload a file or create a folder to get started.' }) {
  const { viewMode, folders: allFolders } = useDrive();

  const folderName = (folderId) => allFolders.find((f) => f.id === folderId)?.name;

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {viewMode === 'grid' ? (
          <GridSkeletonGroup count={10} />
        ) : (
          <div className="glass-panel divide-y divide-white/[0.04]">
            {Array.from({ length: 6 }).map((_, i) => (
              <FileRowSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isEmpty = folders.length === 0 && files.length === 0;
  if (isEmpty) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />;
  }

  if (viewMode === 'list') {
    return (
      <motion.div layout className="glass-panel divide-y divide-white/[0.04] overflow-hidden">
        {folders.length > 0 && (
          <div className="grid grid-cols-[auto_auto_1fr_90px_80px_120px_120px_110px_110px_40px] gap-4 px-4 py-2 text-[11px] uppercase tracking-wide text-ink-faint">
            <span />
            <span />
            <span>Name</span>
            <span className="hidden sm:block">Type</span>
            <span className="hidden md:block">Size</span>
            <span className="hidden lg:block">Folder</span>
            <span className="hidden lg:block">Owner</span>
            <span className="hidden xl:block">Created</span>
            <span className="hidden xl:block">Modified</span>
            <span />
          </div>
        )}
        {folders.map((folder) => (
          <div key={folder.id} className="px-2 py-1">
            <FolderCard folder={folder} />
          </div>
        ))}
        {files.map((file) => (
          <FileListRow key={file.id} file={file} folderName={folderName(file.folderId)} />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div layout className="flex flex-col gap-6">
      {folders.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-faint mb-2.5 px-1">Folders</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {folders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
          </div>
        </div>
      )}
      {files.length > 0 && (
        <div>
          {folders.length > 0 && (
            <p className="text-xs uppercase tracking-wide text-ink-faint mb-2.5 px-1">Files</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {files.map((file) => (
              <FileGridCard key={file.id} file={file} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
