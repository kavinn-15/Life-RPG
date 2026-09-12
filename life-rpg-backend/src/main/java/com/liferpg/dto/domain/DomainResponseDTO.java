package com.liferpg.dto.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class DomainResponseDTO {
    private String id;
    private String name;
    private String tagline;
    private String description;
    private String heroImageUrl;
    private String icon;
    private String accent;
    private String accentClass;
    private String chipClass;
    private String softClass;
    private List<String> primaryAttribute = new ArrayList<>();
    private Map<String, Integer> xpRange;
    private Map<String, Integer> goldRange;
    private String difficultyDefault;
    private List<DomainQuestDTO> quests = new ArrayList<>();
    private DomainStatsDTO stats;

    public DomainResponseDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getHeroImageUrl() { return heroImageUrl; }
    public void setHeroImageUrl(String heroImageUrl) { this.heroImageUrl = heroImageUrl; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getAccent() { return accent; }
    public void setAccent(String accent) { this.accent = accent; }

    public String getAccentClass() { return accentClass; }
    public void setAccentClass(String accentClass) { this.accentClass = accentClass; }

    public String getChipClass() { return chipClass; }
    public void setChipClass(String chipClass) { this.chipClass = chipClass; }

    public String getSoftClass() { return softClass; }
    public void setSoftClass(String softClass) { this.softClass = softClass; }

    public List<String> getPrimaryAttribute() { return primaryAttribute; }
    public void setPrimaryAttribute(List<String> primaryAttribute) { this.primaryAttribute = primaryAttribute; }

    public Map<String, Integer> getXpRange() { return xpRange; }
    public void setXpRange(Map<String, Integer> xpRange) { this.xpRange = xpRange; }

    public Map<String, Integer> getGoldRange() { return goldRange; }
    public void setGoldRange(Map<String, Integer> goldRange) { this.goldRange = goldRange; }

    public String getDifficultyDefault() { return difficultyDefault; }
    public void setDifficultyDefault(String difficultyDefault) { this.difficultyDefault = difficultyDefault; }

    public List<DomainQuestDTO> getQuests() { return quests; }
    public void setQuests(List<DomainQuestDTO> quests) { this.quests = quests; }

    public DomainStatsDTO getStats() { return stats; }
    public void setStats(DomainStatsDTO stats) { this.stats = stats; }
}
