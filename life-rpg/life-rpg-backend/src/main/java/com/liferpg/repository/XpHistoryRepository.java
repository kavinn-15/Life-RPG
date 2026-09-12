package com.liferpg.repository;

import com.liferpg.entity.XpHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface XpHistoryRepository extends JpaRepository<XpHistory, Long> {
    List<XpHistory> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT SUM(x.xpAmount) FROM XpHistory x WHERE x.user.id = :userId AND x.createdAt >= :since")
    Long sumXpByUserIdAndCreatedAtAfter(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    @Query("SELECT x.domainId, SUM(x.xpAmount) FROM XpHistory x WHERE x.user.id = :userId AND x.domainId IS NOT NULL GROUP BY x.domainId ORDER BY SUM(x.xpAmount) DESC")
    List<Object[]> sumXpByDomainForUser(@Param("userId") Long userId);
}
