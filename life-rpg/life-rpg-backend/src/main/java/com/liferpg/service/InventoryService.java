package com.liferpg.service;

import com.liferpg.dto.reward.RewardResponseDTO;
import com.liferpg.entity.InventoryItem;
import com.liferpg.enums.RewardCategory;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.InventoryItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final InventoryItemRepository inventoryItemRepository;

    public InventoryService(InventoryItemRepository inventoryItemRepository) {
        this.inventoryItemRepository = inventoryItemRepository;
    }

    @Transactional(readOnly = true)
    public List<RewardResponseDTO> getUserInventory(Long userId) {
        return inventoryItemRepository.findByUserId(userId).stream().map(i -> new RewardResponseDTO(
                i.getReward().getId(),
                i.getReward().getName(),
                i.getReward().getDescription(),
                i.getReward().getIcon(),
                i.getReward().getCategory().getDisplayName(),
                i.getReward().getPrice(),
                true,
                i.isEquipped()
        )).collect(Collectors.toList());
    }

    @Transactional
    public RewardResponseDTO equipItem(Long userId, String rewardId) {
        InventoryItem item = inventoryItemRepository.findByUserIdAndRewardId(userId, rewardId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in inventory: " + rewardId));

        RewardCategory category = item.getReward().getCategory();

        // Unequip any other item currently equipped in the same category slot
        List<InventoryItem> currentlyEquipped = inventoryItemRepository.findEquippedByUserAndCategory(userId, category);
        for (InventoryItem eq : currentlyEquipped) {
            eq.setEquipped(false);
            inventoryItemRepository.save(eq);
        }

        item.setEquipped(true);
        inventoryItemRepository.save(item);

        return new RewardResponseDTO(
                item.getReward().getId(),
                item.getReward().getName(),
                item.getReward().getDescription(),
                item.getReward().getIcon(),
                item.getReward().getCategory().getDisplayName(),
                item.getReward().getPrice(),
                true,
                true
        );
    }

    @Transactional
    public RewardResponseDTO unequipItem(Long userId, String rewardId) {
        InventoryItem item = inventoryItemRepository.findByUserIdAndRewardId(userId, rewardId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in inventory: " + rewardId));

        item.setEquipped(false);
        inventoryItemRepository.save(item);

        return new RewardResponseDTO(
                item.getReward().getId(),
                item.getReward().getName(),
                item.getReward().getDescription(),
                item.getReward().getIcon(),
                item.getReward().getCategory().getDisplayName(),
                item.getReward().getPrice(),
                true,
                false
        );
    }
}
