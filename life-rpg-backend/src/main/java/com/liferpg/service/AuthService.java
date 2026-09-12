package com.liferpg.service;

import com.liferpg.dto.auth.*;
import com.liferpg.entity.*;
import com.liferpg.entity.Character;
import com.liferpg.enums.QuestStatus;
import com.liferpg.enums.QuestType;
import com.liferpg.enums.UserRole;
import com.liferpg.exception.BadRequestException;
import com.liferpg.exception.DuplicateResourceException;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.*;
import com.liferpg.security.JwtService;
import com.liferpg.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CharacterRepository characterRepository;
    private final UserSettingsRepository settingsRepository;
    private final AttributeService attributeService;
    private final DomainRepository domainRepository;
    private final UserDomainRepository userDomainRepository;
    private final QuestRepository questRepository;
    private final PasswordResetOtpRepository passwordResetOtpRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       CharacterRepository characterRepository,
                       UserSettingsRepository settingsRepository,
                       AttributeService attributeService,
                       DomainRepository domainRepository,
                       UserDomainRepository userDomainRepository,
                       QuestRepository questRepository,
                       PasswordResetOtpRepository passwordResetOtpRepository,
                       EmailService emailService,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.characterRepository = characterRepository;
        this.settingsRepository = settingsRepository;
        this.attributeService = attributeService;
        this.domainRepository = domainRepository;
        this.userDomainRepository = userDomainRepository;
        this.questRepository = questRepository;
        this.passwordResetOtpRepository = passwordResetOtpRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO req) {
        if (userRepository.existsByEmail(req.getEmail().toLowerCase().trim())) {
            throw new DuplicateResourceException("An adventurer account with email " + req.getEmail() + " already exists.");
        }

        String encodedPassword = passwordEncoder.encode(req.getPassword());
        User user = new User(req.getName().trim(), req.getEmail().toLowerCase().trim(), encodedPassword, UserRole.ROLE_USER);
        userRepository.save(user);

        // Create character
        Character character = new Character(user, req.getName().trim(), "The Novice");
        character.setLevel(1);
        character.setCurrentXp(0);
        character.setTotalXp(0);
        character.setGold(100);
        character.setCurrentStreak(1);
        character.setLongestStreak(1);
        characterRepository.save(character);

        // Initialize user settings
        settingsRepository.save(new UserSettings(user));

        // Initialize attributes
        attributeService.initializeDefaultAttributes(user);

        // Link all active domains to user
        List<Domain> allDomains = domainRepository.findAll();
        for (Domain d : allDomains) {
            userDomainRepository.save(new UserDomain(user, d, 1, 0, 0, 0, 0));
        }

        // Seed starter quests for this adventurer
        seedStarterQuests(user);

        // Generate JWT
        UserPrincipal principal = UserPrincipal.create(user);
        String token = jwtService.generateToken(principal, user.getId());

        UserResponseDTO userDTO = new UserResponseDTO(
                "user-" + user.getId(),
                user.getName(),
                character.getTitle(),
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponseDTO(token, userDTO);
    }

    @Transactional
    public AuthResponseDTO login(LoginRequestDTO req) {
        String cleanEmail = req.getEmail().toLowerCase().trim();

        // Security check: verify if the account exists in database
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new BadRequestException("No adventurer account found with email: " + cleanEmail + ". This account does not exist. Please register first."));

        // Security check: verify password matches
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid password. Please check your credentials or reset your password.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(cleanEmail, req.getPassword())
        );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        Character character = characterRepository.findByUserId(user.getId()).orElse(null);
        String title = character != null ? character.getTitle() : "The Adventurer";

        String token = jwtService.generateToken(principal, user.getId());
        UserResponseDTO userDTO = new UserResponseDTO(
                "user-" + user.getId(),
                user.getName(),
                title,
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponseDTO(token, userDTO);
    }

    @Transactional(readOnly = true)
    public boolean checkEmailExists(String email) {
        if (email == null || email.isBlank()) return false;
        return userRepository.existsByEmail(email.toLowerCase().trim());
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Character character = characterRepository.findByUserId(userId).orElse(null);
        String title = character != null ? character.getTitle() : "The Adventurer";

        return new UserResponseDTO(
                "user-" + user.getId(),
                user.getName(),
                title,
                user.getEmail(),
                user.getRole().name()
        );
    }

    private void seedStarterQuests(User user) {
        Domain prog = domainRepository.findById("programming").orElse(null);
        Domain fit = domainRepository.findById("fitness").orElse(null);
        Domain read = domainRepository.findById("reading").orElse(null);
        Domain mind = domainRepository.findById("mindfulness").orElse(null);

        // 1. Featured Quest for Adventure Page
        Quest featured = new Quest("featured-" + UUID.randomUUID().toString().substring(0, 6),
                user, prog, "Programming", "Introduction to System Architecture (Microservices Kafka Pipeline)",
                "Architecting event-driven streams, configuring consumer groups for real-time telemetry, and stress-testing idempotency against simulated socket drops.",
                "Hard", "bg-primary-container text-on-primary",
                QuestStatus.ACTIVE, QuestType.FEATURED, 280, 95, "intelligence", 30, "terminal");
        featured.setFeatured(true);
        featured.setProgressPercentage(65);
        featured.setProgressLabel("Module 4 of 6");
        featured.setMilestoneLabel("MILESTONE PROGRESSION (2/3)");
        featured.setTimeRemaining("120m Remaining");
        featured.setDomainClass("bg-primary-container text-on-primary");
        featured.addMilestone(new QuestMilestone("fm1-" + UUID.randomUUID().toString().substring(0, 6), featured, "Architect event-driven streams & schema", 1, true));
        featured.addMilestone(new QuestMilestone("fm2-" + UUID.randomUUID().toString().substring(0, 6), featured, "Configure real-time consumer groups", 2, true));
        featured.addMilestone(new QuestMilestone("fm3-" + UUID.randomUUID().toString().substring(0, 6), featured, "Stress-test idempotency under socket drop", 3, false));
        questRepository.save(featured);

        // 2. Continue Quests (Active quests with progress > 0)
        Quest cont1 = new Quest("cont-fitness-" + UUID.randomUUID().toString().substring(0, 6),
                user, fit, "Fitness", "Master the Field: Conditioning & Core Workout",
                "Execute 4 explosive core sets, agility ladders, and mobility stretching.",
                "Medium", "bg-secondary-fixed text-on-secondary-fixed",
                QuestStatus.ACTIVE, QuestType.NORMAL, 80, 30, "strength", 20, "fitness_center");
        cont1.setProgressPercentage(75);
        cont1.setProgressLabel("3 / 4 Sets Completed");
        cont1.setProgressClass("bg-secondary-container");
        cont1.setTimeRemaining("45m Session");
        cont1.setDomainClass("bg-secondary-fixed text-on-secondary-fixed");
        cont1.addMilestone(new QuestMilestone("cm1-" + UUID.randomUUID().toString().substring(0, 6), cont1, "15m dynamic hip & hamstring mobility", 1, true));
        cont1.addMilestone(new QuestMilestone("cm2-" + UUID.randomUUID().toString().substring(0, 6), cont1, "3x12 Explosive box jumps", 2, true));
        cont1.addMilestone(new QuestMilestone("cm3-" + UUID.randomUUID().toString().substring(0, 6), cont1, "Core plank burnout series", 3, false));
        questRepository.save(cont1);

        Quest cont2 = new Quest("cont-reading-" + UUID.randomUUID().toString().substring(0, 6),
                user, read, "Reading", "Read 25 Pages: Data-Intensive Applications",
                "Chapter 5: Reliable replication, failovers, and consensus models in distributed state.",
                "Medium", "bg-tertiary-fixed text-on-tertiary-fixed",
                QuestStatus.ACTIVE, QuestType.NORMAL, 65, 20, "wisdom", 15, "auto_stories");
        cont2.setProgressPercentage(40);
        cont2.setProgressLabel("10 / 25 Pages Read");
        cont2.setProgressClass("bg-tertiary-container");
        cont2.setTimeRemaining("30m Session");
        cont2.setDomainClass("bg-tertiary-fixed text-on-tertiary-fixed");
        questRepository.save(cont2);

        // 3. Recommended Quests
        Quest rec1 = new Quest("rec-sprint-" + UUID.randomUUID().toString().substring(0, 6),
                user, fit, "Fitness", "Morning Athletic 5km Interval Sprint",
                "High-intensity intervals: 60s sprint followed by 90s recovery jog.",
                "Medium", "bg-secondary-fixed text-on-secondary-fixed",
                QuestStatus.ACTIVE, QuestType.NORMAL, 80, 25, "agility", 20, "sprint");
        rec1.setRecommended(true);
        rec1.setDomainClass("bg-secondary-fixed text-on-secondary-fixed");
        questRepository.save(rec1);

        Quest rec2 = new Quest("rec-mind-" + UUID.randomUUID().toString().substring(0, 6),
                user, mind, "Mindfulness", "15m Box Breathing & Cortisol Reset",
                "Controlled 4-4-4-4 pulmonary cycle to deactivate stress receptors.",
                "Easy", "bg-surface-variant text-on-surface-variant",
                QuestStatus.ACTIVE, QuestType.NORMAL, 40, 15, "discipline", 15, "self_improvement");
        rec2.setRecommended(true);
        rec2.setDomainClass("bg-surface-variant text-on-surface-variant");
        questRepository.save(rec2);

        Quest rec3 = new Quest("rec-code-" + UUID.randomUUID().toString().substring(0, 6),
                user, prog, "Programming", "UI/UX Micro-Interaction Prototype",
                "Build 3 spring-physics tactile toggles and component interactions.",
                "Hard", "bg-primary-container text-on-primary",
                QuestStatus.ACTIVE, QuestType.NORMAL, 90, 35, "creativity", 25, "palette");
        rec3.setRecommended(true);
        rec3.setDomainClass("bg-primary-container text-on-primary");
        questRepository.save(rec3);

        // 4. Daily quests
        Quest q1 = new Quest("daily-hydration-" + UUID.randomUUID().toString().substring(0, 6),
                user, null, "Health", "Log morning hydration (500ml)",
                "Drink 500ml of clean water within 15 minutes of waking.", "Common", "bg-surface-variant text-on-surface-variant",
                QuestStatus.COMPLETED, QuestType.DAILY, 15, 5, "vitality", 10, "water_drop");
        q1.setDaily(true);
        questRepository.save(q1);

        Quest q2 = new Quest("daily-walk-" + UUID.randomUUID().toString().substring(0, 6),
                user, null, "Fitness", "30-minute evening walk",
                "Low-intensity cardio zone 1 stroll without headphones.", "Common", "bg-surface-variant text-on-surface-variant",
                QuestStatus.ACTIVE, QuestType.DAILY, 25, 10, "vitality", 10, "directions_walk");
        q2.setDaily(true);
        questRepository.save(q2);
    }

    @Transactional
    public String sendForgotPasswordOtp(String email) {
        String cleanEmail = email.toLowerCase().trim();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new ResourceNotFoundException("No adventurer account found with email: " + cleanEmail));

        // Generate 6-digit OTP
        int randomPin = (int) (Math.random() * 900000) + 100000;
        String otp = String.valueOf(randomPin);

        // Save OTP record with 15-minute expiration
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);
        PasswordResetOtp otpRecord = new PasswordResetOtp(cleanEmail, otp, expiryDate);
        passwordResetOtpRepository.save(otpRecord);

        // Send OTP to user's Gmail
        emailService.sendOtpEmail(cleanEmail, otp, user.getName());

        return "A 6-digit verification code has been dispatched to your email address.";
    }

    @Transactional
    public String verifyOtp(String email, String otp) {
        String cleanEmail = email.toLowerCase().trim();
        String cleanOtp = otp.trim();

        if (!userRepository.existsByEmail(cleanEmail)) {
            throw new ResourceNotFoundException("No adventurer account found with email: " + cleanEmail);
        }

        PasswordResetOtp otpRecord = passwordResetOtpRepository
                .findByEmailAndOtpAndUsedFalse(cleanEmail, cleanOtp)
                .orElseThrow(() -> new BadRequestException("Invalid or incorrect verification code."));

        if (otpRecord.isExpired()) {
            throw new BadRequestException("Verification code has expired. Please request a new code.");
        }

        otpRecord.setVerified(true);
        passwordResetOtpRepository.save(otpRecord);

        return "Verification code verified successfully.";
    }

    @Transactional
    public String resetPassword(String email, String otp, String newPassword) {
        String cleanEmail = email.toLowerCase().trim();
        String cleanOtp = otp.trim();

        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new ResourceNotFoundException("No adventurer account found with email: " + cleanEmail));

        PasswordResetOtp otpRecord = passwordResetOtpRepository
                .findByEmailAndOtpAndUsedFalse(cleanEmail, cleanOtp)
                .orElseThrow(() -> new BadRequestException("Invalid verification code or session expired."));

        if (otpRecord.isExpired()) {
            throw new BadRequestException("Verification code has expired. Please request a new code.");
        }

        if (newPassword == null || newPassword.length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters in length.");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Invalidate OTP
        otpRecord.setUsed(true);
        passwordResetOtpRepository.save(otpRecord);

        return "Your password has been successfully reset. You may now return to the portal to log in.";
    }
}

