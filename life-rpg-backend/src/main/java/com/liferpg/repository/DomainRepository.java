package com.liferpg.repository;

import com.liferpg.entity.Domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DomainRepository extends JpaRepository<Domain, String> {
    List<Domain> findByActiveTrue();
    Optional<Domain> findByIdAndActiveTrue(String id);
}
