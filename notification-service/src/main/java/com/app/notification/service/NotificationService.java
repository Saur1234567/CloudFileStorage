package com.app.notification.service;

import com.app.notification.dto.NotificationRequest;

public interface NotificationService {

    void notifyUploadSuccess(NotificationRequest request);

    void notifyDeleteSuccess(NotificationRequest request);

    void notifyShareFile(NotificationRequest request);

    void sendGenericEmail(NotificationRequest request);
}
