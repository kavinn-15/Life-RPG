package com.liferpg.controller;

import com.liferpg.dto.common.ApiResponse;
import com.liferpg.dto.notification.CreateNotificationRequestDTO;
import com.liferpg.dto.notification.NotificationResponseDTO;
import com.liferpg.entity.User;
import com.liferpg.repository.UserRepository;
import com.liferpg.security.UserPrincipal;
import com.liferpg.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "In-app alerts and notifications management")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService, UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @GetMapping
    @Operation(summary = "Get user notifications ordered by newest first")
    public ResponseEntity<ApiResponse<List<NotificationResponseDTO>>> getNotifications(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<NotificationResponseDTO> notifications = notificationService.getUserNotifications(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Notifications retrieved successfully", notifications));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notifications count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal principal) {
        long count = notificationService.getUnreadCount(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Unread count retrieved", Map.of("unreadCount", count)));
    }

    @RequestMapping(value = "/{id}/read", method = {RequestMethod.PATCH, RequestMethod.POST, RequestMethod.PUT})
    @Operation(summary = "Mark a single notification as read")
    public ResponseEntity<ApiResponse<NotificationResponseDTO>> markAsRead(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        NotificationResponseDTO updated = notificationService.markAsRead(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read", updated));
    }

    @RequestMapping(value = "/read-all", method = {RequestMethod.PATCH, RequestMethod.POST})
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse<List<NotificationResponseDTO>>> markAllAsRead(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<NotificationResponseDTO> all = notificationService.markAllAsRead(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read", all));
    }

    @DeleteMapping
    @Operation(summary = "Clear all notifications for user")
    public ResponseEntity<ApiResponse<Void>> clearNotifications(
            @AuthenticationPrincipal UserPrincipal principal) {
        notificationService.clearAll(principal.getId());
        return ResponseEntity.ok(ApiResponse.<Void>ok("All notifications cleared", null));
    }

    @PostMapping
    @Operation(summary = "Create custom notification")
    public ResponseEntity<ApiResponse<NotificationResponseDTO>> createNotification(
            @RequestBody CreateNotificationRequestDTO req,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        NotificationResponseDTO created = notificationService.createFromRequest(user, req);
        return ResponseEntity.ok(ApiResponse.ok("Notification created", created));
    }
}
