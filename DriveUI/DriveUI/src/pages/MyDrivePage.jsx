import { FolderOpen } from 'lucide-react';
import { useDrive } from '../context/DriveContext.jsx';
import Breadcrumbs from '../components/FileExplorer/Breadcrumbs.jsx';
import FilterBar from '../components/Filters/FilterBar.jsx';
import FileExplorer from '../components/FileExplorer/FileExplorer.jsx';
import UploadDropzone from '../components/Upload/UploadDropzone.jsx';
import { useFilteredFiles } from '../utils/useFilteredFiles';

export default function MyDrivePage() {
  const { files, folders, currentFolderId, isLoading } = useDrive();

  const scopedFolders = folders.filter((f) => f.parentId === currentFolderId && !f.trashed);
  const scopedFilesRaw = files.filter((f) => f.folderId === currentFolderId && !f.trashed);
  const scopedFiles = useFilteredFiles(scopedFilesRaw);

  return (
    <UploadDropzone>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <Breadcrumbs />
          <FilterBar />
        </div>
        <FileExplorer
          folders={scopedFolders}
          files={scopedFiles}
          loading={isLoading}
          emptyIcon={FolderOpen}
          emptyTitle="This folder is empty"
          emptyDescription="Drag and drop files here, or use the upload button to add something."
        />
      </div>
    </UploadDropzone>
  );
}
