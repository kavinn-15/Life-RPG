package com.liferpg.controller;

import com.liferpg.dto.character.CharacterResponseDTO;
import com.liferpg.dto.character.CharacterUpdateRequestDTO;
import com.liferpg.dto.common.ApiResponse;
import com.liferpg.security.UserPrincipal;
import com.liferpg.service.CharacterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/onboarding")
@Tag(name = "Onboarding", description = "New character initialization and onboarding endpoints")
public class OnboardingController {

    private final CharacterService characterService;

    public OnboardingController(CharacterService characterService) {
        this.characterService = characterService;
    }

    @PostMapping
    @Operation(summary = "Complete character onboarding genesis")
    public ResponseEntity<ApiResponse<CharacterResponseDTO>> completeOnboarding(
            @RequestBody CharacterUpdateRequestDTO request,
            @AuthenticationPrincipal UserPrincipal principal) {
        CharacterResponseDTO updated = characterService.updateCharacter(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Character onboarding completed successfully", updated));
    }
}
