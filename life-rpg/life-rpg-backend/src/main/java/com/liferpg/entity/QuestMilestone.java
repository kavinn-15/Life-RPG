package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quest_milestones", indexes = {
    @Index(name = "idx_milestones_quest_id", columnList = "quest_id")
})
public class QuestMilestone {

    @Id
    @Column(length = 64)
    private String id; // e.g. "m1" or "m-12345"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quest_id", nullable = false)
    private Quest quest;

    @Column(nullable = false, length = 500)
    private String label;

    @Column(name = "sequence_number", nullable = false)
    private int sequenceNumber = 1;

    @Column(nullable = false)
    private boolean completed = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public QuestMilestone() {}

    public QuestMilestone(String id, Quest quest, String label, int sequenceNumber, boolean completed) {
        this.id = id;
        this.quest = quest;
        this.label = label;
        this.sequenceNumber = sequenceNumber;
        this.completed = completed;
    }

    public QuestMilestone(Quest quest, String id, String label, boolean completed) {
        this.id = id;
        this.quest = quest;
        this.label = label;
        this.completed = completed;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Quest getQuest() { return quest; }
    public void setQuest(Quest quest) { this.quest = quest; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public int getSequenceNumber() { return sequenceNumber; }
    public void setSequenceNumber(int sequenceNumber) { this.sequenceNumber = sequenceNumber; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
