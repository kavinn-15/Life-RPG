package com.liferpg.service;

import com.liferpg.dto.character.CharacterResponseDTO;
import com.liferpg.dto.quest.QuestCompletionResponseDTO;
import com.liferpg.entity.Character;
import com.liferpg.entity.Quest;
import com.liferpg.entity.User;
import com.liferpg.enums.QuestStatus;
import com.liferpg.enums.QuestType;
import com.liferpg.enums.UserRole;
import com.liferpg.exception.QuestCompletionException;
import com.liferpg.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GameEngineServiceTest {

    @Mock private QuestRepository questRepository;
    @Mock private CharacterRepository characterRepository;
    @Mock private UserDomainRepository userDomainRepository;
    private LevelService levelService;
    @Mock private AttributeService attributeService;
    @Mock private StreakService streakService;
    @Mock private AchievementService achievementService;
    @Mock private NotificationService notificationService;
    @Mock private XpHistoryRepository xpHistoryRepository;
    @Mock private GoldTransactionRepository goldTransactionRepository;
    @Mock private CharacterService characterService;

    private GameEngineService gameEngineService;
    private User user;
    private Character character;
    private Quest activeQuest;

    @BeforeEach
    void setUp() {
        levelService = new LevelService();
        gameEngineService = new GameEngineService(
                questRepository, characterRepository, userDomainRepository,
                levelService, attributeService, streakService, achievementService,
                notificationService, xpHistoryRepository, goldTransactionRepository,
                characterService
        );

        user = new User("testplayer@liferpg.app", "pass", "Test Player", UserRole.USER);
        user.setId(1L);

        character = new Character(user);
        character.setGold(100);
        character.setLevel(5);

        activeQuest = new Quest();
        activeQuest.setId("quest-1");
        activeQuest.setUser(user);
        activeQuest.setTitle("Build Backend");
        activeQuest.setStatus(QuestStatus.ACTIVE);
        activeQuest.setXpReward(200);
        activeQuest.setGoldReward(50);
        activeQuest.setDifficulty("Hard");
        activeQuest.setQuestType(QuestType.MAIN);
    }

    @Test
    @DisplayName("Completing an already completed quest throws QuestCompletionException")
    void testCannotCompleteAlreadyCompletedQuest() {
        activeQuest.setStatus(QuestStatus.COMPLETED);
        when(questRepository.findByIdAndUserId("quest-1", 1L)).thenReturn(Optional.of(activeQuest));

        assertThrows(QuestCompletionException.class, () ->
                gameEngineService.processQuestCompletion(1L, "quest-1")
        );

        verify(characterRepository, never()).save(any());
    }

    @Test
    @DisplayName("Completing active quest awards Gold, XP, marks quest completed, and saves state")
    void testSuccessfulQuestCompletion() {
        when(questRepository.findByIdAndUserId("quest-1", 1L)).thenReturn(Optional.of(activeQuest));
        when(characterRepository.findByUserId(1L)).thenReturn(Optional.of(character));
        when(streakService.processDailyActivity(user, character, 200))
                .thenReturn(new StreakService.StreakUpdateResult(false, 5, null));
        when(questRepository.countByUserIdAndStatus(1L, QuestStatus.COMPLETED)).thenReturn(10L);
        when(achievementService.evaluateAchievements(user, character, 10L)).thenReturn(List.of());
        when(characterService.getCharacter(1L)).thenReturn(new CharacterResponseDTO());

        QuestCompletionResponseDTO response = gameEngineService.processQuestCompletion(1L, "quest-1");

        assertNotNull(response);
        assertEquals(QuestStatus.COMPLETED, activeQuest.getStatus());
        assertNotNull(activeQuest.getCompletedAt());
        assertEquals(150, character.getGold()); // 100 + 50
        assertEquals(200, response.getXpGained());
        assertEquals(50, response.getGoldGained());

        verify(characterRepository).save(character);
        verify(questRepository).save(activeQuest);
        verify(goldTransactionRepository).save(any());
        verify(xpHistoryRepository).save(any());
        verify(notificationService).createNotification(any(), any(), any(), any(), any(), any(), any(), any());
    }
}
