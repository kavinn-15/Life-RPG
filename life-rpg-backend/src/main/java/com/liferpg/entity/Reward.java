package com.liferpg.entity;

import com.liferpg.enums.RewardCategory;
import jakarta.persistence.*;

@Entity
@Table(name = "rewards")
public class Reward {

    @Id
    @Column(length = 64)
    private String id; // e.g. "theme-midnight-aurora"

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String icon;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RewardCategory category;

    @Column(nullable = false)
    private int price = 100;

    @Column(nullable = false)
    private boolean active = true;

    public Reward() {}

    public Reward(String id, String name, String description, String icon, RewardCategory category, int price) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.category = category;
        this.price = price;
        this.active = true;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public RewardCategory getCategory() { return category; }
    public void setCategory(RewardCategory category) { this.category = category; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
