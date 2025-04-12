
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Settings, Award, X } from 'lucide-react';

const TutorialGuide: React.FC = () => {
  const { state, dispatch } = useGame();
  const { tutorial, gamePhase } = state;
  
  const handleAdvanceTutorial = () => {
    if (tutorial.currentStep < tutorial.totalSteps - 1) {
      dispatch({ type: 'ADVANCE_TUTORIAL' });
    } else {
      dispatch({ type: 'COMPLETE_TUTORIAL' });
    }
  };
  
  const handleSkipTutorial = () => {
    dispatch({ type: 'COMPLETE_TUTORIAL' });
  };
  
  const tutorialSteps = [
    {
      title: "Welcome to the Prompt Engineering Lab",
      content: "This is your training ground for mastering prompt engineering. Let me guide you through the basics.",
      icon: <MessageSquare className="text-rpg-accent" size={24} />
    },
    {
      title: "Understanding the Interface",
      content: "Your character stats influence your success with different types of prompts. The prompt interface lets you craft instructions for the LLM. The output terminal shows responses.",
      icon: <Settings className="text-rpg-accent" size={24} />
    },
    {
      title: "Completing Quests",
      content: "Select a quest from the quest panel to get started. Each quest has objectives, hints, and rewards. Use the right techniques to succeed!",
      icon: <Award className="text-rpg-accent" size={24} />
    }
  ];
  
  if (gamePhase !== 'tutorial' || tutorial.completed) {
    return null;
  }
  
  const currentStep = tutorialSteps[tutorial.currentStep];
  
  return (
    <Card className="fixed bottom-4 right-4 bg-rpg-main border-rpg-accent p-4 max-w-md shadow-lg animate-fade-in z-10">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          {currentStep.icon}
          <div>
            <h3 className="font-pixel text-lg text-rpg-highlight">{currentStep.title}</h3>
            <p className="text-sm mt-2">{currentStep.content}</p>
          </div>
        </div>
        <button 
          onClick={handleSkipTutorial}
          className="text-rpg-text hover:text-rpg-highlight transition-colors"
          aria-label="Skip tutorial"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-1">
          {tutorialSteps.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-2 h-2 rounded-full ${idx === tutorial.currentStep ? 'bg-rpg-accent' : 'bg-rpg-light'}`}
            />
          ))}
        </div>
        
        <Button 
          onClick={handleAdvanceTutorial}
          className="rpg-button"
        >
          {tutorial.currentStep < tutorial.totalSteps - 1 ? 'Next' : 'Start Playing'}
        </Button>
      </div>
    </Card>
  );
};

export default TutorialGuide;
