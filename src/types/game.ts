
// Character stats and progression
export interface CharacterStats {
  clarity: number;
  conciseness: number;
  creativity: number;
  logic: number;
  debugging: number;
  configuration: number;
}

export interface Character {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  stats: CharacterStats;
  unassignedPoints: number;
  energy: number;
  maxEnergy: number;
  tokens: number;
  completedQuests: string[];
  unlockedTechniques: string[];
  activeQuest: string | null;
}

// LLM Core types
export interface LLMCore {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseAccuracy: number;
  hallucination: number;
  creativityBias: number;
  logicBias: number;
  unlocked: boolean;
  icon: string;
}

// Prompt techniques
export interface Technique {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  energyCost: number;
  unlocked: boolean;
  icon: string;
}

// Quest system
export interface QuestRequirement {
  type: 'level' | 'stat' | 'technique' | 'quest';
  target: string;
  value: number;
}

export interface QuestReward {
  type: 'xp' | 'tokens' | 'technique' | 'core' | 'stat';
  target?: string;
  value: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'tutorial' | 'main' | 'side' | 'challenge';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  objective: string;
  requirements: QuestRequirement[];
  rewards: QuestReward[];
  available: boolean;
  completed: boolean;
  promptTemplate?: string;
  expectedOutcome?: string;
  hints: string[];
}

// Game state
export interface GameState {
  character: Character;
  availableLLMCores: LLMCore[];
  activeLLMCore: string;
  availableTechniques: Technique[];
  quests: Quest[];
  tutorial: {
    completed: boolean;
    currentStep: number;
    totalSteps: number;
  };
  promptConfig: {
    temperature: number;
    topK: number;
    topP: number;
    maxTokens: number;
  };
  currentPrompt: string;
  lastResponse: string | null;
  gamePhase: 'intro' | 'tutorial' | 'main' | 'quest';
}
