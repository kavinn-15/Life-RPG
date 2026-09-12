package com.liferpg.repository;

import com.liferpg.entity.GuildMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuildMemberRepository extends JpaRepository<GuildMember, Long> {

    Optional<GuildMember> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    List<GuildMember> findByGuildIdOrderByContributionXpDescJoinedAtAsc(Long guildId);

    long countByGuildId(Long guildId);

    void deleteByUserId(Long userId);
}
