package com.liferpg.dto.character;

public class MilestoneResponseDTO {
    private String title;
    private String description;
    private int pct;

    public MilestoneResponseDTO() {}

    public MilestoneResponseDTO(String title, String description, int pct) {
        this.title = title;
        this.description = description;
        this.pct = pct;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getPct() { return pct; }
    public void setPct(int pct) { this.pct = pct; }
}
