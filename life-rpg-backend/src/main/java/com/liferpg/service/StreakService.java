package com.liferpg.service;

import com.liferpg.entity.Character;
import com.liferpg.entity.StreakLog;
import com.liferpg.entity.User;
import com.liferpg.repository.CharacterRepository;
import com.liferpg.repository.StreakLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class StreakService {

    private final StreakLogRepository streakLogRepository;
    private final CharacterRepository characterRepository;

    public StreakService(StreakLogRepository streakLogRepository, CharacterRepository characterRepository) {
        this.streakLogRepository = streakLogRepository;
        this.characterRepository = characterRepository;
    }

    /**
     * Records activity for today and updates the user streak.
     * Prevents multiple streak increments on the same day.
     * Returns true if streak incremented or reset today.
     */
    @Transactional
    public StreakUpdateResult processDailyActivity(User user, Character character, int xpEarned) {
        LocalDate today = LocalDate.now();

        Optional<StreakLog> todayLogOpt = streakLogRepository.findByUserAndActivityDate(user, today);
        if (todayLogOpt.isPresent()) {
            // Already active today; just increment quest counter and XP
            StreakLog log = todayLogOpt.get();
            log.setQuestsCompleted(log.getQuestsCompleted() + 1);
            log.setXpEarned(log.getXpEarned() + xpEarned);
            streakLogRepository.save(log);
            return new StreakUpdateResult(false, character.getCurrentStreak(), null);
        }

        // First quest completed today! Check yesterday's activity
        LocalDate yesterday = today.minusDays(1);
        Optional<StreakLog> yesterdayLogOpt = streakLogRepository.findByUserAndActivityDate(user, yesterday);

        int newStreak;
        if (yesterdayLogOpt.isPresent()) {
            newStreak = character.getCurrentStreak() + 1;
        } else {
            // Missed yesterday; reset streak to 1
            newStreak = 1;
        }

        character.setCurrentStreak(newStreak);
        if (newStreak > character.getLongestStreak()) {
            character.setLongestStreak(newStreak);
        }
        characterRepository.save(character);

        StreakLog newLog = new StreakLog(user, today, 1, xpEarned);
        streakLogRepository.save(newLog);

        Integer milestoneReached = checkStreakMilestone(newStreak);
        return new StreakUpdateResult(true, newStreak, milestoneReached);
    }

    private Integer checkStreakMilestone(int streak) {
        List<Integer> milestones = List.of(3, 7, 14, 30, 60, 100);
        if (milestones.contains(streak)) {
            return streak;
        }
        return null;
    }

    public record StreakUpdateResult(boolean incremented, int currentStreak, Integer milestoneReached) {}
}
