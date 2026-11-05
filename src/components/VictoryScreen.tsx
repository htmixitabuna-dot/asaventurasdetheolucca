/**
 * Final Victory Screen
 * Shows "Você resgatou o Amor!" and restart button
 */

import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Heart, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { CHARACTER_IMAGE_URL } from '../game/spriteLoader';

interface VictoryScreenProps {
  totalHearts: number;
  stageIndex?: number;
  onRestart: () => void;
  onStartMission2?: () => void;
  onStartHomeJourney?: () => void;
  onExitGame?: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  totalHearts,
  stageIndex = 4,
  onRestart,
  onStartMission2,
  onStartHomeJourney,
  onExitGame,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMission2Complete = stageIndex >= 5 && stageIndex < 10;
  const isHomeComplete = stageIndex >= 10;

  // Trigger celebration confetti with hearts and colors
  useEffect(() => {
    // Fire confetti bursts
    const end = Date.now() + 4 * 1000;
    const colors = isMission2Complete
      ? ['#38bdf8', '#818cf8', '#c084fc', '#f43f5e', '#fef08a']
      : ['#f43f5e', '#ec4899', '#facc15', '#38bdf8', '#a855f7'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [isMission2Complete]);

  // Draw teddy bear Amor or both Amor and Carinho on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.04;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isMission2Complete) {
        // Draw single brown teddy bear Amor
        const cx = canvas.width / 2;
        const cy = canvas.height / 2 + 10;

        ctx.save();
        ctx.translate(cx, cy);
        const breath = 1.0 + Math.sin(t * 3) * 0.05;
        ctx.scale(breath, breath);

        const furDark = '#78350f';
        const furBrown = '#92400e';
        const furMuzzle = '#fed7aa';

        // Ears
        ctx.fillStyle = furBrown;
        ctx.beginPath();
        ctx.arc(-22, -34, 11, 0, Math.PI * 2);
        ctx.arc(22, -34, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.arc(-22, -34, 6, 0, Math.PI * 2);
        ctx.arc(22, -34, 6, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = furBrown;
        ctx.beginPath();
        ctx.arc(0, -18, 28, 0, Math.PI * 2);
        ctx.fill();

        // Muzzle
        ctx.fillStyle = furMuzzle;
        ctx.beginPath();
        ctx.ellipse(0, -14, 14, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.ellipse(0, -16, 5, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cartoon Eyes
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.arc(-9, -22, 4.5, 0, Math.PI * 2);
        ctx.arc(9, -22, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-11, -24, 1.8, 0, Math.PI * 2);
        ctx.arc(7, -24, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Blushing cheeks
        ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
        ctx.beginPath();
        ctx.arc(-16, -14, 5, 0, Math.PI * 2);
        ctx.arc(16, -14, 5, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = furDark;
        ctx.beginPath();
        ctx.ellipse(0, 16, 22, 25, 0, 0, Math.PI * 2);
        ctx.fill();

        // Feet
        ctx.fillStyle = furBrown;
        ctx.beginPath();
        ctx.arc(-18, 34, 9, 0, Math.PI * 2);
        ctx.arc(18, 34, 9, 0, Math.PI * 2);
        ctx.fill();

        // Giant glowing red Heart held in arms
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        const s = 18;
        ctx.moveTo(0, 12);
        ctx.bezierCurveTo(-s / 2, -s / 2 + 12, -s, s / 3 + 12, 0, s + 12);
        ctx.bezierCurveTo(s, s / 3 + 12, s / 2, -s / 2 + 12, 0, 12);
        ctx.fill();

        // Little paws
        ctx.fillStyle = furBrown;
        ctx.beginPath();
        ctx.arc(-14, 14, 6, 0, Math.PI * 2);
        ctx.arc(14, 14, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else {
        // Draw BOTH Amor (brown) and Carinho (white) hugging together!
        const tAmor = Math.sin(t * 3) * 3;
        const tCarinho = Math.cos(t * 3) * 3;

        // Amor (Left side)
        ctx.save();
        ctx.translate(canvas.width * 0.3, canvas.height * 0.55 + tAmor);
        ctx.scale(0.85, 0.85);

        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.arc(-16, -26, 9, 0, Math.PI * 2);
        ctx.arc(16, -26, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -12, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.ellipse(0, -9, 11, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.arc(-7, -15, 3.5, 0, Math.PI * 2);
        ctx.arc(7, -15, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.ellipse(0, 15, 18, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Carinho (Right side, white teddy bear)
        ctx.save();
        ctx.translate(canvas.width * 0.7, canvas.height * 0.55 + tCarinho);
        ctx.scale(0.85, 0.85);

        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(-16, -26, 9, 0, Math.PI * 2);
        ctx.arc(16, -26, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.arc(-16, -26, 5, 0, Math.PI * 2);
        ctx.arc(16, -26, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, -12, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath();
        ctx.ellipse(0, -9, 11, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(-7, -15, 3.5, 0, Math.PI * 2);
        ctx.arc(7, -15, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.ellipse(0, 15, 18, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        // Cyan Bowtie
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-7, -4);
        ctx.lineTo(-7, 4);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(7, -4);
        ctx.lineTo(7, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Big heart in the center connecting them
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height * 0.42);
        const sHeart = 16 + Math.sin(t * 5) * 2;
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-sHeart / 2, -sHeart / 2, -sHeart, sHeart / 3, 0, sHeart);
        ctx.bezierCurveTo(sHeart, sHeart / 3, sHeart / 2, -sHeart / 2, 0, 0);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isMission2Complete]);

  return (
    <div className="relative w-full h-full flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 bg-gradient-to-br from-purple-950 via-slate-900 to-rose-950 text-white overflow-y-auto select-none gap-4">
      {/* Decorative ambient lights */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-72 h-72 bg-rose-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-8 w-56 h-56 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* Left Column: Theo Lucca & Teddy Bear Reunion */}
      <div className="relative z-10 flex flex-col items-center justify-center shrink-0">
        <div className="relative flex items-center justify-center gap-2">
          {/* Theo Lucca Portrait */}
          <div className="relative w-32 sm:w-36 h-44 sm:h-48 rounded-2xl overflow-hidden border-3 border-amber-300 shadow-2xl bg-white/95">
            <img
              src={CHARACTER_IMAGE_URL}
              alt="Theo Lucca Sorrindo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute bottom-1.5 left-1 right-1 bg-slate-900/80 rounded-md py-0.5 text-center">
              <span className="text-[10px] font-bold text-amber-300">Theo Lucca</span>
            </div>
          </div>

          {/* Big Beating Heart between them */}
          <div className="flex flex-col items-center z-20 -mx-3">
            <Heart className="w-10 sm:w-12 h-10 sm:h-12 text-rose-500 fill-rose-500 animate-ping absolute opacity-60" />
            <Heart className="w-10 sm:w-12 h-10 sm:h-12 text-rose-500 fill-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.9)]" />
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin mt-1" />
          </div>

          {/* Teddy Bear Amor / Carinho Card */}
          <div className="relative w-32 sm:w-36 h-44 sm:h-48 rounded-2xl overflow-hidden border-3 border-rose-300 shadow-2xl bg-gradient-to-b from-rose-900 via-indigo-950 to-cyan-950 flex flex-col items-center justify-center p-2">
            <canvas ref={canvasRef} width={140} height={140} className="w-full h-auto" />
            <div className="absolute bottom-1.5 left-1 right-1 bg-slate-900/80 rounded-md py-0.5 text-center">
              <span className="text-[10px] font-bold text-rose-300">
                {isMission2Complete ? 'Amor & Carinho Salvos!' : 'Ursinho Amor'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Mission banner, stats, and Next / Restart button */}
      <div className="relative z-10 flex flex-col justify-center flex-1 max-w-lg w-full text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold tracking-wider uppercase mb-1 w-fit mx-auto sm:mx-0">
          <Trophy className="w-4 h-4 text-amber-300 animate-bounce" />
          {isHomeComplete
            ? 'Missão Concluída! Fim da Aventura!'
            : isMission2Complete
            ? 'Missão 2 Cumprida!'
            : 'Missão 1 Cumprida!'}
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_12px_rgba(244,63,94,0.7)]">
          {isHomeComplete
            ? 'Bem-vindo de volta para casa, Theo! 🏠❤️'
            : isMission2Complete
            ? 'Você resgatou o Ursinho Carinho!'
            : 'Você resgatou o Amor!'}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-rose-200 mt-0.5">
          {isHomeComplete
            ? 'Theo Lucca guardou Amor e Carinho na mochila, voltou pela cidade e reencontrou seu papai e sua mamãe muito felizes!'
            : isMission2Complete
            ? 'Theo Lucca colocou os dois ursinhos na mochila! Agora siga a aventura pelo caminho de volta para casa!'
            : 'Ursinho Amor está a salvo! Mas seu melhor amigo, o Ursinho Carinho branco, precisa de ajuda nos reinos mágicos!'}
        </p>

        {/* Stats card */}
        <div className="w-full mt-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center justify-around text-center shadow-lg">
          <div>
            <span className="text-[11px] text-slate-300 block font-medium">Fases Vencidas</span>
            <span className="text-base font-extrabold text-amber-300">
              {isHomeComplete ? '11 / 11' : isMission2Complete ? '10 / 10' : '5 / 5'}
            </span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <span className="text-[11px] text-slate-300 block font-medium">Corações Salvos</span>
            <span className="text-base font-extrabold text-rose-400 flex items-center justify-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-rose-400" />
              {totalHearts}
            </span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <span className="text-[11px] text-slate-300 block font-medium">Resultado</span>
            <span className="text-base font-extrabold text-emerald-400">
              {isHomeComplete
                ? 'Família Reunida! 👑'
                : isMission2Complete
                ? 'Ursinhos na Mochila! 🎒'
                : 'Grande Herói! 🧸'}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-2">
          {!isMission2Complete && !isHomeComplete && onStartMission2 && (
            <button
              type="button"
              onClick={onStartMission2}
              className="w-full h-13 sm:h-14 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 active:from-cyan-600 active:to-purple-700 text-white font-black text-sm sm:text-base tracking-wide uppercase shadow-2xl shadow-cyan-950/70 border-2 border-cyan-300 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <span>Resgatar o Ursinho Carinho 🤍🕸️</span>
            </button>
          )}

          {isMission2Complete && onStartHomeJourney && (
            <button
              type="button"
              onClick={onStartHomeJourney}
              className="w-full h-13 sm:h-14 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 active:from-amber-600 active:to-pink-700 text-white font-black text-sm sm:text-base tracking-wide uppercase shadow-2xl shadow-rose-950/70 border-2 border-amber-300 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <span>Caminho de Casa com os Ursinhos 🎒🏠</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRestart}
            className="w-full h-11 sm:h-12 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 active:from-rose-600 active:to-pink-700 text-white font-black text-xs sm:text-sm tracking-wide uppercase shadow-xl shadow-rose-950/70 border-2 border-rose-300 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <RotateCcw className="w-4 h-4 text-white stroke-[2.5]" />
            <span>
              {isHomeComplete || isMission2Complete
                ? 'Jogar Novamente desde o Início'
                : 'Repetir Missão 1'}
            </span>
          </button>

          {onExitGame && (
            <button
              type="button"
              onClick={onExitGame}
              className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold text-xs tracking-wider uppercase border border-slate-700 active:scale-95 transition-transform"
            >
              Voltar ao Menu Principal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
