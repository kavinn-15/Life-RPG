package com.liferpg.controller;

import com.liferpg.dto.common.ApiResponse;
import com.liferpg.dto.user.LeaderboardEntryDTO;
import com.liferpg.service.LeaderboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@Tag(name = "Leaderboard", description = "Global Vanguard ranking and character standings")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    @Operation(summary = "Get global leaderboard rankings")
    public ResponseEntity<ApiResponse<List<LeaderboardEntryDTO>>> getLeaderboard() {
        List<LeaderboardEntryDTO> leaderboard = leaderboardService.getLeaderboard();
        return ResponseEntity.ok(ApiResponse.ok("Leaderboard retrieved successfully", leaderboard));
    }
}
