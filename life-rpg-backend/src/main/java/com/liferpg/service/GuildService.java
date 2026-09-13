package com.liferpg.service;

import com.liferpg.dto.guild.*;
import com.liferpg.entity.Character;
import com.liferpg.entity.Guild;
import com.liferpg.entity.GuildMember;
import com.liferpg.entity.GuildMessage;
import com.liferpg.entity.User;
import com.liferpg.exception.BadRequestException;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.CharacterRepository;
import com.liferpg.repository.GuildMemberRepository;
import com.liferpg.repository.GuildMessageRepository;
import com.liferpg.repository.GuildRepository;
import com.liferpg.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GuildService {

    private final GuildRepository guildRepository;
    private final GuildMemberRepository guildMemberRepository;
    private final GuildMessageRepository guildMessageRepository;
    private final UserRepository userRepository;
    private final CharacterRepository characterRepository;

    public GuildService(GuildRepository guildRepository,
                        GuildMemberRepository guildMemberRepository,
                        GuildMessageRepository guildMessageRepository,
                        UserRepository userRepository,
                        CharacterRepository characterRepository) {
        this.guildRepository = guildRepository;
        this.guildMemberRepository = guildMemberRepository;
        this.guildMessageRepository = guildMessageRepository;
        this.userRepository = userRepository;
        this.characterRepository = characterRepository;
    }

    @PostConstruct
    @Transactional
    public void seedInitialGuilds() {
        if (guildRepository.count() > 0) {
            return;
        }

        // 1. Silicon Vanguard
        Guild g1 = new Guild(
                "Silicon Vanguard",
                "[CODE]",
                "Architecting reality line by line. Clean code, unstoppable systems.",
                "The premier guild for developers, software engineers, and hackers leveling up technical mastery.",
                "Code & Logic",
                "terminal",
                null,
                "Cyber Archon"
        );
        g1.setLevel(6);
        g1.setTotalXp(38400);
        g1.setMemberCount(28);
        g1.setWeeklyRaidTitle("Operation: Zero-Downtime Microservices");
        g1.setWeeklyRaidTargetXp(20000);
        g1.setWeeklyRaidCurrentXp(14200);
        g1.setBannerGradient("from-cyan-500/20 via-blue-950/40 to-slate-950");
        guildRepository.save(g1);

        addDefaultMessage(g1, "Cyber Archon", "LEADER", "cyan", "Welcome recruits! Make sure to log your coding sprint milestones daily. The raid target is within reach!", "ANNOUNCEMENT");
        addDefaultMessage(g1, "Elena Rostova", "OFFICER", "teal", "Just pushed 3 modules for the distributed sync task. +240 XP logged!", "CHAT");
        addDefaultMessage(g1, "Marcus Kane", "MEMBER", "rose", "Finished 2 hours of refactoring. Feeling great about this sprint.", "CHAT");

        // 2. Iron Legion
        Guild g2 = new Guild(
                "Iron Legion",
                "[IRON]",
                "Discipline over motivation. Every rep builds the fortress.",
                "Dedicated to strength training, calisthenics, conditioning, and nutrition excellence.",
                "Physical Power",
                "fitness_center",
                null,
                "Titan Prime"
        );
        g2.setLevel(5);
        g2.setTotalXp(29100);
        g2.setMemberCount(21);
        g2.setWeeklyRaidTitle("Raid: 1,000,000 Reps & Heavy Milestones");
        g2.setWeeklyRaidTargetXp(15000);
        g2.setWeeklyRaidCurrentXp(9800);
        g2.setBannerGradient("from-rose-500/20 via-red-950/40 to-slate-950");
        guildRepository.save(g2);

        addDefaultMessage(g2, "Titan Prime", "LEADER", "crimson", "Early morning lift completed. Remember hydration and 8 hours of sleep, warriors.", "ANNOUNCEMENT");
        addDefaultMessage(g2, "Sarah Lin", "OFFICER", "amber", "Hit a new deadlift PR today! 5x5 squats logged as well.", "CHAT");

        // 3. Archivist Conclave
        Guild g3 = new Guild(
                "Archivist Conclave",
                "[MIND]",
                "Knowledge is the ultimate force multiplier in the realm.",
                "Deep reading, cognitive performance, memory training, and polymath synthesis.",
                "Knowledge & Mind",
                "psychology",
                null,
                "Grand Archivist"
        );
        g3.setLevel(7);
        g3.setTotalXp(46200);
        g3.setMemberCount(34);
        g3.setWeeklyRaidTitle("Expedition: 100 Deep Work Focus Hours");
        g3.setWeeklyRaidTargetXp(25000);
        g3.setWeeklyRaidCurrentXp(21500);
        g3.setBannerGradient("from-purple-500/20 via-indigo-950/40 to-slate-950");
        guildRepository.save(g3);

        addDefaultMessage(g3, "Grand Archivist", "LEADER", "teal", "The library opens its doors. 4-hour uninterrupted deep work block active today.", "ANNOUNCEMENT");
        addDefaultMessage(g3, "Tariq Khan", "MEMBER", "cyan", "Finished reading 'Designing Data-Intensive Applications' Chapter 7.", "CHAT");

        // 4. Gold Sovereign Syndicate
        Guild g4 = new Guild(
                "Gold Sovereign Syndicate",
                "[GOLD]",
                "Compound growth, strategic investment, and financial sovereignty.",
                "Master personal finance, portfolio allocation, cash flow, and asset building.",
                "Finance & Wealth",
                "account_balance",
                null,
                "Vault Master"
        );
        g4.setLevel(4);
        g4.setTotalXp(21300);
        g4.setMemberCount(17);
        g4.setWeeklyRaidTitle("Consortium: 100% Budget & Expense Audit");
        g4.setWeeklyRaidTargetXp(12000);
        g4.setWeeklyRaidCurrentXp(7600);
        g4.setBannerGradient("from-amber-500/20 via-yellow-950/40 to-slate-950");
        guildRepository.save(g4);

        addDefaultMessage(g4, "Vault Master", "LEADER", "amber", "Weekly expense review time! Ensure all high-ROI habit investments are accounted for.", "ANNOUNCEMENT");

        // 5. Prismatic Artisan Guild
        Guild g5 = new Guild(
                "Prismatic Artisan Guild",
                "[ARTS]",
                "Creating what does not yet exist. Fuel for the soul.",
                "UI/UX designers, 3D artists, writers, musicians, and creative pioneers.",
                "Creativity & Art",
                "palette",
                null,
                "Master Maker"
        );
        g5.setLevel(4);
        g5.setTotalXp(18900);
        g5.setMemberCount(15);
        g5.setWeeklyRaidTitle("Exhibition: 40 Concept Prototypes");
        g5.setWeeklyRaidTargetXp(10000);
        g5.setWeeklyRaidCurrentXp(6200);
        g5.setBannerGradient("from-emerald-500/20 via-teal-950/40 to-slate-950");
        guildRepository.save(g5);

        addDefaultMessage(g5, "Master Maker", "LEADER", "rose", "Welcome to the atelier! Share your creative drafts in the guild feed.", "ANNOUNCEMENT");
    }

    private void addDefaultMessage(Guild guild, String senderName, String senderRole, String senderAvatar, String message, String type) {
        GuildMessage msg = new GuildMessage(guild, null, senderName, senderRole, senderAvatar, message, type);
        guildMessageRepository.save(msg);
    }

    @Transactional(readOnly = true)
    public List<GuildResponseDTO> getAllGuilds(String search, String domain, Long currentUserId) {
        List<Guild> guilds = guildRepository.findFilteredGuilds(
                (search == null || search.isBlank()) ? null : search.trim(),
                (domain == null || domain.isBlank() || "All".equalsIgnoreCase(domain)) ? null : domain.trim()
        );

        Optional<GuildMember> currentMembership = (currentUserId != null) ? guildMemberRepository.findByUserId(currentUserId) : Optional.empty();
        Long userGuildId = currentMembership.map(m -> m.getGuild().getId()).orElse(null);
        String userRole = currentMembership.map(GuildMember::getRole).orElse(null);

        return guilds.stream().map(g -> {
            GuildResponseDTO dto = mapToDto(g);
            if (userGuildId != null && userGuildId.equals(g.getId())) {
                dto.setUserMember(true);
                dto.setUserRole(userRole);
            } else {
                dto.setUserMember(false);
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> getUserGuildData(Long userId) {
        Optional<GuildMember> memberOpt = guildMemberRepository.findByUserId(userId);
        if (memberOpt.isEmpty()) {
            // Auto-enroll user into top guild (Silicon Vanguard)
            List<Guild> allGuilds = guildRepository.findAllByOrderByTotalXpDesc();
            if (!allGuilds.isEmpty()) {
                Guild targetGuild = allGuilds.get(0);
                User user = userRepository.findById(userId).orElse(null);
                Character character = characterRepository.findByUserId(userId).orElse(null);
                if (user != null && character != null) {
                    GuildMember newMem = new GuildMember(
                            targetGuild,
                            user,
                            character.getPlayerName(),
                            character.getTitle(),
                            character.getLevel(),
                            character.getAvatarClass() != null ? character.getAvatarClass() : "cyan",
                            character.getAvatarUrl(),
                            "OFFICER"
                    );
                    newMem.setContributionXp(420);
                    guildMemberRepository.save(newMem);
                    targetGuild.setMemberCount(targetGuild.getMemberCount() + 1);
                    guildRepository.save(targetGuild);
                    memberOpt = Optional.of(newMem);
                }
            }
        }

        if (memberOpt.isEmpty()) {
            return Map.of("hasGuild", false);
        }

        GuildMember member = memberOpt.get();
        Guild guild = member.getGuild();

        GuildResponseDTO guildDTO = mapToDto(guild);
        guildDTO.setUserMember(true);
        guildDTO.setUserRole(member.getRole());

        List<GuildMemberDTO> members = getGuildMembers(guild.getId());
        List<GuildMessageDTO> messages = getGuildMessages(guild.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("hasGuild", true);
        response.put("guild", guildDTO);
        response.put("memberInfo", mapMemberToDto(member));
        response.put("members", members);
        response.put("messages", messages);

        return response;
    }

    @Transactional(readOnly = true)
    public GuildResponseDTO getGuildById(Long guildId, Long userId) {
        Guild guild = guildRepository.findById(guildId)
                .orElseThrow(() -> new ResourceNotFoundException("Guild", "id", guildId));

        GuildResponseDTO dto = mapToDto(guild);
        if (userId != null) {
            guildMemberRepository.findByUserId(userId).ifPresent(m -> {
                if (m.getGuild().getId().equals(guildId)) {
                    dto.setUserMember(true);
                    dto.setUserRole(m.getRole());
                }
            });
        }
        return dto;
    }

    @Transactional
    public GuildResponseDTO createGuild(Long userId, CreateGuildRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Character character = characterRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Character", "userId", userId));

        if (guildRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("A guild named '" + request.getName() + "' already exists!");
        }

        // Leave existing guild if any
        guildMemberRepository.findByUserId(userId).ifPresent(existingMember -> {
            Guild oldGuild = existingMember.getGuild();
            guildMemberRepository.delete(existingMember);
            guildMemberRepository.flush();
            oldGuild.setMemberCount(Math.max(0, oldGuild.getMemberCount() - 1));
            guildRepository.save(oldGuild);
        });

        String bannerGradient = getBannerGradientByDomain(request.getDomainSphere());

        Guild guild = new Guild(
                request.getName().trim(),
                request.getTag().toUpperCase().startsWith("[") ? request.getTag().toUpperCase() : "[" + request.getTag().toUpperCase() + "]",
                request.getMotto(),
                request.getDescription(),
                request.getDomainSphere(),
                request.getIcon() != null ? request.getIcon() : "shield",
                userId,
                character.getPlayerName()
        );
        guild.setBannerGradient(bannerGradient);
        guild.setLevel(1);
        guild.setTotalXp(100);
        guild.setMemberCount(1);
        guild.setPublic(request.isPublic());
        guild.setWeeklyRaidTitle("Guild Inception: First Milestone Sprint");
        guild.setWeeklyRaidTargetXp(5000);
        guild.setWeeklyRaidCurrentXp(100);

        Guild savedGuild = guildRepository.save(guild);

        // Add creator as LEADER
        GuildMember leaderMember = new GuildMember(
                savedGuild,
                user,
                character.getPlayerName(),
                character.getTitle(),
                character.getLevel(),
                character.getAvatarClass(),
                character.getAvatarUrl(),
                "LEADER"
        );
        leaderMember.setContributionXp(100);
        guildMemberRepository.save(leaderMember);

        // Add inception tavern message
        GuildMessage inceptionMsg = new GuildMessage(
                savedGuild,
                userId,
                character.getPlayerName(),
                "LEADER",
                character.getAvatarClass() != null ? character.getAvatarClass() : "cyan",
                "Guild forged! Welcome to the hall of " + savedGuild.getName() + ". Let us conquer our daily quests together!",
                "ANNOUNCEMENT"
        );
        guildMessageRepository.save(inceptionMsg);

        GuildResponseDTO responseDTO = mapToDto(savedGuild);
        responseDTO.setUserMember(true);
        responseDTO.setUserRole("LEADER");
        return responseDTO;
    }

    @Transactional
    public GuildResponseDTO joinGuild(Long userId, Long guildId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Character character = characterRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Character", "userId", userId));
        Guild guild = guildRepository.findById(guildId)
                .orElseThrow(() -> new ResourceNotFoundException("Guild", "id", guildId));

        if (guild.getMemberCount() >= guild.getMaxMembers()) {
            throw new BadRequestException("This guild has reached its maximum capacity of " + guild.getMaxMembers() + " adventurers!");
        }

        // Leave existing guild if in another
        guildMemberRepository.findByUserId(userId).ifPresent(existingMember -> {
            if (existingMember.getGuild().getId().equals(guildId)) {
                throw new BadRequestException("You are already a member of " + guild.getName());
            }
            Guild oldGuild = existingMember.getGuild();
            guildMemberRepository.delete(existingMember);
            guildMemberRepository.flush();
            oldGuild.setMemberCount(Math.max(0, oldGuild.getMemberCount() - 1));
            guildRepository.save(oldGuild);
        });

        GuildMember newMember = new GuildMember(
                guild,
                user,
                character.getPlayerName(),
                character.getTitle(),
                character.getLevel(),
                character.getAvatarClass(),
                character.getAvatarUrl(),
                "MEMBER"
        );
        guildMemberRepository.save(newMember);

        guild.setMemberCount(guild.getMemberCount() + 1);
        guildRepository.save(guild);

        // Post member join message
        GuildMessage joinMsg = new GuildMessage(
                guild,
                userId,
                character.getPlayerName(),
                "MEMBER",
                character.getAvatarClass() != null ? character.getAvatarClass() : "cyan",
                character.getPlayerName() + " has entered the guild hall! ⚔️",
                "MEMBER_JOIN"
        );
        guildMessageRepository.save(joinMsg);

        GuildResponseDTO responseDTO = mapToDto(guild);
        responseDTO.setUserMember(true);
        responseDTO.setUserRole("MEMBER");
        return responseDTO;
    }

    @Transactional
    public void leaveGuild(Long userId, Long guildId) {
        GuildMember member = guildMemberRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("You are not currently a member of any guild."));

        if (!member.getGuild().getId().equals(guildId)) {
            throw new BadRequestException("You are not a member of this guild.");
        }

        Guild guild = member.getGuild();
        String playerName = member.getPlayerName();
        guildMemberRepository.delete(member);

        guild.setMemberCount(Math.max(0, guild.getMemberCount() - 1));
        guildRepository.save(guild);

        // Broadcast leave message
        GuildMessage leaveMsg = new GuildMessage(
                guild,
                userId,
                playerName,
                "MEMBER",
                "cyan",
                playerName + " departed to embark on a solo quest line.",
                "MEMBER_JOIN"
        );
        guildMessageRepository.save(leaveMsg);
    }

    @Transactional(readOnly = true)
    public List<GuildMemberDTO> getGuildMembers(Long guildId) {
        List<GuildMember> members = guildMemberRepository.findByGuildIdOrderByContributionXpDescJoinedAtAsc(guildId);
        return members.stream().map(this::mapMemberToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GuildMessageDTO> getGuildMessages(Long guildId) {
        List<GuildMessage> messages = guildMessageRepository.findByGuildIdOrderByCreatedAtAsc(guildId);
        return messages.stream().map(this::mapMessageToDto).collect(Collectors.toList());
    }

    @Transactional
    public GuildMessageDTO postGuildMessage(Long userId, Long guildId, PostGuildMessageRequestDTO request) {
        GuildMember member = guildMemberRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("You must be a member of this guild to chat in the tavern."));

        if (!member.getGuild().getId().equals(guildId)) {
            throw new BadRequestException("You cannot post messages to a guild you do not belong to.");
        }

        GuildMessage msg = new GuildMessage(
                member.getGuild(),
                userId,
                member.getPlayerName(),
                member.getRole(),
                member.getAvatarClass() != null ? member.getAvatarClass() : "cyan",
                request.getMessage().trim(),
                request.getType() != null ? request.getType() : "CHAT"
        );

        GuildMessage saved = guildMessageRepository.save(msg);
        return mapMessageToDto(saved);
    }

    @Transactional
    public Map<String, Object> contributeRaidXp(Long userId, Long guildId, long xpAmount) {
        GuildMember member = guildMemberRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("You must be a member of this guild to contribute raid XP."));

        if (!member.getGuild().getId().equals(guildId)) {
            throw new BadRequestException("Invalid guild contribution.");
        }

        Guild guild = member.getGuild();

        // Update member contribution
        member.setContributionXp(member.getContributionXp() + xpAmount);
        guildMemberRepository.save(member);

        // Update guild total XP and raid XP
        guild.setTotalXp(guild.getTotalXp() + xpAmount);
        long newRaidXp = guild.getWeeklyRaidCurrentXp() + xpAmount;
        boolean raidCompleted = false;

        if (newRaidXp >= guild.getWeeklyRaidTargetXp() && guild.getWeeklyRaidCurrentXp() < guild.getWeeklyRaidTargetXp()) {
            raidCompleted = true;
            // Guild level up check
            guild.setLevel(guild.getLevel() + 1);
            // Post victory announcement
            GuildMessage victoryMsg = new GuildMessage(
                    guild,
                    userId,
                    member.getPlayerName(),
                    "SYSTEM",
                    "amber",
                    "🏆 RAID VICTORY! The guild has conquered '" + guild.getWeeklyRaidTitle() + "'! All members earn +" + guild.getWeeklyRaidRewardGold() + " Gold & +" + guild.getWeeklyRaidRewardXp() + " XP!",
                    "MILESTONE"
            );
            guildMessageRepository.save(victoryMsg);
        }

        guild.setWeeklyRaidCurrentXp(newRaidXp);
        guildRepository.save(guild);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("contributedXp", xpAmount);
        result.put("newTotalXp", guild.getTotalXp());
        result.put("newRaidXp", guild.getWeeklyRaidCurrentXp());
        result.put("raidTargetXp", guild.getWeeklyRaidTargetXp());
        result.put("guildLevel", guild.getLevel());
        result.put("raidCompleted", raidCompleted);

        return result;
    }

    private String getBannerGradientByDomain(String domain) {
        if (domain == null) return "from-primary/20 via-indigo-950/40 to-slate-950";
        String lower = domain.toLowerCase();
        if (lower.contains("code") || lower.contains("logic")) {
            return "from-cyan-500/20 via-blue-950/40 to-slate-950";
        } else if (lower.contains("fit") || lower.contains("physic") || lower.contains("power")) {
            return "from-rose-500/20 via-red-950/40 to-slate-950";
        } else if (lower.contains("mind") || lower.contains("knowledg")) {
            return "from-purple-500/20 via-indigo-950/40 to-slate-950";
        } else if (lower.contains("finan") || lower.contains("wealth")) {
            return "from-amber-500/20 via-yellow-950/40 to-slate-950";
        } else if (lower.contains("art") || lower.contains("creat")) {
            return "from-emerald-500/20 via-teal-950/40 to-slate-950";
        }
        return "from-primary/20 via-indigo-950/40 to-slate-950";
    }

    private GuildResponseDTO mapToDto(Guild g) {
        GuildResponseDTO dto = new GuildResponseDTO();
        dto.setId(g.getId());
        dto.setName(g.getName());
        dto.setTag(g.getTag());
        dto.setMotto(g.getMotto());
        dto.setDescription(g.getDescription());
        dto.setDomainSphere(g.getDomainSphere());
        dto.setIcon(g.getIcon());
        dto.setBannerGradient(g.getBannerGradient());
        dto.setLevel(g.getLevel());
        dto.setTotalXp(g.getTotalXp());
        dto.setMemberCount(g.getMemberCount());
        dto.setMaxMembers(g.getMaxMembers());
        dto.setWeeklyRaidTitle(g.getWeeklyRaidTitle());
        dto.setWeeklyRaidTargetXp(g.getWeeklyRaidTargetXp());
        dto.setWeeklyRaidCurrentXp(g.getWeeklyRaidCurrentXp());
        dto.setWeeklyRaidRewardGold(g.getWeeklyRaidRewardGold());
        dto.setWeeklyRaidRewardXp(g.getWeeklyRaidRewardXp());
        dto.setPublic(g.isPublic());
        dto.setLeaderUserId(g.getLeaderUserId());
        dto.setLeaderName(g.getLeaderName());
        dto.setCreatedAt(g.getCreatedAt());
        return dto;
    }

    private GuildMemberDTO mapMemberToDto(GuildMember m) {
        GuildMemberDTO dto = new GuildMemberDTO();
        dto.setId(m.getId());
        dto.setUserId(m.getUser().getId());
        dto.setPlayerName(m.getPlayerName());
        dto.setCharacterTitle(m.getCharacterTitle());
        dto.setCharacterLevel(m.getCharacterLevel());
        dto.setAvatarClass(m.getAvatarClass());
        dto.setAvatarUrl(m.getAvatarUrl());
        dto.setRole(m.getRole());
        dto.setContributionXp(m.getContributionXp());
        dto.setJoinedAt(m.getJoinedAt());
        return dto;
    }

    private GuildMessageDTO mapMessageToDto(GuildMessage msg) {
        return new GuildMessageDTO(
                msg.getId(),
                msg.getSenderId(),
                msg.getSenderName(),
                msg.getSenderRole(),
                msg.getSenderAvatar(),
                msg.getMessage(),
                msg.getType(),
                msg.getCreatedAt()
        );
    }
}
