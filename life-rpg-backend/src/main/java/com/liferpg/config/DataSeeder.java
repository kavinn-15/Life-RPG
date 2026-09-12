package com.liferpg.config;

import com.liferpg.entity.*;
import com.liferpg.entity.Character;
import com.liferpg.enums.*;
import com.liferpg.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

        private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

        private final UserRepository userRepository;
        private final CharacterRepository characterRepository;
        private final AttributeRepository attributeRepository;
        private final DomainRepository domainRepository;
        private final UserDomainRepository userDomainRepository;
        private final QuestRepository questRepository;
        private final QuestMilestoneRepository milestoneRepository;
        private final AchievementRepository achievementRepository;
        private final UserAchievementRepository userAchievementRepository;
        private final DailyMissionRepository dailyMissionRepository;
        private final DailyMissionProgressRepository dailyMissionProgressRepository;
        private final RewardRepository rewardRepository;
        private final InventoryItemRepository inventoryItemRepository;
        private final NotificationRepository notificationRepository;
        private final EquippedRelicRepository relicRepository;
        private final ProofOfWorkRepository proofOfWorkRepository;
        private final UserSettingsRepository settingsRepository;
        private final PasswordEncoder passwordEncoder;

        public DataSeeder(UserRepository userRepository,
                        CharacterRepository characterRepository,
                        AttributeRepository attributeRepository,
                        DomainRepository domainRepository,
                        UserDomainRepository userDomainRepository,
                        QuestRepository questRepository,
                        QuestMilestoneRepository milestoneRepository,
                        AchievementRepository achievementRepository,
                        UserAchievementRepository userAchievementRepository,
                        DailyMissionRepository dailyMissionRepository,
                        DailyMissionProgressRepository dailyMissionProgressRepository,
                        RewardRepository rewardRepository,
                        InventoryItemRepository inventoryItemRepository,
                        NotificationRepository notificationRepository,
                        EquippedRelicRepository relicRepository,
                        ProofOfWorkRepository proofOfWorkRepository,
                        UserSettingsRepository settingsRepository,
                        PasswordEncoder passwordEncoder) {
                this.userRepository = userRepository;
                this.characterRepository = characterRepository;
                this.attributeRepository = attributeRepository;
                this.domainRepository = domainRepository;
                this.userDomainRepository = userDomainRepository;
                this.questRepository = questRepository;
                this.milestoneRepository = milestoneRepository;
                this.achievementRepository = achievementRepository;
                this.userAchievementRepository = userAchievementRepository;
                this.dailyMissionRepository = dailyMissionRepository;
                this.dailyMissionProgressRepository = dailyMissionProgressRepository;
                this.rewardRepository = rewardRepository;
                this.inventoryItemRepository = inventoryItemRepository;
                this.notificationRepository = notificationRepository;
                this.relicRepository = relicRepository;
                this.proofOfWorkRepository = proofOfWorkRepository;
                this.settingsRepository = settingsRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @Override
        @Transactional
        public void run(String... args) {
                log.info("Starting Life RPG database seed check...");
                seedDomains();
                seedAchievements();
                seedDailyMissions();
                seedRewards();
                seedDemoUser();
                log.info("Life RPG database seed check complete!");
        }

        private void seedDomains() {
                if (domainRepository.count() > 0)
                        return;
                log.info("Seeding 15 RPG Domains...");

                List<Domain> domains = Arrays.asList(
                                createDomain("programming", "Programming", "Architecture & Codecraft",
                                                "Master software engineering, architecture, system design, and algorithmic thinking.",
                                                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80",
                                                "terminal", "#8c7ae6", "bg-primary-container text-on-primary",
                                                "text-primary bg-primary-fixed", "bg-primary-fixed-dim/30",
                                                "Hard", "Intelligence, Focus", 120, 250, 40, 90),
                                createDomain("fitness", "Fitness", "Strength & Conditioning",
                                                "Forge physical strength, endurance, mobility, and cardiovascular health.",
                                                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80",
                                                "fitness_center", "#00d2d3", "bg-secondary-container text-on-secondary",
                                                "text-secondary bg-secondary-fixed", "bg-secondary-fixed-dim/30",
                                                "Medium", "Strength, Vitality", 80, 200, 25, 75),
                                createDomain("reading", "Reading", "Intellect & Knowledge",
                                                "Expand intellect, comprehension, and worldview through systematic reading.",
                                                "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&auto=format&fit=crop&q=80",
                                                "auto_stories", "#ff9f43", "bg-tertiary-container text-on-tertiary",
                                                "text-tertiary bg-tertiary-fixed", "bg-tertiary-fixed-dim/30",
                                                "Easy", "Wisdom, Focus", 50, 150, 15, 50),
                                createDomain("finance", "Finance", "Wealth & Sovereignty",
                                                "Build financial literacy, wealth accumulation, investing, and resource management.",
                                                "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80",
                                                "trending_up", "#00d2d3", "bg-secondary-container text-on-secondary",
                                                "text-secondary bg-secondary-fixed", "bg-secondary-fixed-dim/30",
                                                "Medium", "Discipline, Intelligence", 90, 220, 30, 80),
                                createDomain("mindfulness", "Mindfulness", "Inner Stillness & Clarity",
                                                "Cultivate mental stillness, emotional regulation, and deep presence.",
                                                "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80",
                                                "self_improvement", "#ff9f43", "bg-tertiary-container text-on-tertiary",
                                                "text-tertiary bg-tertiary-fixed", "bg-tertiary-fixed-dim/30",
                                                "Easy", "Wisdom, Resilience", 40, 120, 10, 40),
                                createDomain("nutrition", "Nutrition", "Macronutrients & Fuel",
                                                "Fuel the body with optimal macronutrients, hydration, and meal prep discipline.",
                                                "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&auto=format&fit=crop&q=80",
                                                "restaurant", "#00d2d3", "bg-secondary-container text-on-secondary",
                                                "text-secondary bg-secondary-fixed", "bg-secondary-fixed-dim/30",
                                                "Medium", "Vitality, Discipline", 60, 160, 20, 55),
                                createDomain("writing", "Writing", "Expression & Rhetoric",
                                                "Hone expressive clarity, technical documentation, and creative storytelling.",
                                                "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80",
                                                "edit_note", "#8c7ae6", "bg-primary-container text-on-primary",
                                                "text-primary bg-primary-fixed", "bg-primary-fixed-dim/30",
                                                "Medium", "Creativity, Wisdom", 70, 180, 25, 65),
                                createDomain("languages", "Languages", "Linguistics & Polyglotism",
                                                "Acquire linguistic proficiency, vocabulary, and cross-cultural communication.",
                                                "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200&auto=format&fit=crop&q=80",
                                                "language", "#8c7ae6", "bg-primary-container text-on-primary",
                                                "text-primary bg-primary-fixed", "bg-primary-fixed-dim/30",
                                                "Hard", "Intelligence, Discipline", 90, 220, 30, 80),
                                createDomain("career", "Career", "Ascendance & Leadership",
                                                "Advance professional trajectory, networking, leadership, and public speaking.",
                                                "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80",
                                                "workspace_premium", "#ff9f43",
                                                "bg-tertiary-container text-on-tertiary",
                                                "text-tertiary bg-tertiary-fixed", "bg-tertiary-fixed-dim/30",
                                                "Hard", "Charisma, Discipline", 100, 260, 35, 95),
                                createDomain("creativity", "Creativity", "Artistry & Generative Flow",
                                                "Channel artistic impulse into design, music, digital art, and generative media.",
                                                "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&auto=format&fit=crop&q=80",
                                                "palette", "#8c7ae6", "bg-primary-container text-on-primary",
                                                "text-primary bg-primary-fixed", "bg-primary-fixed-dim/30",
                                                "Medium", "Creativity, Focus", 80, 200, 25, 75),
                                createDomain("sleep", "Sleep", "Restorative Architecture",
                                                "Optimize circadian rhythms, sleep architecture, and restorative recovery.",
                                                "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&auto=format&fit=crop&q=80",
                                                "bedtime", "#00d2d3", "bg-secondary-container text-on-secondary",
                                                "text-secondary bg-secondary-fixed", "bg-secondary-fixed-dim/30",
                                                "Easy", "Vitality, Discipline", 50, 130, 15, 45),
                                createDomain("social", "Social", "Community & Empathy",
                                                "Nurture meaningful relationships, community building, and charismatic empathy.",
                                                "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80",
                                                "groups", "#ff9f43", "bg-tertiary-container text-on-tertiary",
                                                "text-tertiary bg-tertiary-fixed", "bg-tertiary-fixed-dim/30",
                                                "Medium", "Charisma, Resilience", 70, 170, 20, 60),
                                createDomain("productivity", "Productivity", "Deep Work & Systems",
                                                "Master time blocking, deep work rituals, and distraction elimination.",
                                                "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&auto=format&fit=crop&q=80",
                                                "bolt", "#8c7ae6", "bg-primary-container text-on-primary",
                                                "text-primary bg-primary-fixed", "bg-primary-fixed-dim/30",
                                                "Medium", "Focus, Discipline", 80, 200, 25, 70),
                                createDomain("resilience", "Resilience", "Stoicism & Fortitude",
                                                "Build mental toughness, stoic fortitude, and crisis composure.",
                                                "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80",
                                                "shield", "#00d2d3", "bg-secondary-container text-on-secondary",
                                                "text-secondary bg-secondary-fixed", "bg-secondary-fixed-dim/30",
                                                "Hard", "Resilience, Discipline", 90, 230, 30, 85),
                                createDomain("philosophy", "Philosophy", "First Principles & Ethics",
                                                "Examine first principles, ethics, mental models, and epistemological frameworks.",
                                                "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80",
                                                "psychology", "#ff9f43", "bg-tertiary-container text-on-tertiary",
                                                "text-tertiary bg-tertiary-fixed", "bg-tertiary-fixed-dim/30",
                                                "Hard", "Wisdom, Intelligence", 100, 250, 35, 90));

                domainRepository.saveAll(domains);
        }

        private Domain createDomain(String id, String name, String tagline, String desc, String heroImg,
                        String icon, String accent, String accentClass, String chipClass,
                        String softClass, String difficultyDefault, String primaryAttrs,
                        int xpMin, int xpMax, int goldMin, int goldMax) {
                Domain d = new Domain();
                d.setId(id);
                d.setName(name);
                d.setTagline(tagline);
                d.setDescription(desc);
                d.setHeroImageUrl(heroImg);
                d.setIcon(icon);
                d.setAccent(accent);
                d.setAccentClass(accentClass);
                d.setChipClass(chipClass);
                d.setSoftClass(softClass);
                d.setDifficultyDefault(difficultyDefault);
                d.setPrimaryAttributes(primaryAttrs);
                d.setXpMin(xpMin);
                d.setXpMax(xpMax);
                d.setGoldMin(goldMin);
                d.setGoldMax(goldMax);
                d.setActive(true);
                return d;
        }

        private void seedAchievements() {
                log.info("Ensuring achievements are seeded...");
                List<Achievement> achievements = Arrays.asList(
                                new Achievement("first-quest", "First Step into the Arena",
                                                "Complete your first quest.", "military_tech",
                                                AchievementCategory.QUEST, "Programming", 1, 50, 25),
                                new Achievement("quest-marathon", "Quest Marathoner",
                                                "Complete 5 quests in a single calendar day.", "sprint",
                                                AchievementCategory.QUEST, "Fitness", 5, 200, 100),
                                new Achievement("century-club", "Century Club",
                                                "Complete 100 total quests across all domains.", "workspace_premium",
                                                AchievementCategory.QUEST, "Career", 100, 1000, 500),
                                new Achievement("coding-streak-14", "Fortnight of Flow",
                                                "Maintain a 14-day consecutive activity streak.",
                                                "local_fire_department", AchievementCategory.STREAK, "Programming", 14,
                                                400, 150),
                                new Achievement("streak-vanguard", "Streak Vanguard",
                                                "Reach a 30-day consecutive streak.", "whatshot",
                                                AchievementCategory.STREAK, "Productivity", 30, 800, 350),
                                new Achievement("unbreakable", "The Unbreakable Chain",
                                                "Achieve an uninterrupted 100-day streak.", "bolt",
                                                AchievementCategory.STREAK, "Resilience", 100, 2500, 1200),
                                new Achievement("novice-ascendant", "Novice Ascendant", "Reach character Level 5.",
                                                "keyboard_double_arrow_up", AchievementCategory.LEVEL, "Career", 5, 150,
                                                50),
                                new Achievement("veteran-adventurer", "Veteran Adventurer", "Reach character Level 10.",
                                                "shield_with_heart", AchievementCategory.LEVEL, "Fitness", 10, 500,
                                                250),
                                new Achievement("kafka-milestone", "Distributed Master", "Reach character Level 15.",
                                                "stars", AchievementCategory.LEVEL, "Programming", 15, 1200, 600),
                                new Achievement("strength-lvl-8", "Iron Forged",
                                                "Attain Level 8 in the Strength attribute.", "fitness_center",
                                                AchievementCategory.ATTRIBUTE, "Fitness", 8, 300, 120),
                                new Achievement("mind-over-matter", "Sage Mind",
                                                "Attain Level 10 in the Intelligence attribute.", "psychology",
                                                AchievementCategory.ATTRIBUTE, "Philosophy", 10, 450, 180),
                                new Achievement("renaissance-adventurer", "Renaissance Mind",
                                                "Level at least 5 attributes to Level 10 or above.", "auto_stories",
                                                AchievementCategory.ATTRIBUTE, "Mindfulness", 5, 750, 300),
                                new Achievement("first-fortune", "First Coin in the Pouch",
                                                "Accumulate 100 Gold in your vault.", "savings",
                                                AchievementCategory.GOLD, "Finance", 100, 100, 50),
                                new Achievement("gold-hoarder", "Vault Custodian",
                                                "Accumulate 1,000 Gold simultaneously.", "monetization_on",
                                                AchievementCategory.GOLD, "Finance", 1000, 400, 200),
                                new Achievement("vault-tycoon", "Dragon's Hoard",
                                                "Accumulate 5,000 Gold in total savings.", "diamond",
                                                AchievementCategory.GOLD, "Finance", 5000, 1500, 750),
                                new Achievement("domain-adept", "Domain Adept", "Reach Domain Level 5 in any domain.",
                                                "public", AchievementCategory.DOMAIN, "Programming", 5, 300, 100),
                                new Achievement("domain-master", "Domain Master",
                                                "Reach Domain Level 10 in any domain.", "military_tech",
                                                AchievementCategory.DOMAIN, "Reading", 10, 800, 400),
                                new Achievement("grandmaster-generalist", "Omni-Disciplined",
                                                "Reach Domain Level 5 across 5 different domains.", "grade",
                                                AchievementCategory.DOMAIN, "Productivity", 5, 1200, 500));

                for (Achievement a : achievements) {
                        if (!achievementRepository.existsById(a.getId())) {
                                achievementRepository.save(a);
                        }
                }
        }

        private void seedDailyMissions() {
                log.info("Ensuring daily missions are seeded...");
                List<DailyMission> missions = List.of(
                                new DailyMission("complete-daily-3", "Complete 3 Quests",
                                                "Finish any 3 quests from your daily roster.", "task_alt",
                                                "activeQuests", 3, 150, 50),
                                new DailyMission("xp-surge", "Earn 200 XP",
                                                "Accumulate at least 200 XP from quests and milestones today.", "bolt",
                                                "todayXp", 200, 100, 30),
                                new DailyMission("domain-diversifier", "Progress in 2 Domains",
                                                "Complete at least one quest in 2 distinct domains.", "category",
                                                "todayDomains", 2, 120, 40),
                                new DailyMission("morning-momentum", "Complete 1 Quest Before 12 PM",
                                                "Knock out any quest in the morning hours.", "wb_sunny",
                                                "todayMorningQuests", 1, 80, 25),
                                new DailyMission("milestone-march", "Complete 5 Milestones",
                                                "Check off 5 individual milestone sub-tasks.", "checklist",
                                                "todayMilestones", 5, 110, 35),
                                new DailyMission("gold-rush", "Earn 100 Gold",
                                                "Bank 100 Gold from quest rewards and bonus bonuses.",
                                                "monetization_on", "todayGold", 100, 90, 50));

                for (DailyMission m : missions) {
                        if (!dailyMissionRepository.existsById(m.getId())) {
                                dailyMissionRepository.save(m);
                        }
                }
        }

        private void seedRewards() {
                log.info("Ensuring store rewards are seeded...");
                List<Reward> rewards = Arrays.asList(
                                new Reward("theme-midnight-aurora", "Midnight Aurora Theme",
                                                "A deep-indigo interface skin with a slow aurora shimmer.", "palette",
                                                RewardCategory.Theme, 450),
                                new Reward("theme-sunfire-dawn", "Sunfire Dawn Theme",
                                                "Warm amber gradients across every panel.", "palette",
                                                RewardCategory.Theme, 450),
                                new Reward("theme-forest-grove", "Forest Grove Theme",
                                                "A calm, mossy green skin for long focus sessions.", "palette",
                                                RewardCategory.Theme, 400),
                                new Reward("frame-gilded", "Gilded Avatar Frame",
                                                "A polished gold border for your character portrait.", "frame_inspect",
                                                RewardCategory.AvatarFrame, 250),
                                new Reward("frame-obsidian", "Obsidian Frame",
                                                "Sleek matte-black frame with a faint violet edge glow.",
                                                "frame_inspect", RewardCategory.AvatarFrame, 300),
                                new Reward("frame-celestial-halo", "Celestial Halo Frame",
                                                "A slow-rotating ring of stars around your portrait.", "frame_inspect",
                                                RewardCategory.AvatarFrame, 650),
                                new Reward("title-novice-vanguard", "The Novice Vanguard",
                                                "Equipable title. +5% XP on Early Quests.", "military_tech",
                                                RewardCategory.Title, 350),
                                new Reward("title-technomancer", "The Technomancer",
                                                "Equipable title. +8% XP on Programming quests.", "code",
                                                RewardCategory.Title, 750),
                                new Reward("title-iron-sentinel", "The Iron Sentinel",
                                                "Equipable title. +8% XP on Fitness quests.", "shield",
                                                RewardCategory.Title, 750),
                                new Reward("title-archmage-discipline", "Archmage of Discipline",
                                                "Equipable title. +10% XP on Streak days.", "auto_stories",
                                                RewardCategory.Title, 900),
                                new Reward("badge-bronze-completionist", "Bronze Completionist Badge",
                                                "Displayed on your profile next to your name.", "workspace_premium",
                                                RewardCategory.Badge, 200),
                                new Reward("badge-streak-sentinel", "Streak Sentinel Badge",
                                                "A flame-rimmed badge for the streak-obsessed.",
                                                "local_fire_department", RewardCategory.Badge, 300),
                                new Reward("badge-domain-master", "Domain Master Badge",
                                                "Shows off deep investment across every domain.", "public",
                                                RewardCategory.Badge, 550),
                                new Reward("decoration-flame-aura", "Animated Flame Aura",
                                                "A subtle animated flame behind your portrait.", "auto_awesome",
                                                RewardCategory.ProfileDecoration, 500),
                                new Reward("decoration-starfield", "Starfield Backdrop",
                                                "A slow-drifting starfield behind your profile card.", "auto_awesome",
                                                RewardCategory.ProfileDecoration, 500),
                                new Reward("decoration-laurel-wreath", "Laurel Wreath Border",
                                                "A classic laurel wreath framing your profile card.", "auto_awesome",
                                                RewardCategory.ProfileDecoration, 400),
                                new Reward("boost-double-xp", "24hr Double XP Charm",
                                                "Doubles all XP earned for the next 24 hours.", "bolt",
                                                RewardCategory.XpBoost, 500),
                                new Reward("boost-weekend-surge", "Weekend XP Surge",
                                                "+50% XP on all quests completed over the weekend.", "bolt",
                                                RewardCategory.XpBoost, 350),
                                new Reward("boost-attribute-elixir", "Attribute Focus Elixir",
                                                "+30% XP toward a single attribute of your choice for 24h.", "bolt",
                                                RewardCategory.XpBoost, 300),
                                new Reward("cosmetic-chromatic-nameplate", "Chromatic Nameplate",
                                                "Your display name shifts through a slow color gradient.", "diamond",
                                                RewardCategory.Cosmetic, 600),
                                new Reward("cosmetic-holographic-card", "Holographic Card Skin",
                                                "A shimmering holo-foil finish for your character card.", "diamond",
                                                RewardCategory.Cosmetic, 700),
                                new Reward("cosmetic-pixel-pet", "Pixel Companion Pet",
                                                "A tiny pixel-art companion that follows your cursor.", "diamond",
                                                RewardCategory.Cosmetic, 850));

                for (Reward r : rewards) {
                        if (!rewardRepository.existsById(r.getId())) {
                                rewardRepository.save(r);
                        }
                }
        }

        private void seedDemoUser() {
                String email = "alex@liferpg.app";
                User user = userRepository.findByEmail(email).orElse(null);
                if (user == null) {
                        log.info("Seeding Demo User Alex Mercer ({}) with Level 12 state...", email);
                        user = new User("Alex Mercer", email, passwordEncoder.encode("rpgmaster123"),
                                        UserRole.ROLE_USER);
                        user = userRepository.save(user);
                } else {
                        log.info("Ensuring demo user {} is fully populated...", email);
                }

                // Character
                if (characterRepository.findByUserId(user.getId()).isEmpty()) {
                        Character character = new Character(user);
                        character.setPlayerName("Alex Mercer");
                        character.setTitle("Cyber Nomad");
                        character.setAvatarClass("cyber-nomad");
                        character.setDailyGoal(3);
                        character.setPreferredDifficulty("Medium");
                        character.setMainObjective(
                                        "Build unshakeable daily habits and master distributed systems engineering.");
                        character.setFavoriteDomains("programming,fitness,reading,finance");
                        character.setLevel(12);
                        character.setCurrentXp(400);
                        character.setNextLevelXp(1300);
                        character.setLevelProgress(30);
                        character.setTotalXp(14800);
                        character.setGold(850);
                        character.setCurrentStreak(18);
                        character.setLongestStreak(24);
                        character.setQuestsCompletedToday(2);
                        character.setQuestsTotalToday(4);
                        characterRepository.save(character);
                }

                // Settings
                if (settingsRepository.findByUserId(user.getId()).isEmpty()) {
                        UserSettings settings = new UserSettings(user);
                        settings.setPreferredTheme("dark");
                        settings.setTimezone("America/Los_Angeles");
                        settingsRepository.save(settings);
                }

                // Attributes
                if (attributeRepository.findByUserId(user.getId()).isEmpty()) {
                        seedAttributes(user);
                }

                // Relics
                if (relicRepository.findByUserId(user.getId()).isEmpty()) {
                        seedRelics(user);
                }

                // Proof of Work
                if (proofOfWorkRepository.findByUserId(user.getId()).isEmpty()) {
                        seedProofOfWork(user);
                }

                // User Domains
                if (userDomainRepository.findByUserId(user.getId()).isEmpty()) {
                        seedUserDomains(user);
                }

                // Owned & Equipped Rewards
                if (inventoryItemRepository.findByUserId(user.getId()).isEmpty()) {
                        seedInventory(user);
                }

                // Quests & Milestones
                seedQuests(user);

                // Achievements Unlocked for Alex
                if (userAchievementRepository.findByUserId(user.getId()).isEmpty()) {
                        seedUserAchievements(user);
                }

                // Daily Mission Progress for today
                if (dailyMissionProgressRepository.findByUserIdAndProgressDate(user.getId(), LocalDate.now())
                                .isEmpty()) {
                        seedDailyMissionProgress(user);
                }

                // Starter notifications
                if (notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).isEmpty()) {
                        seedNotifications(user);
                }
        }

        private void seedAttributes(User user) {
                List<Attribute> attributes = Arrays.asList(
                                new Attribute(user, "strength", "Strength",
                                                "Physical power and heavy resistance conditioning", "fitness_center", 8,
                                                720, 800, 90),
                                new Attribute(user, "agility", "Agility",
                                                "Reaction speed, mobility, and cardiovascular pace", "sprint", 7, 450,
                                                700, 64),
                                new Attribute(user, "vitality", "Vitality",
                                                "Sustained biological stamina, sleep, and recovery", "favorite", 9, 810,
                                                900, 90),
                                new Attribute(user, "intelligence", "Intelligence",
                                                "Algorithmic synthesis, system design, and logic", "terminal", 11, 950,
                                                1100, 86),
                                new Attribute(user, "wisdom", "Wisdom",
                                                "First-principles perspective and mental clarity", "auto_stories", 10,
                                                600, 1000, 60),
                                new Attribute(user, "charisma", "Charisma",
                                                "Oratorical clarity, team leadership, and presence",
                                                "record_voice_over", 6, 300, 600, 50),
                                new Attribute(user, "discipline", "Discipline",
                                                "Iron adherence to daily protocols without friction", "shield", 12,
                                                1100, 1200, 91),
                                new Attribute(user, "focus", "Focus",
                                                "Monotasking depth and uninterrupted cognitive flow",
                                                "center_focus_strong", 11, 850, 1100, 77),
                                new Attribute(user, "creativity", "Creativity",
                                                "Lateral ideation, technical architecture, and art", "palette", 8, 520,
                                                800, 65),
                                new Attribute(user, "resilience", "Resilience",
                                                "Equanimity under high stress and rapid bounce-back",
                                                "local_fire_department", 9, 750, 900, 83));
                attributeRepository.saveAll(attributes);
        }

        private void seedRelics(User user) {
                List<EquippedRelic> relics = Arrays.asList(
                                new EquippedRelic(user, "Relic Slot 1", "Neural Processing Core", "+15% Deep Work XP",
                                                "memory"),
                                new EquippedRelic(user, "Relic Slot 2", "Chronometer of Flow",
                                                "+10% Streak Duration XP", "timer"),
                                new EquippedRelic(user, "Relic Slot 3", "Titan Grip Gauntlet",
                                                "+12% Physical Conditioning XP", "fitness_center"));
                relicRepository.saveAll(relics);
        }

        private void seedProofOfWork(User user) {
                List<ProofOfWork> pows = Arrays.asList(
                                new ProofOfWork(user, "GitHub Commits", "Kafka Broker Implementation", "+280 XP",
                                                "code", "PR #42", true),
                                new ProofOfWork(user, "Strava PR", "Deadlift 405 lbs 3x5", "+220 XP", "fitness_center",
                                                "RPE 8.5", true),
                                new ProofOfWork(user, "Kindle Sync", "Designing Data-Intensive Applications", "+130 XP",
                                                "menu_book", "Ch. 9", true));
                proofOfWorkRepository.saveAll(pows);
        }

        private void seedUserDomains(User user) {
                List<Domain> domains = domainRepository.findAll();
                List<UserDomain> userDomains = new ArrayList<>();

                for (Domain d : domains) {
                        int quests = switch (d.getId()) {
                                case "programming" -> 42;
                                case "fitness" -> 28;
                                case "reading" -> 19;
                                case "finance" -> 14;
                                case "mindfulness" -> 11;
                                case "productivity" -> 21;
                                default -> 5;
                        };
                        long xp = switch (d.getId()) {
                                case "programming" -> 5800L;
                                case "fitness" -> 3600L;
                                case "reading" -> 2200L;
                                case "finance" -> 1750L;
                                case "mindfulness" -> 1200L;
                                case "productivity" -> 2800L;
                                default -> 650L;
                        };
                        int level = Math.max(1, (int) Math.sqrt(xp / 100.0));
                        int streak = switch (d.getId()) {
                                case "programming" -> 18;
                                case "fitness" -> 12;
                                case "reading" -> 18;
                                default -> 3;
                        };

                        userDomains.add(new UserDomain(user, d, quests, xp, level, streak));
                }

                userDomainRepository.saveAll(userDomains);
        }

        private void seedInventory(User user) {
                List<String> ownedIds = List.of(
                                "theme-midnight-aurora",
                                "frame-gilded",
                                "title-novice-vanguard",
                                "badge-bronze-completionist",
                                "decoration-laurel-wreath");

                for (String id : ownedIds) {
                        rewardRepository.findById(id).ifPresent(reward -> {
                                InventoryItem item = new InventoryItem(user, reward, true);
                                inventoryItemRepository.save(item);
                        });
                }
        }

        private void seedQuests(User user) {
                Domain prog = domainRepository.findById("programming").orElse(null);
                Domain fit = domainRepository.findById("fitness").orElse(null);
                Domain read = domainRepository.findById("reading").orElse(null);
                Domain mind = domainRepository.findById("mindfulness").orElse(null);
                Domain fin = domainRepository.findById("finance").orElse(null);
                Domain prod = domainRepository.findById("productivity").orElse(null);
                Domain creat = domainRepository.findById("creativity").orElse(null);
                Domain nutr = domainRepository.findById("nutrition").orElse(null);
                Domain res = domainRepository.findById("resilience").orElse(null);
                Domain soc = domainRepository.findById("social").orElse(null);
                Domain phil = domainRepository.findById("philosophy").orElse(null);
                Domain car = domainRepository.findById("career").orElse(null);
                Domain sleep = domainRepository.findById("sleep").orElse(null);
                Domain write = domainRepository.findById("writing").orElse(null);
                Domain lang = domainRepository.findById("language").orElse(null);

                // --- PROGRAMMING ---
                seedQuestItem("quest-kafka-pipeline", user, prog, "Kafka Event Streaming Architecture",
                                "Architect a fault-tolerant multi-partition consumer pipeline with graceful rebalancing and schema registry.",
                                "Programming", "Hard", QuestType.MAIN, 280, 95, 45, true, true, false,
                                QuestStatus.ACTIVE, "terminal", "Requires Java 21 & Docker Kafka broker",
                                List.of("Design partition assignment strategy & schema registry",
                                                "Implement dead-letter-queue with exponential backoff",
                                                "Benchmark 10,000 msg/sec throughput with k6"),
                                List.of(true, true, false));

                seedQuestItem("quest-redis-raft", user, prog, "Distributed Cache & Raft Consensus Engine",
                                "Implement leader election, log replication, and heartbeat timeouts for high-availability cluster.",
                                "Programming", "Heroic", QuestType.MAIN, 420, 150, 90, false, true, false,
                                QuestStatus.ACTIVE, "memory", "Distributed Systems Specialization",
                                List.of("Implement Raft state machine & leader election timer",
                                                "Log replication with quorum confirmation",
                                                "Fault-injection network partition simulation"),
                                List.of(false, false, false));

                seedQuestItem("quest-graphql-realtime", user, prog, "Full-Stack GraphQL Subscriptions & WebSocket Relay",
                                "Configure bi-directional reactive telemetry streaming with JWT authorization guards.",
                                "Programming", "Medium", QuestType.SIDE, 160, 55, 35, false, false, false,
                                QuestStatus.ACTIVE, "hub", "WebSockets and Spring WebFlux",
                                List.of("Setup Apollo Client subscription links",
                                                "Secure WebSocket handshake with bearer token filter",
                                                "Stress test 500 concurrent active connections"),
                                List.of(true, false, false));

                seedQuestItem("quest-leetcode-dp", user, prog, "LeetCode: Dynamic Programming & Graph Traversal",
                                "Solve 2 Medium DP problems and 1 Hard DAG topological sort challenge with optimal space complexity.",
                                "Programming", "Medium", QuestType.DAILY, 120, 40, 40, false, false, true,
                                QuestStatus.ACTIVE, "code", "Optimal Big-O Analysis",
                                List.of("Solve LeetCode #300 Longest Increasing Subsequence",
                                                "Solve LeetCode #207 Course Schedule (Kahn's Algorithm)",
                                                "Document time/space complexities in study notes"),
                                List.of(false, false, false));

                seedQuestItem("quest-docker-k8s", user, prog, "Docker Containerization & Kubernetes Helm Chart",
                                "Containerize multi-container microservice stack with health probes, resource limits, and Helm templates.",
                                "Programming", "Hard", QuestType.SIDE, 240, 80, 60, false, true, false,
                                QuestStatus.ACTIVE, "view_in_ar", "Docker and Minikube installed",
                                List.of("Multi-stage Dockerfile build optimization (<80MB image)",
                                                "Configure liveness and readiness HTTP probes",
                                                "Deploy via Helm chart to local Kubernetes namespace"),
                                List.of(true, true, false));

                // --- FITNESS ---
                seedQuestItem("quest-deadlift-pr", user, fit, "Heavy Compound Pull Session (Deadlift 405 lbs)",
                                "Execute 3 working sets of conventional deadlifts at 405 lbs followed by Pendlay barbell rows.",
                                "Fitness", "Hard", QuestType.MAIN, 220, 70, 60, false, true, false,
                                QuestStatus.ACTIVE, "fitness_center", "Warmup thoroughly & engage posterior chain",
                                List.of("15-minute dynamic hip and posterior chain warm-up",
                                                "Hit 405 lbs x 5 reps (RPE 8.5)",
                                                "Pendlay rows 4x8 + hamstring cooldown"),
                                List.of(true, false, false));

                seedQuestItem("quest-zone2-cardio", user, fit, "Zone 2 Cardiovascular 10km Aerobic Run",
                                "Maintain steady 135-145 BPM heart rate across continuous 10km outdoor or treadmill tempo.",
                                "Fitness", "Medium", QuestType.SIDE, 180, 60, 55, false, false, false,
                                QuestStatus.ACTIVE, "directions_run", "HR Chest Strap or Smartwatch",
                                List.of("1km progressive pace warmup",
                                                "8km steady Zone 2 heart rate lock (138 BPM avg)",
                                                "1km cooldown walk and calf mobility stretches"),
                                List.of(false, false, false));

                seedQuestItem("quest-cold-shower", user, fit, "Morning Ice Protocol & Wim Hof Breathwork",
                                "3 rounds of 30 power breaths followed by 3-minute maximum cold immersion.",
                                "Fitness", "Easy", QuestType.DAILY, 90, 30, 15, false, false, true,
                                QuestStatus.COMPLETED, "ac_unit", "Post-wake morning routine",
                                List.of("3 rounds Wim Hof oxygenation breathwork",
                                                "3 minutes uninterrupted cold shower exposure"),
                                List.of(true, true));

                seedQuestItem("quest-core-bulletproof", user, fit, "Isometric Core & Rotator Cuff Bulletproofing",
                                "4 rounds of hollow-body holds, ab wheel rollouts, face pulls, and pallof presses.",
                                "Fitness", "Easy", QuestType.DAILY, 80, 25, 20, false, false, true,
                                QuestStatus.ACTIVE, "shield", "Resistance band required",
                                List.of("Hollow body holds 4x45s",
                                                "Face pulls with external rotation 4x15",
                                                "Pallof press anti-rotation holds 3x30s each side"),
                                List.of(false, false, false));

                // --- READING & INTELLECT ---
                seedQuestItem("quest-reading-ddia", user, read, "DDIA: Consistency, Consensus, & Linearizability",
                                "Read Chapter 9 of Designing Data-Intensive Applications. Synthesize key takeaways in second brain.",
                                "Reading", "Medium", QuestType.DAILY, 130, 45, 30, false, false, true,
                                QuestStatus.ACTIVE, "auto_stories", "Physical book or Kindle",
                                List.of("Read pages 321 to 354 on linearizability",
                                                "Draft Obsidian note on Byzantine fault tolerance & Raft quorum"),
                                List.of(true, false));

                seedQuestItem("quest-thinking-fast-slow", user, read, "Cognitive Biases: Thinking, Fast and Slow",
                                "Deep dive into System 1 vs System 2 heuristics, prospect theory, and framing effects.",
                                "Reading", "Medium", QuestType.SIDE, 140, 50, 40, false, true, false,
                                QuestStatus.ACTIVE, "psychology", "Daniel Kahneman text",
                                List.of("Read Chapters 11-14 on anchoring & availability heuristic",
                                                "Synthesize 3 daily decision-making checkpoints"),
                                List.of(false, false));

                seedQuestItem("quest-obsidian-zettelkasten", user, read, "Synthesize Obsidian Zettelkasten Knowledge Graph",
                                "Transform raw book highlights into 5 atomic evergreen notes with bidirectional wikilinks.",
                                "Reading", "Easy", QuestType.DAILY, 85, 30, 25, false, false, true,
                                QuestStatus.ACTIVE, "share", "Obsidian / Markdown Vault",
                                List.of("Process 10 raw Kindle highlights",
                                                "Create 5 atomic permanent notes with bidirectional links"),
                                List.of(false, false));

                // --- MINDFULNESS & RECOVERY ---
                seedQuestItem("quest-meditation-20", user, mind, "Vipassana Mindfulness Sit (20 mins stillness)",
                                "20 minutes of silent breath awareness without shifting posture.",
                                "Mindfulness", "Easy", QuestType.DAILY, 80, 25, 20, false, false, true,
                                QuestStatus.COMPLETED, "self_improvement", "Quiet environment",
                                List.of("20 minutes uninterrupted stillness & breath awareness"),
                                List.of(true));

                seedQuestItem("quest-nsdr-recovery", user, mind, "Deep NSDR (Non-Sleep Deep Rest) Neural Reset",
                                "Perform 20 minutes of guided Non-Sleep Deep Rest (Huberman protocol) for dopamine recovery.",
                                "Mindfulness", "Easy", QuestType.DAILY, 75, 25, 20, false, false, true,
                                QuestStatus.ACTIVE, "bedtime", "Headphones recommended",
                                List.of("20-minute NSDR body scan and diaphragmatic breathing"),
                                List.of(false));

                // --- FINANCE & WEALTH ---
                seedQuestItem("quest-portfolio-rebalance", user, fin, "Asset Rebalancing & Dividend Portfolio Review",
                                "Review monthly asset allocations, rebalance index ETF ratios, and log savings rate.",
                                "Finance", "Medium", QuestType.SIDE, 140, 50, 40, false, true, false,
                                QuestStatus.ACTIVE, "trending_up", "Portfolio dashboard",
                                List.of("Calculate quarterly savings percentage target",
                                                "Execute automated index fund buy orders"),
                                List.of(true, false));

                seedQuestItem("quest-zero-budget", user, fin, "Zero-Base Budget & Net Worth Telemetry Audit",
                                "Categorize all transactions for the preceding 30 days and audit subscription burn rate.",
                                "Finance", "Easy", QuestType.SIDE, 110, 40, 30, false, false, false,
                                QuestStatus.ACTIVE, "account_balance_wallet", "Financial ledger",
                                List.of("Audit and cancel unused recurring subscriptions",
                                                "Log monthly net worth progression chart in spreadsheet"),
                                List.of(false, false));

                seedQuestItem("quest-dcf-valuation", user, fin, "Analyze Tech Balance Sheet & DCF Valuation",
                                "Construct 3-statement discounted cash flow model estimating enterprise intrinsic value.",
                                "Finance", "Hard", QuestType.MAIN, 260, 90, 75, false, true, false,
                                QuestStatus.ACTIVE, "query_stats", "10-K filings and Excel model",
                                List.of("Extract 5-year free cash flow history from SEC Edgar",
                                                "Model WACC discount rate and terminal growth sensitivity",
                                                "Draft 1-page investment thesis"),
                                List.of(false, false, false));

                // --- PRODUCTIVITY & DEEP WORK ---
                seedQuestItem("quest-deepwork-sprint", user, prod, "4-Hour Monotasking Deep Work Sprint",
                                "Execute four 50-minute blocks of uninterrupted cognitive deep work with phone on airplane mode.",
                                "Productivity", "Hard", QuestType.DAILY, 200, 75, 240, false, true, true,
                                QuestStatus.ACTIVE, "bolt", "Zero notifications during work blocks",
                                List.of("Block 1: High-priority core technical architecture",
                                                "Block 2: Code implementation & unit test writing",
                                                "Block 3: Refactoring and documentation synthesis",
                                                "Block 4: Code review & deployment check"),
                                List.of(true, false, false, false));

                seedQuestItem("quest-weekly-eisenhower", user, prod, "Weekly Review & Eisenhower Matrix Calibration",
                                "Triage inbox, review open commitments, plan upcoming week's top 3 strategic levers.",
                                "Productivity", "Medium", QuestType.SIDE, 130, 45, 45, false, false, false,
                                QuestStatus.ACTIVE, "checklist", "Weekly calendar & task manager",
                                List.of("Process email and Slack inboxes to zero",
                                                "Map tasks to Urgent vs Important Eisenhower matrix",
                                                "Schedule calendar timeblocks for top 3 weekly goals"),
                                List.of(false, false, false));

                // --- CREATIVITY & DESIGN ---
                seedQuestItem("quest-design-tokens", user, creat, "UI/UX Design System Component Tokens in Figma",
                                "Build scalable color tokens, typography scales, glassmorphism cards, and interactive buttons.",
                                "Creativity", "Medium", QuestType.SIDE, 170, 60, 50, false, true, false,
                                QuestStatus.ACTIVE, "palette", "Figma design file",
                                List.of("Define semantic color palette with dark/light variants",
                                                "Construct button component with hover, active, disabled states",
                                                "Export CSS design tokens and variables"),
                                List.of(true, false, false));

                seedQuestItem("quest-synth-progression", user, creat, "Compose Electronic Synth Progression in DAW",
                                "Design custom analog synth patches and arrange 16-bar melodic cyberpunk chord progression.",
                                "Creativity", "Medium", QuestType.SIDE, 150, 50, 60, false, false, false,
                                QuestStatus.ACTIVE, "music_note", "Ableton Live / Logic Pro / FL Studio",
                                List.of("Sound design bass and lead synth presets",
                                                "Compose 16-bar melodic chord progression",
                                                "Render audio mixdown sample"),
                                List.of(false, false, false));

                // --- NUTRITION & HEALTH ---
                seedQuestItem("quest-intermittent-fasting", user, nutr, "16:8 Intermittent Fasting & Micronutrient Log",
                                "Complete 16 hours of clean fasting and hit 180g dietary protein target.",
                                "Nutrition", "Easy", QuestType.DAILY, 85, 30, 10, false, false, true,
                                QuestStatus.ACTIVE, "restaurant", "Food logging tracker",
                                List.of("16-hour clean water/black coffee fast window",
                                                "Log daily micronutrients and reach protein goal"),
                                List.of(false, false));

                seedQuestItem("quest-meal-prep-macro", user, nutr, "High-Protein Macro Meal Prep Protocol (5 Days)",
                                "Prepare 5 balanced lunches with whole foods, complex carbs, and lean protein sources.",
                                "Nutrition", "Medium", QuestType.SIDE, 160, 55, 90, false, false, false,
                                QuestStatus.ACTIVE, "soup_kitchen", "Groceries and meal containers",
                                List.of("Cook 1.5kg lean protein source",
                                                "Roast fibrous greens and complex carbs",
                                                "Portion and vacuum-seal 5 meal prep containers"),
                                List.of(false, false, false));

                // --- RESILIENCE & STOICISM ---
                seedQuestItem("quest-stoic-journal", user, res, "Marcus Aurelius Stoic Journaling & Retrospective",
                                "Evening journaling prompt: Dichotomy of control, gratitude, and moral inventory.",
                                "Resilience", "Easy", QuestType.DAILY, 75, 25, 15, false, false, true,
                                QuestStatus.ACTIVE, "edit_note", "Physical journal",
                                List.of("Write 3 things outside of control that were released",
                                                "Write 3 intentional actions taken with virtue"),
                                List.of(false, false));

                // --- SOCIAL & LEADERSHIP ---
                seedQuestItem("quest-public-speaking", user, soc, "Executive Presentation & Impromptu Speaking Drills",
                                "Record 5-minute technical presentation with zero filler words and persuasive structure.",
                                "Social", "Medium", QuestType.SIDE, 150, 50, 30, false, true, false,
                                QuestStatus.ACTIVE, "record_voice_over", "Video camera or voice memo",
                                List.of("Draft speech outline using Problem-Action-Result format",
                                                "Record 5-minute delivery on camera",
                                                "Review recording and analyze pacing and cadence"),
                                List.of(false, false, false));

                seedQuestItem("quest-tech-mentorship", user, soc, "Mentor Junior Developer & Conduct Mock Interview",
                                "Provide 45 minutes of pair programming guidance and constructive code review feedback.",
                                "Social", "Medium", QuestType.SIDE, 160, 55, 45, false, false, false,
                                QuestStatus.ACTIVE, "school", "Video call & GitHub PR",
                                List.of("Conduct 45-minute live pair programming session",
                                                "Deliver 3 actionable code quality recommendations"),
                                List.of(false, false));

                // --- CAREER & ARCHITECTURE ---
                seedQuestItem("quest-career-roadmap", user, car, "Staff Engineer Promotion Dossier & Impact Matrix",
                                "Map technical leadership contributions, multi-team business impact, and strategic initiatives.",
                                "Career", "Hard", QuestType.MAIN, 300, 100, 60, false, true, false,
                                QuestStatus.ACTIVE, "workspace_premium", "Engineering rubrics",
                                List.of("Synthesize 6-month cross-functional project impact metrics",
                                                "Document architecture decision records (ADRs) delivered",
                                                "Review growth trajectory with principal mentor"),
                                List.of(false, false, false));

                // --- SLEEP & RECOVERY ---
                seedQuestItem("quest-sleep-hygiene", user, sleep, "Digital Sunset & Circadian Alignment Protocol",
                                "No blue light screens 60 minutes before bed; maintain 68°F bedroom temperature.",
                                "Sleep", "Easy", QuestType.DAILY, 80, 25, 10, false, false, true,
                                QuestStatus.ACTIVE, "bedtime", "Sleep tracker",
                                List.of("Screens off 60 minutes before sleep",
                                                "Achieve 8+ hours restorative sleep tracked"),
                                List.of(false, false));
        }

        private void seedQuestItem(String id, User user, Domain domain, String title, String desc,
                        String domainName, String difficulty, QuestType type, int xp,
                        int gold, int duration, boolean featured, boolean recommended,
                        boolean daily, QuestStatus status, String icon, String reqs,
                        List<String> milestones, List<Boolean> milestonesDone) {
                if (questRepository.existsById(id)) {
                        return;
                }
                Quest q = createQuest(id, user, domain, title, desc, domainName, difficulty,
                                type, xp, gold, duration, featured, recommended, daily, status, icon);
                if (reqs != null) {
                        q.setRequirements(reqs);
                }
                if (status == QuestStatus.COMPLETED) {
                        q.setCompletedAt(LocalDateTime.now().minusHours(2));
                }
                Quest saved = questRepository.save(q);

                if (milestones != null && !milestones.isEmpty()) {
                        List<QuestMilestone> msList = new ArrayList<>();
                        for (int i = 0; i < milestones.size(); i++) {
                                boolean done = i < milestonesDone.size() && milestonesDone.get(i);
                                msList.add(new QuestMilestone(saved, id + "-ms-" + (i + 1), milestones.get(i), done));
                        }
                        milestoneRepository.saveAll(msList);
                }
        }

        private Quest createQuest(String id, User user, Domain domain, String title, String desc,
                        String domainName, String difficulty, QuestType type, int xp,
                        int gold, int duration, boolean featured, boolean recommended,
                        boolean daily, QuestStatus status, String icon) {
                Quest q = new Quest();
                q.setId(id);
                q.setUser(user);
                q.setDomain(domain);
                q.setTitle(title);
                q.setDescription(desc);
                q.setDomainName(domainName);
                q.setDifficulty(difficulty);
                q.setQuestType(type);
                q.setXpReward(xp);
                q.setGoldReward(gold);
                q.setTimeRemaining(duration + "m");
                q.setFeatured(featured);
                q.setRecommended(recommended);
                q.setDaily(daily);
                q.setStatus(status);
                q.setIcon(icon);
                return q;
        }

        private void seedUserAchievements(User user) {
                List<String> unlockedIds = List.of(
                                "first-quest", "quest-marathon", "coding-streak-14", "novice-ascendant",
                                "veteran-adventurer", "strength-lvl-8", "first-fortune");

                for (String id : unlockedIds) {
                        achievementRepository.findById(id).ifPresent(a -> {
                                UserAchievement ua = new UserAchievement(user, a, a.getTarget(), true,
                                                LocalDateTime.now().minusDays(2));
                                userAchievementRepository.save(ua);
                        });
                }
        }

        private void seedDailyMissionProgress(User user) {
                LocalDate today = LocalDate.now();

                // Complete 3 Quests: 2/3
                dailyMissionRepository.findById("complete-daily-3").ifPresent(m -> dailyMissionProgressRepository
                                .save(new DailyMissionProgress(user, m, today, 2, false, false)));

                // XP Surge: 170/200
                dailyMissionRepository.findById("xp-surge").ifPresent(m -> dailyMissionProgressRepository
                                .save(new DailyMissionProgress(user, m, today, 170, false, false)));

                // Domain Diversifier: 2/2 completed!
                dailyMissionRepository.findById("domain-diversifier").ifPresent(m -> dailyMissionProgressRepository
                                .save(new DailyMissionProgress(user, m, today, 2, true, false)));

                // Morning Momentum: 1/1 completed & claimed
                dailyMissionRepository.findById("morning-momentum").ifPresent(m -> {
                        DailyMissionProgress p = new DailyMissionProgress(user, m, today, 1, true, true);
                        p.setCompletedAt(LocalDateTime.now().minusHours(4));
                        dailyMissionProgressRepository.save(p);
                });
        }

        private void seedNotifications(User user) {
                notificationRepository.save(new Notification(
                                "notif-lvl12", user, NotificationType.level_up,
                                "Ascended to Level 12!",
                                "You have reached Level 12 (Cyber Nomad). All attributes bolstered.",
                                "military_tech", "text-primary bg-primary-fixed", "/character", "View Character"));
                notificationRepository.save(new Notification(
                                "notif-streak18", user, NotificationType.streak_maintained,
                                "18-Day Streak Active!", "You are 12 days away from the Streak Vanguard medal.",
                                "whatshot", "text-secondary bg-secondary-fixed", "/analytics", "View Streak"));
                notificationRepository.save(new Notification(
                                "notif-daily-ready", user, NotificationType.daily_mission_completed,
                                "Daily Mission Ready to Claim!",
                                "'Domain Diversifier' completed. Claim your +120 XP & +40 Gold.",
                                "category", "text-tertiary bg-tertiary-fixed", "/daily-missions", "Claim Reward"));
        }
}
