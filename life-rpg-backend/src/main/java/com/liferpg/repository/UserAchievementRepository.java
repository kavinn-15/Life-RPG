package com.liferpg.repository;

import com.liferpg.entity.Achievement;
import com.liferpg.entity.User;
import com.liferpg.entity.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
    List<UserAchievement> findByUser(User user);
    List<UserAchievement> findByUserId(Long userId);
    Optional<UserAchievement> findByUserAndAchievement(User user, Achievement achievement);
    Optional<UserAchievement> findByUserIdAndAchievementId(Long userId, String achievementId);
    List<UserAchievement> findByUserIdAndUnlockedTrue(Long userId);
    List<UserAchievement> findByUserIdAndUnlockedFalse(Long userId);
}
