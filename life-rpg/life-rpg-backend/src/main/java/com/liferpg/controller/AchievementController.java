package com.liferpg.controller;

import com.liferpg.dto.achievement.AchievementResponseDTO;
import com.liferpg.dto.common.ApiResponse;
import com.liferpg.security.UserPrincipal;
import com.liferpg.service.AchievementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@Tag(name = "Achievements", description = "Achievement tracking, progression, and unlock endpoints")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping
    @Operation(summary = "Get all achievements with unlock status for the authenticated user")
    public ResponseEntity<ApiResponse<List<AchievementResponseDTO>>> getAchievements(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<AchievementResponseDTO> achievements = achievementService.getUserAchievements(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Achievements retrieved successfully", achievements));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single achievement details by ID")
    public ResponseEntity<ApiResponse<AchievementResponseDTO>> getAchievementById(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        AchievementResponseDTO achievement = achievementService.getAchievementById(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Achievement retrieved successfully", achievement));
    }

    @PostMapping("/{id}/unlock")
    @Operation(summary = "Simulate unlocking an achievement (dev/demo trigger)")
    public ResponseEntity<ApiResponse<AchievementResponseDTO>> unlockAchievement(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        AchievementResponseDTO unlocked = achievementService.simulateUnlock(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Achievement unlocked successfully", unlocked));
    }

    @PostMapping("/{id}/claim")
    @Operation(summary = "Claim an unlocked achievement and grant its rewards")
    public ResponseEntity<ApiResponse<AchievementResponseDTO>> claimAchievement(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        AchievementResponseDTO claimed = achievementService.claimAchievement(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Achievement claimed successfully", claimed));
    }
}
