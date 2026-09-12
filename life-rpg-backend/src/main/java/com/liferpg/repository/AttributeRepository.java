package com.liferpg.repository;

import com.liferpg.entity.Attribute;
import com.liferpg.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttributeRepository extends JpaRepository<Attribute, Long> {
    List<Attribute> findByUser(User user);
    List<Attribute> findByUserId(Long userId);
    Optional<Attribute> findByUserAndAttributeKey(User user, String attributeKey);
    Optional<Attribute> findByUserIdAndAttributeKey(Long userId, String attributeKey);
}
