
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, CheckCircle, Lightbulb } from 'lucide-react';

const ResponseOutput: React.FC = () => {
  const { state } = useGame();
  const { lastResponse, character } = state;
  
  const activeQuest = character.activeQuest 
    ? state.quests.find(q => q.id === character.activeQuest) 
    : null;
  
  return (
    <Card className="bg-rpg-main border-rpg-accent p-4 max-w-xl h-[400px] overflow-hidden flex flex-col">
      <h2 className="font-pixel text-xl text-rpg-highlight mb-2">Output Terminal</h2>
      
      <Tabs defaultValue="response" className="flex-1 flex flex-col">
        <TabsList className="bg-rpg-dark">
          <TabsTrigger value="response" className="data-[state=active]:bg-rpg-accent data-[state=active]:text-rpg-dark">
            <MessageSquare className="h-4 w-4 mr-2" />
            Response
          </TabsTrigger>
          {activeQuest && (
            <TabsTrigger value="hints" className="data-[state=active]:bg-rpg-accent data-[state=active]:text-rpg-dark">
              <Lightbulb className="h-4 w-4 mr-2" />
              Hints
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent 
          value="response" 
          className="flex-1 bg-rpg-dark p-3 rounded-b-md border border-rpg-light overflow-auto"
        >
          {lastResponse ? (
            <div className="terminal-text">
              <div className="flex items-center text-rpg-accent mb-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="font-code">LLM Core Response:</span>
              </div>
              <pre className="whitespace-pre-wrap text-sm">{lastResponse}</pre>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground text-sm italic">No response generated yet</p>
            </div>
          )}
        </TabsContent>
        
        {activeQuest && (
          <TabsContent 
            value="hints" 
            className="flex-1 bg-rpg-dark p-3 rounded-b-md border border-rpg-light overflow-auto"
          >
            <div className="terminal-text">
              <div className="flex items-center text-rpg-accent mb-2">
                <Lightbulb className="h-4 w-4 mr-2" />
                <span className="font-code">Quest Hints:</span>
              </div>
              <ul className="list-disc list-inside space-y-2">
                {activeQuest.hints.map((hint, index) => (
                  <li key={index} className="text-sm">{hint}</li>
                ))}
              </ul>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
};

export default ResponseOutput;
