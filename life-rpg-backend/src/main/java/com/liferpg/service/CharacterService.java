package com.liferpg.service;

import com.liferpg.dto.character.*;
import com.liferpg.entity.*;
import com.liferpg.entity.Character;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CharacterService {

    private final CharacterRepository characterRepository;
    private final AttributeRepository attributeRepository;
    private final EquippedRelicRepository relicRepository;
    private final ProofOfWorkRepository proofOfWorkRepository;
    private final LevelService levelService;
    private final AttributeService attributeService;
    private final NotificationService notificationService;

    public CharacterService(CharacterRepository characterRepository,
                            AttributeRepository attributeRepository,
                            EquippedRelicRepository relicRepository,
                            ProofOfWorkRepository proofOfWorkRepository,
                            LevelService levelService,
                            AttributeService attributeService,
                            NotificationService notificationService) {
        this.characterRepository = characterRepository;
        this.attributeRepository = attributeRepository;
        this.relicRepository = relicRepository;
        this.proofOfWorkRepository = proofOfWorkRepository;
        this.levelService = levelService;
        this.attributeService = attributeService;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public CharacterResponseDTO getCharacter(Long userId) {
        Character character = characterRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found for user: " + userId));

        List<AttributeResponseDTO> attributes = attributeRepository.findByUserId(userId).stream()
                .map(this::toAttributeDTO)
                .collect(Collectors.toList());

        return toCharacterDTO(character, attributes);
    }

    @Transactional
    public CharacterResponseDTO updateCharacter(Long userId, CharacterUpdateRequestDTO req) {
        Character character = characterRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found for user: " + userId));

        if (req.getPlayerName() != null && !req.getPlayerName().isBlank()) {
            character.setPlayerName(req.getPlayerName());
        }
        if (req.getTitle() != null && !req.getTitle().isBlank()) {
            character.setTitle(req.getTitle());
        }
        if (req.getCharacterClass() != null) {
            character.setCharacterClass(req.getCharacterClass());
        }
        if (req.getDailyGoal() != null) {
            character.setDailyGoal(req.getDailyGoal());
        }
        if (req.getPreferredDifficulty() != null) {
            character.setPreferredDifficulty(req.getPreferredDifficulty());
        }
        if (req.getMainObjective() != null) {
            character.setMainObjective(req.getMainObjective());
        }
        if (req.getAvatarClass() != null) {
            character.setAvatarClass(req.getAvatarClass());
        }
        if (req.getAvatarUrl() != null) {
            character.setAvatarUrl(req.getAvatarUrl());
        }

        characterRepository.save(character);
        return getCharacter(userId);
    }

    @Transactional(readOnly = true)
    public List<AttributeResponseDTO> getAttributes(Long userId) {
        return attributeRepository.findByUserId(userId).stream()
                .map(this::toAttributeDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AttributeResponseDTO updateAttribute(Long userId, String key, AttributeResponseDTO req) {
        Attribute attr = attributeRepository.findByUserIdAndAttributeKey(userId, key.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Attribute not found: " + key));

        if (req.getLevel() > 0) attr.setLevel(req.getLevel());
        if (req.getXp() >= 0) attr.setCurrentXp(req.getXp());
        if (req.getPct() >= 0) attr.setPercentage(req.getPct());

        attributeRepository.save(attr);
        return toAttributeDTO(attr);
    }

    @Transactional(readOnly = true)
    public List<RelicResponseDTO> getRelics(Long userId) {
        return relicRepository.findByUserId(userId).stream().map(r -> new RelicResponseDTO(
                r.getId(),
                r.getSlot(),
                r.getName(),
                r.getBonus(),
                r.getIcon()
        )).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProofOfWorkResponseDTO> getProofOfWork(Long userId) {
        return proofOfWorkRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(p -> new ProofOfWorkResponseDTO(
                p.getId(),
                p.getSource(),
                p.getDetail(),
                p.getReward(),
                p.getIcon(),
                p.isVerified()
        )).collect(Collectors.toList());
    }

    @Transactional
    public ProofOfWorkResponseDTO createProofOfWork(Long userId, ProofOfWorkResponseDTO req) {
        Character character = characterRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found for user: " + userId));

        ProofOfWork pow = new ProofOfWork(
                character.getUser(),
                req.getSource(),
                req.getDetail(),
                req.getReward(),
                req.getIcon() != null ? req.getIcon() : "directions_run",
                null,
                true
        );
        proofOfWorkRepository.save(pow);

        return new ProofOfWorkResponseDTO(pow.getId(), pow.getSource(), pow.getDetail(), pow.getReward(), pow.getIcon(), true);
    }

    @Transactional
    public CharacterResponseDTO simulateLevelUp(Long userId) {
        Character character = characterRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found for user: " + userId));

        User user = character.getUser();

        // Level up character
        int newLevel = character.getLevel() + 1;
        character.setLevel(newLevel);
        character.setCurrentXp(0);
        character.setTotalXp(character.getTotalXp() + levelService.getRequiredXpForLevel(newLevel - 1));

        // Bonus gold
        int bonusGold = 150;
        character.setGold(character.getGold() + bonusGold);
        characterRepository.save(character);

        // Ensure user has all attributes and award +60 XP to all 10 core attributes
        List<Attribute> attributes = attributeRepository.findByUserId(userId);
        if (attributes.isEmpty()) {
            attributeService.initializeDefaultAttributes(user);
            attributes = attributeRepository.findByUserId(userId);
        }
        for (Attribute attr : attributes) {
            attributeService.processAttributeXpGain(user, attr.getAttributeKey(), 60);
        }

        // Trigger level up notification
        notificationService.createNotification(
                user,
                com.liferpg.enums.NotificationType.level_up,
                "Ascended to Level " + newLevel + "!",
                "Simulated level up awakened new power! Level " + newLevel + " unlocked (+150 Gold & Stat Boost).",
                "military_tech",
                "text-secondary-container bg-secondary-fixed",
                "/character",
                "View Sheet"
        );

        return getCharacter(userId);
    }

    @Transactional(readOnly = true)
    public MilestoneResponseDTO getNextMilestone(Long userId) {
        Character character = characterRepository.findByUserId(userId).orElse(null);
        int lvl = character != null ? character.getLevel() : 1;
        int nextTarget = ((lvl / 5) + 1) * 5;
        int pct = (int) Math.min(100, Math.max(10, Math.round(((double) (lvl % 5) / 5.0) * 100.0)));
        return new MilestoneResponseDTO(
                "Ascendancy Tier " + ((lvl / 5) + 1) + " Mastery",
                "Advance core attributes and reach Level " + nextTarget + " to unlock elite archetype dual-specialization nodes.",
                pct
        );
    }

    @Transactional(readOnly = true)
    public List<RadarAxisDTO> getRadarAxes(Long userId) {
        return List.of(
                new RadarAxisDTO("coding", "CODING"),
                new RadarAxisDTO("strength", "STR"),
                new RadarAxisDTO("intelligence", "INTEL"),
                new RadarAxisDTO("discipline", "DISC"),
                new RadarAxisDTO("focus", "FOCUS"),
                new RadarAxisDTO("vitality", "VITALITY")
        );
    }

    public CharacterResponseDTO toCharacterDTO(Character c, List<AttributeResponseDTO> attributes) {
        long xpNeeded = levelService.getRequiredXpForLevel(c.getLevel());
        int xpPct = levelService.calculatePercentage(c.getCurrentXp(), c.getLevel());

        CharacterResponseDTO dto = new CharacterResponseDTO();
        dto.setId(c.getId());
        dto.setPlayerName(c.getPlayerName());
        dto.setTitle(c.getTitle());
        dto.setCharacterClass(c.getCharacterClass());
        dto.setLevel(c.getLevel());
        dto.setXp(c.getCurrentXp());
        dto.setTotalXp(c.getTotalXp());
        dto.setXpNeeded(xpNeeded);
        dto.setXpPct(xpPct);
        dto.setGold(c.getGold());
        dto.setStreak(c.getCurrentStreak());
        dto.setLongestStreak(c.getLongestStreak());
        dto.setQuestsCompletedToday(c.getQuestsCompletedToday());
        dto.setQuestsTotalToday(c.getQuestsTotalToday());
        dto.setDailyGoal(c.getDailyGoal());
        dto.setPreferredDifficulty(c.getPreferredDifficulty());
        dto.setMainObjective(c.getMainObjective());
        dto.setAvatarClass(c.getAvatarClass());
        dto.setAvatarUrl(c.getAvatarUrl());
        dto.setAttributes(attributes);
        return dto;
    }

    public AttributeResponseDTO toAttributeDTO(Attribute a) {
        return new AttributeResponseDTO(
                a.getAttributeKey(),
                a.getDisplayName(),
                a.getIcon(),
                a.getLevel(),
                a.getCurrentXp(),
                a.getTotalXp(),
                a.getWeeklyXp(),
                a.getNextThreshold(),
                a.getPercentage(),
                a.isStable(),
                a.isNeedQuest()
        );
    }
}
