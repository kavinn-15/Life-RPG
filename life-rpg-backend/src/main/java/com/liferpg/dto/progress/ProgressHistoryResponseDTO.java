package com.liferpg.dto.progress;

import java.util.ArrayList;
import java.util.List;

public class ProgressHistoryResponseDTO {

    private List<WeeklyXpDTO> weeklyXpHistory = new ArrayList<>();
    private List<MonthlyXpDTO> monthlyXpHistory = new ArrayList<>();
    private List<TopDomainDTO> topDomainsByXp = new ArrayList<>();
    private List<AttributeGrowthDTO> attributeGrowthHistory = new ArrayList<>();
    private List<HeatmapEntryDTO> productiveDayHeatmap = new ArrayList<>();
    private List<DayOfWeekStatDTO> dayOfWeekStats = new ArrayList<>();
    private QuestCompletionStatsDTO questCompletionStats;
    private List<LevelHistoryDTO> levelHistory = new ArrayList<>();
    private StreakHistoryDTO streakHistory;
    private List<StreakMilestoneDTO> streakMilestones = new ArrayList<>();

    public ProgressHistoryResponseDTO() {}

    public List<WeeklyXpDTO> getWeeklyXpHistory() { return weeklyXpHistory; }
    public void setWeeklyXpHistory(List<WeeklyXpDTO> weeklyXpHistory) { this.weeklyXpHistory = weeklyXpHistory; }

    public List<MonthlyXpDTO> getMonthlyXpHistory() { return monthlyXpHistory; }
    public void setMonthlyXpHistory(List<MonthlyXpDTO> monthlyXpHistory) { this.monthlyXpHistory = monthlyXpHistory; }

    public List<TopDomainDTO> getTopDomainsByXp() { return topDomainsByXp; }
    public void setTopDomainsByXp(List<TopDomainDTO> topDomainsByXp) { this.topDomainsByXp = topDomainsByXp; }

    public List<AttributeGrowthDTO> getAttributeGrowthHistory() { return attributeGrowthHistory; }
    public void setAttributeGrowthHistory(List<AttributeGrowthDTO> attributeGrowthHistory) { this.attributeGrowthHistory = attributeGrowthHistory; }

    public List<HeatmapEntryDTO> getProductiveDayHeatmap() { return productiveDayHeatmap; }
    public void setProductiveDayHeatmap(List<HeatmapEntryDTO> productiveDayHeatmap) { this.productiveDayHeatmap = productiveDayHeatmap; }

    public List<DayOfWeekStatDTO> getDayOfWeekStats() { return dayOfWeekStats; }
    public void setDayOfWeekStats(List<DayOfWeekStatDTO> dayOfWeekStats) { this.dayOfWeekStats = dayOfWeekStats; }

    public QuestCompletionStatsDTO getQuestCompletionStats() { return questCompletionStats; }
    public void setQuestCompletionStats(QuestCompletionStatsDTO questCompletionStats) { this.questCompletionStats = questCompletionStats; }

    public List<LevelHistoryDTO> getLevelHistory() { return levelHistory; }
    public void setLevelHistory(List<LevelHistoryDTO> levelHistory) { this.levelHistory = levelHistory; }

    public StreakHistoryDTO getStreakHistory() { return streakHistory; }
    public void setStreakHistory(StreakHistoryDTO streakHistory) { this.streakHistory = streakHistory; }

    public List<StreakMilestoneDTO> getStreakMilestones() { return streakMilestones; }
    public void setStreakMilestones(List<StreakMilestoneDTO> streakMilestones) { this.streakMilestones = streakMilestones; }

    // --- Static Sub-DTOs ---

    public static class WeeklyXpDTO {
        private String week;
        private String fullDate;
        private int xp;
        private int gold;
        private int questsCompleted;
        private int target;

