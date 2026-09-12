package com.liferpg.dto.quest;

import java.util.ArrayList;
import java.util.List;

public class QuestResponseDTO {
    private String id;
    private String domain;
    private String domainId;
    private String domainClass;
    private String title;
    private String description;
    private String difficulty;
    private String difficultyClass;
    private String timeRemaining;
    private String icon;
    private int xp;
    private int gold;
    private String statLabel;
    private String statKey;
    private int statAmount;
    private int progress;
    private String progressLabel;
    private String progressClass;
    private String milestoneLabel;
    private int sprintPct;
    private boolean featured;
    private boolean recommended;
    private boolean daily;
    private boolean done;
    private String status;
    private List<QuestMilestoneDTO> milestones = new ArrayList<>();

    public QuestResponseDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getDomainId() { return domainId; }
    public void setDomainId(String domainId) { this.domainId = domainId; }

    public String getDomainClass() { return domainClass; }
    public void setDomainClass(String domainClass) { this.domainClass = domainClass; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getDifficultyClass() { return difficultyClass; }
    public void setDifficultyClass(String difficultyClass) { this.difficultyClass = difficultyClass; }

    public String getTimeRemaining() { return timeRemaining; }
    public void setTimeRemaining(String timeRemaining) { this.timeRemaining = timeRemaining; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }

    public int getGold() { return gold; }
    public void setGold(int gold) { this.gold = gold; }

    public String getStatLabel() { return statLabel; }
    public void setStatLabel(String statLabel) { this.statLabel = statLabel; }

    public String getStatKey() { return statKey; }
    public void setStatKey(String statKey) { this.statKey = statKey; }

    public int getStatAmount() { return statAmount; }
    public void setStatAmount(int statAmount) { this.statAmount = statAmount; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public String getProgressLabel() { return progressLabel; }
    public void setProgressLabel(String progressLabel) { this.progressLabel = progressLabel; }

    public String getProgressClass() { return progressClass; }
    public void setProgressClass(String progressClass) { this.progressClass = progressClass; }

    public String getMilestoneLabel() { return milestoneLabel; }
    public void setMilestoneLabel(String milestoneLabel) { this.milestoneLabel = milestoneLabel; }

    public int getSprintPct() { return sprintPct; }
    public void setSprintPct(int sprintPct) { this.sprintPct = sprintPct; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public boolean isRecommended() { return recommended; }
    public void setRecommended(boolean recommended) { this.recommended = recommended; }

    public boolean isDaily() { return daily; }
    public void setDaily(boolean daily) { this.daily = daily; }

    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<QuestMilestoneDTO> getMilestones() { return milestones; }
    public void setMilestones(List<QuestMilestoneDTO> milestones) { this.milestones = milestones; }
}
