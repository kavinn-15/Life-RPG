package com.liferpg.controller;

import com.liferpg.dto.common.ApiResponse;
import com.liferpg.dto.guild.*;
import com.liferpg.security.UserPrincipal;
import com.liferpg.service.GuildService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/guilds")
@Tag(name = "Guilds & Expeditions", description = "Guild formation, expeditions, tavern chat, and player syndicates")
public class GuildController {

    private final GuildService guildService;
    private final com.liferpg.repository.UserRepository userRepository;

    public GuildController(GuildService guildService, com.liferpg.repository.UserRepository userRepository) {
        this.guildService = guildService;
        this.userRepository = userRepository;
    }

    private Long resolveUserId(UserPrincipal principal) {
        if (principal != null) {
            return principal.getId();
        }
        return userRepository.findAll().stream().findFirst().map(com.liferpg.entity.User::getId).orElse(1L);
    }

    @GetMapping
    @Operation(summary = "Get all guilds with optional search and domain filter")
    public ResponseEntity<ApiResponse<List<GuildResponseDTO>>> getAllGuilds(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "domain", required = false) String domain,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = resolveUserId(principal);
        List<GuildResponseDTO> guilds = guildService.getAllGuilds(search, domain, userId);
        return ResponseEntity.ok(ApiResponse.ok("Guild directory retrieved", guilds));
    }

    @GetMapping("/my-guild")
    @Operation(summary = "Get current authenticated user's guild details, members, and tavern messages")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyGuild(
            @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = resolveUserId(principal);
        Map<String, Object> data = guildService.getUserGuildData(userId);
        return ResponseEntity.ok(ApiResponse.ok("User guild status retrieved", data));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get guild details by ID")
    public ResponseEntity<ApiResponse<GuildResponseDTO>> getGuildById(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal != null ? principal.getId() : null;
        GuildResponseDTO dto = guildService.getGuildById(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Guild details retrieved", dto));
    }

    @PostMapping
    @Operation(summary = "Forge a new guild")
    public ResponseEntity<ApiResponse<GuildResponseDTO>> createGuild(
            @Valid @RequestBody CreateGuildRequestDTO request,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = resolveUserId(principal);
        GuildResponseDTO created = guildService.createGuild(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("Guild successfully forged!", created));
    }

    @PostMapping("/{id}/join")
    @Operation(summary = "Join a guild")
    public ResponseEntity<ApiResponse<GuildResponseDTO>> joinGuild(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = resolveUserId(principal);
        GuildResponseDTO joined = guildService.joinGuild(userId, id);
        return ResponseEntity.ok(ApiResponse.ok("Joined guild successfully!", joined));
    }

    @PostMapping("/{id}/leave")
    @Operation(summary = "Leave a guild")
    public ResponseEntity<ApiResponse<Map<String, String>>> leaveGuild(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = resolveUserId(principal);
        guildService.leaveGuild(userId, id);
        return ResponseEntity.ok(ApiResponse.ok("Departed from guild.", Map.of("status", "LEFT")));
    }

    @GetMapping("/{id}/members")
    @Operation(summary = "Get all members of a guild")
    public ResponseEntity<ApiResponse<List<GuildMemberDTO>>> getGuildMembers(@PathVariable("id") Long id) {
        List<GuildMemberDTO> members = guildService.getGuildMembers(id);
        return ResponseEntity.ok(ApiResponse.ok("Guild members retrieved", members));
    }

    @GetMapping("/{id}/messages")
    @Operation(summary = "Get tavern chat messages for a guild")
    public ResponseEntity<ApiResponse<List<GuildMessageDTO>>> getGuildMessages(@PathVariable("id") Long id) {
        List<GuildMessageDTO> messages = guildService.getGuildMessages(id);
        return ResponseEntity.ok(ApiResponse.ok("Tavern messages retrieved", messages));
    }

    @PostMapping("/{id}/messages")
    @Operation(summary = "Post a message in the guild tavern chat")
    public ResponseEntity<ApiResponse<GuildMessageDTO>> postGuildMessage(
            @PathVariable("id") Long id,
            @Valid @RequestBody PostGuildMessageRequestDTO request,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = resolveUserId(principal);
        GuildMessageDTO posted = guildService.postGuildMessage(userId, id, request);
        return ResponseEntity.ok(ApiResponse.ok("Message broadcasted to tavern.", posted));
    }

    @PostMapping("/{id}/contribute")
    @Operation(summary = "Contribute quest XP to guild weekly raid")
    public ResponseEntity<ApiResponse<Map<String, Object>>> contributeRaidXp(
            @PathVariable("id") Long id,
            @Valid @RequestBody ContributeGuildXpRequestDTO request,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = resolveUserId(principal);
        Map<String, Object> result = guildService.contributeRaidXp(userId, id, request.getXpAmount());
        return ResponseEntity.ok(ApiResponse.ok("Raid XP contribution logged!", result));
    }
}
