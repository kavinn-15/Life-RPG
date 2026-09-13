package com.liferpg.service;

import com.liferpg.entity.Character;
import com.liferpg.entity.StreakLog;
import com.liferpg.entity.User;
import com.liferpg.enums.UserRole;
import com.liferpg.repository.CharacterRepository;
import com.liferpg.repository.StreakLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StreakServiceTest {

    @Mock
    private StreakLogRepository streakLogRepository;

    @Mock
    private CharacterRepository characterRepository;

    private StreakService streakService;
    private User user;
    private Character character;

    @BeforeEach
    void setUp() {
        streakService = new StreakService(streakLogRepository, characterRepository);
        user = new User("testplayer@liferpg.app", "hash", "Test Player", UserRole.USER);
        user.setId(1L);
        character = new Character(user);
        character.setCurrentStreak(5);
        character.setLongestStreak(10);
    }

    @Test
    @DisplayName("Subsequent activity on same day does not re-increment streak counter")
    void testSameDayActivityDoesNotIncrementStreak() {
        LocalDate today = LocalDate.now();
        StreakLog existingTodayLog = new StreakLog(user, today, 1, 150);

        when(streakLogRepository.findByUserAndActivityDate(user, today)).thenReturn(Optional.of(existingTodayLog));

        StreakService.StreakUpdateResult result = streakService.processDailyActivity(user, character, 200);

        assertFalse(result.incremented());
        assertEquals(5, result.currentStreak());
        assertEquals(2, existingTodayLog.getQuestsCompleted());
        assertEquals(350, existingTodayLog.getXpEarned());
        verify(streakLogRepository).save(existingTodayLog);
        verify(characterRepository, never()).save(any());
    }

    @Test
    @DisplayName("Consecutive day activity increments streak and updates longest streak if exceeded")
    void testConsecutiveDayActivityIncrementsStreak() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        StreakLog yesterdayLog = new StreakLog(user, yesterday, 2, 300);

        when(streakLogRepository.findByUserAndActivityDate(user, today)).thenReturn(Optional.empty());
        when(streakLogRepository.findByUserAndActivityDate(user, yesterday)).thenReturn(Optional.of(yesterdayLog));

        character.setCurrentStreak(10);
        character.setLongestStreak(10);

        StreakService.StreakUpdateResult result = streakService.processDailyActivity(user, character, 100);

        assertTrue(result.incremented());
        assertEquals(11, result.currentStreak());
        assertEquals(11, character.getCurrentStreak());
        assertEquals(11, character.getLongestStreak());
        verify(characterRepository).save(character);
        verify(streakLogRepository).save(any(StreakLog.class));
    }

    @Test
    @DisplayName("Broken streak resets to 1 if yesterday was missed")
    void testBrokenStreakResetsToOne() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        when(streakLogRepository.findByUserAndActivityDate(user, today)).thenReturn(Optional.empty());
        when(streakLogRepository.findByUserAndActivityDate(user, yesterday)).thenReturn(Optional.empty());

        character.setCurrentStreak(15);
        character.setLongestStreak(20);

        StreakService.StreakUpdateResult result = streakService.processDailyActivity(user, character, 100);

        assertTrue(result.incremented());
        assertEquals(1, result.currentStreak());
        assertEquals(1, character.getCurrentStreak());
        assertEquals(20, character.getLongestStreak()); // Longest streak preserved!
        verify(characterRepository).save(character);
    }
}