        public WeeklyXpDTO() {}
        public WeeklyXpDTO(String week, String fullDate, int xp, int gold, int questsCompleted, int target) {
            this.week = week;
            this.fullDate = fullDate;
            this.xp = xp;
            this.gold = gold;
            this.questsCompleted = questsCompleted;
            this.target = target;
        }

        public String getWeek() { return week; }
        public void setWeek(String week) { this.week = week; }

        public String getFullDate() { return fullDate; }
        public void setFullDate(String fullDate) { this.fullDate = fullDate; }

        public int getXp() { return xp; }
        public void setXp(int xp) { this.xp = xp; }

        public int getGold() { return gold; }
        public void setGold(int gold) { this.gold = gold; }

        public int getQuestsCompleted() { return questsCompleted; }
        public void setQuestsCompleted(int questsCompleted) { this.questsCompleted = questsCompleted; }

        public int getTarget() { return target; }
        public void setTarget(int target) { this.target = target; }
    }

    public static class MonthlyXpDTO {
        private String month;
        private int xp;
        private int gold;
        private int questsCompleted;

        public MonthlyXpDTO() {}
        public MonthlyXpDTO(String month, int xp, int gold, int questsCompleted) {
            this.month = month;
            this.xp = xp;
            this.gold = gold;
            this.questsCompleted = questsCompleted;
        }

        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }

        public int getXp() { return xp; }
        public void setXp(int xp) { this.xp = xp; }

        public int getGold() { return gold; }
        public void setGold(int gold) { this.gold = gold; }

