package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "proof_of_work", indexes = {
    @Index(name = "idx_pow_user_id", columnList = "user_id")
})
public class ProofOfWork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String source; // e.g. "Strava Tempo Run", "GitHub Commits"

    @Column(nullable = false)
    private String detail; // e.g. "5.2 km • 24m 12s", "3 PRs merged to main"

    @Column(nullable = false)
    private String reward; // e.g. "+180 STR XP", "+120 COD XP"

    @Column(nullable = false)
    private String icon = "directions_run";

    @Column(name = "external_reference")
    private String externalReference;

    @Column(nullable = false)
    private boolean verified = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ProofOfWork() {}

    public ProofOfWork(User user, String source, String detail, String reward, String icon, String externalReference, boolean verified) {
        this.user = user;
        this.source = source;
        this.detail = detail;
        this.reward = reward;
        this.icon = icon;
        this.externalReference = externalReference;
        this.verified = verified;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }

    public String getReward() { return reward; }
    public void setReward(String reward) { this.reward = reward; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getExternalReference() { return externalReference; }
    public void setExternalReference(String externalReference) { this.externalReference = externalReference; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
