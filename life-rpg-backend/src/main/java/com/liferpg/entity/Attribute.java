package com.liferpg.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "attributes", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_attribute", columnNames = {"user_id", "attribute_key"})
}, indexes = {
    @Index(name = "idx_attributes_user_id", columnList = "user_id")
})
public class Attribute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "attribute_key", nullable = false)
    private String attributeKey;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(nullable = false)
    private String icon;

    @Column(nullable = false)
    private int level = 1;

    @Column(name = "current_xp", nullable = false)
    private long currentXp = 0;

    @Column(name = "total_xp", nullable = false)
    private long totalXp = 0;

    @Column(name = "weekly_xp", nullable = false)
    private long weeklyXp = 0;

    @Column(name = "next_threshold", nullable = false)
    private int nextThreshold = 2;

    @Column(nullable = false)
    private int percentage = 0;

    @Column(nullable = false)
    private boolean stable = false;

    @Column(name = "need_quest", nullable = false)
    private boolean needQuest = false;

    public Attribute() {}

    public Attribute(User user, String attributeKey, String displayName, String description, String icon, int level, long currentXp, int nextThreshold, int percentage) {
        this.user = user;
        this.attributeKey = attributeKey;
        this.displayName = displayName;
        this.icon = icon;
        this.level = level;
        this.currentXp = currentXp;
        this.totalXp = currentXp;
        this.weeklyXp = currentXp / 2;
        this.nextThreshold = nextThreshold;
        this.percentage = percentage;
    }

    public Attribute(User user, String attributeKey, String displayName, String icon, int level, long currentXp, long totalXp, long weeklyXp, int nextThreshold, int percentage) {
        this.user = user;
        this.attributeKey = attributeKey;
        this.displayName = displayName;
        this.icon = icon;
        this.level = level;
        this.currentXp = currentXp;
        this.totalXp = totalXp;
        this.weeklyXp = weeklyXp;
        this.nextThreshold = nextThreshold;
        this.percentage = percentage;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getAttributeKey() { return attributeKey; }
    public void setAttributeKey(String attributeKey) { this.attributeKey = attributeKey; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public long getCurrentXp() { return currentXp; }
    public void setCurrentXp(long currentXp) { this.currentXp = currentXp; }

    public long getTotalXp() { return totalXp; }
    public void setTotalXp(long totalXp) { this.totalXp = totalXp; }

    public long getWeeklyXp() { return weeklyXp; }
    public void setWeeklyXp(long weeklyXp) { this.weeklyXp = weeklyXp; }

    public int getNextThreshold() { return nextThreshold; }
    public void setNextThreshold(int nextThreshold) { this.nextThreshold = nextThreshold; }

    public int getPercentage() { return percentage; }
    public void setPercentage(int percentage) { this.percentage = percentage; }

    public boolean isStable() { return stable; }
    public void setStable(boolean stable) { this.stable = stable; }

    public boolean isNeedQuest() { return needQuest; }
    public void setNeedQuest(boolean needQuest) { this.needQuest = needQuest; }
}
