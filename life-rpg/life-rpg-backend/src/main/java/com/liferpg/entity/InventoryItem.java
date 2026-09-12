package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_reward", columnNames = {"user_id", "reward_id"})
}, indexes = {
    @Index(name = "idx_inventory_user_id", columnList = "user_id")
})
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reward_id", nullable = false)
    private Reward reward;

    @Column(name = "acquired_at", nullable = false)
    private LocalDateTime acquiredAt = LocalDateTime.now();

    @Column(nullable = false)
    private boolean equipped = false;

    @Column(nullable = false)
    private int quantity = 1;

    public InventoryItem() {}

    public InventoryItem(User user, Reward reward, boolean equipped) {
        this.user = user;
        this.reward = reward;
        this.equipped = equipped;
        this.acquiredAt = LocalDateTime.now();
        this.quantity = 1;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Reward getReward() { return reward; }
    public void setReward(Reward reward) { this.reward = reward; }

    public LocalDateTime getAcquiredAt() { return acquiredAt; }
    public void setAcquiredAt(LocalDateTime acquiredAt) { this.acquiredAt = acquiredAt; }

    public boolean isEquipped() { return equipped; }
    public void setEquipped(boolean equipped) { this.equipped = equipped; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
