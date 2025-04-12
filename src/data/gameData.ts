
import { LLMCore, Technique, Quest, Character } from "../types/game";
import { 
  Sparkles, Brain, Code, FileJson, MessageSquare, BadgeCheck, 
  Zap, TerminalSquare, Lightbulb, Puzzle, Award
} from "lucide-react";

// Initial character setup
export const initialCharacter: Character = {
  name: "Novice Engineer",
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  stats: {
    clarity: 1,
    conciseness: 1,
    creativity: 1,
    logic: 1,
    debugging: 1,
    configuration: 1
  },
  unassignedPoints: 0,
  energy: 100,
  maxEnergy: 100,
  tokens: 50,
  completedQuests: [],
  unlockedTechniques: ["zero-shot"],
  activeQuest: null
};

// LLM Cores
export const llmCores: LLMCore[] = [
  {
    id: "basic-core",
    name: "Basic Core",
    description: "A simple LLM core with balanced capabilities. Good for beginners.",
    baseCost: 5,
    baseAccuracy: 0.7,
    hallucination: 0.3,
    creativityBias: 0.5,
    logicBias: 0.5,
    unlocked: true,
    icon: "Cpu"
  },
  {
    id: "creative-core",
    name: "Creative Core",
    description: "Specializes in creative outputs. Good for storytelling and content generation.",
    baseCost: 8,
    baseAccuracy: 0.65,
    hallucination: 0.4,
    creativityBias: 0.8,
    logicBias: 0.3,
    unlocked: false,
    icon: "Sparkles"
  },
  {
    id: "logic-core",
    name: "Logic Core",
    description: "Excels at logical reasoning and structured outputs. Ideal for code and data.",
    baseCost: 8,
    baseAccuracy: 0.75,
    hallucination: 0.2,
    creativityBias: 0.3,
    logicBias: 0.8,
    unlocked: false,
    icon: "Brain"
  },
  {
    id: "advanced-core",
    name: "Advanced Core",
    description: "High-performance core with excellent capabilities across all domains.",
    baseCost: 12,
    baseAccuracy: 0.85,
    hallucination: 0.15,
    creativityBias: 0.7,
    logicBias: 0.7,
    unlocked: false,
    icon: "Zap"
  }
];

// Prompt Engineering Techniques
export const techniques: Technique[] = [
  {
    id: "zero-shot",
    name: "Zero-Shot Prompting",
    description: "Direct instruction to the LLM without examples.",
    level: 1,
    maxLevel: 3,
    energyCost: 5,
    unlocked: true,
    icon: "MessageSquare"
  },
  {
    id: "few-shot",
    name: "Few-Shot Learning",
    description: "Include examples to guide the LLM's responses.",
    level: 0,
    maxLevel: 3,
    energyCost: 10,
    unlocked: false,
    icon: "Copy"
  },
  {
    id: "role-prompt",
    name: "Role Prompting",
    description: "Assign a specific role to the LLM to shape its responses.",
    level: 0,
    maxLevel: 3,
    energyCost: 8,
    unlocked: false,
    icon: "UserCircle"
  },
  {
    id: "cot",
    name: "Chain of Thought",
    description: "Guide the LLM to break down complex problems step by step.",
    level: 0,
    maxLevel: 3,
    energyCost: 15,
    unlocked: false,
    icon: "List"
  },
  {
    id: "json-format",
    name: "JSON Formatting",
    description: "Structure outputs as JSON for easier data extraction.",
    level: 0,
    maxLevel: 3,
    energyCost: 12,
    unlocked: false,
    icon: "FileJson"
  },
  {
    id: "react",
    name: "ReAct Prompting",
    description: "Alternate between reasoning and actions for problem-solving.",
    level: 0,
    maxLevel: 3,
    energyCost: 20,
    unlocked: false,
    icon: "Braces"
  }
];

// Quests
export const quests: Quest[] = [
  {
    id: "tutorial-basics",
    name: "Prompt Basics",
    description: "Learn the fundamentals of interacting with an LLM.",
    type: "tutorial",
    difficulty: "beginner",
    objective: "Create your first successful prompt using Zero-Shot technique",
    requirements: [],
    rewards: [
      { type: "xp", value: 50 },
      { type: "tokens", value: 25 }
    ],
    available: true,
    completed: false,
    promptTemplate: "Write a brief summary about prompt engineering.",
    expectedOutcome: "CONTAINS:prompt engineering,language models,instructions",
    hints: [
      "Be clear and specific in your instructions",
      "Ask directly for what you want",
      "Don't overthink it for this first quest!"
    ]
  },
  {
    id: "summarize-text",
    name: "The Art of Summarization",
    description: "Practice creating prompts that generate concise summaries.",
    type: "main",
    difficulty: "beginner",
    objective: "Create a prompt that summarizes the provided text in 3 bullet points",
    requirements: [
      { type: "quest", target: "tutorial-basics", value: 1 }
    ],
    rewards: [
      { type: "xp", value: 75 },
      { type: "tokens", value: 30 },
      { type: "technique", target: "few-shot", value: 1 }
    ],
    available: false,
    completed: false,
    promptTemplate: "",
    expectedOutcome: "FORMAT:bullet points,COUNT:3",
    hints: [
      "Specify the exact format you want (bullet points)",
      "Be explicit about the number of points",
      "Consider setting a character limit"
    ]
  },
  {
    id: "code-generation",
    name: "Code Craftsman",
    description: "Learn to generate code with effective prompts.",
    type: "main",
    difficulty: "intermediate",
    objective: "Generate working JavaScript code that sorts an array of objects",
    requirements: [
      { type: "level", target: "", value: 2 }
    ],
    rewards: [
      { type: "xp", value: 100 },
      { type: "tokens", value: 50 },
      { type: "core", target: "logic-core", value: 1 }
    ],
    available: false,
    completed: false,
    hints: [
      "Be specific about the language (JavaScript)",
      "Describe the exact functionality needed",
      "Specify input and expected output examples"
    ]
  },
  {
    id: "creative-story",
    name: "Tale Weaver",
    description: "Master creative content generation with LLMs.",
    type: "main",
    difficulty: "intermediate",
    objective: "Create a short story about AI with a surprise ending",
    requirements: [
      { type: "level", target: "", value: 2 }
    ],
    rewards: [
      { type: "xp", value: 100 },
      { type: "tokens", value: 50 },
      { type: "core", target: "creative-core", value: 1 }
    ],
    available: false,
    completed: false,
    hints: [
      "Set the theme, characters and setting",
      "Define the tone and length",
      "Request a specific plot structure"
    ]
  }
];

// Initial game state
export const initialGameState = {
  character: initialCharacter,
  availableLLMCores: llmCores,
  activeLLMCore: "basic-core",
  availableTechniques: techniques,
  quests: quests,
  tutorial: {
    completed: false,
    currentStep: 0,
    totalSteps: 3
  },
  promptConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.9,
    maxTokens: 100
  },
  currentPrompt: "",
  lastResponse: null,
  gamePhase: "intro" as const
};
