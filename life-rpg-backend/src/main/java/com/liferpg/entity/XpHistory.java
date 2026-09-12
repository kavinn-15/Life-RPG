package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "xp_history", indexes = {
    @Index(name = "idx_xp_history_user_id", columnList = "user_id"),
    @Index(name = "idx_xp_history_created_at", columnList = "created_at")
})
public class XpHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "source_type", nullable = false)
    private String sourceType; // "QUEST", "MISSION", "ACHIEVEMENT"

    @Column(name = "source_id")
    private String sourceId;

    @Column(name = "xp_amount", nullable = false)
    private int xpAmount;

    @Column(name = "attribute_key")
    private String attributeKey;

    @Column(name = "domain_id")
    private String domainId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public XpHistory() {}

    public XpHistory(User user, String sourceType, String sourceId, int xpAmount, String attributeKey, String domainId) {
        this.user = user;
        this.sourceType = sourceType;
        this.sourceId = sourceId;
        this.xpAmount = xpAmount;
        this.attributeKey = attributeKey;
        this.domainId = domainId;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }

    public int getXpAmount() { return xpAmount; }
    public void setXpAmount(int xpAmount) { this.xpAmount = xpAmount; }

    public String getAttributeKey() { return attributeKey; }
    public void setAttributeKey(String attributeKey) { this.attributeKey = attributeKey; }

    public String getDomainId() { return domainId; }
    public void setDomainId(String domainId) { this.domainId = domainId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
