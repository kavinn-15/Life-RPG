package com.liferpg.dto.quest;

import java.util.List;

public class QuestUpdateRequestDTO {
    private String title;
    private String description;
    private String domain;
    private String difficulty;
    private Integer xp;
    private Integer gold;
    private String statKey;
    private Integer statAmount;
    private String timeRemaining;
    private Integer progress;
    private String status;
    private Boolean done;
    private List<QuestMilestoneDTO> milestones;

    public QuestUpdateRequestDTO() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Integer getXp() { return xp; }
    public void setXp(Integer xp) { this.xp = xp; }

    public Integer getGold() { return gold; }
    public void setGold(Integer gold) { this.gold = gold; }

    public String getStatKey() { return statKey; }
    public void setStatKey(String statKey) { this.statKey = statKey; }

    public Integer getStatAmount() { return statAmount; }
    public void setStatAmount(Integer statAmount) { this.statAmount = statAmount; }

    public String getTimeRemaining() { return timeRemaining; }
    public void setTimeRemaining(String timeRemaining) { this.timeRemaining = timeRemaining; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getDone() { return done; }
    public void setDone(Boolean done) { this.done = done; }

    public List<QuestMilestoneDTO> getMilestones() { return milestones; }
    public void setMilestones(List<QuestMilestoneDTO> milestones) { this.milestones = milestones; }
}
