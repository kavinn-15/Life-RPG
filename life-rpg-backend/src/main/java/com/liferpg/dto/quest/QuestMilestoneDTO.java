package com.liferpg.dto.quest;

public class QuestMilestoneDTO {
    private String id;
    private String label;
    private boolean done;
    private int sequenceNumber;

    public QuestMilestoneDTO() {}

    public QuestMilestoneDTO(String id, String label, boolean done, int sequenceNumber) {
        this.id = id;
        this.label = label;
        this.done = done;
        this.sequenceNumber = sequenceNumber;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }

    public int getSequenceNumber() { return sequenceNumber; }
    public void setSequenceNumber(int sequenceNumber) { this.sequenceNumber = sequenceNumber; }
}
