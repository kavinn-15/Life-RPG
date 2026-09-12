package com.liferpg.service;

import com.liferpg.dto.achievement.AchievementResponseDTO;
import com.liferpg.dto.domain.DomainQuestDTO;
import com.liferpg.dto.domain.DomainResponseDTO;
import com.liferpg.dto.domain.DomainStatsDTO;
import com.liferpg.entity.Domain;
import com.liferpg.entity.UserDomain;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.DomainRepository;
import com.liferpg.repository.UserDomainRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DomainService {

    private final DomainRepository domainRepository;
    private final UserDomainRepository userDomainRepository;
    private final AchievementService achievementService;

    public DomainService(DomainRepository domainRepository,
                         UserDomainRepository userDomainRepository,
                         AchievementService achievementService) {
        this.domainRepository = domainRepository;
        this.userDomainRepository = userDomainRepository;
        this.achievementService = achievementService;
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
