import { Clock } from 'lucide-react';
import { useDrive } from '../context/DriveContext.jsx';
import FilterBar from '../components/Filters/FilterBar.jsx';
import FileExplorer from '../components/FileExplorer/FileExplorer.jsx';
import { useFilteredFiles } from '../utils/useFilteredFiles';

export default function RecentPage() {
  const { files, isLoading } = useDrive();
  const recent = [...files]
    .filter((f) => !f.trashed)
    .sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt))
    .slice(0, 20);
  const filtered = useFilteredFiles(recent);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-semibold text-xl">Recent Files</h1>
        <FilterBar />
      </div>
      <FileExplorer
        files={filtered}
        loading={isLoading}
        emptyIcon={Clock}
        emptyTitle="Nothing recent"
        emptyDescription="Files you open or edit will show up here."
      />
    </div>
  );
}
