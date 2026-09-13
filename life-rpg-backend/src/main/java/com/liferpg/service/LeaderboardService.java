package com.liferpg.service;

import com.liferpg.dto.user.LeaderboardEntryDTO;
import com.liferpg.entity.Character;
import com.liferpg.repository.CharacterRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class LeaderboardService {

    private final CharacterRepository characterRepository;

    public LeaderboardService(CharacterRepository characterRepository) {
        this.characterRepository = characterRepository;
    }

    @Transactional(readOnly = true)
    public List<LeaderboardEntryDTO> getLeaderboard() {
        Page<Character> topCharacters = characterRepository.findAllByOrderByTotalXpDesc(PageRequest.of(0, 10));

        List<LeaderboardEntryDTO> entries = new ArrayList<>();
        int rank = 1;

        // Static vanguard leaders for rich RPG atmosphere
        entries.add(new LeaderboardEntryDTO(rank++, "EM", "Elena Rostova", "LVL 14 • Sage", 14820, "bg-secondary-fixed text-on-secondary-fixed", "text-primary"));
        entries.add(new LeaderboardEntryDTO(rank++, "MK", "Marcus Kane", "LVL 13 • Paladin", 13240, "bg-surface-container-highest text-on-surface-variant", "text-tertiary"));
        entries.add(new LeaderboardEntryDTO(rank++, "SL", "Sarah Lin", "LVL 13 • Alchemist", 12910, "bg-secondary-fixed-dim/60 text-secondary", "text-secondary"));
        entries.add(new LeaderboardEntryDTO(rank++, "TK", "Tariq Khan", "LVL 12 • Ranger", 11400, "text-on-surface-variant", "text-on-surface"));

        for (Character c : topCharacters.getContent()) {
            if (c.getPlayerName() == null || c.getPlayerName().isBlank()) {
                continue;
            }
            String initials = getInitials(c.getPlayerName());
            entries.add(new LeaderboardEntryDTO(
                    rank++,
                    initials,
                    c.getPlayerName(),
                    "LVL " + c.getLevel() + " • " + c.getTitle(),
                    c.getTotalXp(),
                    "text-on-surface-variant",
                    "text-primary"
            ));
        }

        return entries;
    }

    private String getInitials(String name) {
        if (name == null || name.isBlank()) return "AN";
        String[] parts = name.trim().split("\\s+");
        if (parts.length == 1) return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
        return ("" + parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
}
