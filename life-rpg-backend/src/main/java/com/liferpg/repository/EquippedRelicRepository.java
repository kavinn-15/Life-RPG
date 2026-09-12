package com.liferpg.repository;

import com.liferpg.entity.EquippedRelic;
import com.liferpg.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquippedRelicRepository extends JpaRepository<EquippedRelic, Long> {
    List<EquippedRelic> findByUserId(Long userId);
    List<EquippedRelic> findByUser(User user);
    Optional<EquippedRelic> findByUserIdAndSlot(Long userId, String slot);
}
