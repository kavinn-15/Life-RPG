package com.liferpg.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "equipped_relics", indexes = {
    @Index(name = "idx_relics_user_id", columnList = "user_id")
})
public class EquippedRelic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String slot; // e.g. "Active Title Slot", "Artifact Slot", "Booster Slot"

    @Column(nullable = false)
    private String name; // e.g. "The Novice Vanguard"

    @Column(nullable = false)
    private String bonus; // e.g. "+5% XP on Early Quests"

    @Column(nullable = false)
    private String icon = "military_tech";

    public EquippedRelic() {}

    public EquippedRelic(User user, String slot, String name, String bonus, String icon) {
        this.user = user;
        this.slot = slot;
        this.name = name;
        this.bonus = bonus;
        this.icon = icon;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getSlot() { return slot; }
    public void setSlot(String slot) { this.slot = slot; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBonus() { return bonus; }
    public void setBonus(String bonus) { this.bonus = bonus; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
