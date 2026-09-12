package com.liferpg.dto.quest;

import com.liferpg.dto.character.CharacterResponseDTO;
import java.util.ArrayList;
import java.util.List;

public class QuestCompletionResponseDTO {
    private String id;
    private String questId;
    private int xp;
    private int xpGained;
    private int gold;
    private int goldGained;
    private String statKey;
    private String attribute;
    private int statAmount;
    private int attributeXpGained;
    private int level;
    private boolean levelUp;
    private int streak;
    private List<String> newAchievements = new ArrayList<>();
    private CharacterResponseDTO characterState;

    public QuestCompletionResponseDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getQuestId() { return questId; }
    public void setQuestId(String questId) { this.questId = questId; }

    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }

    public int getXpGained() { return xpGained; }
    public void setXpGained(int xpGained) { this.xpGained = xpGained; }

    public int getGold() { return gold; }
    public void setGold(int gold) { this.gold = gold; }

    public int getGoldGained() { return goldGained; }
    public void setGoldGained(int goldGained) { this.goldGained = goldGained; }

    public String getStatKey() { return statKey; }
    public void setStatKey(String statKey) { this.statKey = statKey; }

    public String getAttribute() { return attribute; }
    public void setAttribute(String attribute) { this.attribute = attribute; }

    public int getStatAmount() { return statAmount; }
    public void setStatAmount(int statAmount) { this.statAmount = statAmount; }

    public int getAttributeXpGained() { return attributeXpGained; }
    public void setAttributeXpGained(int attributeXpGained) { this.attributeXpGained = attributeXpGained; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public boolean isLevelUp() { return levelUp; }
    public void setLevelUp(boolean levelUp) { this.levelUp = levelUp; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }

    public List<String> getNewAchievements() { return newAchievements; }
    public void setNewAchievements(List<String> newAchievements) { this.newAchievements = newAchievements; }

    public CharacterResponseDTO getCharacterState() { return characterState; }
    public void setCharacterState(CharacterResponseDTO characterState) { this.characterState = characterState; }
}
