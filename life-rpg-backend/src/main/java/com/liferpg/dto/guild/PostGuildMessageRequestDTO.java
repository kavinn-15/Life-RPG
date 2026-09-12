package com.liferpg.dto.guild;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PostGuildMessageRequestDTO {

    @NotBlank(message = "Message content cannot be blank")
    @Size(max = 1000, message = "Message cannot exceed 1000 characters")
    private String message;

    private String type = "CHAT";

    public PostGuildMessageRequestDTO() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
