package com.liferpg.dto.achievement;

public class AchievementResponseDTO {
    private String id;
    private String title;
    private String description;
    private String icon;
    private String category;
    private String domain;
    private boolean unlocked;
    private ProgressDetail progress;
    private RewardDetail reward;

    public AchievementResponseDTO() {}

    public AchievementResponseDTO(String id, String title, String description, String icon, String category,
                                  String domain, boolean unlocked, int current, int target, int xp, int gold) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.icon = icon;
        this.category = category;
        this.domain = domain;
        this.unlocked = unlocked;
        this.progress = new ProgressDetail(current, target);
        this.reward = new RewardDetail(xp, gold);
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public boolean isUnlocked() { return unlocked; }
    public void setUnlocked(boolean unlocked) { this.unlocked = unlocked; }

    public ProgressDetail getProgress() { return progress; }
    public void setProgress(ProgressDetail progress) { this.progress = progress; }

    public RewardDetail getReward() { return reward; }
    public void setReward(RewardDetail reward) { this.reward = reward; }

    public static class ProgressDetail {
        private int current;
        private int target;

        public ProgressDetail() {}
        public ProgressDetail(int current, int target) {
            this.current = current;
            this.target = target;
        }

        public int getCurrent() { return current; }
        public void setCurrent(int current) { this.current = current; }

        public int getTarget() { return target; }
        public void setTarget(int target) { this.target = target; }
    }

    public static class RewardDetail {
        private int xp;
        private int gold;

        public RewardDetail() {}
        public RewardDetail(int xp, int gold) {
            this.xp = xp;
            this.gold = gold;
        }

        public int getXp() { return xp; }
        public void setXp(int xp) { this.xp = xp; }

        public int getGold() { return gold; }
        public void setGold(int gold) { this.gold = gold; }
    }
}