        public int getQuestsCompleted() { return questsCompleted; }
        public void setQuestsCompleted(int questsCompleted) { this.questsCompleted = questsCompleted; }
    }

    public static class TopDomainDTO {
        private String name;
        private String domain;
        private long xp;
        private String color;
        private String icon;

        public TopDomainDTO() {}
        public TopDomainDTO(String name, String domain, long xp, String color, String icon) {
            this.name = name;
            this.domain = domain;
            this.xp = xp;
            this.color = color;
            this.icon = icon;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDomain() { return domain; }
        public void setDomain(String domain) { this.domain = domain; }

        public long getXp() { return xp; }
        public void setXp(long xp) { this.xp = xp; }

        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }

        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }
    }

    public static class AttributeGrowthDTO {
        private String attribute;
        private int current;
        private int previous;
        private int fullMark = 100;

        public AttributeGrowthDTO() {}
        public AttributeGrowthDTO(String attribute, int current, int previous, int fullMark) {
            this.attribute = attribute;
            this.current = current;
            this.previous = previous;
            this.fullMark = fullMark;
        }

        public String getAttribute() { return attribute; }
        public void setAttribute(String attribute) { this.attribute = attribute; }

        public int getCurrent() { return current; }
        public void setCurrent(int current) { this.current = current; }

        public int getPrevious() { return previous; }
        public void setPrevious(int previous) { this.previous = previous; }

        public int getFullMark() { return fullMark; }
        public void setFullMark(int fullMark) { this.fullMark = fullMark; }
    }

    public static class HeatmapEntryDTO {
        private String day;
        private String time;
        private int value;

        public HeatmapEntryDTO() {}
        public HeatmapEntryDTO(String day, String time, int value) {
            this.day = day;
            this.time = time;
            this.value = value;
        }

        public String getDay() { return day; }
        public void setDay(String day) { this.day = day; }

        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }

        public int getValue() { return value; }
        public void setValue(int value) { this.value = value; }
    }

    public static class DayOfWeekStatDTO {
        private String day;
        private int quests;
        private int avgXp;

        public DayOfWeekStatDTO() {}
        public DayOfWeekStatDTO(String day, int quests, int avgXp) {
            this.day = day;
            this.quests = quests;
            this.avgXp = avgXp;
        }

        public String getDay() { return day; }
        public void setDay(String day) { this.day = day; }

        public int getQuests() { return quests; }
        public void setQuests(int quests) { this.quests = quests; }

        public int getAvgXp() { return avgXp; }
        public void setAvgXp(int avgXp) { this.avgXp = avgXp; }
    }

    public static class QuestCompletionStatsDTO {
        private int totalCompleted;
        private int totalAssigned;
        private double completionRatePct;
        private double onTimeRatePct;
        private double averageQuestsPerDay;
        private int streakDays;
        private int bestStreakDays;

        public QuestCompletionStatsDTO() {}
        public QuestCompletionStatsDTO(int totalCompleted, int totalAssigned, double completionRatePct,
                                       double onTimeRatePct, double averageQuestsPerDay, int streakDays, int bestStreakDays) {
            this.totalCompleted = totalCompleted;
            this.totalAssigned = totalAssigned;
            this.completionRatePct = completionRatePct;
            this.onTimeRatePct = onTimeRatePct;
            this.averageQuestsPerDay = averageQuestsPerDay;
            this.streakDays = streakDays;
            this.bestStreakDays = bestStreakDays;
        }

        public int getTotalCompleted() { return totalCompleted; }
        public void setTotalCompleted(int totalCompleted) { this.totalCompleted = totalCompleted; }

        public int getTotalAssigned() { return totalAssigned; }
        public void setTotalAssigned(int totalAssigned) { this.totalAssigned = totalAssigned; }

        public double getCompletionRatePct() { return completionRatePct; }
        public void setCompletionRatePct(double completionRatePct) { this.completionRatePct = completionRatePct; }

        public double getOnTimeRatePct() { return onTimeRatePct; }
        public void setOnTimeRatePct(double onTimeRatePct) { this.onTimeRatePct = onTimeRatePct; }

        public double getAverageQuestsPerDay() { return averageQuestsPerDay; }
        public void setAverageQuestsPerDay(double averageQuestsPerDay) { this.averageQuestsPerDay = averageQuestsPerDay; }

        public int getStreakDays() { return streakDays; }
        public void setStreakDays(int streakDays) { this.streakDays = streakDays; }

        public int getBestStreakDays() { return bestStreakDays; }
        public void setBestStreakDays(int bestStreakDays) { this.bestStreakDays = bestStreakDays; }
    }

    public static class LevelHistoryDTO {
        private int level;
        private String reachedOn;

        public LevelHistoryDTO() {}
        public LevelHistoryDTO(int level, String reachedOn) {
            this.level = level;
            this.reachedOn = reachedOn;
        }

        public int getLevel() { return level; }
        public void setLevel(int level) { this.level = level; }

        public String getReachedOn() { return reachedOn; }
        public void setReachedOn(String reachedOn) { this.reachedOn = reachedOn; }
    }

    public static class StreakHistoryDTO {
        private int current;
        private int longest;
        private List<Integer> last30Days = new ArrayList<>();

        public StreakHistoryDTO() {}
        public StreakHistoryDTO(int current, int longest, List<Integer> last30Days) {
            this.current = current;
            this.longest = longest;
            this.last30Days = last30Days;
        }

        public int getCurrent() { return current; }
        public void setCurrent(int current) { this.current = current; }

        public int getLongest() { return longest; }
        public void setLongest(int longest) { this.longest = longest; }

        public List<Integer> getLast30Days() { return last30Days; }
        public void setLast30Days(List<Integer> last30Days) { this.last30Days = last30Days; }
    }

    public static class StreakMilestoneDTO {
        private int days;
        private String title;
        private String icon;
        private String badgeReward;

        public StreakMilestoneDTO() {}
        public StreakMilestoneDTO(int days, String title, String icon, String badgeReward) {
            this.days = days;
            this.title = title;
            this.icon = icon;
            this.badgeReward = badgeReward;
        }

        public int getDays() { return days; }
        public void setDays(int days) { this.days = days; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }

        public String getBadgeReward() { return badgeReward; }
        public void setBadgeReward(String badgeReward) { this.badgeReward = badgeReward; }
    }
}
