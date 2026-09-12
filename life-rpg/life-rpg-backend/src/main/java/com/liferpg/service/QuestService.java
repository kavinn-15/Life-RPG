package com.liferpg.service;

import com.liferpg.dto.quest.*;
import com.liferpg.entity.*;
import com.liferpg.enums.QuestStatus;
import com.liferpg.enums.QuestType;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.DomainRepository;
import com.liferpg.repository.QuestMilestoneRepository;
import com.liferpg.repository.QuestRepository;
import com.liferpg.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuestService {

    private final QuestRepository questRepository;
    private final QuestMilestoneRepository milestoneRepository;
    private final DomainRepository domainRepository;
    private final UserRepository userRepository;
    private final GameEngineService gameEngineService;

    public QuestService(QuestRepository questRepository,
                        QuestMilestoneRepository milestoneRepository,
                        DomainRepository domainRepository,
                        UserRepository userRepository,
                        GameEngineService gameEngineService) {
        this.questRepository = questRepository;
        this.milestoneRepository = milestoneRepository;
        this.domainRepository = domainRepository;
        this.userRepository = userRepository;
        this.gameEngineService = gameEngineService;
    }

    @Transactional(readOnly = true)
    public List<QuestResponseDTO> getActiveQuests(Long userId) {
        return questRepository.findByUserIdAndStatus(userId, QuestStatus.ACTIVE).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuestResponseDTO> getAllQuests(Long userId) {
        return questRepository.findByUserId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuestResponseDTO> getQuestsByDomain(Long userId, String domainId) {
        return questRepository.findByUserIdAndDomainId(userId, domainId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuestResponseDTO getFeaturedQuest(Long userId) {
        return questRepository.findByUserIdAndFeaturedTrue(userId).stream()
                .findFirst()
                .map(this::toDTO)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<QuestResponseDTO> getContinueQuests(Long userId) {
        return questRepository.findByUserIdAndStatus(userId, QuestStatus.ACTIVE).stream()
                .filter(q -> q.getProgressPercentage() > 0 && !q.isDaily())
                .limit(4)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuestResponseDTO> getRecommendedQuests(Long userId) {
        return questRepository.findByUserIdAndRecommendedTrue(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuestResponseDTO> getDailyQuests(Long userId) {
        return questRepository.findByUserIdAndDailyTrue(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public QuestResponseDTO toggleDailyQuest(Long userId, String id) {
        Quest quest = questRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Daily quest not found: " + id));

        boolean nowDone = quest.getStatus() != QuestStatus.COMPLETED;
        quest.setStatus(nowDone ? QuestStatus.COMPLETED : QuestStatus.ACTIVE);
        quest.setProgressPercentage(nowDone ? 100 : 0);
        quest.setCompletedAt(nowDone ? LocalDateTime.now() : null);
        questRepository.save(quest);

        return toDTO(quest);
    }

    @Transactional(readOnly = true)
    public QuestResponseDTO getQuestById(Long userId, String id) {
        Quest quest = questRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Quest not found: " + id));
        return toDTO(quest);
    }

    @Transactional
    public QuestResponseDTO createQuest(Long userId, QuestCreateRequestDTO req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        String id = "quest-" + UUID.randomUUID().toString().substring(0, 8);
        Domain domain = null;
        if (req.getDomainId() != null) {
            domain = domainRepository.findById(req.getDomainId()).orElse(null);
        } else if (req.getDomain() != null) {
            domain = domainRepository.findById(req.getDomain().toLowerCase().trim()).orElse(null);
        }

        String domainName = domain != null ? domain.getName() : (req.getDomain() != null ? req.getDomain() : "General");
        String domainClass = domain != null ? domain.getSoftClass() : "bg-surface-variant text-on-surface-variant";
        String diffClass = resolveDifficultyClass(req.getDifficulty());

        Quest quest = new Quest(
                id,
                user,
                domain,
                domainName,
                req.getTitle(),
                req.getDescription(),
                req.getDifficulty() != null ? req.getDifficulty() : "Medium",
                diffClass,
                QuestStatus.ACTIVE,
                req.isDaily() ? QuestType.DAILY : (req.isFeatured() ? QuestType.FEATURED : QuestType.NORMAL),
                req.getXp(),
                req.getGold(),
                req.getStatKey(),
                req.getStatAmount() * 10,
                req.getIcon() != null ? req.getIcon() : "deployed_code"
        );
        quest.setDomainClass(domainClass);
        quest.setStatLabel("+" + req.getStatAmount() + " " + (req.getStatKey() != null ? capitalize(req.getStatKey()) : "XP"));
        quest.setStatAmount(req.getStatAmount());
        quest.setDaily(req.isDaily());
        quest.setFeatured(req.isFeatured());
        quest.setRecommended(req.isRecommended());
        quest.setTimeRemaining(req.getTimeRemaining() != null ? req.getTimeRemaining() : "60m Session");

        if (req.getMilestones() != null) {
            int seq = 1;
            for (String label : req.getMilestones()) {
                if (label != null && !label.isBlank()) {
                    QuestMilestone m = new QuestMilestone("m-" + UUID.randomUUID().toString().substring(0, 8), quest, label, seq++, false);
                    quest.addMilestone(m);
                }
            }
        }

        questRepository.save(quest);
        return toDTO(quest);
    }

    @Transactional
    public QuestResponseDTO updateQuest(Long userId, String id, QuestUpdateRequestDTO req) {
        Quest quest = questRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Quest not found: " + id));

        if (req.getTitle() != null && !req.getTitle().isBlank()) quest.setTitle(req.getTitle());
        if (req.getDescription() != null) quest.setDescription(req.getDescription());
        if (req.getDifficulty() != null) {
            quest.setDifficulty(req.getDifficulty());
            quest.setDifficultyClass(resolveDifficultyClass(req.getDifficulty()));
        }
        if (req.getXp() != null) quest.setXpReward(req.getXp());
        if (req.getGold() != null) quest.setGoldReward(req.getGold());
        if (req.getStatKey() != null) quest.setAttributeKey(req.getStatKey());
        if (req.getStatAmount() != null) {
            quest.setStatAmount(req.getStatAmount());
            quest.setStatLabel("+" + req.getStatAmount() + " " + capitalize(quest.getAttributeKey() != null ? quest.getAttributeKey() : "XP"));
        }
        if (req.getTimeRemaining() != null) quest.setTimeRemaining(req.getTimeRemaining());
        if (req.getProgress() != null) quest.setProgressPercentage(req.getProgress());
        if (req.getStatus() != null) {
            try {
                quest.setStatus(QuestStatus.valueOf(req.getStatus().toUpperCase()));
            } catch (Exception ignored) {}
        }
        if (req.getDone() != null) {
            quest.setStatus(req.getDone() ? QuestStatus.COMPLETED : QuestStatus.ACTIVE);
        }

        questRepository.save(quest);
        return toDTO(quest);
    }

    @Transactional
    public void deleteQuest(Long userId, String id) {
        Quest quest = questRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Quest not found: " + id));
        questRepository.delete(quest);
    }

    @Transactional
    public QuestCompletionResponseDTO completeQuest(Long userId, String id) {
        return gameEngineService.processQuestCompletion(userId, id);
    }

    @Transactional
    public QuestResponseDTO toggleMilestone(Long userId, String questId, String milestoneId) {
        QuestMilestone milestone = milestoneRepository.findByIdAndQuestId(milestoneId, questId)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found: " + milestoneId));

        Quest quest = milestone.getQuest();
        if (!quest.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Quest not found: " + questId);
        }

        milestone.setCompleted(!milestone.isCompleted());
        milestone.setCompletedAt(milestone.isCompleted() ? LocalDateTime.now() : null);
        milestoneRepository.save(milestone);

        // Update quest progress percentage
        List<QuestMilestone> all = milestoneRepository.findByQuestIdOrderBySequenceNumberAsc(questId);
        long doneCount = all.stream().filter(QuestMilestone::isCompleted).count();
        int pct = all.isEmpty() ? 0 : (int) Math.round(((double) doneCount / all.size()) * 100.0);
        quest.setProgressPercentage(pct);
        questRepository.save(quest);

        return toDTO(quest);
    }

    @Transactional(readOnly = true)
    public List<QuestResponseDTO> searchQuests(Long userId, String query) {
        if (query == null || query.isBlank()) return getActiveQuests(userId);
        return questRepository.searchQuests(userId, query).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<QuestResponseDTO> filterQuests(Long userId, QuestStatus status, String domainId,
                                              String difficulty, QuestType questType, Pageable pageable) {
        return questRepository.findWithFilters(userId, status, domainId, difficulty, questType, pageable)
                .map(this::toDTO);
    }

    public QuestResponseDTO toDTO(Quest q) {
        QuestResponseDTO dto = new QuestResponseDTO();
        dto.setId(q.getId());
        dto.setTitle(q.getTitle());
        dto.setDescription(q.getDescription());
        dto.setDomain(q.getDomainName());
        dto.setDomainId(q.getDomain() != null ? q.getDomain().getId() : null);
        dto.setDomainClass(q.getDomainClass() != null ? q.getDomainClass() : "bg-surface-variant text-on-surface-variant");
        dto.setDifficulty(q.getDifficulty());
        dto.setDifficultyClass(q.getDifficultyClass());
        dto.setTimeRemaining(q.getTimeRemaining());
        dto.setIcon(q.getIcon());
        dto.setXp(q.getXpReward());
        dto.setGold(q.getGoldReward());
        dto.setStatLabel(q.getStatLabel());
        dto.setStatKey(q.getAttributeKey());
        dto.setStatAmount(q.getStatAmount());
        dto.setProgress(q.getProgressPercentage());
        dto.setProgressLabel(q.getProgressLabel());
        dto.setProgressClass(q.getProgressClass());
        dto.setMilestoneLabel(q.getMilestoneLabel());
        dto.setSprintPct(q.getProgressPercentage());
        dto.setFeatured(q.isFeatured());
        dto.setRecommended(q.isRecommended());
        dto.setDaily(q.isDaily());
        dto.setDone(q.getStatus() == QuestStatus.COMPLETED);
        dto.setStatus(q.getStatus().name());

        if (q.getMilestones() != null) {
            dto.setMilestones(q.getMilestones().stream().map(m -> new QuestMilestoneDTO(
                    m.getId(),
                    m.getLabel(),
                    m.isCompleted(),
                    m.getSequenceNumber()
            )).collect(Collectors.toList()));
        }
        return dto;
    }

    private String resolveDifficultyClass(String diff) {
        if (diff == null) return "bg-surface-variant text-on-surface-variant";
        String lower = diff.toLowerCase();
        if (lower.contains("epic")) return "bg-error-container text-on-error-container";
        if (lower.contains("hard")) return "bg-primary-container text-on-primary";
        if (lower.contains("medium")) return "bg-secondary-fixed text-on-secondary-fixed";
        if (lower.contains("habit")) return "bg-tertiary-fixed text-on-tertiary-fixed";
        return "bg-surface-variant text-on-surface-variant";
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return "";
        return java.lang.Character.toUpperCase(str.charAt(0)) + str.substring(1);
    }
}
