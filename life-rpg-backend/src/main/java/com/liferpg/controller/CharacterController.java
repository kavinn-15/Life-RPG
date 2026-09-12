package com.liferpg.controller;

import com.liferpg.dto.character.*;
import com.liferpg.dto.common.ApiResponse;
import com.liferpg.security.UserPrincipal;
import com.liferpg.service.CharacterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/character")
@Tag(name = "Character", description = "Player sheet, attributes, relics, and proof-of-work telemetry")
public class CharacterController {

    private final CharacterService characterService;

    public CharacterController(CharacterService characterService) {
        this.characterService = characterService;
    }

    @GetMapping
    @Operation(summary = "Get full character sheet and attributes")
    public ResponseEntity<ApiResponse<CharacterResponseDTO>> getCharacter(@AuthenticationPrincipal UserPrincipal principal) {
        CharacterResponseDTO response = characterService.getCharacter(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PatchMapping
    @Operation(summary = "Update character identity and archetype")
    public ResponseEntity<ApiResponse<CharacterResponseDTO>> updateCharacter(@AuthenticationPrincipal UserPrincipal principal,
                                                                             @RequestBody CharacterUpdateRequestDTO req) {
        CharacterResponseDTO response = characterService.updateCharacter(principal.getId(), req);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/simulate-level-up")
    @Operation(summary = "Simulate character level up and attribute progression")
    public ResponseEntity<ApiResponse<CharacterResponseDTO>> simulateLevelUp(@AuthenticationPrincipal UserPrincipal principal) {
        CharacterResponseDTO response = characterService.simulateLevelUp(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/attributes")
    @Operation(summary = "Get player core attributes matrix")
    public ResponseEntity<ApiResponse<List<AttributeResponseDTO>>> getAttributes(@AuthenticationPrincipal UserPrincipal principal) {
        List<AttributeResponseDTO> list = characterService.getAttributes(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PatchMapping("/attributes/{key}")
    @Operation(summary = "Update single attribute progression")
    public ResponseEntity<ApiResponse<AttributeResponseDTO>> updateAttribute(@AuthenticationPrincipal UserPrincipal principal,
                                                                             @PathVariable String key,
                                                                             @RequestBody AttributeResponseDTO req) {
        AttributeResponseDTO updated = characterService.updateAttribute(principal.getId(), key, req);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @GetMapping("/relics")
    @Operation(summary = "Get equipped relics and artifact bonuses")
    public ResponseEntity<ApiResponse<List<RelicResponseDTO>>> getRelics(@AuthenticationPrincipal UserPrincipal principal) {
        List<RelicResponseDTO> relics = characterService.getRelics(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(relics));
    }

    @GetMapping("/proof-of-work")
    @Operation(summary = "Get recent proof-of-work integrations feed")
    public ResponseEntity<ApiResponse<List<ProofOfWorkResponseDTO>>> getProofOfWork(@AuthenticationPrincipal UserPrincipal principal) {
        List<ProofOfWorkResponseDTO> pow = characterService.getProofOfWork(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(pow));
    }

    @PostMapping("/proof-of-work")
    @Operation(summary = "Log new proof-of-work activity")
    public ResponseEntity<ApiResponse<ProofOfWorkResponseDTO>> createProofOfWork(@AuthenticationPrincipal UserPrincipal principal,
                                                                                 @RequestBody ProofOfWorkResponseDTO req) {
        ProofOfWorkResponseDTO created = characterService.createProofOfWork(principal.getId(), req);
        return ResponseEntity.ok(ApiResponse.ok(created));
    }

    @GetMapping("/milestone")
    @Operation(summary = "Get next major character ascendancy milestone")
    public ResponseEntity<ApiResponse<MilestoneResponseDTO>> getNextMilestone(@AuthenticationPrincipal UserPrincipal principal) {
        MilestoneResponseDTO milestone = characterService.getNextMilestone(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(milestone));
    }

    @GetMapping("/radar-axes")
    @Operation(summary = "Get 5-axis radar chart configuration and data")
    public ResponseEntity<ApiResponse<List<RadarAxisDTO>>> getRadarAxes(@AuthenticationPrincipal UserPrincipal principal) {
        List<RadarAxisDTO> axes = characterService.getRadarAxes(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(axes));
    }
}
