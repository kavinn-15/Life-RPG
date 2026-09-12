package com.liferpg.dto.guild;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateGuildRequestDTO {

    @NotBlank(message = "Guild name cannot be blank")
    @Size(min = 3, max = 50, message = "Guild name must be between 3 and 50 characters")
    private String name;

    @NotBlank(message = "Guild tag cannot be blank")
    @Size(min = 2, max = 8, message = "Guild tag must be between 2 and 8 characters")
    private String tag;

    @NotBlank(message = "Guild motto cannot be blank")
    @Size(max = 200, message = "Motto cannot exceed 200 characters")
    private String motto;

    private String description;

    private String domainSphere = "Code & Logic";

    private String icon = "terminal";

    private boolean isPublic = true;

    public CreateGuildRequestDTO() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getMotto() { return motto; }
    public void setMotto(String motto) { this.motto = motto; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDomainSphere() { return domainSphere; }
    public void setDomainSphere(String domainSphere) { this.domainSphere = domainSphere; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean aPublic) { isPublic = aPublic; }
}
