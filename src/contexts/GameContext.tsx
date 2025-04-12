import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState } from '../types/game';
import { initialGameState } from '../data/gameData';
import { toast } from '@/components/ui/sonner';

type GameAction =
  | { type: 'SET_CHARACTER_NAME'; payload: string }
  | { type: 'GAIN_XP'; payload: number }
  | { type: 'LEVEL_UP' }
  | { type: 'INCREASE_STAT'; payload: { stat: keyof GameState['character']['stats']; amount: number } }
  | { type: 'SPEND_ENERGY'; payload: number }
  | { type: 'RESTORE_ENERGY'; payload: number }
  | { type: 'EARN_TOKENS'; payload: number }
  | { type: 'SPEND_TOKENS'; payload: number }
  | { type: 'UNLOCK_TECHNIQUE'; payload: string }
  | { type: 'UPGRADE_TECHNIQUE'; payload: string }
  | { type: 'UNLOCK_LLM_CORE'; payload: string }
  | { type: 'SET_ACTIVE_LLM_CORE'; payload: string }
  | { type: 'UPDATE_PROMPT_CONFIG'; payload: Partial<GameState['promptConfig']> }
  | { type: 'SET_CURRENT_PROMPT'; payload: string }
  | { type: 'SET_RESPONSE'; payload: string }
  | { type: 'START_QUEST'; payload: string }
  | { type: 'COMPLETE_QUEST'; payload: string }
  | { type: 'ADVANCE_TUTORIAL' }
  | { type: 'COMPLETE_TUTORIAL' }
  | { type: 'SET_GAME_PHASE'; payload: GameState['gamePhase'] };

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_CHARACTER_NAME':
      return {
        ...state,
        character: {
          ...state.character,
          name: action.payload
        }
      };
    
    case 'GAIN_XP': {
      const newXP = state.character.xp + action.payload;
      const shouldLevelUp = newXP >= state.character.xpToNextLevel;
      
      if (shouldLevelUp) {
        const remainingXP = newXP - state.character.xpToNextLevel;
        const newLevel = state.character.level + 1;
        const newXPToNextLevel = Math.floor(state.character.xpToNextLevel * 1.5);
        
        toast.success(`Level Up! You are now level ${newLevel}!`);
        
        return {
          ...state,
          character: {
            ...state.character,
            level: newLevel,
            xp: remainingXP,
            xpToNextLevel: newXPToNextLevel,
            unassignedPoints: state.character.unassignedPoints + 3,
            energy: state.character.maxEnergy,
            maxEnergy: state.character.maxEnergy + 10
          },
          quests: state.quests.map(quest => {
            // Check if level requirements are met after leveling up
            const levelReq = quest.requirements.find(req => req.type === 'level');
            if (levelReq && newLevel >= levelReq.value) {
              return { ...quest, available: true };
            }
            return quest;
          })
        };
      }
      
      return {
        ...state,
        character: {
          ...state.character,
          xp: newXP
        }
      };
    }
    
    case 'INCREASE_STAT':
      if (state.character.unassignedPoints <= 0) {
        toast.error("No skill points available!");
        return state;
      }
      
      return {
        ...state,
        character: {
          ...state.character,
          stats: {
            ...state.character.stats,
            [action.payload.stat]: state.character.stats[action.payload.stat] + action.payload.amount
          },
          unassignedPoints: state.character.unassignedPoints - 1
        }
      };
    
    case 'SPEND_ENERGY':
      if (state.character.energy < action.payload) {
        toast.error("Not enough energy!");
        return state;
      }
      
      return {
        ...state,
        character: {
          ...state.character,
          energy: state.character.energy - action.payload
        }
      };
    
    case 'RESTORE_ENERGY':
      return {
        ...state,
        character: {
          ...state.character,
          energy: Math.min(state.character.energy + action.payload, state.character.maxEnergy)
        }
      };
    
    case 'EARN_TOKENS':
      return {
        ...state,
        character: {
          ...state.character,
          tokens: state.character.tokens + action.payload
        }
      };
    
    case 'SPEND_TOKENS':
      if (state.character.tokens < action.payload) {
        toast.error("Not enough tokens!");
        return state;
      }
      
      return {
        ...state,
        character: {
          ...state.character,
          tokens: state.character.tokens - action.payload
        }
      };
    
    case 'UNLOCK_TECHNIQUE':
      return {
        ...state,
        availableTechniques: state.availableTechniques.map(technique => 
          technique.id === action.payload
            ? { ...technique, unlocked: true, level: 1 }
            : technique
        ),
        character: {
          ...state.character,
          unlockedTechniques: [...state.character.unlockedTechniques, action.payload]
        }
      };
    
    case 'UPGRADE_TECHNIQUE':
      return {
        ...state,
        availableTechniques: state.availableTechniques.map(technique => 
          technique.id === action.payload && technique.level < technique.maxLevel
            ? { ...technique, level: technique.level + 1 }
            : technique
        )
      };
    
    case 'UNLOCK_LLM_CORE':
      toast.success(`New LLM Core unlocked: ${action.payload}!`);
      return {
        ...state,
        availableLLMCores: state.availableLLMCores.map(core => 
          core.id === action.payload
            ? { ...core, unlocked: true }
            : core
        )
      };
    
    case 'SET_ACTIVE_LLM_CORE':
      return {
        ...state,
        activeLLMCore: action.payload
      };
    
    case 'UPDATE_PROMPT_CONFIG':
      return {
        ...state,
        promptConfig: {
          ...state.promptConfig,
          ...action.payload
        }
      };
    
    case 'SET_CURRENT_PROMPT':
      return {
        ...state,
        currentPrompt: action.payload
      };
    
    case 'SET_RESPONSE':
      return {
        ...state,
        lastResponse: action.payload
      };
    
    case 'START_QUEST':
      return {
        ...state,
        character: {
          ...state.character,
          activeQuest: action.payload
        }
      };
    
    case 'COMPLETE_QUEST': {
      const completedQuest = state.quests.find(q => q.id === action.payload);
      if (!completedQuest) return state;
      
      toast.success(`Quest Completed: ${completedQuest.name}!`);
      
      // Process rewards
      let newState = {
        ...state,
        quests: state.quests.map(quest => 
          quest.id === action.payload
            ? { ...quest, completed: true }
            : quest
        ),
        character: {
          ...state.character,
          completedQuests: [...state.character.completedQuests, action.payload],
          activeQuest: null
        }
      };
      
      // Handle individual rewards
      completedQuest.rewards.forEach(reward => {
        switch (reward.type) {
          case 'xp':
            // Gain XP handled separately to check for level up
            newState = gameReducer(newState, { type: 'GAIN_XP', payload: reward.value });
            break;
          case 'tokens':
            newState = gameReducer(newState, { type: 'EARN_TOKENS', payload: reward.value });
            break;
          case 'technique':
            if (reward.target) {
              newState = gameReducer(newState, { type: 'UNLOCK_TECHNIQUE', payload: reward.target });
            }
            break;
          case 'core':
            if (reward.target) {
              newState = gameReducer(newState, { type: 'UNLOCK_LLM_CORE', payload: reward.target });
            }
            break;
          // Add other reward types as needed
        }
      });
      
      // Update quest availability based on completed quests
      newState = {
        ...newState,
        quests: newState.quests.map(quest => {
          const questRequirement = quest.requirements.find(req => req.type === 'quest');
          if (questRequirement && questRequirement.target === action.payload) {
            return { ...quest, available: true };
          }
          return quest;
        })
      };
      
      return newState;
    }
    
    case 'ADVANCE_TUTORIAL':
      return {
        ...state,
        tutorial: {
          ...state.tutorial,
          currentStep: state.tutorial.currentStep + 1
        }
      };
    
    case 'COMPLETE_TUTORIAL':
      return {
        ...state,
        tutorial: {
          ...state.tutorial,
          completed: true
        },
        gamePhase: 'main'
      };
    
    case 'SET_GAME_PHASE':
      return {
        ...state,
        gamePhase: action.payload
      };
    
    default:
      return state;
  }
}

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
