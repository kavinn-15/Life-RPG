package com.liferpg.dto.character;

import java.util.List;

public class CharacterUpdateRequestDTO {
    private String playerName;
    private String title;
    private String characterClass;
    private Integer dailyGoal;
    private String preferredDifficulty;
    private String mainObjective;
    private String avatarClass;
    private String avatarUrl;
    private List<String> favoriteDomains;

    public CharacterUpdateRequestDTO() {}

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCharacterClass() { return characterClass; }
    public void setCharacterClass(String characterClass) { this.characterClass = characterClass; }

    public Integer getDailyGoal() { return dailyGoal; }
    public void setDailyGoal(Integer dailyGoal) { this.dailyGoal = dailyGoal; }

    public String getPreferredDifficulty() { return preferredDifficulty; }
    public void setPreferredDifficulty(String preferredDifficulty) { this.preferredDifficulty = preferredDifficulty; }

    public String getMainObjective() { return mainObjective; }
    public void setMainObjective(String mainObjective) { this.mainObjective = mainObjective; }

    public String getAvatarClass() { return avatarClass; }
    public void setAvatarClass(String avatarClass) { this.avatarClass = avatarClass; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public List<String> getFavoriteDomains() { return favoriteDomains; }
    public void setFavoriteDomains(List<String> favoriteDomains) { this.favoriteDomains = favoriteDomains; }
}
