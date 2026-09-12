package com.liferpg.controller;

import com.liferpg.dto.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "Application and system health check")
public class HealthController {

    @GetMapping
    @Operation(summary = "System health check and uptime status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.ok("System online and operational", Map.of(
                "status", "UP",
                "service", "Life RPG Production Backend",
                "timestamp", LocalDateTime.now(),
                "version", "1.0.0"
        )));
    }
}
