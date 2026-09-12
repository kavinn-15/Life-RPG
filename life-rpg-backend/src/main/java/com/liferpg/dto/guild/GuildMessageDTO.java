package com.liferpg.dto.guild;

import java.time.LocalDateTime;

public class GuildMessageDTO {

    private Long id;
    private Long senderId;
    private String senderName;
    private String senderRole;
    private String senderAvatar;
    private String message;
    private String type;
    private LocalDateTime createdAt;

    public GuildMessageDTO() {}

    public GuildMessageDTO(Long id, Long senderId, String senderName, String senderRole, String senderAvatar, String message, String type, LocalDateTime createdAt) {
        this.id = id;
        this.senderId = senderId;
        this.senderName = senderName;
        this.senderRole = senderRole;
        this.senderAvatar = senderAvatar;
        this.message = message;
        this.type = type;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderRole() { return senderRole; }
    public void setSenderRole(String senderRole) { this.senderRole = senderRole; }

    public String getSenderAvatar() { return senderAvatar; }
    public void setSenderAvatar(String senderAvatar) { this.senderAvatar = senderAvatar; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
