package com.liferpg.service;

import com.liferpg.dto.achievement.AchievementResponseDTO;
import com.liferpg.entity.*;
import com.liferpg.entity.Character;
import com.liferpg.enums.NotificationType;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.AchievementRepository;
import com.liferpg.repository.AttributeRepository;
import com.liferpg.repository.UserAchievementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final AttributeRepository attributeRepository;
    private final NotificationService notificationService;
    private final com.liferpg.repository.UserRepository userRepository;
    private final com.liferpg.repository.CharacterRepository characterRepository;
    private final LevelService levelService;

    public AchievementService(AchievementRepository achievementRepository,
                              UserAchievementRepository userAchievementRepository,
                              AttributeRepository attributeRepository,
                              NotificationService notificationService,
                              com.liferpg.repository.UserRepository userRepository,
                              com.liferpg.repository.CharacterRepository characterRepository,
                              LevelService levelService) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.attributeRepository = attributeRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.characterRepository = characterRepository;
        this.levelService = levelService;
    }

    @Transactional
    public AchievementResponseDTO simulateUnlock(Long userId, String id) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        return simulateUnlock(user, id);
    }

    @Transactional(readOnly = true)
    public List<AchievementResponseDTO> getUserAchievements(Long userId) {
        List<Achievement> all = achievementRepository.findByActiveTrue();
        Map<String, UserAchievement> userMap = userAchievementRepository.findByUserId(userId)
                .stream()
                .collect(Collectors.toMap(ua -> ua.getAchievement().getId(), ua -> ua, (a, b) -> a));

        return all.stream().map(a -> {
            UserAchievement ua = userMap.get(a.getId());
            boolean unlocked = ua != null && ua.isUnlocked();
            int current = ua != null ? ua.getProgress() : 0;
            return new AchievementResponseDTO(
                    a.getId(),
                    a.getTitle(),
                    a.getDescription(),
                    a.getIcon(),
                    a.getCategory().name(),
                    a.getDomainName(),
                    unlocked,
                    current,
                    a.getTarget(),
                    a.getRewardXp(),
                    a.getRewardGold()
            );
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AchievementResponseDTO getAchievementById(Long userId, String id) {
        Achievement a = achievementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found: " + id));

        Optional<UserAchievement> uaOpt = userAchievementRepository.findByUserIdAndAchievementId(userId, id);
        boolean unlocked = uaOpt.map(UserAchievement::isUnlocked).orElse(false);
        int current = uaOpt.map(UserAchievement::getProgress).orElse(0);

        return new AchievementResponseDTO(
                a.getId(),
                a.getTitle(),
                a.getDescription(),
                a.getIcon(),
                a.getCategory().name(),
                a.getDomainName(),
                unlocked,
                current,
                a.getTarget(),
                a.getRewardXp(),
                a.getRewardGold()
        );
    }

    @Transactional
    public AchievementResponseDTO simulateUnlock(User user, String id) {
        Achievement a = achievementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found: " + id));

        Optional<UserAchievement> uaOpt = userAchievementRepository.findByUserAndAchievement(user, a);
        boolean alreadyUnlocked = uaOpt.map(UserAchievement::isUnlocked).orElse(false);

        UserAchievement ua = uaOpt.orElseGet(() -> new UserAchievement(user, a, a.getTarget(), true, LocalDateTime.now()));

        ua.setUnlocked(true);
        ua.setProgress(a.getTarget());
        ua.setUnlockedAt(LocalDateTime.now());
        userAchievementRepository.save(ua);

        if (!alreadyUnlocked) {
            Character character = characterRepository.findByUserId(user.getId()).orElse(null);
            if (character != null) {
                if (a.getRewardGold() > 0) {
                    character.setGold(character.getGold() + a.getRewardGold());
                }
                if (a.getRewardXp() > 0) {
                    boolean leveledUp = levelService.processXpGain(character, a.getRewardXp());
                    if (leveledUp) {
                        notificationService.createNotification(
                                user,
                                NotificationType.level_up,
                                "Ascended to Level " + character.getLevel() + "!",
                                "Achievement mastery propelled you to Level " + character.getLevel() + "!",
                                "military_tech",
                                "text-secondary-container bg-secondary-fixed",
                                "/character",
                                "View Sheet"
                        );
                    }
                }
                characterRepository.save(character);
            }
        }

        notificationService.createNotification(
                user,
                NotificationType.achievement_unlocked,
                "Achievement Unlocked: " + a.getTitle(),
                a.getDescription(),
                a.getIcon(),
                "text-tertiary-container bg-tertiary-fixed",
                "/achievements",
                "View Medals"
        );

        return new AchievementResponseDTO(
                a.getId(),
                a.getTitle(),
                a.getDescription(),
                a.getIcon(),
                a.getCategory().name(),
                a.getDomainName(),
                true,
                a.getTarget(),
                a.getTarget(),
                a.getRewardXp(),
                a.getRewardGold()
        );
    }

    @Transactional
    public AchievementResponseDTO claimAchievement(Long userId, String id) {
        return simulateUnlock(userId, id);
    }

    /**
     * Evaluates achievements for the user and unlocks qualifying achievements.
     * Returns list of newly unlocked achievement titles.
     */
    @Transactional
    public List<String> evaluateAchievements(User user, Character character, long totalCompletedQuests) {
        List<String> newlyUnlocked = new ArrayList<>();
        List<Achievement> all = achievementRepository.findByActiveTrue();
        List<Attribute> attributes = attributeRepository.findByUserId(user.getId());
        Map<String, Attribute> attrMap = attributes.stream()
                .collect(Collectors.toMap(Attribute::getAttributeKey, a -> a, (a, b) -> a));

        boolean characterModified = false;

        for (Achievement a : all) {
            UserAchievement ua = userAchievementRepository.findByUserAndAchievement(user, a)
                    .orElseGet(() -> new UserAchievement(user, a, 0, false, null));

            if (ua.isUnlocked()) continue;

            int progress = calculateProgress(a, character, totalCompletedQuests, attrMap);
            ua.setProgress(progress);

            if (progress >= a.getTarget()) {
                ua.setUnlocked(true);
                ua.setUnlockedAt(LocalDateTime.now());
                newlyUnlocked.add(a.getTitle());

                if (character != null) {
                    if (a.getRewardGold() > 0) {
                        character.setGold(character.getGold() + a.getRewardGold());
                        characterModified = true;
                    }
                    if (a.getRewardXp() > 0) {
                        levelService.processXpGain(character, a.getRewardXp());
                        characterModified = true;
                    }
                }

                notificationService.createNotification(
                        user,
                        NotificationType.achievement_unlocked,
                        "Achievement Unlocked: " + a.getTitle(),
                        a.getDescription(),
                        a.getIcon(),
                        "text-tertiary-container bg-tertiary-fixed",
                        "/achievements",
                        "View Medals"
                );
            }
            userAchievementRepository.save(ua);
        }

        if (characterModified && character != null) {
            characterRepository.save(character);
        }

        return newlyUnlocked;
    }

    private int calculateProgress(Achievement a, Character character, long totalCompletedQuests, Map<String, Attribute> attrMap) {
        return switch (a.getId()) {
            case "first-quest", "century-club" -> (int) totalCompletedQuests;
            case "quest-marathon" -> character.getQuestsCompletedToday();
            case "coding-streak-14", "streak-vanguard", "unbreakable" -> character.getCurrentStreak();
            case "novice-ascendant", "veteran-adventurer", "kafka-milestone" -> character.getLevel();
            case "first-fortune", "gold-hoarder", "vault-tycoon" -> (int) character.getGold();
            case "strength-lvl-8" -> attrMap.containsKey("strength") ? attrMap.get("strength").getLevel() : 0;
            case "mind-over-matter" -> attrMap.containsKey("intelligence") ? attrMap.get("intelligence").getLevel() : 0;
            case "renaissance-adventurer" -> (int) attrMap.values().stream().filter(att -> att.getLevel() >= 10).count();
            default -> a.getTarget();
        };
    }
}
