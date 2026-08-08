package com.app.notification.service;

import com.app.notification.dto.NotificationRequest;
import com.app.notification.email.EmailService;
import com.app.notification.sms.SmsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final EmailService emailService;
    private final SmsService smsService;

    @Override
    public void notifyUploadSuccess(NotificationRequest request) {
        String subject = "Upload Successful: " + request.getResourceName();
        String body = "Hi,\n\nYour file '" + request.getResourceName() +
                "' has been uploaded successfully.\n\nRegards,\nTeam";
        emailService.sendEmail(request.getRecipientEmail(), subject, body);
        smsService.sendSms(request.getRecipientPhone(), "Your file '" + request.getResourceName() + "' was uploaded.");
    }

    @Override
    public void notifyDeleteSuccess(NotificationRequest request) {
        String subject = "File Deleted: " + request.getResourceName();
        String body = "Hi,\n\nYour file '" + request.getResourceName() +
                "' has been deleted successfully.\n\nRegards,\nTeam";
        emailService.sendEmail(request.getRecipientEmail(), subject, body);
        smsService.sendSms(request.getRecipientPhone(), "Your file '" + request.getResourceName() + "' was deleted.");
    }

    @Override
    public void notifyShareFile(NotificationRequest request) {
        String sharedBy = request.getMetadata() != null ? request.getMetadata().getOrDefault("sharedBy", "a user") : "a user";
        String subject = request.getResourceName() + " was shared with you";
        String body = "Hi,\n\n" + sharedBy + " shared '" + request.getResourceName() +
                "' with you.\n\nRegards,\nTeam";
        emailService.sendEmail(request.getRecipientEmail(), subject, body);
        smsService.sendSms(request.getRecipientPhone(), sharedBy + " shared '" + request.getResourceName() + "' with you.");
    }

    @Override
    public void sendGenericEmail(NotificationRequest request) {
        String subject = "Notification: " + request.getResourceName();
        String body = request.getMetadata() != null ? request.getMetadata().getOrDefault("body", "You have a new notification.")
                : "You have a new notification.";
        emailService.sendEmail(request.getRecipientEmail(), subject, body);
    }
}
