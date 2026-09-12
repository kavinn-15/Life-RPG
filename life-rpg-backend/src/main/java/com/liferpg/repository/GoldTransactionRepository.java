package com.liferpg.repository;

import com.liferpg.entity.GoldTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GoldTransactionRepository extends JpaRepository<GoldTransaction, Long> {
    List<GoldTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT SUM(g.amount) FROM GoldTransaction g WHERE g.user.id = :userId AND g.amount > 0 AND g.createdAt >= :since")
    Long sumEarnedGoldByUserIdAndCreatedAtAfter(@Param("userId") Long userId, @Param("since") LocalDateTime since);
}
