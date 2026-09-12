package com.liferpg.repository;

import com.liferpg.entity.Reward;
import com.liferpg.enums.RewardCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardRepository extends JpaRepository<Reward, String> {
    List<Reward> findByActiveTrue();
    List<Reward> findByCategoryAndActiveTrue(RewardCategory category);
}
