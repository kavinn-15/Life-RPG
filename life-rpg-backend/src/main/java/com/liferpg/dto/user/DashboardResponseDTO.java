package com.liferpg.dto.user;

import com.liferpg.dto.character.CharacterResponseDTO;
import com.liferpg.dto.notification.NotificationResponseDTO;
import com.liferpg.dto.quest.QuestResponseDTO;

import java.util.ArrayList;
import java.util.List;

public class DashboardResponseDTO {
    private CharacterResponseDTO character;
    private QuestResponseDTO featuredQuest;
    private List<QuestResponseDTO> continueQuests = new ArrayList<>();
    private List<QuestResponseDTO> recommendedQuests = new ArrayList<>();
    private List<QuestResponseDTO> dailyQuests = new ArrayList<>();
    private List<NotificationResponseDTO> recentNotifications = new ArrayList<>();
    private int streak;
    private long xp;
    private long xpNeeded;
    private int xpPct;
    private long gold;
    private int level;

    public DashboardResponseDTO() {}

    public CharacterResponseDTO getCharacter() { return character; }
    public void setCharacter(CharacterResponseDTO character) { this.character = character; }

    public QuestResponseDTO getFeaturedQuest() { return featuredQuest; }
    public void setFeaturedQuest(QuestResponseDTO featuredQuest) { this.featuredQuest = featuredQuest; }

    public List<QuestResponseDTO> getContinueQuests() { return continueQuests; }
    public void setContinueQuests(List<QuestResponseDTO> continueQuests) { this.continueQuests = continueQuests; }

    public List<QuestResponseDTO> getRecommendedQuests() { return recommendedQuests; }
    public void setRecommendedQuests(List<QuestResponseDTO> recommendedQuests) { this.recommendedQuests = recommendedQuests; }

    public List<QuestResponseDTO> getDailyQuests() { return dailyQuests; }
    public void setDailyQuests(List<QuestResponseDTO> dailyQuests) { this.dailyQuests = dailyQuests; }

    public List<NotificationResponseDTO> getRecentNotifications() { return recentNotifications; }
    public void setRecentNotifications(List<NotificationResponseDTO> recentNotifications) { this.recentNotifications = recentNotifications; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }

    public long getXp() { return xp; }
    public void setXp(long xp) { this.xp = xp; }

    public long getXpNeeded() { return xpNeeded; }
    public void setXpNeeded(long xpNeeded) { this.xpNeeded = xpNeeded; }

    public int getXpPct() { return xpPct; }
    public void setXpPct(int xpPct) { this.xpPct = xpPct; }

    public long getGold() { return gold; }
    public void setGold(long gold) { this.gold = gold; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }
}
