package com.liferpg.dto.guild;

import jakarta.validation.constraints.Min;

public class ContributeGuildXpRequestDTO {

    @Min(value = 1, message = "Contribution amount must be at least 1 XP")
    private long xpAmount = 100;

    public ContributeGuildXpRequestDTO() {}

    public long getXpAmount() { return xpAmount; }
    public void setXpAmount(long xpAmount) { this.xpAmount = xpAmount; }
}
