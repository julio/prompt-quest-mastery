
import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Cpu, Brain, Zap } from 'lucide-react';

const IntroSequence: React.FC = () => {
  const { state, dispatch } = useGame();
  const [step, setStep] = useState(0);
  const [nameInput, setNameInput] = useState('');
  const [inputError, setInputError] = useState('');
  
  const handleNext = () => {
    if (step === 1 && !nameInput.trim()) {
      setInputError('Please enter a name');
      return;
    }
    
    if (step === 1) {
      dispatch({ type: 'SET_CHARACTER_NAME', payload: nameInput });
    }
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      dispatch({ type: 'SET_GAME_PHASE', payload: 'tutorial' });
    }
  };
  
  const introContent = [
    {
      title: "Welcome to Prompt Engineering: The RPG",
      content: "In a world where AI language models shape the digital landscape, the art of prompt engineering has become a crucial skill. As a budding prompt engineer, you'll learn to master the techniques needed to command these powerful models.",
      image: <Sparkles size={48} className="text-rpg-accent animate-float" />
    },
    {
      title: "Create Your Character",
      content: "Before you begin your journey, you'll need to establish your identity. What shall we call you, aspiring prompt engineer?",
      image: <Cpu size={48} className="text-rpg-accent animate-float" />
    },
    {
      title: "Your Mission Begins",
      content: "As a novice prompt engineer, you'll start with basic tasks and gradually take on more complex challenges. Complete quests to earn XP, tokens, and unlock new techniques and LLM cores.",
      image: <Brain size={48} className="text-rpg-accent animate-float" />
    },
    {
      title: "The Adventure Awaits",
      content: "Your journey to becoming a master prompt engineer begins now. Good luck, and remember - the power of language models is in your hands!",
      image: <Zap size={48} className="text-rpg-accent animate-float" />
    }
  ];
  
  const currentContent = introContent[step];
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-rpg-dark">
      <Card className="bg-rpg-main border-rpg-accent p-6 max-w-md w-full">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="h-20 flex items-center justify-center">
            {currentContent.image}
          </div>
          
          <h1 className="font-pixel text-xl text-rpg-highlight">{currentContent.title}</h1>
          
          <p className="font-code text-sm">{currentContent.content}</p>
          
          {step === 1 && (
            <div className="w-full space-y-2">
              <Input 
                placeholder="Enter your name"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setInputError('');
                }}
                className="bg-rpg-dark border-rpg-light text-rpg-text font-code"
              />
              {inputError && <p className="text-xs text-rpg-danger">{inputError}</p>}
            </div>
          )}
          
          <div className="w-full pt-4">
            <Button 
              onClick={handleNext}
              className="rpg-button w-full"
            >
              {step < 3 ? 'Continue' : 'Start Your Journey'}
            </Button>
          </div>
          
          <div className="flex gap-2 pt-2">
            {introContent.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full ${idx === step ? 'bg-rpg-accent' : 'bg-rpg-light'}`}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IntroSequence;
