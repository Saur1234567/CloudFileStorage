package com.app.notification.controller;

import com.app.common.dto.ApiResponse;
import com.app.notification.dto.NotificationRequest;
import com.app.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/upload-success")
    public ResponseEntity<ApiResponse<Void>> uploadSuccess(@Valid @RequestBody NotificationRequest request) {
        notificationService.notifyUploadSuccess(request);
        return ResponseEntity.ok(ApiResponse.success("Upload success notification sent"));
    }

    @PostMapping("/delete-success")
    public ResponseEntity<ApiResponse<Void>> deleteSuccess(@Valid @RequestBody NotificationRequest request) {
        notificationService.notifyDeleteSuccess(request);
        return ResponseEntity.ok(ApiResponse.success("Delete success notification sent"));
    }

    @PostMapping("/share-file")
    public ResponseEntity<ApiResponse<Void>> shareFile(@Valid @RequestBody NotificationRequest request) {
        notificationService.notifyShareFile(request);
        return ResponseEntity.ok(ApiResponse.success("Share file notification sent"));
    }

    @PostMapping("/email")
    public ResponseEntity<ApiResponse<Void>> genericEmail(@Valid @RequestBody NotificationRequest request) {
        notificationService.sendGenericEmail(request);
        return ResponseEntity.ok(ApiResponse.success("Email notification sent"));
    }
}
