package com.app.auth.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Mirrors notification-service's NotificationRequest field-for-field so Feign's
 * JSON body matches what that service's controller expects. Kept local (instead
 * of importing notification-service's DTO directly) since services don't share
 * each other's internal packages — only common-library is shared.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailNotificationRequest {

    private String recipientEmail;
    private String recipientPhone;

    /** Matches com.app.common.enums.NotificationType by name, e.g. "EMAIL_GENERIC" */
    private String type;

    private String resourceName;
    private Map<String, String> metadata;
}
