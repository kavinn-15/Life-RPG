package com.liferpg.repository;

import com.liferpg.entity.Guild;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuildRepository extends JpaRepository<Guild, Long> {

    Optional<Guild> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    @Query("SELECT g FROM Guild g WHERE " +
           "(:search IS NULL OR LOWER(g.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(g.motto) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(g.tag) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:domain IS NULL OR :domain = 'All' OR LOWER(g.domainSphere) LIKE LOWER(CONCAT('%', :domain, '%'))) " +
           "ORDER BY g.totalXp DESC, g.level DESC")
    List<Guild> findFilteredGuilds(@Param("search") String search, @Param("domain") String domain);

    List<Guild> findAllByOrderByTotalXpDesc();
}
