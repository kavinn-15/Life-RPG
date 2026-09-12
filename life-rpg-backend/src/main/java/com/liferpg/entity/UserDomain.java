package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_domains", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_domain", columnNames = {"user_id", "domain_id"})
}, indexes = {
    @Index(name = "idx_user_domains_user_id", columnList = "user_id"),
    @Index(name = "idx_user_domains_domain_id", columnList = "domain_id")
})
public class UserDomain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "domain_id", nullable = false)
    private Domain domain;

    @Column(name = "domain_level", nullable = false)
    private int domainLevel = 1;

    @Column(name = "current_xp", nullable = false)
    private long currentXp = 0;

    @Column(name = "total_xp", nullable = false)
    private long totalXp = 0;

    @Column(nullable = false)
    private int streak = 0;

    @Column(name = "quests_completed", nullable = false)
    private int questsCompleted = 0;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public UserDomain() {}

    public UserDomain(User user, Domain domain, int questsCompleted, long totalXp, int domainLevel, int streak) {
        this.user = user;
        this.domain = domain;
        this.questsCompleted = questsCompleted;
        this.totalXp = totalXp;
        this.currentXp = totalXp;
        this.domainLevel = domainLevel;
        this.streak = streak;
        this.updatedAt = LocalDateTime.now();
    }

    public UserDomain(User user, Domain domain, int domainLevel, long currentXp, long totalXp, int streak, int questsCompleted) {
        this.user = user;
        this.domain = domain;
        this.domainLevel = domainLevel;
        this.currentXp = currentXp;
        this.totalXp = totalXp;
        this.streak = streak;
        this.questsCompleted = questsCompleted;
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Domain getDomain() { return domain; }
    public void setDomain(Domain domain) { this.domain = domain; }

    public int getDomainLevel() { return domainLevel; }
    public void setDomainLevel(int domainLevel) { this.domainLevel = domainLevel; }

    public long getCurrentXp() { return currentXp; }
    public void setCurrentXp(long currentXp) { this.currentXp = currentXp; }

    public long getTotalXp() { return totalXp; }
    public void setTotalXp(long totalXp) { this.totalXp = totalXp; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }

    public int getQuestsCompleted() { return questsCompleted; }
    public void setQuestsCompleted(int questsCompleted) { this.questsCompleted = questsCompleted; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
