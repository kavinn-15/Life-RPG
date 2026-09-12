package com.liferpg.service;

import com.liferpg.dto.user.UserSettingsDTO;
import com.liferpg.entity.User;
import com.liferpg.entity.UserSettings;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.UserRepository;
import com.liferpg.repository.UserSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserSettingsService {

    private final UserSettingsRepository settingsRepository;
    private final UserRepository userRepository;

    public UserSettingsService(UserSettingsRepository settingsRepository, UserRepository userRepository) {
        this.settingsRepository = settingsRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserSettingsDTO getSettings(Long userId) {
        UserSettings s = settingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    return settingsRepository.save(new UserSettings(user));
                });
        return toDTO(s);
    }

    @Transactional
    public UserSettingsDTO updateSettings(Long userId, UserSettingsDTO req) {
        UserSettings s = settingsRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Settings not found for user: " + userId));

        if (req.getTimezone() != null) s.setTimezone(req.getTimezone());
        if (req.getNotificationsEnabled() != null) s.setNotificationsEnabled(req.getNotificationsEnabled());
        if (req.getEmailAlerts() != null) s.setEmailAlerts(req.getEmailAlerts());
        if (req.getStreakWarnings() != null) s.setStreakWarnings(req.getStreakWarnings());
        if (req.getQuestReminders() != null) s.setQuestReminders(req.getQuestReminders());
        if (req.getReducedMotion() != null) s.setReducedMotion(req.getReducedMotion());
        if (req.getSoundEffects() != null) s.setSoundEffects(req.getSoundEffects());
        if (req.getHighContrast() != null) s.setHighContrast(req.getHighContrast());
        if (req.getLargeText() != null) s.setLargeText(req.getLargeText());
        if (req.getPreferredTheme() != null) s.setPreferredTheme(req.getPreferredTheme());
        if (req.getDefaultDifficulty() != null) s.setDefaultDifficulty(req.getDefaultDifficulty());
        if (req.getPublicLeaderboard() != null) s.setPublicLeaderboard(req.getPublicLeaderboard());
        if (req.getAnonymousMetrics() != null) s.setAnonymousMetrics(req.getAnonymousMetrics());

        settingsRepository.save(s);
        return toDTO(s);
    }

    private UserSettingsDTO toDTO(UserSettings s) {
        UserSettingsDTO dto = new UserSettingsDTO();
        dto.setTimezone(s.getTimezone());
        dto.setNotificationsEnabled(s.isNotificationsEnabled());
        dto.setEmailAlerts(s.isEmailAlerts());
        dto.setStreakWarnings(s.isStreakWarnings());
        dto.setQuestReminders(s.isQuestReminders());
        dto.setReducedMotion(s.isReducedMotion());
        dto.setSoundEffects(s.isSoundEffects());
        dto.setHighContrast(s.isHighContrast());
        dto.setLargeText(s.isLargeText());
        dto.setPreferredTheme(s.getPreferredTheme());
        dto.setDefaultDifficulty(s.getDefaultDifficulty());
        dto.setPublicLeaderboard(s.isPublicLeaderboard());
        dto.setAnonymousMetrics(s.isAnonymousMetrics());
        return dto;
    }
}
