import axiosClient from "./axiosClient";

const notificationApi = {

  // Send Email
  sendEmail: (data) =>
    axiosClient.post("/notifications/email", data)
      .then((res) => res.data),

  // Send SMS
  sendSMS: (data) =>
    axiosClient.post("/notifications/sms", data)
      .then((res) => res.data),

  // Get All Notifications
  getNotifications: () =>
    axiosClient.get("/notifications")
      .then((res) => res.data),

  // Get Notification By Id
  getNotificationById: (id) =>
    axiosClient.get(`/notifications/${id}`)
      .then((res) => res.data),

  // Delete Notification
  deleteNotification: (id) =>
    axiosClient.delete(`/notifications/${id}`)
      .then((res) => res.data),

};

export default notificationApi;