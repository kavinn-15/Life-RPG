package com.liferpg.dto.quest;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class QuestCreateRequestDTO {

    @NotBlank(message = "Quest title is required")
    private String title;

    private String description;
    private String domain;
    private String domainId;
    private String difficulty = "Medium";
    private int xp = 50;
    private int gold = 20;
    private String statKey;
    private int statAmount = 3;
    private String timeRemaining;
    private String icon = "task_alt";
    private boolean daily = false;
    private boolean featured = false;
    private boolean recommended = false;
    private List<String> milestones;

    public QuestCreateRequestDTO() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getDomainId() { return domainId; }
    public void setDomainId(String domainId) { this.domainId = domainId; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }

    public int getGold() { return gold; }
    public void setGold(int gold) { this.gold = gold; }

    public String getStatKey() { return statKey; }
    public void setStatKey(String statKey) { this.statKey = statKey; }

    public int getStatAmount() { return statAmount; }
    public void setStatAmount(int statAmount) { this.statAmount = statAmount; }

    public String getTimeRemaining() { return timeRemaining; }
    public void setTimeRemaining(String timeRemaining) { this.timeRemaining = timeRemaining; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public boolean isDaily() { return daily; }
    public void setDaily(boolean daily) { this.daily = daily; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public boolean isRecommended() { return recommended; }
    public void setRecommended(boolean recommended) { this.recommended = recommended; }

    public List<String> getMilestones() { return milestones; }
    public void setMilestones(List<String> milestones) { this.milestones = milestones; }
}
