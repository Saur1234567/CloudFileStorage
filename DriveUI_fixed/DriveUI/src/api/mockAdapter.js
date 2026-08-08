import { initialFiles, initialFolders, nextId } from '../data/mockData';

// Simulates the same async contract as filesApi.js (delay + occasional shape)
// so the UI can be built and demoed with zero backend. DriveContext calls
// this by default; flip USE_MOCK to false in DriveContext.jsx to hit filesApi
// (the real Axios layer) against your actual backend instead.

let files = [...initialFiles];
let folders = [...initialFolders];

const delay = (ms = 500) => new Promise((res) => setTimeout(res, ms));

export const mockAdapter = {
  async getFiles() {
    await delay();
    return files.filter((f) => !f.trashed);
  },
  async getFolders() {
    await delay(350);
    return folders.filter((f) => !f.trashed);
  },
  async createFolder({ name, color, parentId = null }) {
    await delay(450);
    const folder = {
      id: nextId(),
      name,
      color: color || 'violet',
      parentId,
      owner: 'Saurav Kumar',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      starred: false,
      trashed: false
    };
    folders = [folder, ...folders];
    return folder;
  },
  async deleteFolder(id) {
    await delay(400);
    folders = folders.map((f) => (f.id === id ? { ...f, trashed: true } : f));
    return { id, trashed: true };
  },
  async uploadFile(fileMeta, onProgress) {
    // Simulates chunked progress so the UI's progress bar has something real to show
    for (let pct = 0; pct <= 100; pct += Math.round(10 + Math.random() * 15)) {
      await delay(120 + Math.random() * 150);
      onProgress?.(Math.min(pct, 100));
    }
    onProgress?.(100);
    const file = {
      id: nextId(),
      name: fileMeta.name,
      type: fileMeta.type,
      size: fileMeta.size,
      folderId: fileMeta.folderId ?? null,
      owner: 'Saurav Kumar',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      starred: false,
      trashed: false,
      shared: false
    };
    files = [file, ...files];
    return file;
  },
  async deleteFile(id) {
    await delay(350);
    files = files.map((f) => (f.id === id ? { ...f, trashed: true } : f));
    return { id, trashed: true };
  },
  async renameFile(id, name) {
    await delay(300);
    files = files.map((f) => (f.id === id ? { ...f, name, modifiedAt: new Date().toISOString() } : f));
    return files.find((f) => f.id === id);
  },
  async renameFolder(id, name) {
    await delay(300);
    folders = folders.map((f) => (f.id === id ? { ...f, name, modifiedAt: new Date().toISOString() } : f));
    return folders.find((f) => f.id === id);
  },
  async moveFile(id, folderId) {
    await delay(350);
    files = files.map((f) => (f.id === id ? { ...f, folderId, modifiedAt: new Date().toISOString() } : f));
    return files.find((f) => f.id === id);
  },
  async toggleStarFile(id) {
    await delay(200);
    files = files.map((f) => (f.id === id ? { ...f, starred: !f.starred } : f));
    return files.find((f) => f.id === id);
  },
  async toggleStarFolder(id) {
    await delay(200);
    folders = folders.map((f) => (f.id === id ? { ...f, starred: !f.starred } : f));
    return folders.find((f) => f.id === id);
  },
  async restoreFile(id) {
    await delay(300);
    files = files.map((f) => (f.id === id ? { ...f, trashed: false } : f));
    return files.find((f) => f.id === id);
  },
  async permanentlyDeleteFile(id) {
    await delay(300);
    files = files.filter((f) => f.id !== id);
    return { id };
  }
};

export default mockAdapter;
