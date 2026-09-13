package com.liferpg.entity;

import com.liferpg.enums.QuestStatus;
import com.liferpg.enums.QuestType;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quests", indexes = {
    @Index(name = "idx_quests_user_id", columnList = "user_id"),
    @Index(name = "idx_quests_status", columnList = "status"),
    @Index(name = "idx_quests_domain_id", columnList = "domain_id"),
    @Index(name = "idx_quests_completed_at", columnList = "completed_at")
})
public class Quest {

    @Id
    @Column(length = 64)
    private String id; // e.g. "kafka" or "quest-123abc4"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "domain_id")
    private Domain domain;

    @Column(name = "domain_name")
    private String domainName;

    @Column(name = "domain_class")
    private String domainClass;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(length = 1000)
    private String requirements;

    @Column(nullable = false)
    private String difficulty = "Medium";

    @Column(name = "difficulty_class")
    private String difficultyClass = "bg-surface-variant text-on-surface-variant";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestStatus status = QuestStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "quest_type", nullable = false)
    private QuestType questType = QuestType.NORMAL;

    @Column(name = "xp_reward", nullable = false)
    private int xpReward = 50;

    @Column(name = "gold_reward", nullable = false)
    private int goldReward = 20;

    @Column(name = "attribute_key")
    private String attributeKey;

    @Column(name = "attribute_xp_reward", nullable = false)
    private int attributeXpReward = 30;

    @Column(name = "stat_label")
    private String statLabel;

    @Column(name = "stat_amount")
    private int statAmount = 3;

    @Column(name = "progress_percentage")
    private int progressPercentage = 0;

    @Column(name = "progress_label")
    private String progressLabel;

    @Column(name = "progress_class")
    private String progressClass;

    @Column(name = "milestone_label")
    private String milestoneLabel;

    @Column(nullable = false)
    private boolean featured = false;

    @Column(nullable = false)
    private boolean recommended = false;

    @Column(nullable = false)
    private boolean daily = false;

    @Column(name = "time_remaining")
    private String timeRemaining;

    @Column(nullable = false)
    private String icon = "task_alt";

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "due_time")
    private LocalDateTime dueTime;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Version
    private Long version;

    @OneToMany(mappedBy = "quest", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("sequenceNumber ASC")
    private List<QuestMilestone> milestones = new ArrayList<>();

    public Quest() {}

    public Quest(String id, User user, Domain domain, String domainName, String title, String description,
                 String difficulty, String difficultyClass, QuestStatus status, QuestType questType,
                 int xpReward, int goldReward, String attributeKey, int attributeXpReward, String icon) {
        this.id = id;
        this.user = user;
        this.domain = domain;
        this.domainName = domainName;
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.difficultyClass = difficultyClass;
        this.status = status;
        this.questType = questType;
        this.xpReward = xpReward;
        this.goldReward = goldReward;
        this.attributeKey = attributeKey;
        this.attributeXpReward = attributeXpReward;
        this.icon = icon;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addMilestone(QuestMilestone milestone) {
        milestones.add(milestone);
        milestone.setQuest(this);
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Domain getDomain() { return domain; }
    public void setDomain(Domain domain) { this.domain = domain; }

    public String getDomainName() { return domainName; }
    public void setDomainName(String domainName) { this.domainName = domainName; }

    public String getDomainClass() { return domainClass; }
    public void setDomainClass(String domainClass) { this.domainClass = domainClass; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getDifficultyClass() { return difficultyClass; }
    public void setDifficultyClass(String difficultyClass) { this.difficultyClass = difficultyClass; }

    public QuestStatus getStatus() { return status; }
    public void setStatus(QuestStatus status) { this.status = status; }

    public QuestType getQuestType() { return questType; }
    public void setQuestType(QuestType questType) { this.questType = questType; }

    public int getXpReward() { return xpReward; }
    public void setXpReward(int xpReward) { this.xpReward = xpReward; }

    public int getGoldReward() { return goldReward; }
    public void setGoldReward(int goldReward) { this.goldReward = goldReward; }

    public String getAttributeKey() { return attributeKey; }
    public void setAttributeKey(String attributeKey) { this.attributeKey = attributeKey; }

    public int getAttributeXpReward() { return attributeXpReward; }
    public void setAttributeXpReward(int attributeXpReward) { this.attributeXpReward = attributeXpReward; }

    public String getStatLabel() { return statLabel; }
    public void setStatLabel(String statLabel) { this.statLabel = statLabel; }

    public int getStatAmount() { return statAmount; }
    public void setStatAmount(int statAmount) { this.statAmount = statAmount; }

    public int getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(int progressPercentage) { this.progressPercentage = progressPercentage; }

    public String getProgressLabel() { return progressLabel; }
    public void setProgressLabel(String progressLabel) { this.progressLabel = progressLabel; }

    public String getProgressClass() { return progressClass; }
    public void setProgressClass(String progressClass) { this.progressClass = progressClass; }

    public String getMilestoneLabel() { return milestoneLabel; }
    public void setMilestoneLabel(String milestoneLabel) { this.milestoneLabel = milestoneLabel; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public boolean isRecommended() { return recommended; }
    public void setRecommended(boolean recommended) { this.recommended = recommended; }

    public boolean isDaily() { return daily; }
    public void setDaily(boolean daily) { this.daily = daily; }

    public String getTimeRemaining() { return timeRemaining; }
    public void setTimeRemaining(String timeRemaining) { this.timeRemaining = timeRemaining; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getDueTime() { return dueTime; }
    public void setDueTime(LocalDateTime dueTime) { this.dueTime = dueTime; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public List<QuestMilestone> getMilestones() { return milestones; }
    public void setMilestones(List<QuestMilestone> milestones) { this.milestones = milestones; }
}
