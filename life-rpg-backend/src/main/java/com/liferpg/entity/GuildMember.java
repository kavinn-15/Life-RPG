package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "guild_members", indexes = {
    @Index(name = "idx_guild_members_guild_id", columnList = "guild_id"),
    @Index(name = "idx_guild_members_user_id", columnList = "user_id", unique = true)
})
public class GuildMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guild_id", nullable = false)
    private Guild guild;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "player_name", nullable = false)
    private String playerName;

    @Column(name = "character_title")
    private String characterTitle = "Adventurer";

    @Column(name = "character_level", nullable = false)
    private int characterLevel = 1;

    @Column(name = "avatar_class")
    private String avatarClass = "cyber-nomad";

    @Column(name = "avatar_url", columnDefinition = "LONGTEXT")
    private String avatarUrl;

    @Column(nullable = false)
    private String role = "MEMBER"; // LEADER, OFFICER, MEMBER

    @Column(name = "contribution_xp", nullable = false)
    private long contributionXp = 0;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();

    public GuildMember() {}

    public GuildMember(Guild guild, User user, String playerName, String characterTitle, int characterLevel, String avatarClass, String avatarUrl, String role) {
        this.guild = guild;
        this.user = user;
        this.playerName = playerName;
        this.characterTitle = characterTitle;
        this.characterLevel = characterLevel;
        this.avatarClass = avatarClass;
        this.avatarUrl = avatarUrl;
        this.role = role;
        this.contributionXp = 0;
        this.joinedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Guild getGuild() { return guild; }
    public void setGuild(Guild guild) { this.guild = guild; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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
