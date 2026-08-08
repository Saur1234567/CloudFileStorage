import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { useDrive } from '../context/DriveContext.jsx';
import FilterBar from '../components/Filters/FilterBar.jsx';
import FileExplorer from '../components/FileExplorer/FileExplorer.jsx';
import { useFilteredFiles } from '../utils/useFilteredFiles';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const { files, folders, isLoading } = useDrive();

  const matchedFolders = useMemo(
    () => (q ? folders.filter((f) => !f.trashed && f.name.toLowerCase().includes(q.toLowerCase())) : []),
    [folders, q]
  );
  const matchedFilesRaw = useMemo(
    () => (q ? files.filter((f) => !f.trashed && f.name.toLowerCase().includes(q.toLowerCase())) : []),
    [files, q]
  );
  const matchedFiles = useFilteredFiles(matchedFilesRaw);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display font-semibold text-xl">
          {q ? (
            <>
              Results for <span className="aurora-text">"{q}"</span>
            </>
          ) : (
            'Search'
          )}
        </h1>
        <FilterBar />
      </div>
      <FileExplorer
        folders={matchedFolders}
        files={matchedFiles}
        loading={isLoading}
        emptyIcon={SearchIcon}
        emptyTitle={q ? 'No matching results' : 'Search your drive'}
        emptyDescription={
          q ? `We couldn't find anything for "${q}". Try a different keyword.` : 'Use the search bar above to find files and folders instantly.'
        }
      />
    </div>
  );
}
