package com.liferpg.repository;

import com.liferpg.entity.Domain;
import com.liferpg.entity.User;
import com.liferpg.entity.UserDomain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDomainRepository extends JpaRepository<UserDomain, Long> {
    List<UserDomain> findByUser(User user);
    List<UserDomain> findByUserId(Long userId);
    Optional<UserDomain> findByUserAndDomain(User user, Domain domain);
    Optional<UserDomain> findByUserIdAndDomainId(Long userId, String domainId);
}
