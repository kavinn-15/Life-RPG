package com.liferpg.dto.user;

public class UserSettingsDTO {
    private String timezone;
    private Boolean notificationsEnabled;
    private Boolean emailAlerts;
    private Boolean streakWarnings;
    private Boolean questReminders;
    private Boolean reducedMotion;
    private Boolean soundEffects;
    private Boolean highContrast;
    private Boolean largeText;
    private String preferredTheme;
    private String defaultDifficulty;
    private Boolean publicLeaderboard;
    private Boolean anonymousMetrics;

    public UserSettingsDTO() {}

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public Boolean getNotificationsEnabled() { return notificationsEnabled; }
    public void setNotificationsEnabled(Boolean notificationsEnabled) { this.notificationsEnabled = notificationsEnabled; }

    public Boolean getEmailAlerts() { return emailAlerts; }
    public void setEmailAlerts(Boolean emailAlerts) { this.emailAlerts = emailAlerts; }

    public Boolean getStreakWarnings() { return streakWarnings; }
    public void setStreakWarnings(Boolean streakWarnings) { this.streakWarnings = streakWarnings; }

    public Boolean getQuestReminders() { return questReminders; }
    public void setQuestReminders(Boolean questReminders) { this.questReminders = questReminders; }

    public Boolean getReducedMotion() { return reducedMotion; }
    public void setReducedMotion(Boolean reducedMotion) { this.reducedMotion = reducedMotion; }

    public Boolean getSoundEffects() { return soundEffects; }
    public void setSoundEffects(Boolean soundEffects) { this.soundEffects = soundEffects; }

    public Boolean getHighContrast() { return highContrast; }
    public void setHighContrast(Boolean highContrast) { this.highContrast = highContrast; }

    public Boolean getLargeText() { return largeText; }
    public void setLargeText(Boolean largeText) { this.largeText = largeText; }

    public String getPreferredTheme() { return preferredTheme; }
    public void setPreferredTheme(String preferredTheme) { this.preferredTheme = preferredTheme; }

    public String getDefaultDifficulty() { return defaultDifficulty; }
    public void setDefaultDifficulty(String defaultDifficulty) { this.defaultDifficulty = defaultDifficulty; }

    public Boolean getPublicLeaderboard() { return publicLeaderboard; }
    public void setPublicLeaderboard(Boolean publicLeaderboard) { this.publicLeaderboard = publicLeaderboard; }

    public Boolean getAnonymousMetrics() { return anonymousMetrics; }
    public void setAnonymousMetrics(Boolean anonymousMetrics) { this.anonymousMetrics = anonymousMetrics; }
}
