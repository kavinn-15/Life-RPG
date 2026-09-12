package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "streak_logs", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_activity_date", columnNames = {"user_id", "activity_date"})
}, indexes = {
    @Index(name = "idx_streak_user_date", columnList = "user_id, activity_date")
})
public class StreakLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @Column(name = "quests_completed", nullable = false)
    private int questsCompleted = 1;

    @Column(name = "xp_earned", nullable = false)
    private int xpEarned = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public StreakLog() {}

    public StreakLog(User user, LocalDate activityDate, int questsCompleted, int xpEarned) {
        this.user = user;
        this.activityDate = activityDate;
        this.questsCompleted = questsCompleted;
        this.xpEarned = xpEarned;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDate getActivityDate() { return activityDate; }
    public void setActivityDate(LocalDate activityDate) { this.activityDate = activityDate; }

    public int getQuestsCompleted() { return questsCompleted; }
    public void setQuestsCompleted(int questsCompleted) { this.questsCompleted = questsCompleted; }

    public int getXpEarned() { return xpEarned; }
    public void setXpEarned(int xpEarned) { this.xpEarned = xpEarned; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
