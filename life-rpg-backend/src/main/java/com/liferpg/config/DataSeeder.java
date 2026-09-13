package com.liferpg.config;

import com.liferpg.entity.*;
import com.liferpg.enums.*;
import com.liferpg.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
	private final AchievementRepository achievementRepository;
	private final UserAchievementRepository userAchievementRepository;
	private final DailyMissionRepository dailyMissionRepository;
	private final RewardRepository rewardRepository;
	private final InventoryItemRepository inventoryItemRepository;
	private final NotificationRepository notificationRepository;
	private final EquippedRelicRepository relicRepository;
	private final ProofOfWorkRepository proofOfWorkRepository;
	private final UserSettingsRepository settingsRepository;

	public DataSeeder(UserRepository userRepository,
			CharacterRepository characterRepository,
			AttributeRepository attributeRepository,
			DomainRepository domainRepository,
			UserDomainRepository userDomainRepository,
			QuestRepository questRepository,
			AchievementRepository achievementRepository,
			UserAchievementRepository userAchievementRepository,
			DailyMissionRepository dailyMissionRepository,
			RewardRepository rewardRepository,
			InventoryItemRepository inventoryItemRepository,
			NotificationRepository notificationRepository,
			EquippedRelicRepository relicRepository,
			ProofOfWorkRepository proofOfWorkRepository,
			UserSettingsRepository settingsRepository) {
		this.userRepository = userRepository;
		this.characterRepository = characterRepository;
		this.attributeRepository = attributeRepository;
		this.domainRepository = domainRepository;
		this.userDomainRepository = userDomainRepository;
		this.questRepository = questRepository;
		this.achievementRepository = achievementRepository;
		this.userAchievementRepository = userAchievementRepository;
		this.dailyMissionRepository = dailyMissionRepository;
		this.rewardRepository = rewardRepository;
		this.inventoryItemRepository = inventoryItemRepository;
		this.notificationRepository = notificationRepository;
		this.relicRepository = relicRepository;
		this.proofOfWorkRepository = proofOfWorkRepository;
		this.settingsRepository = settingsRepository;
	}

	@Override
	@Transactional
	public void run(String... args) {
		log.info("Starting Life RPG database seed check...");
		seedDomains();
		seedAchievements();
		seedDailyMissions();
		seedRewards();
		cleanupDemoUser();
		log.info("Life RPG database seed check complete!");
	}

	private void cleanupDemoUser() {
		// Purge any legacy demo or test account by email or username
		List<String> emailsToPurge = Arrays.asList("alex@liferpg.app", "alex.mercer@liferpg.app");
		for (String email : emailsToPurge) {
			userRepository.findByEmail(email).ifPresent(user -> {
				log.info("Purging demo account {}...", email);
				characterRepository.findByUserId(user.getId()).ifPresent(characterRepository::delete);
				settingsRepository.findByUserId(user.getId()).ifPresent(settingsRepository::delete);
				attributeRepository.deleteAll(attributeRepository.findByUserId(user.getId()));
				relicRepository.deleteAll(relicRepository.findByUserId(user.getId()));
				proofOfWorkRepository.deleteAll(proofOfWorkRepository.findByUserId(user.getId()));
				userDomainRepository.deleteAll(userDomainRepository.findByUserId(user.getId()));
				inventoryItemRepository.deleteAll(inventoryItemRepository.findByUserId(user.getId()));
				questRepository.deleteAll(questRepository.findByUserId(user.getId()));
				userAchievementRepository.deleteAll(userAchievementRepository.findByUserId(user.getId()));
				notificationRepository.deleteAll(notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
				userRepository.delete(user);
				log.info("Demo account {} successfully purged.", email);
			});
		}
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
}
