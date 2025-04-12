
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import CharacterPanel from './CharacterPanel';
import PromptInterface from './PromptInterface';
import ResponseOutput from './ResponseOutput';
import QuestPanel from './QuestPanel';
import IntroSequence from './IntroSequence';
import TutorialGuide from './TutorialGuide';
import { Separator } from '@/components/ui/separator';
import { Brain, TerminalSquare, Settings, MenuSquare } from 'lucide-react';

const GameContainer: React.FC = () => {
  const { state } = useGame();
  const { gamePhase } = state;
  
  if (gamePhase === 'intro') {
    return <IntroSequence />;
  }
  
  return (
    <div className="min-h-screen bg-rpg-dark text-rpg-text">
      <header className="bg-rpg-main border-b border-rpg-accent px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Brain className="text-rpg-accent mr-2" size={24} />
            <h1 className="font-pixel text-lg text-rpg-highlight">Prompt Engineering: The RPG</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <TerminalSquare className="text-rpg-accent mr-1" size={16} />
              <span className="text-sm font-code">v1.0</span>
            </div>
            <div className="flex items-center cursor-pointer hover:text-rpg-highlight transition-colors">
              <Settings className="text-rpg-accent mr-1" size={16} />
              <span className="text-sm font-code">Settings</span>
            </div>
            <div className="flex items-center cursor-pointer hover:text-rpg-highlight transition-colors">
              <MenuSquare className="text-rpg-accent mr-1" size={16} />
              <span className="text-sm font-code">Menu</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <CharacterPanel />
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <PromptInterface />
            <ResponseOutput />
            
            <Separator className="bg-rpg-accent/30 my-4" />
            
            <QuestPanel />
          </div>
        </div>
        
        {/* Tutorial guide overlay */}
        <TutorialGuide />
      </main>
    </div>
  );
};

export default GameContainer;
