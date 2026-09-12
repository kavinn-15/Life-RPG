package com.liferpg.repository;

import com.liferpg.entity.QuestMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestMilestoneRepository extends JpaRepository<QuestMilestone, String> {
    List<QuestMilestone> findByQuestIdOrderBySequenceNumberAsc(String questId);
    Optional<QuestMilestone> findByIdAndQuestId(String id, String questId);
}
