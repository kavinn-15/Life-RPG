package com.liferpg.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "daily_missions")
public class DailyMission {

    @Id
    @Column(length = 64)
    private String id; // e.g. "triple-threat", "full-house"

    @Column(nullable = false)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String icon;

    private String source; // e.g. "questsCompletedToday", "dailyQuestsRatio"

    private Integer target;

    @Column(name = "reward_xp", nullable = false)
    private int rewardXp = 50;

    @Column(name = "reward_gold", nullable = false)
    private int rewardGold = 20;

    @Column(nullable = false)
    private boolean active = true;

    public DailyMission() {}

    public DailyMission(String id, String title, String description, String icon, String source, Integer target, int rewardXp, int rewardGold) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.icon = icon;
        this.source = source;
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

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Integer getTarget() { return target; }
    public void setTarget(Integer target) { this.target = target; }

    public int getRewardXp() { return rewardXp; }
    public void setRewardXp(int rewardXp) { this.rewardXp = rewardXp; }

    public int getRewardGold() { return rewardGold; }
    public void setRewardGold(int rewardGold) { this.rewardGold = rewardGold; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
