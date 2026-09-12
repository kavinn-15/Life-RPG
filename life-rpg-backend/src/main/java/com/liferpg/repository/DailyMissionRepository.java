package com.liferpg.repository;

import com.liferpg.entity.DailyMission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyMissionRepository extends JpaRepository<DailyMission, String> {
    List<DailyMission> findByActiveTrue();
}
