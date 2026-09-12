package com.liferpg.dto.character;

public class AttributeResponseDTO {
    private String key;
    private String label;
    private String icon;
    private int level;
    private long xp;
    private long totalXp;
    private long weeklyXp;
    private int nextThreshold;
    private int pct;
    private Boolean stable;
    private Boolean needQuest;

    public AttributeResponseDTO() {}

    public AttributeResponseDTO(String key, String label, String icon, int level, long xp, long totalXp,
                                long weeklyXp, int nextThreshold, int pct, Boolean stable, Boolean needQuest) {
        this.key = key;
        this.label = label;
        this.icon = icon;
        this.level = level;
        this.xp = xp;
        this.totalXp = totalXp;
        this.weeklyXp = weeklyXp;
        this.nextThreshold = nextThreshold;
        this.pct = pct;
        this.stable = stable;
        this.needQuest = needQuest;
    }

    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public long getXp() { return xp; }
    public void setXp(long xp) { this.xp = xp; }

    public long getTotalXp() { return totalXp; }
    public void setTotalXp(long totalXp) { this.totalXp = totalXp; }

    public long getWeeklyXp() { return weeklyXp; }
    public void setWeeklyXp(long weeklyXp) { this.weeklyXp = weeklyXp; }

    public int getNextThreshold() { return nextThreshold; }
    public void setNextThreshold(int nextThreshold) { this.nextThreshold = nextThreshold; }

    public int getPct() { return pct; }
    public void setPct(int pct) { this.pct = pct; }

    public Boolean getStable() { return stable; }
    public void setStable(Boolean stable) { this.stable = stable; }

    public Boolean getNeedQuest() { return needQuest; }
    public void setNeedQuest(Boolean needQuest) { this.needQuest = needQuest; }
}
