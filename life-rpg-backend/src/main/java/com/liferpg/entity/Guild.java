package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "guilds", indexes = {
    @Index(name = "idx_guilds_name", columnList = "name", unique = true)
})
public class Guild {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, length = 10)
    private String tag = "[HERO]";

    @Column(nullable = false, length = 255)
    private String motto = "Forge your destiny together.";

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "domain_sphere", nullable = false)
    private String domainSphere = "Code & Logic";

    @Column(nullable = false)
    private String icon = "terminal";

    @Column(name = "banner_gradient")
    private String bannerGradient = "from-primary/20 via-indigo-950/40 to-slate-950";

    @Column(nullable = false)
    private int level = 1;

    @Column(name = "total_xp", nullable = false)
    private long totalXp = 0;

    @Column(name = "member_count", nullable = false)
    private int memberCount = 1;

    @Column(name = "max_members", nullable = false)
    private int maxMembers = 50;

    @Column(name = "weekly_raid_title")
    private String weeklyRaidTitle = "Operation: Sprint Clean Codebase";

    @Column(name = "weekly_raid_target_xp", nullable = false)
    private long weeklyRaidTargetXp = 10000;

    @Column(name = "weekly_raid_current_xp", nullable = false)
    private long weeklyRaidCurrentXp = 4200;

    @Column(name = "weekly_raid_reward_gold", nullable = false)
    private long weeklyRaidRewardGold = 600;

    @Column(name = "weekly_raid_reward_xp", nullable = false)
    private long weeklyRaidRewardXp = 1500;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic = true;

    @Column(name = "leader_user_id")
    private Long leaderUserId;

    @Column(name = "leader_name")
    private String leaderName = "Guild Master";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Guild() {}

    public Guild(String name, String tag, String motto, String description, String domainSphere, String icon, Long leaderUserId, String leaderName) {
        this.name = name;
        this.tag = tag;
        this.motto = motto;
        this.description = description;
        this.domainSphere = domainSphere;
        this.icon = icon;
        this.leaderUserId = leaderUserId;
        this.leaderName = leaderName;
        this.level = 1;
        this.totalXp = 0;
        this.memberCount = 1;
        this.maxMembers = 50;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getMotto() { return motto; }
    public void setMotto(String motto) { this.motto = motto; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDomainSphere() { return domainSphere; }
    public void setDomainSphere(String domainSphere) { this.domainSphere = domainSphere; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getBannerGradient() { return bannerGradient; }
    public void setBannerGradient(String bannerGradient) { this.bannerGradient = bannerGradient; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public long getTotalXp() { return totalXp; }
    public void setTotalXp(long totalXp) { this.totalXp = totalXp; }

    public int getMemberCount() { return memberCount; }
    public void setMemberCount(int memberCount) { this.memberCount = memberCount; }

    public int getMaxMembers() { return maxMembers; }
    public void setMaxMembers(int maxMembers) { this.maxMembers = maxMembers; }

    public String getWeeklyRaidTitle() { return weeklyRaidTitle; }
    public void setWeeklyRaidTitle(String weeklyRaidTitle) { this.weeklyRaidTitle = weeklyRaidTitle; }

    public long getWeeklyRaidTargetXp() { return weeklyRaidTargetXp; }
    public void setWeeklyRaidTargetXp(long weeklyRaidTargetXp) { this.weeklyRaidTargetXp = weeklyRaidTargetXp; }

    public long getWeeklyRaidCurrentXp() { return weeklyRaidCurrentXp; }
    public void setWeeklyRaidCurrentXp(long weeklyRaidCurrentXp) { this.weeklyRaidCurrentXp = weeklyRaidCurrentXp; }

    public long getWeeklyRaidRewardGold() { return weeklyRaidRewardGold; }
    public void setWeeklyRaidRewardGold(long weeklyRaidRewardGold) { this.weeklyRaidRewardGold = weeklyRaidRewardGold; }

    public long getWeeklyRaidRewardXp() { return weeklyRaidRewardXp; }
    public void setWeeklyRaidRewardXp(long weeklyRaidRewardXp) { this.weeklyRaidRewardXp = weeklyRaidRewardXp; }

    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }

    public Long getLeaderUserId() { return leaderUserId; }
    public void setLeaderUserId(Long leaderUserId) { this.leaderUserId = leaderUserId; }

    public String getLeaderName() { return leaderName; }
    public void setLeaderName(String leaderName) { this.leaderName = leaderName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
