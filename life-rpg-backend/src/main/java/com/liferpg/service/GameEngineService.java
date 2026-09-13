package com.liferpg.service;

import com.liferpg.dto.character.CharacterResponseDTO;
import com.liferpg.dto.quest.QuestCompletionResponseDTO;
import com.liferpg.entity.*;
import com.liferpg.entity.Character;
import com.liferpg.enums.NotificationType;
import com.liferpg.enums.QuestStatus;
import com.liferpg.enums.TransactionType;
import com.liferpg.exception.QuestCompletionException;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GameEngineService {

    private final QuestRepository questRepository;
    private final CharacterRepository characterRepository;
    private final UserDomainRepository userDomainRepository;
    private final LevelService levelService;
    private final AttributeService attributeService;
    private final StreakService streakService;
    private final AchievementService achievementService;
    private final NotificationService notificationService;
    private final XpHistoryRepository xpHistoryRepository;
    private final GoldTransactionRepository goldTransactionRepository;
    private final CharacterService characterService;

    public GameEngineService(QuestRepository questRepository,
                             CharacterRepository characterRepository,
                             UserDomainRepository userDomainRepository,
                             LevelService levelService,
                             AttributeService attributeService,
                             StreakService streakService,
                             AchievementService achievementService,
                             NotificationService notificationService,
                             XpHistoryRepository xpHistoryRepository,
                             GoldTransactionRepository goldTransactionRepository,
                             CharacterService characterService) {
        this.questRepository = questRepository;
        this.characterRepository = characterRepository;
        this.userDomainRepository = userDomainRepository;
        this.levelService = levelService;
        this.attributeService = attributeService;
        this.streakService = streakService;
        this.achievementService = achievementService;
        this.notificationService = notificationService;
        this.xpHistoryRepository = xpHistoryRepository;
        this.goldTransactionRepository = goldTransactionRepository;
        this.characterService = characterService;
    }

    @Transactional
    public QuestCompletionResponseDTO processQuestCompletion(Long userId, String questId) {
        Quest quest = questRepository.findByIdAndUserId(questId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Quest not found with id: " + questId));

        if (quest.getStatus() == QuestStatus.COMPLETED) {
            throw new QuestCompletionException("Quest has already been completed");
        }

        User user = quest.getUser();
        Character character = characterRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found for user: " + userId));

        // Mark quest COMPLETED
        quest.setStatus(QuestStatus.COMPLETED);
        quest.setCompletedAt(LocalDateTime.now());
        quest.setProgressPercentage(100);
        if (quest.getMilestones() != null) {
            for (QuestMilestone m : quest.getMilestones()) {
                m.setCompleted(true);
                m.setCompletedAt(LocalDateTime.now());
            }
        }
        questRepository.save(quest);

        // Process XP gain & Level progression
        int xpReward = quest.getXpReward();
        boolean levelUp = levelService.processXpGain(character, xpReward);

        // Process Gold reward
        int goldReward = quest.getGoldReward();
        character.setGold(character.getGold() + goldReward);

        // Process Attribute XP
        String attrKey = quest.getAttributeKey();
        int attrXpReward = quest.getAttributeXpReward() > 0 ? quest.getAttributeXpReward() : quest.getStatAmount() * 10;
        if (attrKey != null && !attrKey.isBlank()) {
            attributeService.processAttributeXpGain(user, attrKey, attrXpReward);
        }

        // Process Domain Progression
        if (quest.getDomain() != null) {
            userDomainRepository.findByUserAndDomain(user, quest.getDomain()).ifPresent(ud -> {
                ud.setCurrentXp(ud.getCurrentXp() + xpReward);
                ud.setTotalXp(ud.getTotalXp() + xpReward);
                ud.setQuestsCompleted(ud.getQuestsCompleted() + 1);
                long domainThreshold = 500L * ud.getDomainLevel();
                if (ud.getCurrentXp() >= domainThreshold) {
                    ud.setCurrentXp(ud.getCurrentXp() - domainThreshold);
                    ud.setDomainLevel(ud.getDomainLevel() + 1);
                    notificationService.createNotification(
                            user,
                            NotificationType.domain_milestone,
                            "Domain Tier Advanced: " + quest.getDomain().getName(),
                            "Reached Level " + ud.getDomainLevel() + " in " + quest.getDomain().getName() + "!",
                            quest.getDomain().getIcon(),
                            "text-tertiary-container bg-tertiary-fixed",
                            "/domains/" + quest.getDomain().getId(),
                            "View Realm"
                    );
                }
                userDomainRepository.save(ud);
            });
        }

        // Update quests completed today
        character.setQuestsCompletedToday(character.getQuestsCompletedToday() + 1);

        // Process Streak
        StreakService.StreakUpdateResult streakResult = streakService.processDailyActivity(user, character, xpReward);

        // Persist Character state
        characterRepository.save(character);

        // Audit XP History
        xpHistoryRepository.save(new XpHistory(
                user,
                "QUEST",
                quest.getId(),
                xpReward,
                attrKey,
                quest.getDomain() != null ? quest.getDomain().getId() : null
        ));

        // Audit Gold Transaction
        if (goldReward > 0) {
            goldTransactionRepository.save(new GoldTransaction(
                    user,
                    TransactionType.QUEST_REWARD,
                    goldReward,
                    character.getGold(),
                    "QUEST",
                    quest.getId(),
                    "Completed quest: " + quest.getTitle()
            ));
        }

        // Generate Quest Completed Notification
        notificationService.createNotification(
                user,
                NotificationType.quest_completed,
                "Quest Completed: " + quest.getTitle(),
                "Earned +" + xpReward + " XP and +" + goldReward + " Gold" +
                        (attrKey != null ? " (+" + quest.getStatAmount() + " " + attrKey + ")" : "") + ".",
                "task_alt",
                "text-primary bg-primary-fixed",
                "/quests",
                "Quest Board"
        );

        // Generate Level Up Notification if ascended
        if (levelUp) {
            notificationService.createNotification(
                    user,
                    NotificationType.level_up,
                    "Ascended to Level " + character.getLevel() + "!",
                    "Congratulations! You unlocked Level " + character.getLevel() + ". New attribute potential awakened.",
                    "military_tech",
                    "text-secondary-container bg-secondary-fixed",
                    "/character",
                    "View Sheet"
            );
        }

        // Streak Milestone Notification
        if (streakResult.milestoneReached() != null) {
            notificationService.createNotification(
                    user,
                    NotificationType.streak_milestone,
                    "Streak Milestone: " + streakResult.milestoneReached() + " Days Unbroken!",
                    "Your consistency fuels the fire. Keep the daily momentum alive.",
                    "local_fire_department",
                    "text-secondary bg-secondary-fixed",
                    "/streak",
                    "View Flame"
            );
        }

        // Evaluate Achievements
        long totalCompleted = questRepository.countByUserIdAndStatus(userId, QuestStatus.COMPLETED);
        List<String> newAchievements = achievementService.evaluateAchievements(user, character, totalCompleted);

        // Build Response
        CharacterResponseDTO characterState = characterService.getCharacter(userId);

        QuestCompletionResponseDTO response = new QuestCompletionResponseDTO();
        response.setId(quest.getId());
        response.setQuestId(quest.getId());
        response.setXp(xpReward);
        response.setXpGained(xpReward);
        response.setGold(goldReward);
        response.setGoldGained(goldReward);
        response.setStatKey(attrKey);
        response.setAttribute(attrKey);
        response.setStatAmount(quest.getStatAmount());
        response.setAttributeXpGained(attrXpReward);
        response.setLevel(character.getLevel());
        response.setLevelUp(levelUp);
        response.setStreak(character.getCurrentStreak());
        response.setNewAchievements(newAchievements);
        response.setCharacterState(characterState);

        return response;
    }
}
