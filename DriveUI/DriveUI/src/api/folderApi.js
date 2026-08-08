import axiosClient from "./axiosClient";

const folderApi = {

  // Get all folders
  getFolders: () =>
    axiosClient.get("/folders").then((res) => res.data),

  // Get folder by id
  getFolderById: (id) =>
    axiosClient.get(`/folders/${id}`).then((res) => res.data),

  // Get child folders
  getFoldersByParent: (parentId) =>
    axiosClient.get(`/folders/parent/${parentId}`).then((res) => res.data),

  // Create folder
  createFolder: (folder) =>
    axiosClient.post("/folders", folder).then((res) => res.data),

  // Update folder
  updateFolder: (id, folder) =>
    axiosClient.put(`/folders/${id}`, folder).then((res) => res.data),

  // Delete folder
  deleteFolder: (id) =>
    axiosClient.delete(`/folders/${id}`).then((res) => res.data),

};

export default folderApi;