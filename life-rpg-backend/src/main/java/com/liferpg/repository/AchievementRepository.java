package com.liferpg.repository;

import com.liferpg.entity.Achievement;
import com.liferpg.enums.AchievementCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, String> {
    List<Achievement> findByActiveTrue();
    List<Achievement> findByCategoryAndActiveTrue(AchievementCategory category);
    List<Achievement> findByDomainNameAndActiveTrue(String domainName);
}
