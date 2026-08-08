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

  // Refresh Token — backend route is /auth/refresh-token (not /auth/refresh)
  refreshToken: (refreshToken) =>
    axiosClient.post("/auth/refresh-token", {
      refreshToken,
    }).then((res) => res.data),

  // Logout — backend requires the refreshToken in the body to invalidate it
  logout: () =>
    axiosClient.post("/auth/logout", {
      refreshToken: localStorage.getItem("drivex-refresh-token"),
    })
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

  // Forgot Password — sends a 6-digit OTP to the account's email
  forgotPassword: (email) =>
    axiosClient.post("/auth/forgot-password", { email })
      .then((res) => res.data),

  // Verify OTP
  verifyOtp: ({ email, otp }) =>
    axiosClient.post("/auth/verify-otp", { email, otp })
      .then((res) => res.data),

  // Resend OTP — reuses the same forgot-password flow server-side
  resendOtp: (email) =>
    axiosClient.post("/auth/resend-otp", { email })
      .then((res) => res.data),

  // Reset Password — only succeeds if the OTP for this email was verified
  resetPassword: ({ email, password }) =>
    axiosClient.post("/auth/reset-password", { email, password })
      .then((res) => res.data),

};

export default authApi;