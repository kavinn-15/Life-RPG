package com.liferpg.dto.character;

public class RelicResponseDTO {
    private Long id;
    private String slot;
    private String name;
    private String bonus;
    private String icon;

    public RelicResponseDTO() {}

    public RelicResponseDTO(Long id, String slot, String name, String bonus, String icon) {
        this.id = id;
        this.slot = slot;
        this.name = name;
        this.bonus = bonus;
        this.icon = icon;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSlot() { return slot; }
    public void setSlot(String slot) { this.slot = slot; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBonus() { return bonus; }
    public void setBonus(String bonus) { this.bonus = bonus; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
