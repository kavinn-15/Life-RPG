package com.liferpg.dto.reward;

public class RewardResponseDTO {
    private String id;
    private String name;
    private String description;
    private String icon;
    private String category;
    private int price;
    private boolean owned;
    private boolean equipped;

    public RewardResponseDTO() {}

    public RewardResponseDTO(String id, String name, String description, String icon, String category, int price, boolean owned, boolean equipped) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.category = category;
        this.price = price;
        this.owned = owned;
        this.equipped = equipped;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public boolean isOwned() { return owned; }
    public void setOwned(boolean owned) { this.owned = owned; }

    public boolean isEquipped() { return equipped; }
    public void setEquipped(boolean equipped) { this.equipped = equipped; }
}
