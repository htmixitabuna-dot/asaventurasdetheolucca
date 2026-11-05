/**
 * Interactive Game Canvas & Physics Engine
 * Controls Theo Lucca's movement, mushroom stomp combat, sword & shield action button,
 * armor pickup and transformation, rewards, camera tracking, and the live in-game encounter cutscene with Amor.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, RotateCcw, Heart, Shield, Star, Sparkles, LogOut } from 'lucide-react';
import { LEVELS, LevelData, Platform } from '../game/levels';
import { sounds } from '../game/sound';
import { theoSprites, CharacterSprites, loadAndProcessTheoImage } from '../game/spriteLoader';
import {
  drawBackground,
  drawScenery,
  drawPlatforms,
  drawHearts,
  drawEnemies,
  drawRewards,
  drawHazards,
  drawGoal,
  drawPlayer,
  drawReunionCutscene,
  drawParticles,
  drawWebAnchors,
  drawWebGrapple,
  Particle,
} from '../game/renderer';
import { TouchControls } from './TouchControls';

interface GameCanvasProps {
  currentStageIndex: number;
  totalScore: number;
  onHeartCollected: (count: number) => void;
  onStageClear: (stageHearts: number, maxHearts: number) => void;
  onGameComplete: (stageHearts: number) => void;
  onExitGame: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  currentStageIndex,
  totalScore: _totalScore,
  onHeartCollected,
  onStageClear,
  onGameComplete,
  onExitGame,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const levelData: LevelData = LEVELS[currentStageIndex] || LEVELS[0];

  // Game Loop Refs
  const isRunningRef = useRef(true);
  const stageClearedRef = useRef(false);
  const currentLevelRef = useRef<LevelData>(JSON.parse(JSON.stringify(levelData)));
  const spritesRef = useRef<CharacterSprites>(theoSprites);

  // In-Game Live Cutscene State for Stage 3 Reunion
  const cutsceneRef = useRef({
    active: false,
    startTime: 0,
    progress: 0,
    theoX: 0,
    theoY: 0,
    amorX: 0,
    amorY: 0,
    targetX: 0,
    finished: false,
  });

  // Player physics state (Theo Lucca Hero size: tamanho exato que fica ao comer a maçã)
  const playerRef = useRef({
    x: levelData.playerStart.x,
    y: levelData.playerStart.y,
    w: 62,
    h: 89,
    vx: 0,
    vy: 0,
    facing: 'right' as 'right' | 'left',
    isGrounded: false,
    standingPlatform: null as Platform | null,
    coyoteTime: 0,
    jumpBuffer: 0,
    invincibleTimer: 0,
    starPowerTimer: 0,
    hasShield: false,
    hasArmor: false,
    armorShields: 0,
    swordSlashTimer: 0,
    shieldBlockActive: false,
    health: 3,
    lastCheckpoint: { x: levelData.playerStart.x, y: levelData.playerStart.y },
    hasMoto: false,
    motoTimer: 0,
    isRunning: false,
    isCrouching: false,
    webGrapple: {
      active: false,
      anchorId: null as number | null,
      anchorX: 0,
      anchorY: 0,
      length: 220,
      angle: -0.7,
      speed: 0.05,
    },
  });

  // Camera state
  const cameraRef = useRef({
    x: 0,
    targetX: 0,
    y: 0,
    scale: 1,
  });

  // Inputs
  const inputRef = useRef({
    left: false,
    right: false,
    crouch: false,
    jump: false,
    jumpPressed: false,
    attack: false,
    attackPressed: false,
    run: false,
  });

  // Particle systems
  const particlesRef = useRef<Particle[]>([]);

  // HUD React state
  const [hudHearts, setHudHearts] = useState(0);
  const [hudMaxHearts, setHudMaxHearts] = useState(levelData.hearts.length);
  const [hudHealth, setHudHealth] = useState(3);
  const [isMuted, setIsMuted] = useState(!sounds.enabled);
  const [hasShieldHUD, setHasShieldHUD] = useState(false);
  const [hasStarHUD, setHasStarHUD] = useState(false);
  const [hasArmorHUD, setHasArmorHUD] = useState(false);
  const [hasMotoHUD, setHasMotoHUD] = useState(false);
  const [motoSecondsHUD, setMotoSecondsHUD] = useState(0);
  const [isCutsceneActive, setIsCutsceneActive] = useState(false);

  // Load Theo Lucca sprite
  useEffect(() => {
    loadAndProcessTheoImage().then((res) => {
      spritesRef.current = res;
    });
  }, []);

  // Reset or setup level when stage changes
  const resetLevel = useCallback((stageIdx: number) => {
    const rawLevel = LEVELS[stageIdx] || LEVELS[0];
    const lvlCopy: LevelData = JSON.parse(JSON.stringify(rawLevel));

    // Initialize moving platforms start positions
    lvlCopy.platforms.forEach((p) => {
      p.startX = p.x;
      p.startY = p.y;
    });

    currentLevelRef.current = lvlCopy;
    stageClearedRef.current = false;
    isRunningRef.current = true;

    cutsceneRef.current = {
      active: false,
      startTime: 0,
      progress: 0,
      theoX: 0,
      theoY: 0,
      amorX: 0,
      amorY: 0,
      targetX: 0,
      finished: false,
    };
    setIsCutsceneActive(false);

    playerRef.current = {
      x: lvlCopy.playerStart.x,
      y: lvlCopy.playerStart.y,
      w: 62,
      h: 89,
      vx: 0,
      vy: 0,
      facing: 'right',
      isGrounded: false,
      standingPlatform: null,
      coyoteTime: 0,
      jumpBuffer: 0,
      invincibleTimer: 0,
      starPowerTimer: 0,
      hasShield: false,
      hasArmor: false,
      armorShields: 0,
      swordSlashTimer: 0,
      shieldBlockActive: false,
      health: 3,
      lastCheckpoint: { x: lvlCopy.playerStart.x, y: lvlCopy.playerStart.y },
      hasMoto: false,
      motoTimer: 0,
      isRunning: false,
      isCrouching: false,
      webGrapple: {
        active: false,
        anchorId: null,
        anchorX: 0,
        anchorY: 0,
        length: 220,
        angle: -0.7,
        speed: 0.05,
      },
    };

    cameraRef.current = {
      x: 0,
      targetX: 0,
      y: 0,
      scale: 1,
    };

    inputRef.current = {
      left: false,
      right: false,
      crouch: false,
      jump: false,
      jumpPressed: false,
      attack: false,
      attackPressed: false,
      run: false,
    };

    particlesRef.current = [];
    setHudHearts(0);
    setHudMaxHearts(lvlCopy.hearts.length);
    setHudHealth(3);
    setHasShieldHUD(false);
    setHasStarHUD(false);
    setHasArmorHUD(false);
    setHasMotoHUD(false);
    setMotoSecondsHUD(0);
  }, []);

  useEffect(() => {
    resetLevel(currentStageIndex);
  }, [currentStageIndex, resetLevel]);

  // Touch control callbacks
  const handleMoveLeft = useCallback((active: boolean) => {
    if (cutsceneRef.current.active) return;
    inputRef.current.left = active;
  }, []);

  const handleMoveRight = useCallback((active: boolean) => {
    if (cutsceneRef.current.active) return;
    inputRef.current.right = active;
  }, []);

  const handleCrouch = useCallback((active: boolean) => {
    if (cutsceneRef.current.active) return;
    inputRef.current.crouch = active;
  }, []);

  const handleJump = useCallback((active: boolean) => {
    if (cutsceneRef.current.active) return;
    if (active && !inputRef.current.jump) {
      inputRef.current.jumpPressed = true;
    }
    inputRef.current.jump = active;
  }, []);

  const handleAttack = useCallback((active: boolean) => {
    if (cutsceneRef.current.active) return;
    if (active && !inputRef.current.attack) {
      inputRef.current.attackPressed = true;
    }
    inputRef.current.attack = active;
  }, []);

  const handleRun = useCallback((active: boolean) => {
    if (cutsceneRef.current.active) return;
    inputRef.current.run = active;
  }, []);

  const spawnDismountParticles = (x: number, y: number) => {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 4 + Math.random() * 4,
        color: '#f59e0b',
        alpha: 1,
        life: 0,
        maxLife: 30,
      });
    }
  };

  const handleDismountMoto = useCallback(() => {
    const p = playerRef.current;
    if (p && p.hasMoto) {
      p.hasMoto = false;
      p.motoTimer = 0;
      setHasMotoHUD(false);
      setMotoSecondsHUD(0);
      sounds.playDismount();
      spawnDismountParticles(p.x + p.w / 2, p.y + p.h / 2);
    }
  }, []);

  const handleWebShoot = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;

    // Se já estiver balançando na teia, soltar com salto acrobático impulsionado!
    if (p.webGrapple.active) {
      p.webGrapple.active = false;
      p.vx = 8.5;
      p.vy = -7.0;
      sounds.playJump();
      spawnDismountParticles(p.x + p.w / 2, p.y + p.h / 2);
      return;
    }

    // Busca o ponto de ancoragem (webAnchor) mais próximo no alcance
    const anchors = currentLevelRef.current.webAnchors || [];
    let bestAnchor: (typeof anchors)[0] | null = null;
    let minDist = 440;

    for (const a of anchors) {
      const dx = a.x - (p.x + p.w / 2);
      const dy = a.y - (p.y + p.h / 2);
      const dist = Math.hypot(dx, dy);

      // Prioriza orbes à frente ou diretamente acima
      if (dist < minDist && dx > -120) {
        minDist = dist;
        bestAnchor = a;
      }
    }

    if (bestAnchor) {
      const dx = (p.x + p.w / 2) - bestAnchor.x;
      const dy = (p.y + p.h / 2) - bestAnchor.y;
      const initialAngle = Math.atan2(dx, dy);
      const ropeLength = Math.max(140, Math.min(360, Math.hypot(dx, dy)));

      p.webGrapple = {
        active: true,
        anchorId: bestAnchor.id,
        anchorX: bestAnchor.x,
        anchorY: bestAnchor.y,
        length: ropeLength,
        angle: initialAngle < 0 ? initialAngle : -0.7,
        speed: 0.065,
      };

      sounds.playWebShoot();
      sounds.playWebSwing();

      // Partículas douradas mágicas
      for (let i = 0; i < 8; i++) {
        particlesRef.current.push({
          x: bestAnchor.x,
          y: bestAnchor.y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          size: 4 + Math.random() * 3,
          color: '#facc15',
          alpha: 1,
          life: 0,
          maxLife: 25,
          isStar: true,
        });
      }
    } else {
      sounds.playWebShoot();
    }
  }, []);

  // Keyboard controls for developer review
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cutsceneRef.current.active) return;
      if (e.repeat) return; // Prevent OS key repeat loops
      if ((e.key === 'c' || e.key === 'C' || e.key === 'q' || e.key === 'Q') && playerRef.current.hasMoto) {
        handleDismountMoto();
      }
      if ((e.key === 't' || e.key === 'T' || e.key === 'w' || e.key === 'W' || e.key === 'e' || e.key === 'E') && (currentLevelRef.current.hasWebPower || currentStageIndex >= 5)) {
        handleWebShoot();
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        inputRef.current.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        inputRef.current.right = true;
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        inputRef.current.crouch = true;
      }
      if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w' || e.key === 'W') {
        if (!inputRef.current.jump) {
          inputRef.current.jumpPressed = true;
        }
        inputRef.current.jump = true;
      }
      if (e.key === 'j' || e.key === 'J' || e.key === 'x' || e.key === 'X' || e.key === 'f' || e.key === 'F') {
        if (!inputRef.current.attack) {
          inputRef.current.attackPressed = true;
        }
        inputRef.current.attack = true;
      }
      if (e.key === 'Shift' || e.key === 'z' || e.key === 'Z' || e.key === 'k' || e.key === 'K') {
        inputRef.current.run = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        inputRef.current.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        inputRef.current.right = false;
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        inputRef.current.crouch = false;
      }
      if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w' || e.key === 'W') {
        inputRef.current.jump = false;
      }
      if (e.key === 'j' || e.key === 'J' || e.key === 'x' || e.key === 'X' || e.key === 'f' || e.key === 'F') {
        inputRef.current.attack = false;
      }
      if (e.key === 'Shift' || e.key === 'z' || e.key === 'Z' || e.key === 'k' || e.key === 'K') {
        inputRef.current.run = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main 60fps Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let gameTime = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const spawnHeartParticles = (x: number, y: number, count = 9) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3.5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: 7 + Math.random() * 6,
          color: i % 2 === 0 ? '#f43f5e' : '#fb7185',
          alpha: 1,
          life: 0,
          maxLife: 35 + Math.random() * 15,
          isHeart: true,
        });
      }
    };

    const spawnSpringStars = (x: number, y: number) => {
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 8) * i + Math.random() * 0.3;
        const speed = 2 + Math.random() * 4;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: -Math.abs(Math.sin(angle) * speed) - 2,
          size: 4 + Math.random() * 4,
          color: '#facc15',
          alpha: 1,
          life: 0,
          maxLife: 30,
        });
      }
    };

    const spawnStompStars = (x: number, y: number) => {
      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 5 + Math.random() * 4,
          color: '#facc15',
          alpha: 1,
          life: 0,
          maxLife: 25,
          isStar: true,
        });
      }
    };

    const spawnArmorEquipSparks = (x: number, y: number) => {
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 4;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: 6 + Math.random() * 5,
          color: i % 2 === 0 ? '#f59e0b' : '#fde047',
          alpha: 1,
          life: 0,
          maxLife: 40,
          isStar: true,
        });
      }
    };

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      gameTime += dt;

      if (!isRunningRef.current) {
        animId = requestAnimationFrame(loop);
        return;
      }

      // Responsive Canvas sizing
      const container = containerRef.current;
      if (container) {
        const dpr = window.devicePixelRatio || 1;
        const dispW = container.clientWidth || (canvas.parentElement?.clientWidth ?? window.innerWidth) || 360;
        const dispH = container.clientHeight || (canvas.parentElement?.clientHeight ?? window.innerHeight) || 640;

        if (canvas.width !== dispW * dpr || canvas.height !== dispH * dpr) {
          canvas.width = dispW * dpr;
          canvas.height = dispH * dpr;
          canvas.style.width = `${dispW}px`;
          canvas.style.height = `${dispH}px`;
        }

        const VIRTUAL_HEIGHT = 700;
        const scale = dispH / VIRTUAL_HEIGHT;
        const virtualWidth = dispW / scale;
        cameraRef.current.scale = scale;

        if (isNaN(cameraRef.current.x)) {
          cameraRef.current.x = 0;
        }

        const level = currentLevelRef.current;
        const p = playerRef.current;
        const input = inputRef.current;
        const cutscene = cutsceneRef.current;

        // ==========================================
        // CUTSCENE MODE LOGIC (Stage 3 Live Encounter)
        // ==========================================
        if (cutscene.active) {
          const cutElapsed = gameTime - cutscene.startTime;
          const CUTSCENE_DURATION = 3.8;
          cutscene.progress = Math.min(1, cutElapsed / CUTSCENE_DURATION);

          if (cutscene.progress < 0.4) {
            const tPhase = cutscene.progress / 0.4;
            cutscene.theoX = p.x + (cutscene.targetX - p.x - 30) * tPhase;
            const amorStartX = level.goal.x + level.goal.w / 2;
            cutscene.amorX = amorStartX + (cutscene.targetX - amorStartX + 30) * tPhase;
          } else {
            cutscene.theoX = cutscene.targetX - 25;
            cutscene.amorX = cutscene.targetX + 25;

            if (Math.random() < 0.18) {
              spawnHeartParticles(cutscene.targetX, cutscene.theoY - 10, 2);
            }
          }

          const targetCamX = cutscene.targetX - virtualWidth * 0.5;
          const maxCamX = Math.max(0, level.worldWidth - virtualWidth);
          cameraRef.current.x += (Math.max(0, Math.min(maxCamX, targetCamX)) - cameraRef.current.x) * 0.08;

          if (cutscene.progress >= 1 && !cutscene.finished) {
            cutscene.finished = true;
            isRunningRef.current = false;
            sounds.playVictory();
            const collectedCount = level.hearts.filter((h) => h.collected).length;
            onGameComplete(collectedCount);
          }

        } else {
          // ==========================================
          // NORMAL GAMEPLAY UPDATE
          // ==========================================

          // 1. Move Dynamic Platforms & Carry Theo
          let carriedDeltaX = 0;
          let carriedDeltaY = 0;

          level.platforms.forEach((plt) => {
            if (plt.type === 'moving' && plt.moveRange && plt.moveSpeed) {
              const prevPltX = plt.x;
              const prevPltY = plt.y;
              const range = plt.moveRange;
              const speed = plt.moveSpeed;
              if (plt.direction === 'vertical') {
                plt.y = (plt.startY ?? plt.y) + Math.sin(gameTime * speed) * range;
              } else {
                plt.x = (plt.startX ?? plt.x) + Math.sin(gameTime * speed) * range;
              }

              if (p.standingPlatform === plt) {
                carriedDeltaX = plt.x - prevPltX;
                carriedDeltaY = plt.y - prevPltY;
              }
            }
          });

          // Carry Theo with the moving platform!
          p.x += carriedDeltaX;
          p.y += carriedDeltaY;

          // 2. Move Hazards
          level.hazards.forEach((hz) => {
            if (hz.vx && hz.minX !== undefined && hz.maxX !== undefined) {
              hz.x += hz.vx;
              if (hz.x < hz.minX || hz.x > hz.maxX) {
                hz.vx = -hz.vx;
              }
            }
          });

          // 3. Move and Update Cogumelos (Mushroom Enemies)
          level.enemies.forEach((en) => {
            if (en.squishTimer && en.squishTimer > 0) {
              en.squishTimer -= dt;
            }
            if (en.alive) {
              en.x += en.vx;
              if (en.x < en.minX || en.x + en.w > en.maxX) {
                en.vx = -en.vx;
              }
            }
          });

          // 4. Powerup & Combat Timers
          if (p.starPowerTimer > 0) {
            p.starPowerTimer -= dt;
            if (p.starPowerTimer <= 0) {
              p.starPowerTimer = 0;
              setHasStarHUD(false);
            }
          }

          if (p.swordSlashTimer > 0) {
            p.swordSlashTimer -= dt;
          }

          // Shield block state: active while holding button or during sword slash
          p.shieldBlockActive = input.attack || p.swordSlashTimer > 0;

          // Execute Sword & Shield Attack action
          if (input.attackPressed) {
            input.attackPressed = false;
            p.swordSlashTimer = 0.25; // 250ms active slash
            sounds.playSwordSlash();

            // Spawn sword energy slash particles in front of Theo
            const slashDir = p.facing === 'right' ? 1 : -1;
            const slashCenterX = p.x + p.w / 2 + slashDir * (p.hasArmor ? 50 : 38);
            const slashCenterY = p.y + p.h / 2;

            spawnSpringStars(slashCenterX, slashCenterY);

            // Sword Slash Hitbox check: slices mushrooms in front
            const slashReach = p.hasArmor ? 95 : 75;
            const slashBoxX = slashDir > 0 ? p.x + p.w : p.x - slashReach;

            for (const en of level.enemies) {
              if (!en.alive) continue;
              const overlapSlash =
                en.x + en.w > slashBoxX &&
                en.x < slashBoxX + slashReach &&
                en.y + en.h > p.y - 20 &&
                en.y < p.y + p.h + 20;

              if (overlapSlash) {
                en.alive = false;
                en.squishTimer = 0.35;
                sounds.playStomp();
                spawnStompStars(en.x + en.w / 2, en.y + en.h / 2);
                spawnHeartParticles(en.x + en.w / 2, en.y, 4);

                setHudHearts((prev) => {
                  const next = prev + 1;
                  onHeartCollected(next);
                  return next;
                });
              }
            }
          }

          // 4b. Crouch (ABAIXAR) Physics & Overhead Obstacle Clearance
          const STAND_HEIGHT = 89;
          const CROUCH_HEIGHT = 48;

          if (input.crouch && p.isGrounded && !p.hasMoto) {
            if (!p.isCrouching) {
              p.isCrouching = true;
              sounds.playDuck();
              const feet = p.y + p.h;
              p.h = CROUCH_HEIGHT;
              p.y = feet - CROUCH_HEIGHT;
            }
          } else if (p.isCrouching) {
            // Check if head would hit an overhead hazard when standing back up
            const feet = p.y + p.h;
            const headTop = feet - STAND_HEIGHT;
            const isHeadBlocked = level.hazards.some(
              (hz) =>
                hz.isOverhead &&
                p.x + p.w - 10 > hz.x &&
                p.x + 10 < hz.x + hz.w &&
                headTop < hz.y + hz.h &&
                feet - CROUCH_HEIGHT >= hz.y
            );

            if (!isHeadBlocked) {
              p.isCrouching = false;
              p.h = STAND_HEIGHT;
              p.y = feet - STAND_HEIGHT;
            }
          }

          // 5. Player Web Grapple / Running / Horizontal Physics
          if (p.webGrapple && p.webGrapple.active) {
            // WEB GRAPPLE SWING PHYSICS
            const wg = p.webGrapple;
            wg.angle += wg.speed;

            // Posição no arco do pêndulo
            p.x = wg.anchorX + Math.sin(wg.angle) * wg.length - p.w / 2;
            p.y = wg.anchorY + Math.cos(wg.angle) * wg.length - p.h / 2;

            // Velocidade tangencial de balanço
            p.vx = Math.cos(wg.angle) * 8.5;
            p.vy = -Math.sin(wg.angle) * 8.5;

            // Soltar ao atingir arco alto à frente (angle > 0.75) ou apertar Pular
            if (wg.angle >= 0.75 || input.jumpPressed) {
              p.webGrapple.active = false;
              p.vx = 9.0;
              p.vy = -7.5;
              sounds.playJump();
              spawnDismountParticles(p.x + p.w / 2, p.y + p.h / 2);
            }

            // Rastro brilhante de teia
            if (Math.random() < 0.4) {
              particlesRef.current.push({
                x: p.x + p.w / 2,
                y: p.y + p.h / 2,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: 3 + Math.random() * 3,
                color: '#facc15',
                alpha: 1,
                life: 0,
                maxLife: 20,
                isStar: true,
              });
            }
          }

          const isPlayerRunning = input.run && (input.left || input.right);
          p.isRunning = isPlayerRunning;

          let ACCEL = 1.4;
          let MAX_SPEED = 5.6;

          if (p.isCrouching) {
            // Crawling or sliding under obstacles
            ACCEL = 1.8;
            MAX_SPEED = isPlayerRunning ? 6.2 : 3.8;
          } else if (p.hasMoto) {
            // Moto has high-speed sports bike physics!
            if (isPlayerRunning) {
              ACCEL = 3.2;
              MAX_SPEED = 12.0; // Nitro Turbo Speed!
            } else {
              ACCEL = 2.4;
              MAX_SPEED = 8.6;
            }
          } else if (p.starPowerTimer > 0) {
            ACCEL = isPlayerRunning ? 2.6 : 1.8;
            MAX_SPEED = isPlayerRunning ? 9.2 : 7.2;
          } else if (isPlayerRunning) {
            ACCEL = 2.2;
            MAX_SPEED = 8.4; // Sprint run speed!
          }

          const FRICTION = p.hasMoto ? 0.90 : 0.82;

          if (input.left) {
            p.vx -= ACCEL;
            p.facing = 'left';
          } else if (input.right) {
            p.vx += ACCEL;
            p.facing = 'right';
          } else {
            p.vx *= FRICTION;
            if (Math.abs(p.vx) < 0.1) p.vx = 0;
          }
          p.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, p.vx));

          // Moto exhaust particles & engine effects
          if (p.hasMoto && Math.abs(p.vx) > 0.5 && p.isGrounded) {
            if (Math.random() < 0.35) {
              const exhaustDir = p.facing === 'right' ? -1 : 1;
              particlesRef.current.push({
                x: p.x + p.w / 2 + exhaustDir * 28,
                y: p.y + p.h * 0.75,
                vx: exhaustDir * (2 + Math.random() * 2),
                vy: -Math.random() * 1.5,
                size: 3 + Math.random() * 3,
                color: isPlayerRunning ? '#f97316' : '#94a3b8',
                alpha: 0.8,
                life: 0,
                maxLife: 0.35,
              });
            }
          }

          // Motorcycle timer decrement
          if (p.hasMoto) {
            p.motoTimer -= dt;
            setMotoSecondsHUD(Math.max(0, Math.ceil(p.motoTimer)));
            if (p.motoTimer <= 0) {
              p.hasMoto = false;
              p.motoTimer = 0;
              setHasMotoHUD(false);
            }
          }

          // 6. Player Jump & Gravity Physics
          const GRAVITY = 0.58;
          const JUMP_IMPULSE = p.hasMoto ? -15.2 : -14.4;

          if (input.jumpPressed) {
            if (p.isCrouching) {
              // Try uncrouching before jumping if not blocked
              const feet = p.y + p.h;
              const headTop = feet - STAND_HEIGHT;
              const isHeadBlocked = level.hazards.some(
                (hz) =>
                  hz.isOverhead &&
                  p.x + p.w - 10 > hz.x &&
                  p.x + 10 < hz.x + hz.w &&
                  headTop < hz.y + hz.h &&
                  feet - CROUCH_HEIGHT >= hz.y
              );
              if (!isHeadBlocked) {
                p.isCrouching = false;
                p.h = STAND_HEIGHT;
                p.y = feet - STAND_HEIGHT;
                p.jumpBuffer = 10;
              }
            } else {
              p.jumpBuffer = 10;
            }
            input.jumpPressed = false;
          } else if (p.jumpBuffer > 0) {
            p.jumpBuffer--;
          }

          if (p.isGrounded) {
            p.coyoteTime = 8;
          } else if (p.coyoteTime > 0) {
            p.coyoteTime--;
          }

          if (p.jumpBuffer > 0 && p.coyoteTime > 0) {
            p.vy = JUMP_IMPULSE;
            p.jumpBuffer = 0;
            p.coyoteTime = 0;
            p.isGrounded = false;
            p.standingPlatform = null;
            if (p.hasMoto) {
              sounds.playMotoEngine();
            } else {
              sounds.playJump();
            }
          }

          if (!input.jump && p.vy < -3.5) {
            p.vy *= 0.88;
          }

          p.vy += GRAVITY;
          if (p.vy > 14) p.vy = 14;

          p.x += p.vx;
          if (p.x < 10) {
            p.x = 10;
            p.vx = 0;
          }
          if (p.x > level.worldWidth - p.w - 10) {
            p.x = level.worldWidth - p.w - 10;
          }

          // 7. Platform Collisions
          p.isGrounded = false;
          let currentStandingPlt: Platform | null = null;
          const prevY = p.y;
          p.y += p.vy;

          for (const plt of level.platforms) {
            const px = p.x + 10;
            const pw = p.w - 20;
            const isHorizOverlap = px + pw > plt.x && px < plt.x + plt.w;

            if (isHorizOverlap) {
              const tolerance = plt.type === 'moving' ? 24 : 32;
              const wasAbove = prevY + p.h <= plt.y + tolerance;
              const maxStep = Math.max(30, p.vy + 16);
              const isNowBelowOrTouching = p.y + p.h >= plt.y - 4 && p.y + p.h <= plt.y + maxStep;

              if (wasAbove && isNowBelowOrTouching && p.vy >= 0) {
                if (plt.type === 'spring') {
                  p.y = plt.y - p.h;
                  p.vy = -19.5;
                  if (p.facing === 'right' && p.vx < 2.5) p.vx = 3;
                  else if (p.facing === 'left' && p.vx > -2.5) p.vx = -3;
                  p.isGrounded = false;
                  currentStandingPlt = null;
                  sounds.playSpring();
                  spawnSpringStars(plt.x + plt.w / 2, plt.y);
                } else {
                  p.y = plt.y - p.h;
                  p.vy = 0;
                  p.isGrounded = true;
                  currentStandingPlt = plt;
                }
                break;
              }
            }
          }
          p.standingPlatform = currentStandingPlt;

          // 8. Cogumelos (Mushroom Enemies) Combat & Stomp & Shield Block & Super Moto Ram
          for (const en of level.enemies) {
            if (!en.alive) continue;

            const px = p.x + 10;
            const py = p.y + 10;
            const pw = p.w - 20;
            const ph = p.h - 10;

            const isOverlap =
              px + pw > en.x &&
              px < en.x + en.w &&
              py + ph > en.y &&
              py < en.y + en.h;

            if (isOverlap) {
              const stomped = prevY + p.h <= en.y + 20 && p.vy > 0;

              // SUPER MOTO RAM: Theo atropela e derrota os cogumelos na hora sem sofrer dano!
              if (p.hasMoto) {
                en.alive = false;
                en.squishTimer = 0.35;
                sounds.playMotoRam();
                spawnStompStars(en.x + en.w / 2, en.y + en.h / 2);
                spawnHeartParticles(en.x + en.w / 2, en.y, 6);

                setHudHearts((prev) => {
                  const next = prev + 2; // Bônus duplo de corações ao atropelar com a Super Moto!
                  onHeartCollected(next);
                  return next;
                });
                break;

              } else if (stomped || p.starPowerTimer > 0) {
                en.alive = false;
                en.squishTimer = 0.35;
                p.vy = -12.5;
                sounds.playStomp();
                spawnStompStars(en.x + en.w / 2, en.y + en.h / 2);
                spawnHeartParticles(en.x + en.w / 2, en.y, 4);

                setHudHearts((prev) => {
                  const next = prev + 1;
                  onHeartCollected(next);
                  return next;
                });
                break;

              } else if (p.shieldBlockActive) {
                // Defensive Shield Block! Repels enemy with zero damage taken
                en.alive = false;
                en.squishTimer = 0.35;
                sounds.playStomp();
                p.vx = p.facing === 'right' ? -3 : 3;
                spawnSpringStars(en.x + en.w / 2, en.y + en.h / 2);
                break;

              } else if (p.invincibleTimer <= 0) {
                // Check Golden Armor protection first!
                if (p.hasArmor && p.armorShields > 0) {
                  p.armorShields -= 1;
                  sounds.playHurt();
                  p.vy = -6;
                  p.vx = p.facing === 'right' ? -4 : 4;
                  p.invincibleTimer = 1.4;
                  spawnArmorEquipSparks(p.x + p.w / 2, p.y + p.h / 2);

                  if (p.armorShields <= 0) {
                    p.hasArmor = false;
                    setHasArmorHUD(false);
                  }
                  break;
                } else if (p.hasShield) {
                  p.hasShield = false;
                  setHasShieldHUD(false);
                  sounds.playHurt();
                  p.vy = -7;
                  p.vx = p.facing === 'right' ? -4 : 4;
                  p.invincibleTimer = 1.4;
                  spawnSpringStars(p.x + p.w / 2, p.y + p.h / 2);
                } else {
                  sounds.playHurt();
                  p.health = Math.max(0, p.health - 1);
                  setHudHealth(p.health);
                  p.vy = -7;
                  p.vx = p.facing === 'right' ? -4 : 4;
                  p.invincibleTimer = 1.6;

                  if (p.health <= 0) {
                    p.health = 3;
                    setHudHealth(3);
                    p.x = p.lastCheckpoint.x;
                    p.y = p.lastCheckpoint.y;
                    p.vx = 0;
                    p.vy = 0;
                  }
                }
                break;
              }
            }
          }

          // 9. Collect Rewards (Baú do Amor, Estrela, Escudo, ARMADURA, SUPER MOTO)
          for (const rw of level.rewards) {
            if (rw.collected && rw.type !== 'chest') continue;
            if (rw.type === 'chest' && rw.opened) continue;

            const dist = Math.hypot(p.x + p.w / 2 - (rw.x + rw.w / 2), p.y + p.h / 2 - (rw.y + rw.h / 2));
            if (dist < 48) {
              if (rw.type === 'moto') {
                // Monta na Super Moto do Herói!
                rw.collected = true;
                p.hasMoto = true;
                p.motoTimer = 40; // 40 segundos de muita velocidade e diversão
                setHasMotoHUD(true);
                setMotoSecondsHUD(40);
                sounds.playMotoEngine();
                spawnSpringStars(rw.x + rw.w / 2, rw.y + rw.h / 2);
                spawnHeartParticles(rw.x + rw.w / 2, rw.y, 10);
              } else if (rw.type === 'armor') {
                // Collect and EQUIP ARMOR!
                rw.collected = true;
                p.hasArmor = true;
                p.armorShields = 2; // Absorbs 2 hits safely
                setHasArmorHUD(true);
                sounds.playEquipArmor();
                spawnArmorEquipSparks(rw.x + rw.w / 2, rw.y + rw.h / 2);
                spawnHeartParticles(rw.x + rw.w / 2, rw.y, 8);
              } else if (rw.type === 'star') {
                rw.collected = true;
                p.starPowerTimer = 8.5;
                setHasStarHUD(true);
                sounds.playPowerup();
                spawnSpringStars(rw.x + rw.w / 2, rw.y + rw.h / 2);
              } else if (rw.type === 'shield') {
                rw.collected = true;
                p.hasShield = true;
                setHasShieldHUD(true);
                sounds.playPowerup();
                spawnSpringStars(rw.x + rw.w / 2, rw.y + rw.h / 2);
              } else if (rw.type === 'chest') {
                rw.opened = true;
                sounds.playChestOpen();
                spawnHeartParticles(rw.x + rw.w / 2, rw.y, 14);
                setHudHearts((prev) => {
                  const next = prev + 5;
                  onHeartCollected(next);
                  return next;
                });
              }
            }
          }

          // 10. Checkpoints Check
          level.checkpoints.forEach((cp) => {
            if (!cp.reached && p.x >= cp.x) {
              cp.reached = true;
              p.lastCheckpoint = { x: cp.x, y: cp.y };
            }
          });

          // 11. Fall into abyss handling
          if (p.y > 630) {
            sounds.playHurt();
            p.health = Math.max(1, p.health - 1);
            setHudHealth(p.health);
            p.x = p.lastCheckpoint.x;
            p.y = p.lastCheckpoint.y;
            p.vx = 0;
            p.vy = 0;
            p.standingPlatform = null;
            p.invincibleTimer = 1.5;
          }

          // 12. Hazard Intersections
          if (p.invincibleTimer > 0) {
            p.invincibleTimer -= dt;
          } else {
            for (const hz of level.hazards) {
              // If overhead hazard (beam, ceiling spikes, pendulum) and Theo is crouching, he safely ducks under!
              if (hz.isOverhead && p.isCrouching) {
                continue;
              }

              const px = p.x + 12;
              const py = p.y + 12;
              const pw = p.w - 24;
              const ph = p.h - 18;

              if (
                px + pw > hz.x &&
                px < hz.x + hz.w &&
                py + ph > hz.y &&
                py < hz.y + hz.h
              ) {
                if (p.hasMoto) {
                  // A Super Moto pula os obstáculos com facilidade!
                  p.vy = -6;
                  p.invincibleTimer = 0.8;
                  sounds.playSpring();
                  spawnSpringStars(p.x + p.w / 2, p.y + p.h / 2);
                  break;
                } else if (p.shieldBlockActive) {
                  // Shield block absorbs hazard
                  sounds.playHurt();
                  p.vy = -5;
                  p.vx = p.facing === 'right' ? -4 : 4;
                  p.invincibleTimer = 1.2;
                  spawnSpringStars(p.x + p.w / 2, p.y + p.h / 2);
                } else if (p.hasArmor && p.armorShields > 0) {
                  p.armorShields -= 1;
                  sounds.playHurt();
                  p.vy = -6;
                  p.vx = p.facing === 'right' ? -4 : 4;
                  p.invincibleTimer = 1.4;
                  spawnArmorEquipSparks(p.x + p.w / 2, p.y + p.h / 2);

                  if (p.armorShields <= 0) {
                    p.hasArmor = false;
                    setHasArmorHUD(false);
                  }
                } else if (p.hasShield) {
                  p.hasShield = false;
                  setHasShieldHUD(false);
                  sounds.playHurt();
                  p.vy = -6;
                  p.vx = p.facing === 'right' ? -4 : 4;
                  p.invincibleTimer = 1.4;
                } else {
                  sounds.playHurt();
                  p.health = Math.max(0, p.health - 1);
                  setHudHealth(p.health);
                  p.vy = -7;
                  p.vx = p.facing === 'right' ? -4 : 4;
                  p.invincibleTimer = 1.6;

                  if (p.health <= 0) {
                    p.health = 3;
                    setHudHealth(3);
                    p.x = p.lastCheckpoint.x;
                    p.y = p.lastCheckpoint.y;
                    p.vx = 0;
                    p.vy = 0;
                  }
                }
                break;
              }
            }
          }

          // 13. Collect Hearts
          level.hearts.forEach((h) => {
            if (!h.collected) {
              const dist = Math.hypot(p.x + p.w / 2 - h.x, p.y + p.h / 2 - h.y);
              if (dist < 42) {
                h.collected = true;
                sounds.playHeart();
                spawnHeartParticles(h.x, h.y);
                setHudHearts((prev) => {
                  const next = prev + 1;
                  onHeartCollected(next);
                  return next;
                });
              }
            }
          });

          // 14. Goal Detection
          const goal = level.goal;
          const reachedGoal =
            p.x + p.w > goal.x - 40 &&
            p.x < goal.x + goal.w + 40 &&
            p.y + p.h > goal.y &&
            p.y < goal.y + goal.h + 20;

          if (reachedGoal && !stageClearedRef.current) {
            if (currentStageIndex === 4 || currentStageIndex === 9 || currentStageIndex === LEVELS.length - 1) {
              // Final da Missão 1 (Fase 5), Final da Missão 2 (Fase 10) OU Final do Caminho de Casa (Fase 11)!
              stageClearedRef.current = true;
              cutscene.active = true;
              cutscene.startTime = gameTime;
              cutscene.theoX = p.x;
              cutscene.theoY = p.y;
              cutscene.amorX = goal.x + goal.w / 2;
              cutscene.amorY = goal.y + goal.h - 70;
              cutscene.targetX = goal.x - 30;
              setIsCutsceneActive(true);
              sounds.playReunion();
            } else {
              // Fases intermediárias: modal de fase concluída!
              stageClearedRef.current = true;
              isRunningRef.current = false;
              sounds.playStageClear();
              const collectedCount = level.hearts.filter((h) => h.collected).length;
              onStageClear(collectedCount, level.hearts.length);
            }
          }

          // Abismo fall rescue / respawn
          if (p.y > 580) {
            sounds.playHurt();
            p.health = Math.max(0, p.health - 1);
            setHudHealth(p.health);
            p.x = p.lastCheckpoint.x;
            p.y = p.lastCheckpoint.y;
            p.vx = 0;
            p.vy = 0;
            if (p.webGrapple) p.webGrapple.active = false;
            if (p.health <= 0) {
              p.health = 3;
              setHudHealth(3);
            }
          }

          // 15. Camera Tracking
          const lookahead = p.facing === 'right' ? 80 : -60;
          const targetCamX = p.x + p.w / 2 - virtualWidth * 0.42 + lookahead;
          const maxCamX = Math.max(0, level.worldWidth - virtualWidth);
          const clampedTarget = Math.max(0, Math.min(maxCamX, targetCamX));
          cameraRef.current.x += (clampedTarget - cameraRef.current.x) * 0.08;
        }

        // 16. Update Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const pt = particlesRef.current[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.vy += 0.12;
          pt.life++;
          pt.alpha = 1 - pt.life / pt.maxLife;
          if (pt.life >= pt.maxLife) {
            particlesRef.current.splice(i, 1);
          }
        }

        // ==========================================
        // 17. RENDER CANVAS
        // ==========================================
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(scale * dpr, scale * dpr);

        const camX = cameraRef.current.x;

        // Background
        drawBackground(ctx, level, camX, virtualWidth, VIRTUAL_HEIGHT, gameTime);

        // Scenery
        drawScenery(ctx, level, camX);

        // Platforms
        drawPlatforms(ctx, level.platforms, camX);

        // Hearts
        drawHearts(ctx, level.hearts, camX, gameTime);

        // Cogumelos (Mushroom Enemies)
        drawEnemies(ctx, level.enemies, camX, gameTime);

        // Rewards (Chests, Stars, Shields, Armor)
        drawRewards(ctx, level.rewards, camX, gameTime);

        // Hazards
        drawHazards(ctx, level.hazards, camX, gameTime);

        // Orbes de Ancoragem de Teia (Web Anchors)
        drawWebAnchors(ctx, level.webAnchors, camX, gameTime, p.x + p.w / 2, p.y + p.h / 2);

        // Linha ativa de Teia
        if (p.webGrapple && p.webGrapple.active) {
          drawWebGrapple(
            ctx,
            p.x + p.w / 2,
            p.y + p.h * 0.4,
            p.webGrapple.anchorX,
            p.webGrapple.anchorY,
            camX,
            gameTime
          );
        }

        // Goal / Amor / Carinho Pedestal
        drawGoal(ctx, level, camX, gameTime, cutscene.active);

        // Theo Lucca Character or Reunion Cutscene
        if (cutscene.active) {
          drawReunionCutscene(
            ctx,
            camX,
            cutscene.theoX,
            cutscene.theoY,
            cutscene.amorX,
            cutscene.amorY,
            cutscene.progress,
            gameTime,
            spritesRef.current,
            level.rescueTarget
          );
        } else {
          drawPlayer(
            ctx,
            p.x - camX,
            p.y,
            p.w,
            p.h,
            p.facing,
            p.isGrounded,
            p.vx,
            p.vy,
            p.invincibleTimer,
            p.starPowerTimer > 0,
            p.hasShield,
            p.hasArmor,
            1, // Fixed apple size (1.2x)
            p.swordSlashTimer,
            p.shieldBlockActive,
            gameTime,
            spritesRef.current,
            p.hasMoto,
            p.isRunning,
            p.isCrouching,
            level.id === 11
          );
        }

        // Particles
        drawParticles(ctx, particlesRef.current, camX);

        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [onHeartCollected, onStageClear, onGameComplete]);

  const toggleSound = () => {
    const active = sounds.toggleMute();
    setIsMuted(!active);
  };

  const handleRestartStage = () => {
    resetLevel(currentStageIndex);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none touch-none bg-slate-950"
    >
      {/* Top HUD Overlay */}
      <div
        className="absolute top-0 left-0 right-0 z-30 px-3.5 pt-3 pb-2 flex items-center justify-between text-white pointer-events-none"
        style={{
          paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0.75rem))',
        }}
      >
        {/* Left: Stage Title & Health */}
        <div className="flex flex-col drop-shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xs tracking-wider uppercase bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30 text-amber-200">
              {levelData.name.split(':')[0]}
            </span>
            <span className="font-bold text-sm text-white drop-shadow">
              {levelData.name.split(':')[1]}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {/* Health Hearts */}
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((hIndex) => (
                <Heart
                  key={hIndex}
                  className={`w-5 h-5 transition-transform ${
                    hIndex <= hudHealth
                      ? 'text-rose-500 fill-rose-500 drop-shadow'
                      : 'text-slate-600 fill-slate-800/80 opacity-60'
                  }`}
                />
              ))}
            </div>

            {/* Super Moto Heroica Badge */}
            {hasMotoHUD && (
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-600 border border-amber-300 text-yellow-100 text-xs font-black shadow-lg animate-pulse">
                <span>🏍️ MOTO</span>
                <span className="tabular-nums text-white bg-black/40 px-1 rounded font-mono text-[11px]">{motoSecondsHUD}s</span>
                <button
                  type="button"
                  onClick={handleDismountMoto}
                  className="pointer-events-auto ml-1 px-1.5 py-0.5 rounded-full bg-black/50 hover:bg-black/70 text-[10px] text-amber-200 border border-amber-400/50 uppercase tracking-tight active:scale-95"
                  title="Descer da moto"
                >
                  Descer ✕
                </button>
              </div>
            )}

            {/* Golden Armor Badge */}
            {hasArmorHUD && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/30 border border-amber-400 text-amber-200 text-xs font-bold animate-pulse">
                <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>Armadura</span>
              </div>
            )}

            {/* Active Shield Powerup Badge */}
            {hasShieldHUD && !hasArmorHUD && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/30 border border-sky-400 text-sky-200 text-xs font-bold animate-pulse">
                <Shield className="w-3.5 h-3.5 fill-sky-300" />
                <span>Escudo</span>
              </div>
            )}

            {/* Active Star Powerup Badge */}
            {hasStarHUD && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/40 border border-amber-300 text-amber-200 text-xs font-bold animate-bounce">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span>Super!</span>
              </div>
            )}
            {/* Active Web Power Badge */}
            {(levelData.hasWebPower || currentStageIndex >= 5) && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/30 border border-cyan-300 text-cyan-200 text-xs font-bold animate-pulse">
                <span>🕸️ Teia</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Heart Counter & Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Hearts Collected */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-rose-400/40 shadow-lg text-rose-300">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            <span className="font-extrabold text-sm text-white tabular-nums tracking-wide">
              {hudHearts}
            </span>
            <span className="text-xs text-rose-300/70 font-semibold">/{hudMaxHearts}</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
            className="w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 active:scale-90 transition-transform shadow-md"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Restart Stage Button */}
          <button
            type="button"
            onClick={handleRestartStage}
            aria-label="Reiniciar fase"
            title="Reiniciar fase"
            className="w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 active:scale-90 transition-transform shadow-md"
          >
            <RotateCcw className="w-4 h-4 text-amber-300" />
          </button>

          {/* Exit Game Button (Sair do Jogo) */}
          <button
            type="button"
            onClick={onExitGame}
            aria-label="Sair do jogo"
            title="Sair para o Menu Inicial"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-extrabold active:scale-95 transition-transform shadow-md"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden xs:inline">Sair</span>
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full touch-none" />

      {/* Mobile Touch Controls with Directional Pad, Correr / Turbo, Sword & Shield, Jump and Teia Button */}
      {!isCutsceneActive && (
        <TouchControls
          onMoveLeft={handleMoveLeft}
          onMoveRight={handleMoveRight}
          onCrouch={handleCrouch}
          onJump={handleJump}
          onAttack={handleAttack}
          onRun={handleRun}
          hasMoto={hasMotoHUD}
          onDismountMoto={handleDismountMoto}
          hasWebPower={levelData.hasWebPower || currentStageIndex >= 5}
          onWebShoot={handleWebShoot}
          isCrouching={playerRef.current?.isCrouching || false}
          isMission2={currentStageIndex >= 5}
        />
      )}
    </div>
  );
};
