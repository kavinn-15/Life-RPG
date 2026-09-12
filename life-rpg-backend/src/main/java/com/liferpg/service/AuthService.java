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
    private final RewardRepository rewardRepository;
    private final InventoryItemRepository inventoryItemRepository;
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
                       RewardRepository rewardRepository,
                       InventoryItemRepository inventoryItemRepository,
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
        this.rewardRepository = rewardRepository;
        this.inventoryItemRepository = inventoryItemRepository;
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
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail().toLowerCase().trim(), req.getPassword())
        );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + principal.getId()));

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
        Domain sport = domainRepository.findById("sports").orElse(null);
        Domain read = domainRepository.findById("reading").orElse(null);
        Domain medit = domainRepository.findById("meditation").orElse(null);

        // Daily quests
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

        // Active quest
        Quest q3 = new Quest("quest-starter-" + UUID.randomUUID().toString().substring(0, 6),
                user, prog, "Programming", "Introduction to System Architecture",
                "Learn distributed systems core principles and set up local dev environment.",
                "Medium", "bg-secondary-fixed text-on-secondary-fixed",
                QuestStatus.ACTIVE, QuestType.NORMAL, 80, 30, "coding", 20, "code");
        q3.addMilestone(new QuestMilestone("m1-" + UUID.randomUUID().toString().substring(0, 6), q3, "Install Java 21 and Maven", 1, true));
        q3.addMilestone(new QuestMilestone("m2-" + UUID.randomUUID().toString().substring(0, 6), q3, "Review Spring Boot Documentation", 2, false));
        questRepository.save(q3);
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

