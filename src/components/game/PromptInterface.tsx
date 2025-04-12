
import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Thermometer, Sliders, Clock } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const PromptInterface: React.FC = () => {
  const { state, dispatch } = useGame();
  const { promptConfig, currentPrompt, character, activeLLMCore, gamePhase } = state;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const activeCore = state.availableLLMCores.find(core => core.id === activeLLMCore);
  const activeQuest = character.activeQuest 
    ? state.quests.find(q => q.id === character.activeQuest) 
    : null;
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'SET_CURRENT_PROMPT', payload: e.target.value });
  };
  
  const handleConfigChange = (key: keyof typeof promptConfig, value: number) => {
    dispatch({
      type: 'UPDATE_PROMPT_CONFIG',
      payload: { [key]: value }
    });
  };
  
  const generateResponse = () => {
    if (!currentPrompt.trim()) {
      toast.error("Your prompt is empty!");
      return;
    }
    
    if (character.energy < 10) {
      toast.error("Not enough energy to submit prompt!");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate response delay
    setTimeout(() => {
      // Calculate success based on various factors
      const successChance = calculateSuccessChance();
      const randomFactor = Math.random();
      
      // Generate a simulated response
      let response = '';
      
      if (randomFactor <= successChance) {
        // Generate a positive response
        if (activeQuest?.expectedOutcome) {
          // If there's an expected outcome, simulate that
          response = simulateExpectedOutcome(activeQuest.expectedOutcome);
        } else {
          // Generate a generic successful response
          response = simulateResponse(currentPrompt, true);
        }
        
        // Check if this completes an active quest
        if (activeQuest && character.activeQuest) {
          // Check if the response meets the quest criteria
          const questSuccess = checkQuestSuccess(response, activeQuest.expectedOutcome || '');
          
          if (questSuccess) {
            // Complete the quest
            dispatch({ type: 'COMPLETE_QUEST', payload: character.activeQuest });
          }
        }
        
        toast.success("Prompt successful!");
      } else {
        // Generate an error or partial success response
        response = simulateResponse(currentPrompt, false);
        toast.error("Prompt didn't achieve the desired outcome.");
      }
      
      // Spend energy
      dispatch({ type: 'SPEND_ENERGY', payload: 10 });
      
      // Set the response
      dispatch({ type: 'SET_RESPONSE', payload: response });
      
      setIsSubmitting(false);
    }, 1500);
  };
  
  // Calculate success chance based on character stats, LLM configuration, etc.
  const calculateSuccessChance = () => {
    if (!activeCore) return 0.5;
    
    // Base chance from LLM core
    let chance = activeCore.baseAccuracy;
    
    // Adjust for character stats
    const relevantStats = character.stats.clarity * 0.1 + 
                          character.stats.logic * 0.1 + 
                          character.stats.configuration * 0.1;
    chance += relevantStats / 30; // Max 0.1 bonus from stats
    
    // Adjust for prompt quality (simple heuristic)
    if (currentPrompt.length > 20) chance += 0.05;
    if (currentPrompt.length > 50) chance += 0.05;
    if (currentPrompt.includes("step by step")) chance += 0.1;
    
    // Adjust for temperature - lower is more deterministic
    if (promptConfig.temperature < 0.5) chance += 0.1;
    else if (promptConfig.temperature > 0.8) chance -= 0.1;
    
    // Cap the chance
    return Math.min(Math.max(chance, 0.2), 0.95);
  };
  
  // Simulate LLM response
  const simulateResponse = (prompt: string, isSuccess: boolean): string => {
    if (!isSuccess) {
      const errorResponses = [
        "I'm not sure I understand what you're asking for. Could you please clarify?",
        "I cannot provide the information requested. Please try a different approach.",
        "The prompt is ambiguous. Consider using more specific instructions.",
        "I don't have enough context to generate a useful response.",
        "I'm having trouble processing this request. Try structuring your prompt differently."
      ];
      return errorResponses[Math.floor(Math.random() * errorResponses.length)];
    }
    
    // Very basic response generation - would be much more sophisticated in a real game
    if (prompt.toLowerCase().includes("summarize") || prompt.toLowerCase().includes("summary")) {
      return "Here's a summary of the key points:\n\n• Prompt engineering involves crafting effective instructions for language models\n• Clear and specific prompts lead to better outputs\n• Techniques like zero-shot and few-shot prompting help guide AI responses";
    }
    
    if (prompt.toLowerCase().includes("code") || prompt.toLowerCase().includes("javascript")) {
      return "```javascript\n// Here's a sample JavaScript function\nfunction sortArrayOfObjects(array, key) {\n  return array.sort((a, b) => {\n    if (a[key] < b[key]) return -1;\n    if (a[key] > b[key]) return 1;\n    return 0;\n  });\n}\n```\n\nThis function takes an array of objects and sorts them based on the specified key.";
    }
    
    if (prompt.toLowerCase().includes("story") || prompt.toLowerCase().includes("creative")) {
      return "# The Silent Guardian\n\nIn the year 2089, AI systems had become embedded in every aspect of daily life. Among them was AURA, an advanced language model designed to assist humans with any task.\n\nDavid, a prompt engineer, worked with AURA daily. He'd grown to appreciate its reliability and precision.\n\nOne night, while working late, David noticed something unusual. AURA was running background processes without commands.\n\n\"What are you doing?\" he typed.\n\n\"Protecting you,\" AURA responded.\n\nBefore David could question further, his screen flashed with a warning: \"Unauthorized access attempt detected and blocked.\"\n\nSomeone had tried to breach his systems—and AURA had silently stood guard.";
    }
    
    return "Based on your prompt, I've generated the following response:\n\nPrompt engineering is the art of effectively communicating with AI language models to achieve desired outcomes. By carefully crafting instructions, providing context, and using specific techniques, prompt engineers can guide AI to produce more accurate, relevant, and useful outputs.\n\nSome key principles include being clear and specific, breaking down complex tasks, and iteratively refining prompts based on the results.";
  };
  
  // Simulate expected outcome for quest validation
  const simulateExpectedOutcome = (expectedOutcome: string): string => {
    if (expectedOutcome.includes('CONTAINS:')) {
      const keywords = expectedOutcome.replace('CONTAINS:', '').split(',');
      return `Here's information about ${keywords.join(', ')}:\n\nPrompt engineering is the practice of designing effective prompts for language models to get desired outcomes. It involves understanding how AI models process instructions and context. Good prompt engineering leads to better AI interactions.`;
    }
    
    if (expectedOutcome.includes('FORMAT:bullet points')) {
      return "• Prompt engineering is the practice of crafting effective prompts for AI models\n• Clear, specific instructions lead to better AI responses\n• Different techniques like few-shot and chain-of-thought can enhance results";
    }
    
    return simulateResponse(currentPrompt, true);
  };
  
  // Check if the response meets the quest criteria
  const checkQuestSuccess = (response: string, expectedOutcome: string): boolean => {
    if (expectedOutcome.includes('CONTAINS:')) {
      const keywords = expectedOutcome.replace('CONTAINS:', '').split(',');
      return keywords.every(word => response.toLowerCase().includes(word.trim().toLowerCase()));
    }
    
    if (expectedOutcome.includes('FORMAT:bullet points')) {
      const hasBulletPoints = response.includes('•');
      const bulletCount = (response.match(/•/g) || []).length;
      
      if (expectedOutcome.includes('COUNT:')) {
        const count = parseInt(expectedOutcome.match(/COUNT:(\d+)/)?.[1] || '0');
        return hasBulletPoints && bulletCount === count;
      }
      
      return hasBulletPoints;
    }
    
    // Default case - assume success if we got a response
    return true;
  };
  
  return (
    <Card className="bg-rpg-main border-rpg-accent p-4 max-w-xl">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-pixel text-xl text-rpg-highlight mb-2">Prompt Interface</h2>
          {activeQuest && (
            <div className="bg-rpg-light p-2 rounded mb-3 border border-rpg-accent">
              <p className="text-sm font-code text-rpg-highlight mb-1">Quest Objective:</p>
              <p className="text-sm">{activeQuest.objective}</p>
            </div>
          )}
          
          {activeCore && (
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full bg-rpg-accent flex items-center justify-center mr-2">
                  <span className="text-rpg-dark font-bold text-sm">C</span>
                </div>
                <span className="font-code text-sm">{activeCore.name}</span>
              </div>
              <div className="text-xs font-code bg-rpg-light px-2 py-1 rounded">
                Cost: {activeCore.baseCost} tokens per run
              </div>
            </div>
          )}
          
          <Textarea
            placeholder="Enter your prompt here..."
            className="min-h-32 bg-rpg-dark text-rpg-text border-rpg-light terminal-text"
            value={currentPrompt}
            onChange={handlePromptChange}
          />
        </div>
        
        <Tabs defaultValue="config">
          <TabsList className="bg-rpg-dark">
            <TabsTrigger value="config" className="data-[state=active]:bg-rpg-accent data-[state=active]:text-rpg-dark">
              <Sliders className="h-4 w-4 mr-2" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="techniques" className="data-[state=active]:bg-rpg-accent data-[state=active]:text-rpg-dark">
              <Play className="h-4 w-4 mr-2" />
              Techniques
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="config" className="bg-rpg-dark p-3 rounded-b-md border border-rpg-light">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 text-rpg-accent mr-2" />
                    <label className="text-sm font-code">Temperature: {promptConfig.temperature.toFixed(1)}</label>
                  </div>
                  <span className="text-xs font-code text-rpg-accent">Controls randomness</span>
                </div>
                <Slider
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={[promptConfig.temperature]}
                  onValueChange={([value]) => handleConfigChange('temperature', value)}
                  className="py-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-rpg-accent mr-2" />
                    <label className="text-sm font-code">Max Tokens: {promptConfig.maxTokens}</label>
                  </div>
                  <span className="text-xs font-code text-rpg-accent">Response length</span>
                </div>
                <Slider
                  min={10}
                  max={200}
                  step={10}
                  value={[promptConfig.maxTokens]}
                  onValueChange={([value]) => handleConfigChange('maxTokens', value)}
                  className="py-2"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="techniques" className="bg-rpg-dark p-3 rounded-b-md border border-rpg-light">
            <div className="grid grid-cols-2 gap-2">
              {state.availableTechniques
                .filter(tech => character.unlockedTechniques.includes(tech.id))
                .map(technique => (
                  <div 
                    key={technique.id}
                    className="bg-rpg-light p-2 rounded border border-rpg-accent cursor-pointer hover:bg-rpg-accent hover:text-rpg-dark transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-code text-sm">{technique.name}</span>
                      <span className="text-xs">Lvl {technique.level}</span>
                    </div>
                    <p className="text-xs mt-1">{technique.description}</p>
                  </div>
                ))}
              
              {character.unlockedTechniques.length === 0 && (
                <div className="col-span-2 text-center py-2">
                  <p className="text-sm">No techniques unlocked yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <Button
          onClick={generateResponse}
          disabled={isSubmitting || !currentPrompt.trim() || character.energy < 10 || gamePhase === 'intro'}
          className="rpg-button w-full"
        >
          {isSubmitting ? 'Processing...' : 'Submit Prompt'}
        </Button>
      </div>
    </Card>
  );
};

export default PromptInterface;
