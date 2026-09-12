package com.liferpg.dto.domain;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class DomainCreateRequestDTO {

    @NotBlank(message = "Domain name is required")
    private String name;

    private String tagline;
    private String description;
    private String heroImageUrl;
    private String icon = "public";
    private String accent = "#8c7ae6";
    private String difficultyDefault = "Medium";
    private List<String> primaryAttributes;
    private int xpMin = 50;
    private int xpMax = 200;
    private int goldMin = 20;
    private int goldMax = 60;

    public DomainCreateRequestDTO() {}

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

    public String getDifficultyDefault() { return difficultyDefault; }
    public void setDifficultyDefault(String difficultyDefault) { this.difficultyDefault = difficultyDefault; }

    public List<String> getPrimaryAttributes() { return primaryAttributes; }
    public void setPrimaryAttributes(List<String> primaryAttributes) { this.primaryAttributes = primaryAttributes; }

    public int getXpMin() { return xpMin; }
    public void setXpMin(int xpMin) { this.xpMin = xpMin; }

    public int getXpMax() { return xpMax; }
    public void setXpMax(int xpMax) { this.xpMax = xpMax; }

    public int getGoldMin() { return goldMin; }
    public void setGoldMin(int goldMin) { this.goldMin = goldMin; }

    public int getGoldMax() { return goldMax; }
    public void setGoldMax(int goldMax) { this.goldMax = goldMax; }
}
