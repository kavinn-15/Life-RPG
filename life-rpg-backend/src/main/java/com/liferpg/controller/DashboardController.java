package com.liferpg.controller;

import com.liferpg.dto.character.CharacterResponseDTO;
import com.liferpg.dto.common.ApiResponse;
import com.liferpg.dto.notification.NotificationResponseDTO;
import com.liferpg.dto.quest.QuestResponseDTO;
import com.liferpg.dto.user.DashboardResponseDTO;
import com.liferpg.security.UserPrincipal;
import com.liferpg.service.CharacterService;
import com.liferpg.service.NotificationService;
import com.liferpg.service.QuestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Aggregated player adventure dashboard data")
public class DashboardController {

    private final CharacterService characterService;
    private final QuestService questService;
    private final NotificationService notificationService;

    public DashboardController(CharacterService characterService,
                               QuestService questService,
                               NotificationService notificationService) {
        this.characterService = characterService;
        this.questService = questService;
        this.notificationService = notificationService;
    }

    @GetMapping
    @Operation(summary = "Get aggregated dashboard data for the active player")
    public ResponseEntity<ApiResponse<DashboardResponseDTO>> getDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal.getId();
        CharacterResponseDTO character = characterService.getCharacter(userId);
        QuestResponseDTO featured = questService.getFeaturedQuest(userId);
        List<QuestResponseDTO> continueQuests = questService.getContinueQuests(userId);
        List<QuestResponseDTO> recommended = questService.getRecommendedQuests(userId);
        List<QuestResponseDTO> daily = questService.getDailyQuests(userId);
        List<NotificationResponseDTO> notifications = notificationService.getUserNotifications(userId);

        DashboardResponseDTO dto = new DashboardResponseDTO();
        dto.setCharacter(character);
        dto.setFeaturedQuest(featured);
        dto.setContinueQuests(continueQuests);
        dto.setRecommendedQuests(recommended);
        dto.setDailyQuests(daily);
        dto.setRecentNotifications(notifications.stream().limit(5).toList());
        dto.setStreak(character.getStreak());
        dto.setXp(character.getXp());
        dto.setXpNeeded(character.getXpNeeded());
        dto.setXpPct(character.getXpPct());
        dto.setGold(character.getGold());
        dto.setLevel(character.getLevel());

        return ResponseEntity.ok(ApiResponse.ok(dto));
    }
}
