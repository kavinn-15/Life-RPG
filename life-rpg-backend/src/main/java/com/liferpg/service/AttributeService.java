package com.liferpg.service;

import com.liferpg.entity.Attribute;
import com.liferpg.entity.User;
import com.liferpg.repository.AttributeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AttributeService {

    private final AttributeRepository attributeRepository;

    public AttributeService(AttributeRepository attributeRepository) {
        this.attributeRepository = attributeRepository;
    }

    @Transactional(readOnly = true)
    public List<Attribute> getUserAttributes(Long userId) {
        return attributeRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Optional<Attribute> getAttribute(Long userId, String key) {
        return attributeRepository.findByUserIdAndAttributeKey(userId, key);
    }

    /**
     * Awards attribute XP and advances attribute level when threshold is reached.
     * Returns true if attribute leveled up.
     */
    @Transactional
    public boolean processAttributeXpGain(User user, String attributeKey, int xpGain) {
        if (attributeKey == null || xpGain <= 0) return false;

        Optional<Attribute> opt = attributeRepository.findByUserAndAttributeKey(user, attributeKey.toLowerCase().trim());
        if (opt.isEmpty()) return false;

        Attribute attr = opt.get();
        attr.setTotalXp(attr.getTotalXp() + xpGain);
        attr.setWeeklyXp(attr.getWeeklyXp() + xpGain);
        long newXp = attr.getCurrentXp() + xpGain;

        boolean leveledUp = false;
        long requiredForNext = calculateAttributeThresholdXp(attr.getLevel());

        while (newXp >= requiredForNext) {
            newXp -= requiredForNext;
            attr.setLevel(attr.getLevel() + 1);
            leveledUp = true;
            requiredForNext = calculateAttributeThresholdXp(attr.getLevel());
        }

        attr.setCurrentXp(newXp);
        attr.setNextThreshold(attr.getLevel() + 1);
        int pct = (int) Math.min(100, Math.round(((double) newXp / requiredForNext) * 100.0));
        attr.setPercentage(pct);

        attributeRepository.save(attr);
        return leveledUp;
    }

    public long calculateAttributeThresholdXp(int level) {
        return 200L + (long) level * 50L;
    }

    @Transactional
    public void initializeDefaultAttributes(User user) {
        List<AttributeData> defaults = List.of(
                new AttributeData("coding", "Coding", "code", 1, 0, 0, 2, 0, false, false),
                new AttributeData("strength", "Strength", "fitness_center", 1, 0, 0, 2, 0, false, false),
                new AttributeData("intelligence", "Intelligence", "psychology", 1, 0, 0, 2, 0, false, false),
                new AttributeData("discipline", "Discipline", "shield", 1, 0, 0, 2, 0, false, false),
                new AttributeData("knowledge", "Knowledge", "menu_book", 1, 0, 0, 2, 0, false, false),
                new AttributeData("focus", "Focus", "center_focus_strong", 1, 0, 0, 2, 0, false, false),
                new AttributeData("vitality", "Health & Vitality", "favorite", 1, 0, 0, 2, 0, false, false),
                new AttributeData("creativity", "Creativity", "palette", 1, 0, 0, 2, 0, false, false),
                new AttributeData("social", "Social & Empathy", "groups", 1, 0, 0, 2, 0, false, false),
                new AttributeData("travel", "Experience & Travel", "flight_takeoff", 1, 0, 0, 2, 0, false, false)
        );

        for (AttributeData d : defaults) {
            if (attributeRepository.findByUserAndAttributeKey(user, d.key).isEmpty()) {
                Attribute attr = new Attribute(user, d.key, d.label, d.icon, d.level, d.xp, d.xp, d.weeklyXp, d.nextThreshold, d.pct);
                attr.setStable(d.stable);
                attr.setNeedQuest(d.needQuest);
                attributeRepository.save(attr);
            }
        }
    }

    private record AttributeData(String key, String label, String icon, int level, long xp, long weeklyXp,
                                 int nextThreshold, int pct, boolean stable, boolean needQuest) {}
}
