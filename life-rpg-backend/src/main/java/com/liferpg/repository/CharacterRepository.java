package com.liferpg.repository;

import com.liferpg.entity.Character;
import com.liferpg.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CharacterRepository extends JpaRepository<Character, Long> {
    Optional<Character> findByUser(User user);
    Optional<Character> findByUserId(Long userId);
    Page<Character> findAllByOrderByTotalXpDesc(Pageable pageable);
    Page<Character> findAllByOrderByLevelDesc(Pageable pageable);
    Page<Character> findAllByOrderByCurrentStreakDesc(Pageable pageable);
}
