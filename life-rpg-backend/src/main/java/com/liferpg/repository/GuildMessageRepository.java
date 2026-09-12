package com.liferpg.repository;

import com.liferpg.entity.GuildMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuildMessageRepository extends JpaRepository<GuildMessage, Long> {

    List<GuildMessage> findByGuildIdOrderByCreatedAtAsc(Long guildId);

    List<GuildMessage> findByGuildIdOrderByCreatedAtDesc(Long guildId, Pageable pageable);
}
