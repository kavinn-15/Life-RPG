package com.liferpg.dto.user;

public class LeaderboardEntryDTO {
    private int rank;
    private String initials;
    private String name;
    private String meta;
    private long xp;
    private String rankClass;
    private String avatarClass;

    public LeaderboardEntryDTO() {}

    public LeaderboardEntryDTO(int rank, String initials, String name, String meta, long xp, String rankClass, String avatarClass) {
        this.rank = rank;
        this.initials = initials;
        this.name = name;
        this.meta = meta;
        this.xp = xp;
        this.rankClass = rankClass;
        this.avatarClass = avatarClass;
    }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }

    public String getInitials() { return initials; }
    public void setInitials(String initials) { this.initials = initials; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMeta() { return meta; }
    public void setMeta(String meta) { this.meta = meta; }

    public long getXp() { return xp; }
    public void setXp(long xp) { this.xp = xp; }

    public String getRankClass() { return rankClass; }
    public void setRankClass(String rankClass) { this.rankClass = rankClass; }

    public String getAvatarClass() { return avatarClass; }
    public void setAvatarClass(String avatarClass) { this.avatarClass = avatarClass; }
}
