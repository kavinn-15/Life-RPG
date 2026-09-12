package com.liferpg.repository;

import com.liferpg.entity.StreakLog;
import com.liferpg.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StreakLogRepository extends JpaRepository<StreakLog, Long> {
    List<StreakLog> findByUserIdOrderByActivityDateDesc(Long userId);
    Optional<StreakLog> findByUserAndActivityDate(User user, LocalDate activityDate);
    Optional<StreakLog> findByUserIdAndActivityDate(Long userId, LocalDate activityDate);
    List<StreakLog> findByUserIdAndActivityDateBetweenOrderByActivityDateAsc(Long userId, LocalDate startDate, LocalDate endDate);
}
