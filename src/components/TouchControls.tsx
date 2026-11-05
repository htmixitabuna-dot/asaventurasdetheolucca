import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Sword, Shield, Zap, Flame, LogOut } from 'lucide-react';

interface Props {
  onMoveLeft: (active: boolean) => void;
  onMoveRight: (active: boolean) => void;
  onCrouch: (active: boolean) => void;
  onJump: (active: boolean) => void;
  onAttack: (active: boolean) => void;
  onRun: (active: boolean) => void;
  onDismountMoto?: () => void;
  onWebShoot?: () => void;
  hasMoto?: boolean;
  hasWebPower?: boolean;
  isCrouching?: boolean;
  isMission2?: boolean;
}

export const TouchControls: React.FC<Props> = ({
  onMoveLeft,
  onMoveRight,
  onCrouch,
  onJump,
  onAttack,
  onRun,
  onDismountMoto,
  onWebShoot,
  hasMoto = false,
  hasWebPower = false,
  isCrouching = false,
  isMission2 = false,
}) => {
  // Allow toggling crouch state so player can tap to crouch, then easily tap Left/Right to walk/crawl while crouched
  const [toggleCrouched, setToggleCrouched] = useState(false);

  const handleCrouchToggle = (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    if (navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch {
        // ignore
      }
    }
    const nextState = !toggleCrouched;
    setToggleCrouched(nextState);
    onCrouch(nextState);
  };

  // Generic robust pointer event handler with pointer capture
  const createControlHandler = (callback: (active: boolean) => void) => {
    return {
      onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        if (navigator.vibrate) {
          try {
            navigator.vibrate(8);
          } catch {
            // ignore
          }
        }
        callback(true);
      },
      onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        } catch {
          // ignore
        }
        callback(false);
      },
      onPointerCancel: (e: React.PointerEvent<HTMLButtonElement>) => {
        try {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        } catch {
          // ignore
        }
        callback(false);
      },
      onPointerLeave: (e: React.PointerEvent<HTMLButtonElement>) => {
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) {
          callback(false);
        }
      },
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    };
  };

  const handleJumpPress = (active: boolean) => {
    // If player was crouched, jumping will release the crouch toggle
    if (active && toggleCrouched) {
      setToggleCrouched(false);
      onCrouch(false);
    }
    onJump(active);
  };

  const effectiveCrouching = isCrouching || toggleCrouched;

  return (
    <div
      className="absolute bottom-5 sm:bottom-7 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none select-none flex items-end justify-between"
      style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 1.25rem))' }}
    >
      {/* Directional Pad: Left, ABAIXAR (Crouch / Walk-Crouch), and Right */}
      <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {/* Esquerda */}
        <button
          type="button"
          aria-label={effectiveCrouching ? "Andar agachado para a esquerda" : "Andar para a esquerda"}
          {...createControlHandler(onMoveLeft)}
          className={`w-[58px] sm:w-[66px] h-[64px] sm:h-[68px] rounded-2xl border-2 text-white shadow-xl flex flex-col items-center justify-center active:scale-95 touch-none transition-all ${
            effectiveCrouching
              ? 'bg-indigo-950/90 border-indigo-400 ring-2 ring-indigo-400/40 active:bg-indigo-900'
              : 'bg-slate-900/90 border-white/30 active:bg-slate-800 active:border-rose-400'
          }`}
        >
          <ArrowLeft className="w-7 h-7 stroke-[3]" />
          {effectiveCrouching && (
            <span className="text-[8px] font-black tracking-tighter text-indigo-200 uppercase -mt-0.5">
              ENGATINHAR
            </span>
          )}
        </button>

        {/* ABAIXAR (Permite andar/rastejar abaixado) */}
        <button
          type="button"
          aria-label="Abaixar e andar agachado sob obstáculos"
          onClick={handleCrouchToggle}
          className={`w-[58px] sm:w-[66px] h-[64px] sm:h-[68px] rounded-2xl border-2 text-white shadow-xl flex flex-col items-center justify-center active:scale-95 touch-none transition-all ${
            effectiveCrouching
              ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 border-amber-300 ring-4 ring-indigo-400/60 scale-105'
              : 'bg-gradient-to-b from-indigo-800 to-slate-900 border-indigo-400/70 hover:brightness-110'
          }`}
        >
          <ArrowDown className={`w-6 h-6 stroke-[3.5] ${effectiveCrouching ? 'text-amber-200 animate-bounce' : 'text-indigo-200'}`} />
          <span className="text-[9px] font-black tracking-wider uppercase text-white mt-0.5">
            {effectiveCrouching ? 'AGACHADO' : 'ABAIXAR'}
          </span>
        </button>

        {/* Direita */}
        <button
          type="button"
          aria-label={effectiveCrouching ? "Andar agachado para a direita" : "Andar para a direita"}
          {...createControlHandler(onMoveRight)}
          className={`w-[58px] sm:w-[66px] h-[64px] sm:h-[68px] rounded-2xl border-2 text-white shadow-xl flex flex-col items-center justify-center active:scale-95 touch-none transition-all ${
            effectiveCrouching
              ? 'bg-indigo-950/90 border-indigo-400 ring-2 ring-indigo-400/40 active:bg-indigo-900'
              : 'bg-slate-900/90 border-white/30 active:bg-slate-800 active:border-rose-400'
          }`}
        >
          <ArrowRight className="w-7 h-7 stroke-[3]" />
          {effectiveCrouching && (
            <span className="text-[8px] font-black tracking-tighter text-indigo-200 uppercase -mt-0.5">
              ENGATINHAR
            </span>
          )}
        </button>
      </div>

      {/* Action Buttons: Correr / Turbo Moto + Golpe + Pular + Descer da Moto */}
      <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {/* Opção para SAIR / DESCER DA MOTO quando Theo estiver montado */}
        {hasMoto && onDismountMoto && (
          <button
            type="button"
            aria-label="Descer da moto"
            onClick={onDismountMoto}
            className="w-[58px] sm:w-[64px] h-[64px] sm:h-[68px] rounded-2xl bg-gradient-to-b from-rose-700 to-red-900 border-2 border-rose-400 text-white shadow-xl flex flex-col items-center justify-center active:scale-95 active:brightness-125 touch-none transition-all ring-2 ring-rose-500/50 animate-pulse"
          >
            <LogOut className="w-5 h-5 text-rose-200" />
            <span className="text-[8px] font-black tracking-wider uppercase text-rose-100 mt-0.5 text-center leading-none">
              DESCER DA MOTO
            </span>
          </button>
        )}

        {/* PODER DA TEIA (Trancar / Lançar Teia para cruzar abismos na Missão 2) */}
        {hasWebPower && onWebShoot && (
          <button
            type="button"
            aria-label="Lançar teia mágica para cruzar abismo"
            onClick={(e) => {
              e.preventDefault();
              if (navigator.vibrate) {
                try {
                  navigator.vibrate(12);
                } catch {
                  // ignore
                }
              }
              onWebShoot();
            }}
            className="w-[58px] sm:w-[64px] h-[64px] sm:h-[68px] rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-orange-500 border-2 border-yellow-200 text-white shadow-2xl flex flex-col items-center justify-center active:scale-95 active:brightness-125 touch-none transition-all ring-2 ring-amber-300/60 animate-pulse"
          >
            <span className="text-xl">🕸️</span>
            <span className="text-[9px] font-black tracking-wider uppercase text-yellow-100 mt-0.5 text-center leading-none">
              TEIA
            </span>
          </button>
        )}

        {isMission2 ? (
          <>
            {/* Na Missão 2: Golpe no lugar do botão Correr */}
            <button
              type="button"
              aria-label="Golpe com Espada e Escudo"
              {...createControlHandler(onAttack)}
              className="w-[56px] sm:w-[62px] h-[64px] sm:h-[68px] rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 border-2 border-amber-300 text-white shadow-xl flex flex-col items-center justify-center active:scale-95 active:brightness-110 touch-none transition-transform"
            >
              <div className="relative flex items-center justify-center">
                <Shield className="w-6 h-6 text-amber-100 fill-amber-700/60" />
                <Sword className="w-3.5 h-3.5 text-white absolute -rotate-45" />
              </div>
              <span className="text-[10px] font-black tracking-wider mt-0.5">GOLPE</span>
            </button>

            {/* Na Missão 2: Pular no lugar do botão Golpe */}
            <button
              type="button"
              aria-label="Pular"
              {...createControlHandler(handleJumpPress)}
              className="w-[66px] sm:w-[74px] h-[64px] sm:h-[68px] rounded-2xl bg-gradient-to-b from-rose-500 to-rose-600 border-2 border-rose-300 text-white shadow-2xl flex flex-col items-center justify-center active:scale-95 active:brightness-110 touch-none transition-transform"
            >
              <ArrowUp className="w-7 h-7 stroke-[3.5]" />
              <span className="font-black text-xs tracking-wider">PULAR</span>
            </button>
          </>
        ) : (
          <>
            {/* CORRER ou TURBO MOTO button */}
            <button
              type="button"
              aria-label={hasMoto ? 'Turbo da Moto' : 'Correr rápido'}
              {...createControlHandler(onRun)}
              className={`w-[56px] sm:w-[62px] h-[64px] sm:h-[68px] rounded-2xl border-2 text-white shadow-xl flex flex-col items-center justify-center active:scale-95 active:brightness-110 touch-none transition-transform ${
                hasMoto
                  ? 'bg-gradient-to-b from-amber-400 via-orange-500 to-rose-600 border-amber-300 ring-2 ring-amber-400/50'
                  : 'bg-gradient-to-b from-emerald-500 to-teal-600 border-emerald-300'
              }`}
            >
              {hasMoto ? (
                <Flame className="w-6 h-6 text-yellow-200 fill-amber-300 animate-pulse" />
              ) : (
                <Zap className="w-6 h-6 text-emerald-100 fill-emerald-200" />
              )}
              <span className="text-[10px] font-black tracking-wider mt-0.5">
                {hasMoto ? 'TURBO' : 'CORRER'}
              </span>
            </button>

            {/* Golpe (Sword & Shield) */}
            <button
              type="button"
              aria-label="Golpe com Espada e Escudo"
              {...createControlHandler(onAttack)}
              className="w-[56px] sm:w-[62px] h-[64px] sm:h-[68px] rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 border-2 border-amber-300 text-white shadow-xl flex flex-col items-center justify-center active:scale-95 active:brightness-110 touch-none transition-transform"
            >
              <div className="relative flex items-center justify-center">
                <Shield className="w-6 h-6 text-amber-100 fill-amber-700/60" />
                <Sword className="w-3.5 h-3.5 text-white absolute -rotate-45" />
              </div>
              <span className="text-[10px] font-black tracking-wider mt-0.5">GOLPE</span>
            </button>

            {/* Pular (Jump) */}
            <button
              type="button"
              aria-label="Pular"
              {...createControlHandler(handleJumpPress)}
              className="w-[66px] sm:w-[74px] h-[64px] sm:h-[68px] rounded-2xl bg-gradient-to-b from-rose-500 to-rose-600 border-2 border-rose-300 text-white shadow-2xl flex flex-col items-center justify-center active:scale-95 active:brightness-110 touch-none transition-transform"
            >
              <ArrowUp className="w-7 h-7 stroke-[3.5]" />
              <span className="font-black text-xs tracking-wider">PULAR</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
