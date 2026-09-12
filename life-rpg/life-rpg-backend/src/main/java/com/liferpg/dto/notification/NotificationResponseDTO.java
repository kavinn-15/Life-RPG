package com.liferpg.dto.notification;

public class NotificationResponseDTO {
    private String id;
    private String type;
    private String title;
    private String message;
    private String icon;
    private String iconColor;
    private boolean read;
    private String actionUrl;
    private String actionLabel;
    private String timestamp;
    private String date;

    public NotificationResponseDTO() {}

    public NotificationResponseDTO(String id, String type, String title, String message, String icon, String iconColor,
                                   boolean read, String actionUrl, String actionLabel, String timestamp, String date) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.message = message;
        this.icon = icon;
        this.iconColor = iconColor;
        this.read = read;
        this.actionUrl = actionUrl;
        this.actionLabel = actionLabel;
        this.timestamp = timestamp;
        this.date = date;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getIconColor() { return iconColor; }
    public void setIconColor(String iconColor) { this.iconColor = iconColor; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }

    public String getActionLabel() { return actionLabel; }
    public void setActionLabel(String actionLabel) { this.actionLabel = actionLabel; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
