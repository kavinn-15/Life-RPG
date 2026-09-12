package com.liferpg.controller;

import com.liferpg.dto.auth.*;
import com.liferpg.dto.common.ApiResponse;
import com.liferpg.security.UserPrincipal;
import com.liferpg.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User registration, login, logout, token session, and password reset APIs")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new adventurer profile")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> register(@Valid @RequestBody RegisterRequestDTO req) {
        AuthResponseDTO response = authService.register(req);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate with email and password")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@Valid @RequestBody LoginRequestDTO req) {
        AuthResponseDTO response = authService.login(req);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Invalidate current session")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> logout() {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("success", true)));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        UserResponseDTO user = authService.getCurrentUser(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @GetMapping("/check-email")
    @Operation(summary = "Check if an email is already registered")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkEmail(@RequestParam("email") String email) {
        boolean exists = authService.checkEmailExists(email);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("exists", exists, "available", !exists)));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<ApiResponse<Map<String, String>>> refresh(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("status", "Token is active")));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request 6-digit OTP verification code sent via Gmail for password reset")
    public ResponseEntity<ApiResponse<Map<String, String>>> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO req) {
        String msg = authService.sendForgotPasswordOtp(req.getEmail());
        return ResponseEntity.ok(ApiResponse.ok(msg, Map.of("email", req.getEmail())));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify received 6-digit OTP code")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyOtp(@Valid @RequestBody VerifyOtpRequestDTO req) {
        String msg = authService.verifyOtp(req.getEmail(), req.getOtp());
        return ResponseEntity.ok(ApiResponse.ok(msg, Map.of("email", req.getEmail(), "verified", true)));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using verified OTP code")
    public ResponseEntity<ApiResponse<Map<String, Object>>> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO req) {
        String msg = authService.resetPassword(req.getEmail(), req.getOtp(), req.getNewPassword());
        return ResponseEntity.ok(ApiResponse.ok(msg, Map.of("success", true)));
    }
}

