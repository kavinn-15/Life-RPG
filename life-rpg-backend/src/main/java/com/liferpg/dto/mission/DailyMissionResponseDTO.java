package com.liferpg.dto.mission;

public class DailyMissionResponseDTO {
    private String id;
    private String title;
    private String description;
    private String icon;
    private String source;
    private Integer target;
    private Integer mockCurrent;
    private int current;
    private int rewardXp;
    private int rewardGold;
    private boolean completed;
    private boolean claimed;

    public DailyMissionResponseDTO() {}

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

    public Integer getMockCurrent() { return mockCurrent; }
    public void setMockCurrent(Integer mockCurrent) { this.mockCurrent = mockCurrent; }

    public int getCurrent() { return current; }
    public void setCurrent(int current) { this.current = current; }

    public int getRewardXp() { return rewardXp; }
    public void setRewardXp(int rewardXp) { this.rewardXp = rewardXp; }

    public int getRewardGold() { return rewardGold; }
    public void setRewardGold(int rewardGold) { this.rewardGold = rewardGold; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public boolean isClaimed() { return claimed; }
    public void setClaimed(boolean claimed) { this.claimed = claimed; }
}
