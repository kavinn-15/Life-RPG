package com.liferpg.dto.character;

public class RadarAxisDTO {
    private String key;
    private String label;
    private int value;

    public RadarAxisDTO() {}

    public RadarAxisDTO(String key, String label) {
        this.key = key;
        this.label = label;
    }

    public RadarAxisDTO(String key, String label, int value) {
        this.key = key;
        this.label = label;
        this.value = value;
    }

    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public int getValue() { return value; }
    public void setValue(int value) { this.value = value; }
}
