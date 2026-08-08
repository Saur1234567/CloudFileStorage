package com.app.auth.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Calls notification-service (registered in Eureka as NOTIFICATION-SERVICE)
 * through the load-balanced Feign client — same service-discovery mechanism
 * the api-gateway uses, so no hardcoded host/port here.
 */
@FeignClient(name = "notification-service")
public interface NotificationClient {

    @PostMapping("/api/notifications/email")
    void sendEmail(@RequestBody EmailNotificationRequest request);
}
