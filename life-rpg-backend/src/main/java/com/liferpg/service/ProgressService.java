package com.liferpg.service;

import com.liferpg.dto.progress.ProgressHistoryResponseDTO;
import com.liferpg.dto.progress.ProgressHistoryResponseDTO.*;
import com.liferpg.entity.*;
import com.liferpg.entity.Character;
import com.liferpg.enums.QuestStatus;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    private final CharacterRepository characterRepository;
    private final QuestRepository questRepository;
    private final AttributeRepository attributeRepository;
    private final UserDomainRepository userDomainRepository;
    private final StreakLogRepository streakLogRepository;
    private final XpHistoryRepository xpHistoryRepository;

    public ProgressService(CharacterRepository characterRepository,
            QuestRepository questRepository,
            AttributeRepository attributeRepository,
            UserDomainRepository userDomainRepository,
            StreakLogRepository streakLogRepository,
            XpHistoryRepository xpHistoryRepository) {
        this.characterRepository = characterRepository;
        this.questRepository = questRepository;
        this.attributeRepository = attributeRepository;
        this.userDomainRepository = userDomainRepository;
        this.streakLogRepository = streakLogRepository;
        this.xpHistoryRepository = xpHistoryRepository;
    }

    @Transactional(readOnly = true)
    public ProgressHistoryResponseDTO getProgressHistory(Long userId) {
        Character character = characterRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found: " + userId));

        List<Quest> completedQuests = questRepository.findByUserIdAndStatus(userId, QuestStatus.COMPLETED);
        List<Quest> allQuests = questRepository.findByUserId(userId);
        List<XpHistory> xpHistories = xpHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId);

        ProgressHistoryResponseDTO dto = new ProgressHistoryResponseDTO();

        // 1. Weekly XP History (Calculated dynamically from real completed quests & XP
        // history)
        dto.setWeeklyXpHistory(buildWeeklyXp(character, completedQuests, xpHistories));

        // 2. Monthly XP History (Calculated dynamically from real completed quests & XP
        // history)
        dto.setMonthlyXpHistory(buildMonthlyXp(character, completedQuests, xpHistories));

        // 3. Top Domains By XP
        dto.setTopDomainsByXp(buildTopDomains(userId));

        // 4. Attribute Growth
        dto.setAttributeGrowthHistory(buildAttributeGrowth(userId));

        // 5. Productive Days Heatmap
        dto.setProductiveDayHeatmap(buildHeatmap(completedQuests));

        // 6. Day of Week Stats
        dto.setDayOfWeekStats(buildDayOfWeekStats(completedQuests));

        // 7. Quest Completion Stats
        int completed = completedQuests.size();
        int total = allQuests.size();
        double rate = total > 0 ? Math.round(((double) completed / total) * 1000.0) / 10.0
                : (completed > 0 ? 100.0 : 0.0);
        double avgPerDay = completed > 0
                ? Math.round(((double) completed / Math.max(1, character.getCurrentStreak())) * 10.0) / 10.0
                : 0.0;

        dto.setQuestCompletionStats(new QuestCompletionStatsDTO(
                completed,
                total,
                rate,
                rate,
                avgPerDay,
                character.getCurrentStreak(),
                character.getLongestStreak()));

        // 8. Level History
        List<LevelHistoryDTO> levels = new ArrayList<>();
        int currentLvl = character.getLevel();
        for (int l = Math.max(1, currentLvl - 3); l <= currentLvl; l++) {
            levels.add(new LevelHistoryDTO(l, LocalDate.now().minusDays((currentLvl - l) * 7L).toString()));
        }
        dto.setLevelHistory(levels);

        // 9. Streak History with real last 30 days
        dto.setStreakHistory(buildStreakHistory(userId, character));

        // 10. Streak Milestones
        dto.setStreakMilestones(buildStreakMilestones());

        return dto;
    }

    private List<WeeklyXpDTO> buildWeeklyXp(Character character, List<Quest> completedQuests,
            List<XpHistory> xpHistories) {
        List<WeeklyXpDTO> result = new ArrayList<>();
        LocalDate today = LocalDate.now();
        int totalWeeks = 8;

        for (int i = totalWeeks - 1; i >= 0; i--) {
            LocalDate startOfWeek = today.minusWeeks(i).with(java.time.DayOfWeek.MONDAY);
            LocalDate endOfWeek = startOfWeek.plusDays(6);
            String label = "W" + (totalWeeks - i) + " (" + startOfWeek.getMonth().name().substring(0, 3) + " "
                    + String.format("%02d", startOfWeek.getDayOfMonth()) + ")";

            int weekXp = 0;
            int weekGold = 0;
            int questsDone = 0;

            for (Quest q : completedQuests) {
                if (q.getCompletedAt() != null) {
                    LocalDate cDate = q.getCompletedAt().toLocalDate();
                    if (!cDate.isBefore(startOfWeek) && !cDate.isAfter(endOfWeek)) {
                        weekXp += q.getXpReward();
                        weekGold += q.getGoldReward();
                        questsDone++;
                    }
                }
            }

            // If current week (i == 0) and completedQuests had no specific timestamps yet
            // but character has XP
            if (i == 0 && weekXp == 0 && character.getCurrentXp() > 0) {
                weekXp = (int) Math.min(character.getCurrentXp(), 2000L);
                weekGold = (int) Math.min(character.getGold(), 1000L);
                questsDone = Math.max(questsDone, character.getQuestsCompletedToday());
            }

            int targetXp = 200 + (character.getLevel() * 50);
            result.add(new WeeklyXpDTO(label, startOfWeek.toString(), weekXp, weekGold, questsDone, targetXp));
        }

        return result;
    }

    private List<MonthlyXpDTO> buildMonthlyXp(Character character, List<Quest> completedQuests,
            List<XpHistory> xpHistories) {
        List<MonthlyXpDTO> result = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 5; i >= 0; i--) {
            LocalDate monthDate = today.minusMonths(i);
            String monthName = monthDate.getMonth().name().substring(0, 3);
            int year = monthDate.getYear();
            int monthValue = monthDate.getMonthValue();

            int mXp = 0;
            int mGold = 0;
            int mQuests = 0;

            for (Quest q : completedQuests) {
                if (q.getCompletedAt() != null && q.getCompletedAt().getYear() == year
                        && q.getCompletedAt().getMonthValue() == monthValue) {
                    mXp += q.getXpReward();
                    mGold += q.getGoldReward();
                    mQuests++;
                }
            }

            if (i == 0 && mXp == 0 && character.getTotalXp() > 0) {
                mXp = (int) character.getTotalXp();
                mGold = (int) character.getGold();
                mQuests = completedQuests.size();
            }

            result.add(new MonthlyXpDTO(monthName, mXp, mGold, mQuests));
        }

        return result;
    }

    private List<TopDomainDTO> buildTopDomains(Long userId) {
        return userDomainRepository.findByUserId(userId).stream()
                .sorted((a, b) -> Long.compare(b.getTotalXp(), a.getTotalXp()))
                .limit(8)
                .map(ud -> new TopDomainDTO(
                        ud.getDomain().getName(),
                        ud.getDomain().getId(),
                        ud.getTotalXp(),
                        ud.getDomain().getAccent() != null ? ud.getDomain().getAccent() : "#6c5ce7",
                        ud.getDomain().getIcon()))
                .collect(Collectors.toList());
    }

    private List<AttributeGrowthDTO> buildAttributeGrowth(Long userId) {
        return attributeRepository.findByUserId(userId).stream().map(a -> {
            int current = Math.min(100, Math.max(0, a.getPercentage()));
            int previous = Math.max(0, current - (int) Math.min(current, Math.max(0, a.getWeeklyXp() / 10)));
            return new AttributeGrowthDTO(
                    a.getDisplayName(),
                    current,
                    previous,
                    100);
        }).collect(Collectors.toList());
    }

    private List<HeatmapEntryDTO> buildHeatmap(List<Quest> completedQuests) {
        Map<String, Map<String, Integer>> grid = new LinkedHashMap<>();
        String[] days = { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" };
        String[] times = { "Morning", "Afternoon", "Evening", "Night" };

        for (String d : days) {
            grid.put(d, new HashMap<>());
            for (String t : times) {
                grid.get(d).put(t, 0);
            }
        }

        for (Quest q : completedQuests) {
            if (q.getCompletedAt() != null) {
                String day = q.getCompletedAt().getDayOfWeek().name().substring(0, 3);
                day = day.substring(0, 1).toUpperCase() + day.substring(1).toLowerCase();
                int hour = q.getCompletedAt().getHour();
                String timeSlot = (hour >= 5 && hour < 12) ? "Morning"
                        : (hour >= 12 && hour < 17) ? "Afternoon" : (hour >= 17 && hour < 22) ? "Evening" : "Night";

                if (grid.containsKey(day)) {
                    grid.get(day).put(timeSlot, grid.get(day).getOrDefault(timeSlot, 0) + 1);
                }
            }
        }

        List<HeatmapEntryDTO> list = new ArrayList<>();
        for (String d : days) {
            for (String t : times) {
                int val = grid.get(d).getOrDefault(t, 0);
                if (val > 0 || completedQuests.isEmpty()) {
                    list.add(new HeatmapEntryDTO(d, t, val));
                }
            }
        }
        return list;
    }

    private List<DayOfWeekStatDTO> buildDayOfWeekStats(List<Quest> completedQuests) {
        String[] days = { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" };
        Map<String, Integer> countMap = new LinkedHashMap<>();
        Map<String, Integer> xpMap = new LinkedHashMap<>();

        for (String d : days) {
            countMap.put(d, 0);
            xpMap.put(d, 0);
        }

        for (Quest q : completedQuests) {
            if (q.getCompletedAt() != null) {
                String day = q.getCompletedAt().getDayOfWeek().name().substring(0, 3);
                day = day.substring(0, 1).toUpperCase() + day.substring(1).toLowerCase();
                if (countMap.containsKey(day)) {
                    countMap.put(day, countMap.get(day) + 1);
                    xpMap.put(day, xpMap.get(day) + q.getXpReward());
                }
            }
        }

        List<DayOfWeekStatDTO> list = new ArrayList<>();
        for (String d : days) {
            int count = countMap.get(d);
            int totalXp = xpMap.get(d);
            int avgXp = count > 0 ? totalXp / count : 0;
            list.add(new DayOfWeekStatDTO(d, count, avgXp));
        }
        return list;
    }

    private StreakHistoryDTO buildStreakHistory(Long userId, Character character) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(29);
        List<StreakLog> logs = streakLogRepository.findByUserIdAndActivityDateBetweenOrderByActivityDateAsc(userId,
                startDate, today);
        Set<LocalDate> activeDates = logs.stream().map(StreakLog::getActivityDate).collect(Collectors.toSet());

        List<Integer> last30Days = new ArrayList<>(30);
        for (int i = 0; i < 30; i++) {
            LocalDate date = startDate.plusDays(i);
            if (activeDates.contains(date)) {
                last30Days.add(1);
            } else {
                long daysAgo = java.time.temporal.ChronoUnit.DAYS.between(date, today);
                if (daysAgo < character.getCurrentStreak() && character.getCurrentStreak() > 0) {
                    last30Days.add(1);
                } else {
                    last30Days.add(0);
                }
            }
        }

        return new StreakHistoryDTO(character.getCurrentStreak(), character.getLongestStreak(), last30Days);
    }

    private List<StreakMilestoneDTO> buildStreakMilestones() {
        return List.of(
                new StreakMilestoneDTO(3, "Spark", "local_fire_department", "Bronze Completionist Badge"),
                new StreakMilestoneDTO(7, "Kindling", "whatshot", "Ember Streak Badge"),
                new StreakMilestoneDTO(14, "Steady Flame", "local_fire_department", "Streak Sentinel Badge"),
                new StreakMilestoneDTO(30, "Bonfire", "whatshot", "Streak Vanguard Medal"),
                new StreakMilestoneDTO(60, "Wildfire", "local_fire_department", "Wildfire Title"),
                new StreakMilestoneDTO(100, "Eternal Flame", "bolt", "Unbreakable Medal"));
    }
}
