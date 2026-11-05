/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { StartScreen } from './components/StartScreen';
import { StageClearModal } from './components/StageClearModal';
import { VictoryScreen } from './components/VictoryScreen';
import { Smartphone } from 'lucide-react';

type GameState = 'START' | 'PLAYING' | 'STAGE_CLEAR' | 'VICTORY';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [totalHearts, setTotalHearts] = useState(0);
  const [currentStageHearts, setCurrentStageHearts] = useState(0);
  const [currentStageMaxHearts, setCurrentStageMaxHearts] = useState(14);

  const handleStartGame = (startingStage = 0) => {
    setCurrentStageIndex(startingStage);
    setTotalHearts(0);
    setCurrentStageHearts(0);
    setGameState('PLAYING');
  };

  const handleHeartCollected = (count: number) => {
    setCurrentStageHearts(count);
  };

  const handleStageClear = (stageHearts: number, maxHearts: number) => {
    setCurrentStageHearts(stageHearts);
    setCurrentStageMaxHearts(maxHearts);
    setTotalHearts((prev) => prev + stageHearts);
    setGameState('STAGE_CLEAR');
  };

  const handleNextStage = () => {
    setCurrentStageIndex((prev) => prev + 1);
    setCurrentStageHearts(0);
    setGameState('PLAYING');
  };

  const handleGameComplete = (stageHearts: number) => {
    setTotalHearts((prev) => prev + stageHearts);
    setGameState('VICTORY');
  };

  const handleStartMission2 = () => {
    setCurrentStageIndex(5);
    setCurrentStageHearts(0);
    setGameState('PLAYING');
  };

  const handleStartHomeJourney = () => {
    setCurrentStageIndex(10);
    setCurrentStageHearts(0);
    setGameState('PLAYING');
  };

  const handleRestart = () => {
    setCurrentStageIndex(0);
    setTotalHearts(0);
    setCurrentStageHearts(0);
    setGameState('PLAYING');
  };

  const handleExitGame = () => {
    setCurrentStageIndex(0);
    setTotalHearts(0);
    setCurrentStageHearts(0);
    setGameState('START');
  };

  return (
    <main className="w-full h-full min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden p-0 sm:p-4 select-none">
      {/* Container: Full screen on mobile, sleek console frame on desktop */}
      <div className="relative w-full h-full sm:max-w-[1020px] sm:max-h-[580px] sm:w-[96vw] sm:h-[90vh] sm:aspect-[16/9] sm:rounded-[36px] sm:border-[8px] sm:border-slate-800 sm:shadow-[0_0_60px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.1)] overflow-hidden bg-slate-900 flex flex-col">
        {/* Subtle camera lens dot on top frame */}
        <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 z-50 w-3 h-3 bg-slate-950 rounded-full border border-slate-800 items-center justify-center pointer-events-none">
          <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
        </div>

        {/* Game State Rendering */}
        {gameState === 'START' && <StartScreen onStart={handleStartGame} />}

        {(gameState === 'PLAYING' || gameState === 'STAGE_CLEAR') && (
          <div className="relative w-full flex-1 min-h-0 flex flex-col overflow-hidden">
            <GameCanvas
              currentStageIndex={currentStageIndex}
              totalScore={totalHearts}
              onHeartCollected={handleHeartCollected}
              onStageClear={handleStageClear}
              onGameComplete={handleGameComplete}
              onExitGame={handleExitGame}
            />

            {gameState === 'STAGE_CLEAR' && (
              <StageClearModal
                stageIndex={currentStageIndex}
                heartsCollected={currentStageHearts}
                totalHearts={currentStageMaxHearts}
                onNextStage={handleNextStage}
                onExitGame={handleExitGame}
              />
            )}
          </div>
        )}

        {gameState === 'VICTORY' && (
          <VictoryScreen
            totalHearts={totalHearts}
            stageIndex={currentStageIndex}
            onRestart={handleRestart}
            onStartMission2={handleStartMission2}
            onStartHomeJourney={handleStartHomeJourney}
            onExitGame={handleExitGame}
          />
        )}
      </div>

      {/* Helpful info on desktop screens without the removed horizontal banner */}
      <div className="hidden lg:flex fixed bottom-3 left-4 text-xs text-slate-400 items-center gap-1.5 pointer-events-none bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800 shadow-lg">
        <Smartphone className="w-3.5 h-3.5 text-rose-400" />
        <span>Theo Lucca: 10 Fases · Resgate do Ursinho Amor e Ursinho Carinho 🤍</span>
      </div>
    </main>
  );
}
