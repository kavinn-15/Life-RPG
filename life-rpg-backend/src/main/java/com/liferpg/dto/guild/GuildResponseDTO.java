package com.liferpg.dto.guild;

import java.time.LocalDateTime;

public class GuildResponseDTO {

    private Long id;
    private String name;
    private String tag;
    private String motto;
    private String description;
    private String domainSphere;
    private String icon;
    private String bannerGradient;
    private int level;
    private long totalXp;
    private int memberCount;
    private int maxMembers;
    private String weeklyRaidTitle;
    private long weeklyRaidTargetXp;
    private long weeklyRaidCurrentXp;
    private long weeklyRaidRewardGold;
    private long weeklyRaidRewardXp;
    private boolean isPublic;
    private Long leaderUserId;
    private String leaderName;
    private boolean isUserMember;
    private String userRole;
    private LocalDateTime createdAt;

    public GuildResponseDTO() {}

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
    public void setPublic(boolean aPublic) { isPublic = aPublic; }

    public Long getLeaderUserId() { return leaderUserId; }
    public void setLeaderUserId(Long leaderUserId) { this.leaderUserId = leaderUserId; }

    public String getLeaderName() { return leaderName; }
    public void setLeaderName(String leaderName) { this.leaderName = leaderName; }

    public boolean isUserMember() { return isUserMember; }
    public void setUserMember(boolean userMember) { isUserMember = userMember; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
