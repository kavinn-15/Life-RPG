package com.liferpg.controller;

import com.liferpg.dto.achievement.AchievementResponseDTO;
import com.liferpg.dto.common.ApiResponse;
import com.liferpg.dto.domain.DomainResponseDTO;
import com.liferpg.dto.quest.QuestResponseDTO;
import com.liferpg.security.UserPrincipal;
import com.liferpg.service.DomainService;
import com.liferpg.service.QuestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/domains")
@Tag(name = "Domains", description = "Domain progression, stats, and catalog endpoints")
public class DomainController {

    private final DomainService domainService;
    private final QuestService questService;

    public DomainController(DomainService domainService, QuestService questService) {
        this.domainService = domainService;
        this.questService = questService;
    }

    @GetMapping
    @Operation(summary = "Get all domains with user progression stats")
    public ResponseEntity<ApiResponse<List<DomainResponseDTO>>> getAllDomains(@AuthenticationPrincipal UserPrincipal principal) {
        List<DomainResponseDTO> domains = domainService.getAllDomains(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Domains retrieved successfully", domains));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get domain details by ID")
    public ResponseEntity<ApiResponse<DomainResponseDTO>> getDomainById(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        DomainResponseDTO domain = domainService.getDomainById(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Domain retrieved successfully", domain));
    }

    @GetMapping("/{id}/achievements")
    @Operation(summary = "Get achievements associated with a domain")
    public ResponseEntity<ApiResponse<List<AchievementResponseDTO>>> getDomainAchievements(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        List<AchievementResponseDTO> achievements = domainService.getDomainAchievements(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Domain achievements retrieved successfully", achievements));
    }

    @GetMapping("/{id}/quests")
    @Operation(summary = "Get quests associated with a domain")
    public ResponseEntity<ApiResponse<List<QuestResponseDTO>>> getDomainQuests(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        List<QuestResponseDTO> quests = questService.getQuestsByDomain(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Domain quests retrieved successfully", quests));
    }

    @PostMapping
    @Operation(summary = "Create a custom domain")
    public ResponseEntity<ApiResponse<DomainResponseDTO>> createDomain(
            @AuthenticationPrincipal UserPrincipal principal,
            @jakarta.validation.Valid @RequestBody com.liferpg.dto.domain.DomainCreateRequestDTO req) {
        DomainResponseDTO created = domainService.createDomain(principal != null ? principal.getId() : null, req);
        return ResponseEntity.ok(ApiResponse.ok("Custom domain forged successfully", created));
    }
}
