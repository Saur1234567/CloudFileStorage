import { Users } from 'lucide-react';
import { useDrive } from '../context/DriveContext.jsx';
import FilterBar from '../components/Filters/FilterBar.jsx';
import FileExplorer from '../components/FileExplorer/FileExplorer.jsx';
import { useFilteredFiles } from '../utils/useFilteredFiles';

export default function SharedPage() {
  const { files, isLoading } = useDrive();
  const shared = files.filter((f) => f.shared && !f.trashed);
  const filtered = useFilteredFiles(shared);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-semibold text-xl">Shared Files</h1>
        <FilterBar />
      </div>
      <FileExplorer
        files={filtered}
        loading={isLoading}
        emptyIcon={Users}
        emptyTitle="Nothing shared yet"
        emptyDescription="Files you share with others will appear here."
      />
    </div>
  );
}
