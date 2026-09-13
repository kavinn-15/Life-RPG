package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "characters", indexes = {
    @Index(name = "idx_characters_user_id", columnList = "user_id", unique = true)
})
public class Character {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "player_name", nullable = false)
    private String playerName = "Adventurer";

    @Column(nullable = false)
    private String title = "Novice Seeker";

    @Column(name = "character_class")
    private String characterClass = "Adventurer";

    @Column(nullable = false)
    private int level = 1;

    @Column(name = "current_xp", nullable = false)
    private long currentXp = 0;

    @Column(name = "total_xp", nullable = false)
    private long totalXp = 0;

    @Column(nullable = false)
    private long gold = 100;

    @Column(name = "current_streak", nullable = false)
    private int currentStreak = 0;

    @Column(name = "longest_streak", nullable = false)
    private int longestStreak = 0;

    @Column(name = "quests_completed_today", nullable = false)
    private int questsCompletedToday = 0;

    @Column(name = "quests_total_today", nullable = false)
    private int questsTotalToday = 3;

    @Column(name = "daily_goal", nullable = false)
    private int dailyGoal = 3;

    @Column(name = "preferred_difficulty")
    private String preferredDifficulty = "Medium";

    @Column(name = "main_objective", length = 500)
    private String mainObjective = "Level up reality and conquer daily goals.";

    @Column(name = "avatar_class")
    private String avatarClass = "cyber-nomad";

    @Column(name = "avatar_url", columnDefinition = "LONGTEXT")
    private String avatarUrl;

    @Column(name = "favorite_domains")
    private String favoriteDomains = "programming,fitness,reading,finance";

    @Transient
    private long nextLevelXp;

    @Transient
    private int levelProgress;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Version
    private Long version;

    public Character() {}

    public Character(User user) {
        this(user, (user != null && user.getName() != null && !user.getName().isBlank()) ? user.getName() : "Adventurer", "Novice Adventurer");
    }

    public Character(User user, String playerName, String title) {
        this.user = user;
        this.playerName = playerName;
        this.title = title;
        this.level = 1;
        this.currentXp = 0;
        this.totalXp = 0;
        this.gold = 100;
        this.currentStreak = 0;
        this.longestStreak = 0;
        this.questsCompletedToday = 0;
        this.questsTotalToday = 3;
        this.dailyGoal = 3;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCharacterClass() { return characterClass; }
    public void setCharacterClass(String characterClass) { this.characterClass = characterClass; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public long getCurrentXp() { return currentXp; }
    public void setCurrentXp(long currentXp) { this.currentXp = currentXp; }

    public long getTotalXp() { return totalXp; }
    public void setTotalXp(long totalXp) { this.totalXp = totalXp; }

    public long getGold() { return gold; }
    public void setGold(long gold) { this.gold = gold; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

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

    public String getFavoriteDomains() { return favoriteDomains; }
    public void setFavoriteDomains(String favoriteDomains) { this.favoriteDomains = favoriteDomains; }

    public long getNextLevelXp() { return nextLevelXp; }
    public void setNextLevelXp(long nextLevelXp) { this.nextLevelXp = nextLevelXp; }

    public int getLevelProgress() { return levelProgress; }
    public void setLevelProgress(int levelProgress) { this.levelProgress = levelProgress; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
}
