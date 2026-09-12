package com.liferpg.entity;

import com.liferpg.enums.AchievementCategory;
import jakarta.persistence.*;

@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @Column(length = 64)
    private String id; // e.g. "first-quest", "coding-streak-14"

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String icon;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AchievementCategory category;

    @Column(name = "domain_name")
    private String domainName;

    @Column(nullable = false)
    private int target = 1;

    @Column(name = "reward_xp", nullable = false)
    private int rewardXp = 50;

    @Column(name = "reward_gold", nullable = false)
    private int rewardGold = 25;

    @Column(nullable = false)
    private boolean active = true;

    public Achievement() {}

    public Achievement(String id, String title, String description, String icon, AchievementCategory category,
                       String domainName, int target, int rewardXp, int rewardGold) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.icon = icon;
        this.category = category;
        this.domainName = domainName;
        this.target = target;
        this.rewardXp = rewardXp;
        this.rewardGold = rewardGold;
        this.active = true;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public AchievementCategory getCategory() { return category; }
    public void setCategory(AchievementCategory category) { this.category = category; }

    public String getDomainName() { return domainName; }
    public void setDomainName(String domainName) { this.domainName = domainName; }

    public int getTarget() { return target; }
    public void setTarget(int target) { this.target = target; }

    public int getRewardXp() { return rewardXp; }
    public void setRewardXp(int rewardXp) { this.rewardXp = rewardXp; }

    public int getRewardGold() { return rewardGold; }
    public void setRewardGold(int rewardGold) { this.rewardGold = rewardGold; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
