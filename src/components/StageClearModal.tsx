/**
 * Stage Clear Modal
 * Celebrates stage completion and prepares Theo for the next stage
 */

import React from 'react';
import { Heart, Star, ArrowRight } from 'lucide-react';
import { LEVELS } from '../game/levels';

interface StageClearModalProps {
  stageIndex: number;
  heartsCollected: number;
  totalHearts: number;
  onNextStage: () => void;
  onExitGame?: () => void;
}

export const StageClearModal: React.FC<StageClearModalProps> = ({
  stageIndex,
  heartsCollected,
  totalHearts,
  onNextStage,
  onExitGame,
}) => {
  const currentLevel = LEVELS[stageIndex] || LEVELS[0];
  const nextLevel = LEVELS[stageIndex + 1];

  // Calculate stars
  const ratio = totalHearts > 0 ? heartsCollected / totalHearts : 1;
  const stars = ratio >= 0.85 ? 3 : ratio >= 0.5 ? 2 : 1;

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-300 select-none">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400/50 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-24 bg-amber-400/20 blur-2xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
          Fase {stageIndex + 1} Concluída!
        </div>

        <h2 className="text-2xl font-extrabold text-white mb-1">
          Muito bem, Theo Lucca!
        </h2>
        <p className="text-sm text-slate-300 mb-5">
          Você superou o {currentLevel.name.split(':')[1]}!
        </p>

        {/* 3 Stars */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {[1, 2, 3].map((sIndex) => (
            <Star
              key={sIndex}
              className={`w-10 h-10 transition-transform ${
                sIndex <= stars
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)] scale-110'
                  : 'text-slate-700 fill-slate-850'
              }`}
            />
          ))}
        </div>

        {/* Hearts Collected Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 flex items-center justify-around">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
            <div className="text-left">
              <span className="text-xs text-slate-400 block font-medium">Corações Pegos</span>
              <span className="text-lg font-bold text-white tabular-nums">
                {heartsCollected} <span className="text-xs text-slate-400">/ {totalHearts}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Next Stage Button */}
        <button
          type="button"
          onClick={onNextStage}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 active:from-emerald-600 active:to-teal-700 text-white font-extrabold text-base tracking-wide uppercase shadow-xl shadow-emerald-950/50 border-2 border-emerald-300/80 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <span>Ir para {nextLevel ? nextLevel.name.split(':')[1] : 'Próxima Fase'}</span>
          <ArrowRight className="w-5 h-5 text-white" />
        </button>

        {onExitGame && (
          <button
            type="button"
            onClick={onExitGame}
            className="w-full mt-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold text-xs tracking-wider uppercase border border-slate-700/80 active:scale-95 transition-transform"
          >
            Sair para o Menu Inicial
          </button>
        )}
      </div>
    </div>
  );
};
