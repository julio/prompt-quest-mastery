
import { GameProvider } from "@/contexts/GameContext";
import GameContainer from "@/components/game/GameContainer";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  return (
    <GameProvider>
      <GameContainer />
      <Toaster />
    </GameProvider>
  );
};

export default Index;
