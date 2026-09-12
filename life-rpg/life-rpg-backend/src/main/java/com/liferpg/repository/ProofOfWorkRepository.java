package com.liferpg.repository;

import com.liferpg.entity.ProofOfWork;
import com.liferpg.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProofOfWorkRepository extends JpaRepository<ProofOfWork, Long> {
    List<ProofOfWork> findByUserId(Long userId);
    List<ProofOfWork> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<ProofOfWork> findByUser(User user);
}
