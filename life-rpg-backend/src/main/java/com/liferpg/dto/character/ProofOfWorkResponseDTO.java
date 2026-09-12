package com.liferpg.dto.character;

public class ProofOfWorkResponseDTO {
    private Long id;
    private String source;
    private String detail;
    private String reward;
    private String icon;
    private boolean verified;

    public ProofOfWorkResponseDTO() {}

    public ProofOfWorkResponseDTO(Long id, String source, String detail, String reward, String icon, boolean verified) {
        this.id = id;
        this.source = source;
        this.detail = detail;
        this.reward = reward;
        this.icon = icon;
        this.verified = verified;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }

    public String getReward() { return reward; }
    public void setReward(String reward) { this.reward = reward; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
