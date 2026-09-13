package com.liferpg.service;

import com.liferpg.dto.mission.DailyMissionResponseDTO;
import com.liferpg.entity.*;
import com.liferpg.entity.Character;
import com.liferpg.enums.NotificationType;
import com.liferpg.enums.TransactionType;
import com.liferpg.exception.BadRequestException;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DailyMissionService {

    private final DailyMissionRepository dailyMissionRepository;
    private final DailyMissionProgressRepository dailyMissionProgressRepository;
    private final CharacterRepository characterRepository;
    private final QuestRepository questRepository;
    private final LevelService levelService;
    private final NotificationService notificationService;
    private final GoldTransactionRepository goldTransactionRepository;
    private final XpHistoryRepository xpHistoryRepository;

    public DailyMissionService(DailyMissionRepository dailyMissionRepository,
            DailyMissionProgressRepository dailyMissionProgressRepository,
            CharacterRepository characterRepository,
            QuestRepository questRepository,
            LevelService levelService,
            NotificationService notificationService,
            GoldTransactionRepository goldTransactionRepository,
            XpHistoryRepository xpHistoryRepository) {
        this.dailyMissionRepository = dailyMissionRepository;
        this.dailyMissionProgressRepository = dailyMissionProgressRepository;
        this.characterRepository = characterRepository;
        this.questRepository = questRepository;
        this.levelService = levelService;
        this.notificationService = notificationService;
        this.goldTransactionRepository = goldTransactionRepository;
        this.xpHistoryRepository = xpHistoryRepository;
    }

    @Transactional
    public List<DailyMissionResponseDTO> getDailyMissions(Long userId) {
        Character character = characterRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found for user: " + userId));

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        List<DailyMission> missions = dailyMissionRepository.findByActiveTrue();
        List<Quest> allUserQuests = questRepository.findByUserId(userId);

        // Real user quest statistics for today
        List<Quest> completedTodayQuests = allUserQuests.stream()
                .filter(q -> q.getStatus() == com.liferpg.enums.QuestStatus.COMPLETED)
                .filter(q -> {
                    LocalDateTime comp = q.getCompletedAt() != null ? q.getCompletedAt() : q.getUpdatedAt();
                    return comp != null && !comp.isBefore(startOfDay) && comp.isBefore(endOfDay);
                })
                .toList();

        int completedQuestsTodayCount = Math.max(completedTodayQuests.size(), character.getQuestsCompletedToday());
        int dailyCount = (int) allUserQuests.stream().filter(Quest::isDaily).count();
        int totalDailyQuests = dailyCount > 0 ? dailyCount : Math.max(1, allUserQuests.size());

        // Real XP gained today
        Long xpGainedTodaySum = xpHistoryRepository.sumXpByUserIdAndCreatedAtAfter(userId, startOfDay);
        int xpGainedToday = xpGainedTodaySum != null ? xpGainedTodaySum.intValue()
                : completedTodayQuests.stream().mapToInt(Quest::getXpReward).sum();

        // Real Gold gained today
        Long goldGainedTodaySum = goldTransactionRepository.sumEarnedGoldByUserIdAndCreatedAtAfter(userId, startOfDay);
        int goldGainedToday = goldGainedTodaySum != null ? goldGainedTodaySum.intValue()
                : completedTodayQuests.stream().mapToInt(Quest::getGoldReward).sum();

        // Real distinct domains progressed today
        long distinctDomainsCount = completedTodayQuests.stream()
                .map(q -> q.getDomain() != null ? q.getDomain().getId()
                        : (q.getDomainName() != null ? q.getDomainName() : ""))
                .filter(d -> !d.isBlank())
                .distinct()
                .count();

        // Real morning quests completed before 12:00 PM today
        long morningQuestsCount = completedTodayQuests.stream()
                .filter(q -> {
                    LocalDateTime comp = q.getCompletedAt() != null ? q.getCompletedAt() : q.getUpdatedAt();
                    return comp != null && comp.getHour() < 12;
                })
                .count();

        // Real completed milestones
        long completedMilestonesCount = allUserQuests.stream()
                .filter(q -> q.getMilestones() != null)
                .flatMap(q -> q.getMilestones().stream())
                .filter(QuestMilestone::isCompleted)
                .count();

        return missions.stream().map(m -> {
            DailyMissionProgress prog = dailyMissionProgressRepository
                    .findByUserIdAndDailyMissionIdAndProgressDate(userId, m.getId(), today)
                    .orElseGet(() -> new DailyMissionProgress(character.getUser(), m, today, 0, false, false));

            int current = deriveCurrent(m, completedQuestsTodayCount, xpGainedToday,
                    goldGainedToday, (int) distinctDomainsCount, (int) morningQuestsCount,
                    (int) completedMilestonesCount);

            int target = m.getTarget() != null && m.getTarget() > 0 ? m.getTarget() : totalDailyQuests;
            boolean completed = current >= target;

            prog.setProgress(current);
            prog.setCompleted(completed);
            dailyMissionProgressRepository.save(prog);

            DailyMissionResponseDTO dto = new DailyMissionResponseDTO();
            dto.setId(m.getId());
            dto.setTitle(m.getTitle());
            dto.setDescription(m.getDescription());
            dto.setIcon(m.getIcon());
            dto.setSource(m.getSource());
            dto.setTarget(target);
            dto.setMockCurrent(current);
            dto.setCurrent(current);
            dto.setRewardXp(m.getRewardXp());
            dto.setRewardGold(m.getRewardGold());
            dto.setCompleted(completed);
            dto.setClaimed(prog.isClaimed());
            return dto;
        }).collect(Collectors.toList());
    }

    private int deriveCurrent(DailyMission m, int completedQuestsToday, int xpToday,
            int goldToday, int domainsToday, int morningQuests, int completedMilestones) {
        String id = m.getId() != null ? m.getId().toLowerCase() : "";
        String source = m.getSource() != null ? m.getSource() : "";

        if ("questsCompletedToday".equalsIgnoreCase(source) || "activeQuests".equalsIgnoreCase(source)
                || id.contains("threat") || id.contains("complete-daily") || id.contains("3-quests")) {
            return completedQuestsToday;
        }
        if ("dailyQuestsRatio".equalsIgnoreCase(source) || id.contains("full-house")) {
            return completedQuestsToday;
        }
        if ("todayXp".equalsIgnoreCase(source) || id.contains("xp-surge") || id.contains("surge")
                || id.contains("xp")) {
            return xpToday;
        }
        if ("todayGold".equalsIgnoreCase(source) || id.contains("gold-rush") || id.contains("gold")) {
            return goldToday;
        }
        if ("todayDomains".equalsIgnoreCase(source) || id.contains("domain")) {
            return domainsToday;
        }
        if ("todayMorningQuests".equalsIgnoreCase(source) || id.contains("morning")) {
            return morningQuests;
        }
        if (id.contains("flame")) {
            return completedQuestsToday >= 1 ? 1 : 0;
        }
        if ("todayMilestones".equalsIgnoreCase(source) || id.contains("milestone")) {
            return completedMilestones;
        }

        return completedQuestsToday;
    }

    @Transactional
    public DailyMissionResponseDTO claimMission(Long userId, String missionId) {
        DailyMission mission = dailyMissionRepository.findById(missionId)
                .orElseThrow(() -> new ResourceNotFoundException("Mission not found: " + missionId));

        Character character = characterRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found for user: " + userId));

        LocalDate today = LocalDate.now();
        DailyMissionProgress prog = dailyMissionProgressRepository
                .findByUserIdAndDailyMissionIdAndProgressDate(userId, missionId, today)
                .orElseThrow(() -> new BadRequestException("Mission progress not found for today"));

        if (!prog.isCompleted()) {
            throw new BadRequestException("Mission is not completed yet");
        }
        if (prog.isClaimed()) {
            throw new BadRequestException("Mission reward has already been claimed today");
        }

        prog.setClaimed(true);
        prog.setCompletedAt(LocalDateTime.now());
        dailyMissionProgressRepository.save(prog);

        // Award rewards
        levelService.processXpGain(character, mission.getRewardXp());
        character.setGold(character.getGold() + mission.getRewardGold());
        characterRepository.save(character);

        // Audit transactions
        xpHistoryRepository.save(
                new XpHistory(character.getUser(), "MISSION", mission.getId(), mission.getRewardXp(), null, null));
        if (mission.getRewardGold() > 0) {
            goldTransactionRepository.save(new GoldTransaction(
                    character.getUser(),
                    TransactionType.MISSION_REWARD,
                    mission.getRewardGold(),
                    character.getGold(),
                    "MISSION",
                    mission.getId(),
                    "Completed daily mission: " + mission.getTitle()));
        }

        notificationService.createNotification(
                character.getUser(),
                NotificationType.daily_mission_completed,
                "Daily Mission Claimed: " + mission.getTitle(),
                "Claimed +" + mission.getRewardXp() + " XP and +" + mission.getRewardGold() + " Gold.",
                mission.getIcon(),
                "text-primary bg-primary-fixed",
                "/daily-missions",
                "View Missions");

        DailyMissionResponseDTO dto = new DailyMissionResponseDTO();
        dto.setId(mission.getId());
        dto.setTitle(mission.getTitle());
        dto.setDescription(mission.getDescription());
        dto.setIcon(mission.getIcon());
        dto.setSource(mission.getSource());
        dto.setTarget(mission.getTarget() != null ? mission.getTarget() : character.getQuestsTotalToday());
        dto.setCurrent(prog.getProgress());
        dto.setRewardXp(mission.getRewardXp());
        dto.setRewardGold(mission.getRewardGold());
        dto.setCompleted(true);
        dto.setClaimed(true);
        return dto;
    }
}
