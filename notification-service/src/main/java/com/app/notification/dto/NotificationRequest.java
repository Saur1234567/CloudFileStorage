package com.app.notification.dto;

import com.app.common.enums.NotificationType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class NotificationRequest {

    @NotBlank(message = "Recipient email is required")
    @Email(message = "Recipient email must be valid")
    private String recipientEmail;

    private String recipientPhone; // optional, used only for SMS

    @NotNull(message = "Notification type is required")
    private NotificationType type;

    @NotBlank(message = "File or resource name is required")
    private String resourceName;

    /** Free-form extra context, e.g. {"sharedBy": "saurav", "size": "12MB"} */
    private Map<String, String> metadata;
}
