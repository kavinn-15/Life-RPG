package com.liferpg.controller;

import com.liferpg.dto.common.ApiResponse;
import com.liferpg.dto.progress.ProgressHistoryResponseDTO;
import com.liferpg.dto.progress.ProgressHistoryResponseDTO.*;
import com.liferpg.security.UserPrincipal;
import com.liferpg.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@Tag(name = "Progress & Analytics", description = "Character analytics, charts, heatmaps, and streak history")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping({"", "/summary"})
    @Operation(summary = "Get progress summary and full analytics telemetry")
    public ResponseEntity<ApiResponse<ProgressHistoryResponseDTO>> getProgressSummary(
            @AuthenticationPrincipal UserPrincipal principal) {
        ProgressHistoryResponseDTO history = progressService.getProgressHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Progress summary retrieved successfully", history));
    }

    @GetMapping("/history")
    @Operation(summary = "Get full progress history and analytics")
    public ResponseEntity<ApiResponse<ProgressHistoryResponseDTO>> getProgressHistory(
            @AuthenticationPrincipal UserPrincipal principal) {
        ProgressHistoryResponseDTO history = progressService.getProgressHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Progress history retrieved successfully", history));
    }

    @GetMapping("/xp/weekly")
    @Operation(summary = "Get weekly XP progression history")
    public ResponseEntity<ApiResponse<List<WeeklyXpDTO>>> getWeeklyXp(
            @AuthenticationPrincipal UserPrincipal principal) {
        ProgressHistoryResponseDTO history = progressService.getProgressHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Weekly XP history retrieved", history.getWeeklyXpHistory()));
    }

    @GetMapping("/xp/monthly")
    @Operation(summary = "Get monthly XP progression history")
    public ResponseEntity<ApiResponse<List<MonthlyXpDTO>>> getMonthlyXp(
            @AuthenticationPrincipal UserPrincipal principal) {
        ProgressHistoryResponseDTO history = progressService.getProgressHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Monthly XP history retrieved", history.getMonthlyXpHistory()));
    }

    @GetMapping("/domains/top")
    @Operation(summary = "Get top domains ranked by XP")
    public ResponseEntity<ApiResponse<List<TopDomainDTO>>> getTopDomains(
            @AuthenticationPrincipal UserPrincipal principal) {
        ProgressHistoryResponseDTO history = progressService.getProgressHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Top domains retrieved", history.getTopDomainsByXp()));
    }

    @GetMapping("/attributes/growth")
    @Operation(summary = "Get attribute growth history")
    public ResponseEntity<ApiResponse<List<AttributeGrowthDTO>>> getAttributeGrowth(
            @AuthenticationPrincipal UserPrincipal principal) {
        ProgressHistoryResponseDTO history = progressService.getProgressHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Attribute growth retrieved", history.getAttributeGrowthHistory()));
    }

    @GetMapping("/productivity")
    @Operation(summary = "Get productivity heatmaps and day of week patterns")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductivity(
            @AuthenticationPrincipal UserPrincipal principal) {
        ProgressHistoryResponseDTO history = progressService.getProgressHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Productivity stats retrieved", Map.of(
                "heatmap", history.getProductiveDayHeatmap(),
                "dayOfWeekStats", history.getDayOfWeekStats()
        )));
    }

    @GetMapping("/completion-stats")
    @Operation(summary = "Get quest completion rates and counts")
    public ResponseEntity<ApiResponse<QuestCompletionStatsDTO>> getCompletionStats(
            @AuthenticationPrincipal UserPrincipal principal) {
        ProgressHistoryResponseDTO history = progressService.getProgressHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Quest completion stats retrieved", history.getQuestCompletionStats()));
    }

    @GetMapping("/streak")
    @Operation(summary = "Get streak history and calendar logs")
    public ResponseEntity<ApiResponse<StreakHistoryDTO>> getStreakHistory(
            @AuthenticationPrincipal UserPrincipal principal) {
        ProgressHistoryResponseDTO history = progressService.getProgressHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Streak history retrieved", history.getStreakHistory()));
    }

    @GetMapping("/streak/milestones")
    @Operation(summary = "Get streak milestones and unlocked badges")
    public ResponseEntity<ApiResponse<List<StreakMilestoneDTO>>> getStreakMilestones(
            @AuthenticationPrincipal UserPrincipal principal) {
        ProgressHistoryResponseDTO history = progressService.getProgressHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Streak milestones retrieved", history.getStreakMilestones()));
    }
}
