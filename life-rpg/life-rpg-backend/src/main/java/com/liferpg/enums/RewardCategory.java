package com.liferpg.enums;

public enum RewardCategory {
    Theme("Theme"),
    AvatarFrame("Avatar Frame"),
    Title("Title"),
    Badge("Badge"),
    ProfileDecoration("Profile Decoration"),
    XpBoost("XP Boost"),
    Cosmetic("Cosmetic");

    private final String displayName;

    RewardCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static RewardCategory fromString(String text) {
        if (text == null || text.isBlank()) return Cosmetic;
        String clean = text.replace(" ", "").replace("-", "").toLowerCase();
        for (RewardCategory c : RewardCategory.values()) {
            if (c.name().equalsIgnoreCase(clean) || c.displayName.replace(" ", "").equalsIgnoreCase(clean)) {
                return c;
            }
        }
        return Cosmetic;
    }
}
