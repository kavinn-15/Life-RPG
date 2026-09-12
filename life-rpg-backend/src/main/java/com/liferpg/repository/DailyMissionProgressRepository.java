package com.liferpg.repository;

import com.liferpg.entity.DailyMission;
import com.liferpg.entity.DailyMissionProgress;
import com.liferpg.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyMissionProgressRepository extends JpaRepository<DailyMissionProgress, Long> {
    List<DailyMissionProgress> findByUserIdAndProgressDate(Long userId, LocalDate progressDate);
    Optional<DailyMissionProgress> findByUserAndDailyMissionAndProgressDate(User user, DailyMission dailyMission, LocalDate progressDate);
    Optional<DailyMissionProgress> findByUserIdAndDailyMissionIdAndProgressDate(Long userId, String missionId, LocalDate progressDate);
}
