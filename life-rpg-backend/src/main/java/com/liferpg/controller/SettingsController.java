package com.liferpg.controller;

import com.liferpg.dto.common.ApiResponse;
import com.liferpg.dto.user.UserSettingsDTO;
import com.liferpg.security.UserPrincipal;
import com.liferpg.service.UserSettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@Tag(name = "Settings", description = "User preferences and system configuration")
public class SettingsController {

    private final UserSettingsService settingsService;

    public SettingsController(UserSettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    @Operation(summary = "Get settings for the authenticated user")
    public ResponseEntity<ApiResponse<UserSettingsDTO>> getSettings(
            @AuthenticationPrincipal UserPrincipal principal) {
        UserSettingsDTO settings = settingsService.getSettings(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Settings retrieved successfully", settings));
    }

    @RequestMapping(method = {RequestMethod.PATCH, RequestMethod.PUT})
    @Operation(summary = "Update settings for the authenticated user")
    public ResponseEntity<ApiResponse<UserSettingsDTO>> updateSettings(
            @RequestBody UserSettingsDTO req,
            @AuthenticationPrincipal UserPrincipal principal) {
        UserSettingsDTO updated = settingsService.updateSettings(principal.getId(), req);
        return ResponseEntity.ok(ApiResponse.ok("Settings updated successfully", updated));
    }
}
