package com.liferpg.service;

import com.liferpg.dto.notification.CreateNotificationRequestDTO;
import com.liferpg.dto.notification.NotificationResponseDTO;
import com.liferpg.entity.Notification;
import com.liferpg.entity.User;
import com.liferpg.enums.NotificationType;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponseDTO> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public NotificationResponseDTO markAsRead(String id, Long userId) {
        Notification notif = notificationRepository.findById(id)
                .filter(n -> n.getUser().getId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));

        notif.setRead(true);
        notificationRepository.save(notif);
        return toDTO(notif);
    }

    @Transactional
    public List<NotificationResponseDTO> markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
        return getUserNotifications(userId);
    }

    @Transactional
    public void clearAll(Long userId) {
        notificationRepository.deleteAllByUserId(userId);
    }

    @Transactional
    public NotificationResponseDTO createNotification(User user, NotificationType type, String title, String message,
                                                      String icon, String iconColor, String actionUrl, String actionLabel) {
        String id = "notif-" + UUID.randomUUID().toString().substring(0, 8);
        Notification notif = new Notification(id, user, type, title, message, icon, iconColor, actionUrl, actionLabel);
        notificationRepository.save(notif);
        return toDTO(notif);
    }

    @Transactional
    public NotificationResponseDTO createFromRequest(User user, CreateNotificationRequestDTO req) {
        NotificationType type = NotificationType.system;
        if (req.getType() != null) {
            try {
                type = NotificationType.valueOf(req.getType().toLowerCase());
            } catch (Exception ignored) {}
        }
        return createNotification(
                user,
                type,
                req.getTitle(),
                req.getMessage(),
                req.getIcon() != null ? req.getIcon() : "notifications",
                req.getIconColor() != null ? req.getIconColor() : "text-primary bg-primary-fixed",
                req.getActionUrl(),
                req.getActionLabel()
        );
    }

    public NotificationResponseDTO toDTO(Notification n) {
        String relativeTime = formatRelativeTime(n.getCreatedAt());
        String dateStr = n.getCreatedAt().toString();
        return new NotificationResponseDTO(
                n.getId(),
                n.getType().name(),
                n.getTitle(),
                n.getMessage(),
                n.getIcon(),
                n.getIconColor(),
                n.isRead(),
                n.getActionUrl(),
                n.getActionLabel(),
                relativeTime,
                dateStr
        );
    }

    private String formatRelativeTime(LocalDateTime dateTime) {
        if (dateTime == null) return "Just now";
        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        long seconds = duration.getSeconds();
        if (seconds < 60) return "Just now";
        long minutes = duration.toMinutes();
        if (minutes < 60) return minutes + "m ago";
        long hours = duration.toHours();
        if (hours < 24) return hours + "h ago";
        long days = duration.toDays();
        if (days == 1) return "Yesterday";
        if (days < 7) return days + " days ago";
        return (days / 7) + " weeks ago";
    }
}
