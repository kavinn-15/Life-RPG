package com.liferpg.controller;

import com.liferpg.dto.common.ApiResponse;
import com.liferpg.dto.mission.DailyMissionResponseDTO;
import com.liferpg.security.UserPrincipal;
import com.liferpg.service.DailyMissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Daily Missions", description = "Daily mission tracking and reward claim endpoints")
public class DailyMissionController {

    private final DailyMissionService dailyMissionService;

    public DailyMissionController(DailyMissionService dailyMissionService) {
        this.dailyMissionService = dailyMissionService;
    }

    @GetMapping({"/api/missions/daily", "/api/daily-missions"})
    @Operation(summary = "Get current daily missions and progress")
    public ResponseEntity<ApiResponse<List<DailyMissionResponseDTO>>> getDailyMissions(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<DailyMissionResponseDTO> missions = dailyMissionService.getDailyMissions(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Daily missions retrieved successfully", missions));
    }

    @PostMapping({"/api/missions/daily/{id}/claim", "/api/daily-missions/{id}/claim"})
    @Operation(summary = "Claim daily mission reward")
    public ResponseEntity<ApiResponse<DailyMissionResponseDTO>> claimMission(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        DailyMissionResponseDTO claimed = dailyMissionService.claimMission(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Mission reward claimed successfully", claimed));
    }
}
