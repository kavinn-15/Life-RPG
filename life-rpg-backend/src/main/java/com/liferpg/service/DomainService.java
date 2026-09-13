package com.liferpg.service;

import com.liferpg.dto.achievement.AchievementResponseDTO;
import com.liferpg.dto.domain.DomainResponseDTO;
import com.liferpg.dto.domain.DomainStatsDTO;
import com.liferpg.entity.Domain;
import com.liferpg.entity.UserDomain;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.DomainRepository;
import com.liferpg.repository.UserDomainRepository;
import com.liferpg.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DomainService {

    private final DomainRepository domainRepository;
    private final UserDomainRepository userDomainRepository;
    private final UserRepository userRepository;
    private final AchievementService achievementService;

    public DomainService(DomainRepository domainRepository,
                         UserDomainRepository userDomainRepository,
                         UserRepository userRepository,
                         AchievementService achievementService) {
        this.domainRepository = domainRepository;
        this.userDomainRepository = userDomainRepository;
        this.userRepository = userRepository;
        this.achievementService = achievementService;
    }

    @Transactional
    public DomainResponseDTO createDomain(Long userId, com.liferpg.dto.domain.DomainCreateRequestDTO req) {
        String baseId = req.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        if (baseId.isBlank()) {
            baseId = "domain-" + UUID.randomUUID().toString().substring(0, 8);
        }
        String id = baseId;
        int count = 1;
        while (domainRepository.existsById(id)) {
            id = baseId + "-" + (++count);
        }

        Domain d = new Domain();
        d.setId(id);
        d.setName(req.getName().trim());
        d.setTagline(req.getTagline() != null && !req.getTagline().isBlank() ? req.getTagline().trim() : req.getName().trim() + " Mastery");
        d.setDescription(req.getDescription() != null && !req.getDescription().isBlank() ? req.getDescription().trim() : "Custom skill realm for tracking " + req.getName().trim() + " progression.");
        d.setHeroImageUrl(req.getHeroImageUrl() != null && !req.getHeroImageUrl().isBlank()
                ? req.getHeroImageUrl()
                : "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80");
        d.setIcon(req.getIcon() != null && !req.getIcon().isBlank() ? req.getIcon() : "public");
        d.setAccent(req.getAccent() != null ? req.getAccent() : "#8c7ae6");
        d.setAccentClass("bg-primary-container text-on-primary");
        d.setChipClass("text-primary bg-primary-fixed");
        d.setSoftClass("bg-primary-fixed-dim/30");
        d.setDifficultyDefault(req.getDifficultyDefault() != null ? req.getDifficultyDefault() : "Medium");

        if (req.getPrimaryAttributes() != null && !req.getPrimaryAttributes().isEmpty()) {
            d.setPrimaryAttributes(String.join(", ", req.getPrimaryAttributes()));
        } else {
            d.setPrimaryAttributes("Wisdom, Focus");
        }

        d.setXpMin(req.getXpMin() > 0 ? req.getXpMin() : 50);
        d.setXpMax(req.getXpMax() > 0 ? req.getXpMax() : 200);
        d.setGoldMin(req.getGoldMin() > 0 ? req.getGoldMin() : 20);
        d.setGoldMax(req.getGoldMax() > 0 ? req.getGoldMax() : 60);
        d.setActive(true);

        domainRepository.save(d);

        // Link to creating user with Level 1
        UserDomain ud = null;
        if (userId != null) {
            com.liferpg.entity.User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                ud = new UserDomain(user, d, 0, 0L, 1, 0);
                userDomainRepository.save(ud);
            }
        }

        return toDTO(d, ud);
    }

    @Transactional(readOnly = true)
    public List<DomainResponseDTO> getAllDomains(Long userId) {
        List<Domain> domains = domainRepository.findByActiveTrue();
        Map<String, UserDomain> userDomainMap = userDomainRepository.findByUserId(userId)
                .stream()
                .collect(Collectors.toMap(ud -> ud.getDomain().getId(), ud -> ud, (a, b) -> a));

        return domains.stream()
                .map(d -> toDTO(d, userDomainMap.get(d.getId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DomainResponseDTO getDomainById(String id, Long userId) {
        Domain domain = domainRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Domain not found: " + id));

        UserDomain userDomain = userDomainRepository.findByUserIdAndDomainId(userId, id).orElse(null);
        return toDTO(domain, userDomain);
    }

    @Transactional(readOnly = true)
    public List<AchievementResponseDTO> getDomainAchievements(String domainId, Long userId) {
        Domain domain = domainRepository.findByIdAndActiveTrue(domainId)
                .orElseThrow(() -> new ResourceNotFoundException("Domain not found: " + domainId));

        return achievementService.getUserAchievements(userId).stream()
                .filter(a -> domain.getName().equalsIgnoreCase(a.getDomain()) || domainId.equalsIgnoreCase(a.getDomain()))
                .collect(Collectors.toList());
    }

    public DomainResponseDTO toDTO(Domain d, UserDomain ud) {
        DomainResponseDTO dto = new DomainResponseDTO();
        dto.setId(d.getId());
        dto.setName(d.getName());
        dto.setTagline(d.getTagline());
        dto.setDescription(d.getDescription());
        dto.setHeroImageUrl(d.getHeroImageUrl());
        dto.setIcon(d.getIcon());
        dto.setAccent(d.getAccent());
        dto.setAccentClass(d.getAccentClass());
        dto.setChipClass(d.getChipClass());
        dto.setSoftClass(d.getSoftClass());
        dto.setDifficultyDefault(d.getDifficultyDefault());

        if (d.getPrimaryAttributes() != null && !d.getPrimaryAttributes().isBlank()) {
            dto.setPrimaryAttribute(Arrays.stream(d.getPrimaryAttributes().split(","))
                    .map(String::trim)
                    .collect(Collectors.toList()));
        }

        dto.setXpRange(Map.of("min", d.getXpMin(), "max", d.getXpMax()));
        dto.setGoldRange(Map.of("min", d.getGoldMin(), "max", d.getGoldMax()));

        if (ud != null) {
            dto.setStats(new DomainStatsDTO(
                    ud.getQuestsCompleted(),
                    ud.getTotalXp(),
                    ud.getDomainLevel(),
                    ud.getStreak()
            ));
        } else {
            dto.setStats(new DomainStatsDTO(0, 0, 1, 0));
        }

        return dto;
    }
}
