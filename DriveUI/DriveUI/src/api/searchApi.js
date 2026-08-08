import axiosClient from "./axiosClient";

const searchApi = {

  // Search Files & Folders
  search: (query) =>
    axiosClient.get("/search", {
      params: { query }
    }).then((res) => res.data),

};

export default searchApi;