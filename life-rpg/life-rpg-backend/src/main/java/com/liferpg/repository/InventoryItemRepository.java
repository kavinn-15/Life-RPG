package com.liferpg.repository;

import com.liferpg.entity.InventoryItem;
import com.liferpg.entity.Reward;
import com.liferpg.entity.User;
import com.liferpg.enums.RewardCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByUser(User user);
    List<InventoryItem> findByUserId(Long userId);
    Optional<InventoryItem> findByUserAndReward(User user, Reward reward);
    Optional<InventoryItem> findByUserIdAndRewardId(Long userId, String rewardId);
    boolean existsByUserIdAndRewardId(Long userId, String rewardId);

    @Query("SELECT i FROM InventoryItem i WHERE i.user.id = :userId AND i.reward.category = :category AND i.equipped = true")
    List<InventoryItem> findEquippedByUserAndCategory(@Param("userId") Long userId, @Param("category") RewardCategory category);
}
