package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_mission_progress", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_mission_date", columnNames = {"user_id", "mission_id", "progress_date"})
}, indexes = {
    @Index(name = "idx_mission_progress_user_date", columnList = "user_id, progress_date")
})
public class DailyMissionProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mission_id", nullable = false)
    private DailyMission dailyMission;

    @Column(name = "progress_date", nullable = false)
    private LocalDate progressDate;

    @Column(nullable = false)
    private int progress = 0;

    @Column(nullable = false)
    private boolean completed = false;

    @Column(nullable = false)
    private boolean claimed = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public DailyMissionProgress() {}

    public DailyMissionProgress(User user, DailyMission dailyMission, LocalDate progressDate, int progress, boolean completed, boolean claimed) {
        this.user = user;
        this.dailyMission = dailyMission;
        this.progressDate = progressDate;
        this.progress = progress;
        this.completed = completed;
        this.claimed = claimed;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public DailyMission getDailyMission() { return dailyMission; }
    public void setDailyMission(DailyMission dailyMission) { this.dailyMission = dailyMission; }

    public LocalDate getProgressDate() { return progressDate; }
    public void setProgressDate(LocalDate progressDate) { this.progressDate = progressDate; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public boolean isClaimed() { return claimed; }
    public void setClaimed(boolean claimed) { this.claimed = claimed; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
