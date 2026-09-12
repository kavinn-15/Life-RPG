package com.liferpg.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "domains")
public class Domain {

    @Id
    @Column(length = 64)
    private String id; // e.g. "programming", "fitness"

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String tagline;

    @Column(length = 2000)
    private String description;

    @Column(name = "hero_image_url", length = 1000)
    private String heroImageUrl;

    @Column(nullable = false)
    private String icon;

    private String accent;
    @Column(name = "accent_class")
    private String accentClass;
    @Column(name = "chip_class")
    private String chipClass;
    @Column(name = "soft_class")
    private String softClass;

    @Column(name = "primary_attributes")
    private String primaryAttributes; // e.g. "coding,intelligence"

    @Column(name = "xp_min")
    private int xpMin = 20;

    @Column(name = "xp_max")
    private int xpMax = 200;

    @Column(name = "gold_min")
    private int goldMin = 10;

    @Column(name = "gold_max")
    private int goldMax = 100;

    @Column(name = "difficulty_default")
    private String difficultyDefault = "Medium";

    @Column(nullable = false)
    private boolean active = true;

    public Domain() {}

    public Domain(String id, String name, String tagline, String description, String heroImageUrl, String icon,
                  String accent, String accentClass, String chipClass, String softClass, String primaryAttributes,
                  int xpMin, int xpMax, int goldMin, int goldMax, String difficultyDefault) {
        this.id = id;
        this.name = name;
        this.tagline = tagline;
        this.description = description;
        this.heroImageUrl = heroImageUrl;
        this.icon = icon;
        this.accent = accent;
        this.accentClass = accentClass;
        this.chipClass = chipClass;
        this.softClass = softClass;
        this.primaryAttributes = primaryAttributes;
        this.xpMin = xpMin;
        this.xpMax = xpMax;
        this.goldMin = goldMin;
        this.goldMax = goldMax;
        this.difficultyDefault = difficultyDefault;
        this.active = true;
    }

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

    public String getPrimaryAttributes() { return primaryAttributes; }
    public void setPrimaryAttributes(String primaryAttributes) { this.primaryAttributes = primaryAttributes; }

    public int getXpMin() { return xpMin; }
    public void setXpMin(int xpMin) { this.xpMin = xpMin; }

    public int getXpMax() { return xpMax; }
    public void setXpMax(int xpMax) { this.xpMax = xpMax; }

    public int getGoldMin() { return goldMin; }
    public void setGoldMin(int goldMin) { this.goldMin = goldMin; }

    public int getGoldMax() { return goldMax; }
    public void setGoldMax(int goldMax) { this.goldMax = goldMax; }

    public String getDifficultyDefault() { return difficultyDefault; }
    public void setDifficultyDefault(String difficultyDefault) { this.difficultyDefault = difficultyDefault; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
