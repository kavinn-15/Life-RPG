package com.liferpg.dto.domain;

public class DomainStatsDTO {
    private int questsCompleted;
    private long xpEarned;
    private int domainLevel;
    private int streak;

    public DomainStatsDTO() {}

    public DomainStatsDTO(int questsCompleted, long xpEarned, int domainLevel, int streak) {
        this.questsCompleted = questsCompleted;
        this.xpEarned = xpEarned;
        this.domainLevel = domainLevel;
        this.streak = streak;
    }

    public int getQuestsCompleted() { return questsCompleted; }
    public void setQuestsCompleted(int questsCompleted) { this.questsCompleted = questsCompleted; }

    public long getXpEarned() { return xpEarned; }
    public void setXpEarned(long xpEarned) { this.xpEarned = xpEarned; }

    public int getDomainLevel() { return domainLevel; }
    public void setDomainLevel(int domainLevel) { this.domainLevel = domainLevel; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }
}
