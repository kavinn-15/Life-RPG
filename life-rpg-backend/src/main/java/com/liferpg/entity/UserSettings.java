package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_settings")
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String timezone = "UTC";

    @Column(name = "notifications_enabled", nullable = false)
    private boolean notificationsEnabled = true;

    @Column(name = "email_alerts", nullable = false)
    private boolean emailAlerts = true;

    @Column(name = "streak_warnings", nullable = false)
    private boolean streakWarnings = true;

    @Column(name = "quest_reminders", nullable = false)
    private boolean questReminders = true;

    @Column(name = "reduced_motion", nullable = false)
    private boolean reducedMotion = false;

    @Column(name = "sound_effects", nullable = false)
    private boolean soundEffects = false;

    @Column(name = "high_contrast", nullable = false)
    private boolean highContrast = false;

    @Column(name = "large_text", nullable = false)
    private boolean largeText = false;

    @Column(name = "preferred_theme", nullable = false)
    private String preferredTheme = "dark-fantasy";

    @Column(name = "default_difficulty", nullable = false)
    private String defaultDifficulty = "Medium";

    @Column(name = "public_leaderboard", nullable = false)
    private boolean publicLeaderboard = true;

    @Column(name = "anonymous_metrics", nullable = false)
    private boolean anonymousMetrics = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public UserSettings() {}

    public UserSettings(User user) {
        this.user = user;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public boolean isNotificationsEnabled() { return notificationsEnabled; }
    public void setNotificationsEnabled(boolean notificationsEnabled) { this.notificationsEnabled = notificationsEnabled; }

    public boolean isEmailAlerts() { return emailAlerts; }
    public void setEmailAlerts(boolean emailAlerts) { this.emailAlerts = emailAlerts; }

    public boolean isStreakWarnings() { return streakWarnings; }
    public void setStreakWarnings(boolean streakWarnings) { this.streakWarnings = streakWarnings; }

    public boolean isQuestReminders() { return questReminders; }
    public void setQuestReminders(boolean questReminders) { this.questReminders = questReminders; }

    public boolean isReducedMotion() { return reducedMotion; }
    public void setReducedMotion(boolean reducedMotion) { this.reducedMotion = reducedMotion; }

    public boolean isSoundEffects() { return soundEffects; }
    public void setSoundEffects(boolean soundEffects) { this.soundEffects = soundEffects; }

    public boolean isHighContrast() { return highContrast; }
    public void setHighContrast(boolean highContrast) { this.highContrast = highContrast; }

    public boolean isLargeText() { return largeText; }
    public void setLargeText(boolean largeText) { this.largeText = largeText; }

    public String getPreferredTheme() { return preferredTheme; }
    public void setPreferredTheme(String preferredTheme) { this.preferredTheme = preferredTheme; }

    public String getDefaultDifficulty() { return defaultDifficulty; }
    public void setDefaultDifficulty(String defaultDifficulty) { this.defaultDifficulty = defaultDifficulty; }

    public boolean isPublicLeaderboard() { return publicLeaderboard; }
    public void setPublicLeaderboard(boolean publicLeaderboard) { this.publicLeaderboard = publicLeaderboard; }

    public boolean isAnonymousMetrics() { return anonymousMetrics; }
    public void setAnonymousMetrics(boolean anonymousMetrics) { this.anonymousMetrics = anonymousMetrics; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
