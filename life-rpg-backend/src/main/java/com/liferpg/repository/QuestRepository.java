package com.liferpg.repository;

import com.liferpg.entity.Quest;
import com.liferpg.entity.User;
import com.liferpg.enums.QuestStatus;
import com.liferpg.enums.QuestType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestRepository extends JpaRepository<Quest, String> {

    List<Quest> findByUser(User user);
    List<Quest> findByUserId(Long userId);
    Optional<Quest> findByIdAndUser(String id, User user);
    Optional<Quest> findByIdAndUserId(String id, Long userId);

    List<Quest> findByUserIdAndStatus(Long userId, QuestStatus status);
    List<Quest> findByUserIdAndFeaturedTrue(Long userId);
    List<Quest> findByUserIdAndRecommendedTrue(Long userId);
    List<Quest> findByUserIdAndDailyTrue(Long userId);
    List<Quest> findByUserIdAndDomainId(Long userId, String domainId);

    @Query("SELECT q FROM Quest q WHERE q.user.id = :userId AND " +
           "(:status IS NULL OR q.status = :status) AND " +
           "(:domainId IS NULL OR q.domain.id = :domainId) AND " +
           "(:difficulty IS NULL OR LOWER(q.difficulty) = LOWER(:difficulty)) AND " +
           "(:questType IS NULL OR q.questType = :questType)")
    Page<Quest> findWithFilters(@Param("userId") Long userId,
                                @Param("status") QuestStatus status,
                                @Param("domainId") String domainId,
                                @Param("difficulty") String difficulty,
                                @Param("questType") QuestType questType,
                                Pageable pageable);

    @Query("SELECT q FROM Quest q WHERE q.user.id = :userId AND (" +
           "LOWER(q.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(q.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(q.domainName) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Quest> searchQuests(@Param("userId") Long userId, @Param("query") String query);

    long countByUserIdAndStatus(Long userId, QuestStatus status);
}
