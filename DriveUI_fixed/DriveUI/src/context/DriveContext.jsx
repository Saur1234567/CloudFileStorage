import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import filesApi from '../api/filesApi';
import { currentUser } from '../data/mockData';
import { useToast } from '../components/Toast/ToastProvider.jsx';

// USE_MOCK=true runs entirely in-memory so the app works with zero backend.
// Set to false and import `filesApi` instead once your real API is live —
// every call below has the exact same shape either way.
const api = filesApi;

// The user saved at login (see pages/auth/Login.jsx) reflects who's actually
// signed in; the mock profile is only a fallback for local/demo runs.
function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const DriveContext = createContext(null);

export function DriveProvider({ children }) {
  const qc = useQueryClient();
  const { push } = useToast();

  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]); // ['pdf','image',...]
  const [sortBy, setSortBy] = useState('modifiedAt');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedIds, setSelectedIds] = useState([]);
  const [uploadQueue, setUploadQueue] = useState([]); // {id, name, progress, status}

  const filesQuery = useQuery({ queryKey: ['files'], queryFn: api.getFiles });
  const foldersQuery = useQuery({ queryKey: ['folders'], queryFn: api.getFolders });

  const files = filesQuery.data || [];
  const folders = foldersQuery.data || [];

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['files'] });
    qc.invalidateQueries({ queryKey: ['folders'] });
  };

  const createFolderMutation = useMutation({
    mutationFn: api.createFolder,
    onSuccess: () => {
      invalidate();
      push({ type: 'success', message: 'Folder created' });
    },
    onError: () => push({ type: 'error', message: "Couldn't create the folder" })
  });

  const deleteFolderMutation = useMutation({
    mutationFn: api.deleteFolder,
    onSuccess: () => {
      invalidate();
      push({ type: 'success', message: 'Folder moved to trash' });
    }
  });

  const deleteFileMutation = useMutation({
    mutationFn: api.deleteFile,
    onSuccess: () => {
      invalidate();
      push({ type: 'success', message: 'File moved to trash' });
    }
  });

  const renameFileMutation = useMutation({
    mutationFn: ({ id, name }) => api.renameFile(id, name),
    onSuccess: () => {
      invalidate();
      push({ type: 'success', message: 'File renamed' });
    }
  });

  const renameFolderMutation = useMutation({
    mutationFn: ({ id, name }) => api.renameFolder(id, name),
    onSuccess: () => {
      invalidate();
      push({ type: 'success', message: 'Folder renamed' });
    }
  });

  const moveFileMutation = useMutation({
    mutationFn: ({ id, folderId }) => api.moveFile(id, folderId),
    onSuccess: () => {
      invalidate();
      push({ type: 'success', message: 'File moved' });
    }
  });

  const toggleStarFileMutation = useMutation({
    mutationFn: api.toggleStarFile,
    onSuccess: invalidate
  });

  const toggleStarFolderMutation = useMutation({
    mutationFn: api.toggleStarFolder,
    onSuccess: invalidate
  });

  const restoreFileMutation = useMutation({
    mutationFn: api.restoreFile,
    onSuccess: () => {
      invalidate();
      push({ type: 'success', message: 'File restored' });
    }
  });

  const permanentlyDeleteMutation = useMutation({
    mutationFn: api.permanentlyDeleteFile,
    onSuccess: () => {
      invalidate();
      push({ type: 'success', message: 'File permanently deleted' });
    }
  });

  const uploadFiles = useCallback(
  (fileList) => {
    Array.from(fileList).forEach(async (rawFile) => {
      const uploadId = `${rawFile.name}-${Date.now()}-${Math.random()}`;

      setUploadQueue((q) => [
        ...q,
        { id: uploadId, name: rawFile.name, progress: 0, status: 'uploading' }
      ]);

      const formData = new FormData();
      formData.append('file', rawFile);              // actual File blob, key matches backend's required part
      if (currentFolderId != null) {
        formData.append('folderId', currentFolderId); // only send if a folder is actually selected
      }

      try {
        await api.uploadFile(formData, (progress) => {
          setUploadQueue((q) => q.map((u) => (u.id === uploadId ? { ...u, progress } : u)));
        });
        setUploadQueue((q) => q.map((u) => (u.id === uploadId ? { ...u, status: 'done', progress: 100 } : u)));
        invalidate();
        push({ type: 'success', message: `${rawFile.name} uploaded` });
      } catch {
        setUploadQueue((q) => q.map((u) => (u.id === uploadId ? { ...u, status: 'error' } : u)));
        push({ type: 'error', message: `${rawFile.name} failed to upload` });
      }
    });
  },
  [currentFolderId] // eslint-disable-line react-hooks/exhaustive-deps
);

  const dismissUpload = (id) => setUploadQueue((q) => q.filter((u) => u.id !== id));
  const retryUpload = (id) => {
    const item = uploadQueue.find((u) => u.id === id);
    if (!item) return;
    dismissUpload(id);
  };

  const toggleSelect = (id) =>
    setSelectedIds((sel) => (sel.includes(id) ? sel.filter((s) => s !== id) : [...sel, id]));
  const clearSelection = () => setSelectedIds([]);

  const breadcrumbs = useMemo(() => {
    const trail = [];
    let cursor = currentFolderId;
    while (cursor) {
      const folder = folders.find((f) => f.id === cursor);
      if (!folder) break;
      trail.unshift(folder);
      cursor = folder.parentId;
    }
    return trail;
  }, [currentFolderId, folders]);

  const value = {
    user: useMemo(() => {
      const stored = getStoredUser();
      if (!stored) return currentUser;
      const initials = (stored.name || stored.email || '?')
        .split(' ')
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
      // Backend user objects don't carry storage-usage stats yet, so fall
      // back to the mock numbers just for that part of the UI.
      return {
        ...currentUser,
        ...stored,
        avatarInitials: stored.avatarInitials || initials || currentUser.avatarInitials
      };
    }, []),
    files,
    folders,
    isLoading: filesQuery.isLoading || foldersQuery.isLoading,
    isError: filesQuery.isError || foldersQuery.isError,
    currentFolderId,
    setCurrentFolderId,
    breadcrumbs,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    activeFilters,
    setActiveFilters,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    selectedIds,
    toggleSelect,
    clearSelection,
    uploadQueue,
    uploadFiles,
    dismissUpload,
    retryUpload,
    createFolder: createFolderMutation.mutate,
    deleteFolder: deleteFolderMutation.mutate,
    deleteFile: deleteFileMutation.mutate,
    renameFile: (id, name) => renameFileMutation.mutate({ id, name }),
    renameFolder: (id, name) => renameFolderMutation.mutate({ id, name }),
    moveFile: (id, folderId) => moveFileMutation.mutate({ id, folderId }),
    toggleStarFile: toggleStarFileMutation.mutate,
    toggleStarFolder: toggleStarFolderMutation.mutate,
    restoreFile: restoreFileMutation.mutate,
    permanentlyDeleteFile: permanentlyDeleteMutation.mutate
  };

  return <DriveContext.Provider value={value}>{children}</DriveContext.Provider>;
}

export const useDrive = () => useContext(DriveContext);
