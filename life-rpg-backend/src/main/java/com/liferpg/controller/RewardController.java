package com.liferpg.controller;

import com.liferpg.dto.common.ApiResponse;
import com.liferpg.dto.reward.RewardResponseDTO;
import com.liferpg.security.UserPrincipal;
import com.liferpg.service.RewardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
@Tag(name = "Rewards & Store", description = "Store catalog and item purchase endpoints")
public class RewardController {

    private final RewardService rewardService;

    public RewardController(RewardService rewardService) {
        this.rewardService = rewardService;
    }

    @GetMapping
    @Operation(summary = "Get all store rewards with ownership/equipped status for user")
    public ResponseEntity<ApiResponse<List<RewardResponseDTO>>> getAllRewards(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<RewardResponseDTO> rewards = rewardService.getAllRewards(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Rewards retrieved successfully", rewards));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single reward details by ID")
    public ResponseEntity<ApiResponse<RewardResponseDTO>> getRewardById(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        RewardResponseDTO reward = rewardService.getRewardById(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Reward retrieved successfully", reward));
    }

    @PostMapping("/{id}/purchase")
    @Operation(summary = "Purchase a reward with Gold from character vault")
    public ResponseEntity<ApiResponse<RewardResponseDTO>> purchaseReward(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        RewardResponseDTO purchased = rewardService.purchaseReward(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Reward purchased successfully", purchased));
    }
}
