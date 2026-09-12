package com.liferpg.controller;

import com.liferpg.dto.common.ApiResponse;
import com.liferpg.dto.reward.RewardResponseDTO;
import com.liferpg.security.UserPrincipal;
import com.liferpg.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@Tag(name = "Inventory", description = "User inventory, equipping and unequipping items")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    @Operation(summary = "Get user inventory")
    public ResponseEntity<ApiResponse<List<RewardResponseDTO>>> getUserInventory(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<RewardResponseDTO> inventory = inventoryService.getUserInventory(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Inventory retrieved successfully", inventory));
    }

    @PostMapping("/{id}/equip")
    @Operation(summary = "Equip an inventory item")
    public ResponseEntity<ApiResponse<RewardResponseDTO>> equipItem(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        RewardResponseDTO item = inventoryService.equipItem(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Item equipped successfully", item));
    }

    @PostMapping("/{id}/unequip")
    @Operation(summary = "Unequip an inventory item")
    public ResponseEntity<ApiResponse<RewardResponseDTO>> unequipItem(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        RewardResponseDTO item = inventoryService.unequipItem(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Item unequipped successfully", item));
    }
}
