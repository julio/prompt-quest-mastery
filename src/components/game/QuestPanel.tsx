
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card } from '@/components/ui/card';
import { Scroll, Star, Award, Badge } from 'lucide-react';

const QuestPanel: React.FC = () => {
  const { state, dispatch } = useGame();
  const { quests, character, gamePhase } = state;
  
  // Filter available quests
  const availableQuests = quests.filter(quest => quest.available && !quest.completed);
  
  const handleStartQuest = (questId: string) => {
    dispatch({ type: 'START_QUEST', payload: questId });
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      default: return 'text-green-400';
    }
  };
  
  if (gamePhase === 'intro') {
    return null;
  }
  
  return (
    <Card className="bg-rpg-main border-rpg-accent p-4 max-w-xl">
      <div className="flex items-center mb-4">
        <Scroll className="text-rpg-accent mr-2" />
        <h2 className="font-pixel text-xl text-rpg-highlight">Available Quests</h2>
      </div>
      
      {availableQuests.length > 0 ? (
        <div className="space-y-3">
          {availableQuests.map(quest => (
            <div 
              key={quest.id}
              className={`bg-rpg-dark p-3 rounded border border-rpg-light hover:border-rpg-accent cursor-pointer transition-colors ${
                character.activeQuest === quest.id ? 'border-rpg-accent bg-rpg-light' : ''
              }`}
              onClick={() => handleStartQuest(quest.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-pixel text-rpg-highlight text-sm">{quest.name}</h3>
                  <p className="text-xs mt-1">{quest.description}</p>
                </div>
                <div className="flex items-center">
                  {quest.type === 'tutorial' && <Badge className="bg-rpg-accent text-rpg-dark text-xs mr-2">Tutorial</Badge>}
                  <span className={`text-xs font-code ${getDifficultyColor(quest.difficulty)}`}>
                    {quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-xs font-bold">Objective:</p>
                <p className="text-xs">{quest.objective}</p>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {quest.rewards.map((reward, idx) => {
                  let rewardText = '';
                  let icon = null;
                  
                  switch (reward.type) {
                    case 'xp':
                      rewardText = `${reward.value} XP`;
                      icon = <Star size={12} className="text-yellow-400" />;
                      break;
                    case 'tokens':
                      rewardText = `${reward.value} Tokens`;
                      icon = <div className="w-3 h-3 bg-rpg-accent rounded-full flex items-center justify-center text-rpg-dark font-bold text-[8px]">T</div>;
                      break;
                    case 'technique':
                      const technique = state.availableTechniques.find(t => t.id === reward.target);
                      rewardText = technique ? technique.name : 'Unknown Technique';
                      icon = <Badge size={12} className="text-rpg-accent" />;
                      break;
                    case 'core':
                      const core = state.availableLLMCores.find(c => c.id === reward.target);
                      rewardText = core ? core.name : 'Unknown Core';
                      icon = <Award size={12} className="text-rpg-accent" />;
                      break;
                    default:
                      rewardText = 'Unknown Reward';
                  }
                  
                  return (
                    <div 
                      key={idx}
                      className="bg-rpg-light text-xs py-1 px-2 rounded flex items-center"
                    >
                      {icon && <span className="mr-1">{icon}</span>}
                      {rewardText}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="font-code text-sm text-rpg-text">No quests available at the moment</p>
          {character.completedQuests.length > 0 && (
            <p className="text-xs mt-2 text-rpg-text opacity-60">
              You've completed {character.completedQuests.length} quests. New quests will unlock as you progress.
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default QuestPanel;
