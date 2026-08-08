import axiosClient from "./axiosClient";

const authApi = {

  // Register
  register: (userData) =>
    axiosClient.post("/auth/register", userData)
      .then((res) => res.data),

  // Login
  login: (credentials) =>
    axiosClient.post("/auth/login", credentials)
      .then((res) => res.data),

  // Refresh Token
  refreshToken: (refreshToken) =>
    axiosClient.post("/auth/refresh", {
      refreshToken,
    }).then((res) => res.data),

  // Logout
  logout: () =>
    axiosClient.post("/auth/logout")
      .then((res) => res.data),

  // Get Logged-in User
  getProfile: () =>
    axiosClient.get("/auth/profile")
      .then((res) => res.data),

  // Update Profile
  updateProfile: (data) =>
    axiosClient.put("/auth/profile", data)
      .then((res) => res.data),

  // Change Password
  changePassword: (data) =>
    axiosClient.put("/auth/change-password", data)
      .then((res) => res.data),

};

export default authApi;