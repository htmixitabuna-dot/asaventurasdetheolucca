/**
 * Start & Story Introduction Screen
 * Showcases Theo Lucca and introduces the 3 stages to rescue Amor
 */

import React, { useState } from 'react';
import { Heart, Sparkles, Play, ShieldAlert, ArrowRight, Zap, Award } from 'lucide-react';
import { CHARACTER_IMAGE_URL } from '../game/spriteLoader';

interface StartScreenProps {
  onStart: (stageIdx?: number) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [selectedMission, setSelectedMission] = useState<1 | 2>(1);

  // Allow desktop users to press Enter or Space to start immediately
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onStart(selectedMission === 1 ? 0 : 5);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onStart, selectedMission]);

  return (
    <div className="relative w-full h-full flex flex-col sm:flex-row items-center justify-between p-3.5 sm:p-6 bg-gradient-to-br from-rose-950 via-slate-900 to-indigo-950 text-white overflow-y-auto select-none gap-3 sm:gap-6">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-10 left-1/3 -translate-x-1/2 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Left Column: Theo Lucca Portrait Card */}
      <div className="relative z-10 flex flex-col items-center justify-center shrink-0">
        <div className="relative group">
          {/* Glowing Aura Ring */}
          <div className="absolute -inset-2 bg-gradient-to-r from-rose-500 via-amber-400 to-pink-500 rounded-3xl blur-md opacity-80 animate-pulse" />

          {/* Character Photo Frame */}
          <div className="relative w-36 sm:w-44 h-48 sm:h-56 rounded-2xl overflow-hidden border-4 border-amber-300/80 shadow-2xl bg-white/95 flex items-center justify-center">
            <img
              src={CHARACTER_IMAGE_URL}
              alt="Theo Lucca - O Herói do Amor"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
            {/* Mission badge indicator */}
            <div className="absolute bottom-2 left-2 right-2 bg-slate-900/85 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20 text-center">
              <span className="text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1">
                {selectedMission === 1 ? '🧸 Resgatar Ursinho Amor' : '🤍 Resgatar Ursinho Carinho'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Title, Mission Switcher, Roadmap, Tips, and Start Button */}
      <div className="relative z-10 flex flex-col justify-center flex-1 max-w-xl w-full">
        {/* Header Title (Without the removed "Aventura em Modo Horizontal" banner) */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-300 via-amber-200 to-pink-300 bg-clip-text text-transparent drop-shadow-sm">
            Theo Lucca, o Herói do Amor
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-rose-200/90 tracking-wide mt-0.5">
            {selectedMission === 1
              ? 'Missão 1: Corra, pilote a Super Moto e vença o castelo para resgatar o Amor!'
              : 'Missão 2: Use o Poder da Teia para cruzar abismos mágicos e salvar o Ursinho Carinho!'}
          </p>
        </div>

        {/* Mission Switcher Tabs */}
        <div className="mt-2.5 flex items-center gap-2 bg-black/40 p-1 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => setSelectedMission(1)}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              selectedMission === 1
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md border border-rose-400/50 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🧸 Missão 1: Ursinho Amor</span>
            <span className="text-[10px] bg-rose-950/80 px-1.5 py-0.2 rounded-full border border-rose-400/30">Fases 1-5</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedMission(2)}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              selectedMission === 2
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md border border-cyan-400/50 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🤍 Missão 2: Ursinho Carinho</span>
            <span className="text-[10px] bg-cyan-950/80 px-1.5 py-0.2 rounded-full border border-cyan-400/30">Fases 6-10 🕸️</span>
          </button>
        </div>

        {/* 5 Stages Roadmap Cards for Selected Mission */}
        {selectedMission === 1 ? (
          <div className="w-full mt-2 grid grid-cols-5 gap-1.5">
            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-1.5 text-center backdrop-blur-sm shadow-md">
              <span className="text-base sm:text-lg block">🌳</span>
              <span className="text-[10px] font-bold text-emerald-300 block truncate">1. Parque</span>
            </div>
            <div className="bg-amber-950/60 border border-amber-500/40 rounded-xl p-1.5 text-center backdrop-blur-sm shadow-md">
              <span className="text-base sm:text-lg block">🏙️</span>
              <span className="text-[10px] font-bold text-amber-300 block truncate">2. Cidade</span>
            </div>
            <div className="bg-indigo-950/70 border border-indigo-500/50 rounded-xl p-1.5 text-center backdrop-blur-sm shadow-md">
              <span className="text-base sm:text-lg block">🏰</span>
              <span className="text-[10px] font-bold text-indigo-300 block truncate">3. Catacumbas</span>
            </div>
            <div className="bg-blue-950/70 border border-blue-500/50 rounded-xl p-1.5 text-center backdrop-blur-sm shadow-md">
              <span className="text-base sm:text-lg block">🛡️</span>
              <span className="text-[10px] font-bold text-blue-300 block truncate">4. Fortaleza</span>
            </div>
            <div className="bg-purple-950/60 border border-purple-500/40 rounded-xl p-1.5 text-center backdrop-blur-sm shadow-md">
              <span className="text-base sm:text-lg block">💖</span>
              <span className="text-[10px] font-bold text-purple-300 block truncate">5. Resgate Amor</span>
            </div>
          </div>
        ) : (
          <div className="w-full mt-2 grid grid-cols-5 gap-1.5">
            <div className="bg-pink-950/70 border border-pink-400/50 rounded-xl p-1.5 text-center backdrop-blur-sm shadow-md">
              <span className="text-base sm:text-lg block">🍭</span>
              <span className="text-[10px] font-bold text-pink-300 block truncate">6. Doces</span>
            </div>
            <div className="bg-purple-950/70 border border-purple-400/50 rounded-xl p-1.5 text-center backdrop-blur-sm shadow-md">
              <span className="text-base sm:text-lg block">💎</span>
              <span className="text-[10px] font-bold text-purple-300 block truncate">7. Cristais</span>
            </div>
            <div className="bg-sky-950/70 border border-sky-400/50 rounded-xl p-1.5 text-center backdrop-blur-sm shadow-md">
              <span className="text-base sm:text-lg block">☁️</span>
              <span className="text-[10px] font-bold text-sky-300 block truncate">8. Nuvens</span>
            </div>
            <div className="bg-amber-950/70 border border-amber-400/50 rounded-xl p-1.5 text-center backdrop-blur-sm shadow-md">
              <span className="text-base sm:text-lg block">🧸</span>
              <span className="text-[10px] font-bold text-amber-300 block truncate">9. Brinquedos</span>
            </div>
            <div className="bg-cyan-950/70 border border-cyan-400/50 rounded-xl p-1.5 text-center backdrop-blur-sm shadow-md">
              <span className="text-base sm:text-lg block">❄️</span>
              <span className="text-[10px] font-bold text-cyan-300 block truncate">10. Carinho!</span>
            </div>
          </div>
        )}

        {/* Controls Instructions depending on Mission */}
        <div className="flex flex-col gap-1 mt-2 text-xs text-rose-200/90">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl flex-wrap text-[11px] sm:text-xs">
            <span className="font-bold text-white">⬅️ ➡️ Andar</span>
            <span>·</span>
            <span className="font-bold text-indigo-300 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-500/40">⬇️ ABAIXAR (Ande agachado)</span>
            <span>·</span>
            <span className="font-bold text-emerald-300">⚡ CORRER</span>
            <span>·</span>
            {selectedMission === 1 ? (
              <span className="font-bold text-orange-300">🏍️ MOTO (Espaço / Toque)</span>
            ) : (
              <span className="font-bold text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-400/40">🕸️ PODER DA TEIA (T / W / Toque)</span>
            )}
            <span>·</span>
            <span className="font-bold text-rose-300">⬆️ PULAR</span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2 text-[10.5px] sm:text-[11px] text-amber-200/90 flex-wrap">
            <span className="font-bold text-amber-300">⏱️ ~2 min por fase com checkpoints</span>
            <span>·</span>
            {selectedMission === 1 ? (
              <span className="text-orange-200 font-semibold">🏍️ Suba e desça da Super Moto</span>
            ) : (
              <span className="text-cyan-200 font-semibold">🕸️ Grude a teia e balance sobre abismos</span>
            )}
            <span>·</span>
            <span className="text-rose-300 font-semibold">🚪 Botão Sair no HUD</span>
          </div>
        </div>

        {/* Big Start Button */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => onStart(selectedMission === 1 ? 0 : 5)}
            className={`w-full h-12 sm:h-13 rounded-2xl text-white font-extrabold text-base sm:text-lg tracking-wide uppercase shadow-2xl border-2 flex items-center justify-center gap-2.5 active:scale-95 transition-transform ${
              selectedMission === 1
                ? 'bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 border-rose-300/80 shadow-rose-900/60'
                : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 border-cyan-300/80 shadow-cyan-900/60'
            }`}
          >
            <Play className="w-5 h-5 fill-white text-white drop-shadow" />
            <span>
              {selectedMission === 1 ? 'Começar Missão 1: Amor!' : 'Começar Missão 2: Carinho! 🕸️'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
