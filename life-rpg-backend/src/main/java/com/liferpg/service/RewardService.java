package com.liferpg.service;

import com.liferpg.dto.reward.RewardResponseDTO;
import com.liferpg.entity.*;
import com.liferpg.entity.Character;
import com.liferpg.enums.NotificationType;
import com.liferpg.enums.TransactionType;
import com.liferpg.exception.BadRequestException;
import com.liferpg.exception.InsufficientGoldException;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RewardService {

    private final RewardRepository rewardRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final CharacterRepository characterRepository;
    private final GoldTransactionRepository goldTransactionRepository;
    private final NotificationService notificationService;

    public RewardService(RewardRepository rewardRepository,
                         InventoryItemRepository inventoryItemRepository,
                         CharacterRepository characterRepository,
                         GoldTransactionRepository goldTransactionRepository,
                         NotificationService notificationService) {
        this.rewardRepository = rewardRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.characterRepository = characterRepository;
        this.goldTransactionRepository = goldTransactionRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<RewardResponseDTO> getAllRewards(Long userId) {
        List<Reward> rewards = rewardRepository.findByActiveTrue();
        Map<String, InventoryItem> inventoryMap = inventoryItemRepository.findByUserId(userId)
                .stream()
                .collect(Collectors.toMap(i -> i.getReward().getId(), i -> i, (a, b) -> a));

        return rewards.stream().map(r -> {
            InventoryItem item = inventoryMap.get(r.getId());
            boolean owned = item != null;
            boolean equipped = item != null && item.isEquipped();
            return new RewardResponseDTO(
                    r.getId(),
                    r.getName(),
                    r.getDescription(),
                    r.getIcon(),
                    r.getCategory().getDisplayName(),
                    r.getPrice(),
                    owned,
                    equipped
            );
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RewardResponseDTO getRewardById(Long userId, String id) {
        Reward r = rewardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found with id: " + id));

        boolean owned = inventoryItemRepository.existsByUserIdAndRewardId(userId, id);
        boolean equipped = inventoryItemRepository.findByUserIdAndRewardId(userId, id)
                .map(InventoryItem::isEquipped)
                .orElse(false);

        return new RewardResponseDTO(
                r.getId(),
                r.getName(),
                r.getDescription(),
                r.getIcon(),
                r.getCategory().getDisplayName(),
                r.getPrice(),
                owned,
                equipped
        );
    }

    @Transactional
    public RewardResponseDTO purchaseReward(Long userId, String rewardId) {
        Reward reward = rewardRepository.findById(rewardId)
                .filter(Reward::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found or inactive: " + rewardId));

        if (inventoryItemRepository.existsByUserIdAndRewardId(userId, rewardId)) {
            throw new BadRequestException("Reward " + rewardId + " already owned");
        }

        Character character = characterRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found for user: " + userId));

        if (character.getGold() < reward.getPrice()) {
            throw new InsufficientGoldException("Not enough Gold in your vault to purchase " + reward.getName() +
                    ". Required: " + reward.getPrice() + ", Available: " + character.getGold());
        }

        // Deduct Gold
        character.setGold(character.getGold() - reward.getPrice());
        characterRepository.save(character);

        // Add inventory item
        InventoryItem item = new InventoryItem(character.getUser(), reward, false);
        inventoryItemRepository.save(item);

        // Audit transaction
        goldTransactionRepository.save(new GoldTransaction(
                character.getUser(),
                TransactionType.REWARD_PURCHASE,
                -reward.getPrice(),
                character.getGold(),
                "REWARD",
                reward.getId(),
                "Purchased reward: " + reward.getName()
        ));

        // Create notification
        notificationService.createNotification(
                character.getUser(),
                NotificationType.reward_purchased,
                "Purchased: " + reward.getName(),
                "Deducted " + reward.getPrice() + " Gold from your vault.",
                reward.getIcon(),
                "text-secondary bg-secondary-fixed",
                "/inventory",
                "Inspect Inventory"
        );

        return new RewardResponseDTO(
                reward.getId(),
                reward.getName(),
                reward.getDescription(),
                reward.getIcon(),
                reward.getCategory().getDisplayName(),
                reward.getPrice(),
                true,
                false
        );
    }
}
