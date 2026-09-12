package com.liferpg.dto.character;

import java.util.List;

public class CharacterResponseDTO {
    private Long id;
    private String playerName;
    private String title;
    private String characterClass;
    private int level;
    private long xp;
    private long totalXp;
    private long xpNeeded;
    private int xpPct;
    private long gold;
    private int streak;
    private int longestStreak;
    private int questsCompletedToday;
    private int questsTotalToday;
    private int dailyGoal;
    private String preferredDifficulty;
    private String mainObjective;
    private String avatarClass;
    private String avatarUrl;
    private List<AttributeResponseDTO> attributes;

    public CharacterResponseDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCharacterClass() { return characterClass; }
    public void setCharacterClass(String characterClass) { this.characterClass = characterClass; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public long getXp() { return xp; }
    public void setXp(long xp) { this.xp = xp; }

    public long getTotalXp() { return totalXp; }
    public void setTotalXp(long totalXp) { this.totalXp = totalXp; }

    public long getXpNeeded() { return xpNeeded; }
    public void setXpNeeded(long xpNeeded) { this.xpNeeded = xpNeeded; }

    public int getXpPct() { return xpPct; }
    public void setXpPct(int xpPct) { this.xpPct = xpPct; }

    public long getGold() { return gold; }
    public void setGold(long gold) { this.gold = gold; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }

    public int getLongestStreak() { return longestStreak; }
    public void setLongestStreak(int longestStreak) { this.longestStreak = longestStreak; }

    public int getQuestsCompletedToday() { return questsCompletedToday; }
    public void setQuestsCompletedToday(int questsCompletedToday) { this.questsCompletedToday = questsCompletedToday; }

    public int getQuestsTotalToday() { return questsTotalToday; }
    public void setQuestsTotalToday(int questsTotalToday) { this.questsTotalToday = questsTotalToday; }

    public int getDailyGoal() { return dailyGoal; }
    public void setDailyGoal(int dailyGoal) { this.dailyGoal = dailyGoal; }

    public String getPreferredDifficulty() { return preferredDifficulty; }
    public void setPreferredDifficulty(String preferredDifficulty) { this.preferredDifficulty = preferredDifficulty; }

    public String getMainObjective() { return mainObjective; }
    public void setMainObjective(String mainObjective) { this.mainObjective = mainObjective; }

    public String getAvatarClass() { return avatarClass; }
    public void setAvatarClass(String avatarClass) { this.avatarClass = avatarClass; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public List<AttributeResponseDTO> getAttributes() { return attributes; }
    public void setAttributes(List<AttributeResponseDTO> attributes) { this.attributes = attributes; }
}
