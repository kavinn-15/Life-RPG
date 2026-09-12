package com.liferpg.dto.guild;

import java.time.LocalDateTime;

public class GuildMemberDTO {

    private Long id;
    private Long userId;
    private String playerName;
    private String characterTitle;
    private int characterLevel;
    private String avatarClass;
    private String avatarUrl;
    private String role;
    private long contributionXp;
    private LocalDateTime joinedAt;

    public GuildMemberDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public String getCharacterTitle() { return characterTitle; }
    public void setCharacterTitle(String characterTitle) { this.characterTitle = characterTitle; }

    public int getCharacterLevel() { return characterLevel; }
    public void setCharacterLevel(int characterLevel) { this.characterLevel = characterLevel; }

    public String getAvatarClass() { return avatarClass; }
    public void setAvatarClass(String avatarClass) { this.avatarClass = avatarClass; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public long getContributionXp() { return contributionXp; }
    public void setContributionXp(long contributionXp) { this.contributionXp = contributionXp; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}
