package com.liferpg.service;

import com.liferpg.entity.Character;
import com.liferpg.entity.User;
import com.liferpg.enums.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LevelServiceTest {

    private LevelService levelService;
    private Character character;

    @BeforeEach
    void setUp() {
        levelService = new LevelService();
        User user = new User("test@liferpg.app", "pass", "Tester", UserRole.USER);
        user.setId(1L);
        character = new Character(user);
        character.setLevel(1);
        character.setCurrentXp(0);
        character.setTotalXp(0);
    }

    @Test
    @DisplayName("Level requirement follows 100 * N^2 formula")
    void testLevelRequirementsFormula() {
        assertEquals(100L, levelService.getRequiredXpForLevel(1));
        assertEquals(400L, levelService.getRequiredXpForLevel(2));
        assertEquals(900L, levelService.getRequiredXpForLevel(3));
        assertEquals(1600L, levelService.getRequiredXpForLevel(4));
        assertEquals(10000L, levelService.getRequiredXpForLevel(10));
    }

    @Test
    @DisplayName("Calculate progress percentage accurately")
    void testCalculatePercentage() {
        // Level 1 requires 100 XP
        assertEquals(50, levelService.calculatePercentage(50, 1));
        assertEquals(100, levelService.calculatePercentage(100, 1));

        // Level 2 requires 400 XP
        assertEquals(25, levelService.calculatePercentage(100, 2));
    }

    @Test
    @DisplayName("Process XP gain without leveling up updates current and total XP")
    void testProcessXpGainWithoutLevelUp() {
        boolean leveledUp = levelService.processXpGain(character, 50);

        assertFalse(leveledUp);
        assertEquals(1, character.getLevel());
        assertEquals(50L, character.getCurrentXp());
        assertEquals(50L, character.getTotalXp());
    }

    @Test
    @DisplayName("Process XP gain with single level up updates level and rolls over remainder")
    void testProcessXpGainSingleLevelUp() {
        // At level 1, required XP is 100
        boolean leveledUp = levelService.processXpGain(character, 150);

        assertTrue(leveledUp);
        assertEquals(2, character.getLevel());
        assertEquals(50L, character.getCurrentXp());
        assertEquals(150L, character.getTotalXp());
    }

    @Test
    @DisplayName("Process massive XP gain triggers multiple level ups accurately")
    void testProcessXpGainMultiLevelUp() {
        // Level 1 needs 100 XP -> new level 2
        // Level 2 needs 400 XP -> new level 3
        // Total needed to reach Level 3 with 100 remainder: 100 + 400 + 100 = 600 XP
        boolean leveledUp = levelService.processXpGain(character, 600);

        assertTrue(leveledUp);
        assertEquals(3, character.getLevel());
        assertEquals(100L, character.getCurrentXp());
        assertEquals(600L, character.getTotalXp());
    }
}
