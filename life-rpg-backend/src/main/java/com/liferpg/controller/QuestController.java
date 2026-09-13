package com.liferpg.controller;

import com.liferpg.dto.common.ApiResponse;
import com.liferpg.dto.quest.*;
import com.liferpg.security.UserPrincipal;
import com.liferpg.service.LeaderboardService;
import com.liferpg.service.QuestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quests")
@Tag(name = "Quests", description = "Quest board, mission creation, milestone tracking, and reward completion engine")
public class QuestController {

    private final QuestService questService;
    private final LeaderboardService leaderboardService;

    public QuestController(QuestService questService,
                           LeaderboardService leaderboardService) {
        this.questService = questService;
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    @Operation(summary = "Get all quests or section-specific quest board")
    public ResponseEntity<ApiResponse<Object>> getQuests(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam(required = false) String section) {
        Long userId = principal.getId();

        if ("continue".equalsIgnoreCase(section)) {
            return ResponseEntity.ok(ApiResponse.ok(questService.getContinueQuests(userId)));
        }
        if ("recommended".equalsIgnoreCase(section)) {
            return ResponseEntity.ok(ApiResponse.ok(questService.getRecommendedQuests(userId)));
        }
        if ("daily".equalsIgnoreCase(section)) {
            return ResponseEntity.ok(ApiResponse.ok(questService.getDailyQuests(userId)));
        }

        // Composite response for Adventure Page and general quest board
        Map<String, Object> composite = new HashMap<>();
        composite.put("allQuests", questService.getAllQuests(userId));
        composite.put("featuredQuest", questService.getFeaturedQuest(userId));
        composite.put("continueQuests", questService.getContinueQuests(userId));
        composite.put("recommendedQuests", questService.getRecommendedQuests(userId));
        composite.put("dailyQuests", questService.getDailyQuests(userId));
        composite.put("activeQuestQueue", questService.getActiveQuests(userId));
        composite.put("leaderboard", leaderboardService.getLeaderboard());

        return ResponseEntity.ok(ApiResponse.ok(composite));
    }

    @GetMapping("/active")
    @Operation(summary = "Get player active quest queue")
    public ResponseEntity<ApiResponse<List<QuestResponseDTO>>> getActiveQuests(@AuthenticationPrincipal UserPrincipal principal) {
        List<QuestResponseDTO> active = questService.getActiveQuests(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(active));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get current cycle featured heroic quest")
    public ResponseEntity<ApiResponse<QuestResponseDTO>> getFeaturedQuest(@AuthenticationPrincipal UserPrincipal principal) {
        QuestResponseDTO featured = questService.getFeaturedQuest(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(featured));
    }

    @GetMapping("/recommended")
    @Operation(summary = "Get recommended quests tailored to attributes")
    public ResponseEntity<ApiResponse<List<QuestResponseDTO>>> getRecommendedQuests(@AuthenticationPrincipal UserPrincipal principal) {
        List<QuestResponseDTO> recommended = questService.getRecommendedQuests(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(recommended));
    }

    @GetMapping("/daily")
    @Operation(summary = "Get today's daily quests")
    public ResponseEntity<ApiResponse<List<QuestResponseDTO>>> getDailyQuests(@AuthenticationPrincipal UserPrincipal principal) {
        List<QuestResponseDTO> daily = questService.getDailyQuests(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(daily));
    }

    @PatchMapping("/daily/{id}")
    @Operation(summary = "Toggle daily quest completion")
    public ResponseEntity<ApiResponse<QuestResponseDTO>> toggleDailyQuest(@AuthenticationPrincipal UserPrincipal principal,
                                                                         @PathVariable String id) {
        QuestResponseDTO toggled = questService.toggleDailyQuest(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(toggled));
    }

    @GetMapping("/search")
    @Operation(summary = "Search quests by title, description, or domain")
    public ResponseEntity<ApiResponse<List<QuestResponseDTO>>> searchQuests(@AuthenticationPrincipal UserPrincipal principal,
                                                                            @RequestParam(defaultValue = "") String query) {
        List<QuestResponseDTO> results = questService.searchQuests(principal.getId(), query);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed quest intel by id")
    public ResponseEntity<ApiResponse<QuestResponseDTO>> getQuestById(@AuthenticationPrincipal UserPrincipal principal,
                                                                      @PathVariable String id) {
        QuestResponseDTO quest = questService.getQuestById(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(quest));
    }

    @PostMapping
    @Operation(summary = "Forge a new custom quest")
    public ResponseEntity<ApiResponse<QuestResponseDTO>> createQuest(@AuthenticationPrincipal UserPrincipal principal,
                                                                     @Valid @RequestBody QuestCreateRequestDTO req) {
        QuestResponseDTO created = questService.createQuest(principal.getId(), req);
        return ResponseEntity.ok(ApiResponse.ok(created));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update quest properties")
    public ResponseEntity<ApiResponse<QuestResponseDTO>> updateQuest(@AuthenticationPrincipal UserPrincipal principal,
                                                                     @PathVariable String id,
                                                                     @RequestBody QuestUpdateRequestDTO req) {
        QuestResponseDTO updated = questService.updateQuest(principal.getId(), id, req);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Abandon or delete a quest from active queue")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteQuest(@AuthenticationPrincipal UserPrincipal principal,
                                                                        @PathVariable String id) {
        questService.deleteQuest(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("success", true, "id", id)));
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "Complete a quest and trigger atomic reward calculation engine")
    public ResponseEntity<ApiResponse<QuestCompletionResponseDTO>> completeQuest(@AuthenticationPrincipal UserPrincipal principal,
                                                                                 @PathVariable String id) {
        QuestCompletionResponseDTO response = questService.completeQuest(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{id}/fail")
    @Operation(summary = "Mark quest as failed")
    public ResponseEntity<ApiResponse<QuestResponseDTO>> failQuest(@AuthenticationPrincipal UserPrincipal principal,
                                                                   @PathVariable String id) {
        QuestUpdateRequestDTO req = new QuestUpdateRequestDTO();
        req.setStatus("FAILED");
        QuestResponseDTO updated = questService.updateQuest(principal.getId(), id, req);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @PatchMapping("/{id}/progress")
    @Operation(summary = "Update quest progress percentage")
    public ResponseEntity<ApiResponse<QuestResponseDTO>> updateProgress(@AuthenticationPrincipal UserPrincipal principal,
                                                                        @PathVariable String id,
                                                                        @RequestParam int progress) {
        QuestUpdateRequestDTO req = new QuestUpdateRequestDTO();
        req.setProgress(progress);
        QuestResponseDTO updated = questService.updateQuest(principal.getId(), id, req);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @RequestMapping(value = {"/{questId}/milestones/{milestoneId}/complete", "/{questId}/milestones/{milestoneId}"},
                    method = {RequestMethod.POST, RequestMethod.PATCH})
    @Operation(summary = "Toggle milestone node completion status")
    public ResponseEntity<ApiResponse<QuestResponseDTO>> toggleMilestone(@AuthenticationPrincipal UserPrincipal principal,
                                                                         @PathVariable String questId,
                                                                         @PathVariable String milestoneId) {
        QuestResponseDTO updated = questService.toggleMilestone(principal.getId(), questId, milestoneId);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }
}
