import { Star } from 'lucide-react';
import { useDrive } from '../context/DriveContext.jsx';
import FilterBar from '../components/Filters/FilterBar.jsx';
import FileExplorer from '../components/FileExplorer/FileExplorer.jsx';
import { useFilteredFiles } from '../utils/useFilteredFiles';

export default function StarredPage() {
  const { files, folders, isLoading } = useDrive();
  const starredFolders = folders.filter((f) => f.starred && !f.trashed);
  const starredFilesRaw = files.filter((f) => f.starred && !f.trashed);
  const starredFiles = useFilteredFiles(starredFilesRaw);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-semibold text-xl">Starred</h1>
        <FilterBar />
      </div>
      <FileExplorer
        folders={starredFolders}
        files={starredFiles}
        loading={isLoading}
        emptyIcon={Star}
        emptyTitle="Nothing starred"
        emptyDescription="Star files and folders to find them quickly here."
      />
    </div>
  );
}
