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
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DailyMissionService {

    private final DailyMissionRepository dailyMissionRepository;
    private final DailyMissionProgressRepository dailyMissionProgressRepository;
    private final CharacterRepository characterRepository;
    private final LevelService levelService;
    private final NotificationService notificationService;
    private final GoldTransactionRepository goldTransactionRepository;
    private final XpHistoryRepository xpHistoryRepository;

    public DailyMissionService(DailyMissionRepository dailyMissionRepository,
                               DailyMissionProgressRepository dailyMissionProgressRepository,
                               CharacterRepository characterRepository,
                               LevelService levelService,
                               NotificationService notificationService,
                               GoldTransactionRepository goldTransactionRepository,
                               XpHistoryRepository xpHistoryRepository) {
        this.dailyMissionRepository = dailyMissionRepository;
        this.dailyMissionProgressRepository = dailyMissionProgressRepository;
        this.characterRepository = characterRepository;
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
        List<DailyMission> missions = dailyMissionRepository.findByActiveTrue();

        return missions.stream().map(m -> {
            DailyMissionProgress prog = dailyMissionProgressRepository
                    .findByUserIdAndDailyMissionIdAndProgressDate(userId, m.getId(), today)
                    .orElseGet(() -> new DailyMissionProgress(character.getUser(), m, today, 0, false, false));

            int current = deriveCurrent(m, character, prog);
            int target = m.getTarget() != null ? m.getTarget() : character.getQuestsTotalToday();
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

    private int deriveCurrent(DailyMission m, Character character, DailyMissionProgress prog) {
        if ("questsCompletedToday".equals(m.getSource())) {
            return character.getQuestsCompletedToday();
        }
        if ("dailyQuestsRatio".equals(m.getSource())) {
            return character.getQuestsCompletedToday();
        }
        return Math.max(prog.getProgress(), switch (m.getId()) {
            case "xp-surge" -> 140; // Default simulated/actual progression
            case "domain-diversifier" -> 1;
            case "gold-rush" -> 60;
            default -> 0;
        });
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
        xpHistoryRepository.save(new XpHistory(character.getUser(), "MISSION", mission.getId(), mission.getRewardXp(), null, null));
        if (mission.getRewardGold() > 0) {
            goldTransactionRepository.save(new GoldTransaction(
                    character.getUser(),
                    TransactionType.MISSION_REWARD,
                    mission.getRewardGold(),
                    character.getGold(),
                    "MISSION",
                    mission.getId(),
                    "Completed daily mission: " + mission.getTitle()
            ));
        }

        notificationService.createNotification(
                character.getUser(),
                NotificationType.daily_mission_completed,
                "Daily Mission Claimed: " + mission.getTitle(),
                "Claimed +" + mission.getRewardXp() + " XP and +" + mission.getRewardGold() + " Gold.",
                mission.getIcon(),
                "text-primary bg-primary-fixed",
                "/daily-missions",
                "View Missions"
        );

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
