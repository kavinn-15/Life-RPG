package com.liferpg.service;

import com.liferpg.entity.Character;
import org.springframework.stereotype.Service;

@Service
public class LevelService {

    /**
     * Quadratic leveling curve: XP required for level N = 100 * N^2
     */
    public long getRequiredXpForLevel(int level) {
        if (level < 1) level = 1;
        return 100L * level * level;
    }

    /**
     * Calculates the percentage of current XP toward the next level (0-100).
     */
    public int calculatePercentage(long currentXp, int level) {
        long needed = getRequiredXpForLevel(level);
        if (needed <= 0) return 0;
        return (int) Math.min(100, Math.round(((double) currentXp / needed) * 100.0));
    }

    /**
     * Processes XP gain on a character, handling multiple level-ups if applicable.
     * Returns true if at least one level-up occurred.
     */
    public boolean processXpGain(Character character, long xpGained) {
        if (xpGained <= 0) return false;

        character.setTotalXp(character.getTotalXp() + xpGained);
        long newXp = character.getCurrentXp() + xpGained;
        int level = character.getLevel();
        boolean leveledUp = false;

        long required = getRequiredXpForLevel(level);
        while (newXp >= required) {
            newXp -= required;
            level++;
            leveledUp = true;
            required = getRequiredXpForLevel(level);
        }

        character.setLevel(level);
        character.setCurrentXp(newXp);
        return leveledUp;
    }
}
