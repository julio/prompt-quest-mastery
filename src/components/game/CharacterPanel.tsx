
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Lightbulb, Wrench, Glasses, Sliders } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CharacterPanel: React.FC = () => {
  const { state, dispatch } = useGame();
  const { character } = state;
  
  const handleIncreaseStat = (stat: keyof typeof character.stats) => {
    if (character.unassignedPoints > 0) {
      dispatch({ 
        type: 'INCREASE_STAT', 
        payload: { stat, amount: 1 } 
      });
    }
  };
  
  // Calculate XP progress percentage
  const xpProgress = (character.xp / character.xpToNextLevel) * 100;
  
  // Get unlockedTechniques names
  const unlockedTechniqueNames = state.availableTechniques
    .filter(tech => character.unlockedTechniques.includes(tech.id))
    .map(tech => tech.name);
  
  return (
    <Card className="bg-rpg-main border-rpg-accent p-4 max-w-md">
      <div className="flex flex-col gap-4">
        <div className="text-center mb-2">
          <h2 className="text-xl font-pixel text-rpg-highlight">{character.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Badge variant="outline" className="bg-rpg-light text-rpg-highlight border-rpg-highlight">
              Level {character.level}
            </Badge>
            {character.unassignedPoints > 0 && (
              <Badge variant="default" className="bg-rpg-accent text-rpg-dark animate-pulse-glow">
                {character.unassignedPoints} Points Available
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-code text-rpg-text">XP</span>
            <span className="font-code text-rpg-text">{character.xp} / {character.xpToNextLevel}</span>
          </div>
          <Progress value={xpProgress} className="h-2 bg-rpg-dark" indicatorClassName="bg-rpg-accent" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between bg-rpg-dark p-2 rounded">
            <div className="flex items-center">
              <Zap size={18} className="text-rpg-accent mr-2" />
              <span className="font-code text-sm">Energy</span>
            </div>
            <span className="stats-value">{character.energy}/{character.maxEnergy}</span>
          </div>
          
          <div className="flex items-center justify-between bg-rpg-dark p-2 rounded">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-rpg-accent rounded-full flex items-center justify-center text-rpg-dark font-bold mr-2">T</div>
              <span className="font-code text-sm">Tokens</span>
            </div>
            <span className="stats-value">{character.tokens}</span>
          </div>
        </div>
        
        <div className="mt-2">
          <h3 className="font-pixel text-sm text-rpg-highlight mb-2">Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <StatItem 
              icon={<Glasses size={16} />} 
              name="Clarity" 
              value={character.stats.clarity}
              canUpgrade={character.unassignedPoints > 0}
              onUpgrade={() => handleIncreaseStat('clarity')}
            />
            <StatItem 
              icon={<Brain size={16} />} 
              name="Logic" 
              value={character.stats.logic}
              canUpgrade={character.unassignedPoints > 0}
              onUpgrade={() => handleIncreaseStat('logic')}
            />
            <StatItem 
              icon={<Lightbulb size={16} />} 
              name="Creativity" 
              value={character.stats.creativity}
              canUpgrade={character.unassignedPoints > 0}
              onUpgrade={() => handleIncreaseStat('creativity')}
            />
            <StatItem 
              icon={<Wrench size={16} />} 
              name="Debugging" 
              value={character.stats.debugging}
              canUpgrade={character.unassignedPoints > 0}
              onUpgrade={() => handleIncreaseStat('debugging')}
            />
            <StatItem 
              icon={<Sliders size={16} />} 
              name="Config" 
              value={character.stats.configuration}
              canUpgrade={character.unassignedPoints > 0}
              onUpgrade={() => handleIncreaseStat('configuration')}
            />
          </div>
        </div>
        
        <div className="mt-2">
          <h3 className="font-pixel text-sm text-rpg-highlight mb-2">Techniques</h3>
          <div className="flex flex-wrap gap-2">
            {unlockedTechniqueNames.length > 0 ? (
              unlockedTechniqueNames.map((tech, index) => (
                <Badge key={index} className="bg-rpg-light text-rpg-highlight border border-rpg-accent">
                  {tech}
                </Badge>
              ))
            ) : (
              <span className="text-sm font-code text-rpg-text">No techniques unlocked yet</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

interface StatItemProps {
  icon: React.ReactNode;
  name: string;
  value: number;
  canUpgrade: boolean;
  onUpgrade: () => void;
}

const StatItem: React.FC<StatItemProps> = ({ icon, name, value, canUpgrade, onUpgrade }) => {
  return (
    <div className="flex items-center justify-between bg-rpg-dark p-2 rounded">
      <div className="flex items-center">
        <span className="text-rpg-accent mr-2">{icon}</span>
        <span className="font-code text-sm">{name}</span>
      </div>
      <div className="flex items-center">
        <span className="stats-value">{value}</span>
        {canUpgrade && (
          <button 
            onClick={onUpgrade}
            className="ml-2 w-5 h-5 rounded-full bg-rpg-accent text-rpg-dark flex items-center justify-center hover:bg-rpg-highlight transition-colors"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterPanel;
