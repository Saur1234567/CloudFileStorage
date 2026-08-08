import axiosClient from "./axiosClient";

const filesApi = {

  // ---------------- FILE ----------------

  getFiles: () =>
    axiosClient.get("/files").then(res => res.data),

  getFileById: (id) =>
    axiosClient.get(`/files/${id}`).then(res => res.data),

  uploadFile: (formData, onUploadProgress) =>
    axiosClient.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress
    }).then(res => res.data),

  deleteFile: (id) =>
    axiosClient.delete(`/files/${id}`).then(res => res.data),

  downloadFile: (id) =>
    axiosClient.get(`/files/download/${id}`, {
      responseType: "blob"
    }).then(res => res.data),

  getFilesByFolder: (folderId) =>
    axiosClient.get(`/files/folder/${folderId}`).then(res => res.data),

  renameFile: (id, name) =>
    axiosClient.patch(`/files/${id}/rename`, { name }).then(res => res.data),

  moveFile: (id, folderId) =>
    axiosClient.patch(`/files/${id}/move`, { folderId }).then(res => res.data),

  toggleStarFile: (id) =>
    axiosClient.patch(`/files/${id}/star`).then(res => res.data),

  restoreFile: (id) =>
    axiosClient.patch(`/files/${id}/restore`).then(res => res.data),

  permanentlyDeleteFile: (id) =>
    axiosClient.delete(`/files/${id}/permanent`).then(res => res.data),


  // ---------------- FOLDER ----------------

  getFolders: () =>
    axiosClient.get("/folders").then(res => res.data),

  createFolder: (folder) =>
    axiosClient.post("/folders", folder).then(res => res.data),

  deleteFolder: (id) =>
    axiosClient.delete(`/folders/${id}`).then(res => res.data),

  getFoldersByParent: (parentId) =>
    axiosClient.get(`/folders/parent/${parentId}`).then(res => res.data),

  renameFolder: (id, name) =>
    axiosClient.patch(`/folders/${id}/rename`, { name }).then(res => res.data),

  toggleStarFolder: (id) =>
    axiosClient.patch(`/folders/${id}/star`).then(res => res.data),


  // ---------------- SEARCH ----------------

  search: (query) =>
    axiosClient.get("/search", {
      params: { query }
    }).then(res => res.data)

};

export default filesApi;