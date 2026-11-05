/**
 * Visual canvas renderer for Theo Lucca, o Herói do Amor
 * Handles backgrounds, scenery, platforms, hearts, mushrooms, rewards, Amor, cutscene and particles
 */

import { LevelData, Platform, HeartItem, Hazard, Enemy, RewardItem, FruitItem, WebAnchor } from './levels';
import { CharacterSprites } from './spriteLoader';

// Canvas roundRect polyfill for maximum browser and webview compatibility
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (
    this: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    radii?: number | number[]
  ) {
    let r = 0;
    if (typeof radii === 'number') r = radii;
    else if (Array.isArray(radii) && radii.length > 0) r = radii[0];
    r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  isHeart?: boolean;
  isStar?: boolean;
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  level: LevelData,
  camX: number,
  viewW: number,
  viewH: number,
  time: number
) {
  if (level.theme === 'parque') {
    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, viewH);
    skyGrad.addColorStop(0, '#67e8f9'); // bright cyan
    skyGrad.addColorStop(0.5, '#bae6fd');
    skyGrad.addColorStop(1, '#fef08a'); // sunny warm horizon
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, viewW, viewH);

    // Warm Sun with rays
    const sunX = viewW - 80 - (camX * 0.05) % (viewW + 200);
    const sunY = 70;
    ctx.save();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Distant soft clouds (Parallax 0.15)
    drawParallaxClouds(ctx, camX * 0.15, viewW, viewH, time);

    // Far rolling hills (Parallax 0.25)
    ctx.save();
    ctx.fillStyle = '#86efac';
    ctx.beginPath();
    ctx.moveTo(0, viewH);
    const hillStep = 180;
    for (let x = -200; x <= viewW + 200; x += hillStep) {
      const hillX = x - ((camX * 0.25) % hillStep);
      const hillY = viewH - 220 + Math.sin((x + camX * 0.05) * 0.01) * 35;
      ctx.quadraticCurveTo(hillX + hillStep / 2, hillY - 45, hillX + hillStep, hillY);
    }
    ctx.lineTo(viewW, viewH);
    ctx.closePath();
    ctx.fill();

    // Near rolling hills (Parallax 0.4)
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.moveTo(0, viewH);
    for (let x = -200; x <= viewW + 200; x += 160) {
      const hillX = x - ((camX * 0.4) % 160);
      const hillY = viewH - 170 + Math.cos(x * 0.015) * 30;
      ctx.quadraticCurveTo(hillX + 80, hillY - 35, hillX + 160, hillY);
    }
    ctx.lineTo(viewW, viewH);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

  } else if (level.theme === 'cidade') {
    // Golden Hour sunset city sky
    const citySky = ctx.createLinearGradient(0, 0, 0, viewH);
    citySky.addColorStop(0, '#312e81'); // deep indigo
    citySky.addColorStop(0.4, '#c026d3'); // vibrant magenta
    citySky.addColorStop(0.7, '#f97316'); // orange
    citySky.addColorStop(1, '#fde047'); // yellow horizon
    ctx.fillStyle = citySky;
    ctx.fillRect(0, 0, viewW, viewH);

    // Distant city silhouette (Parallax 0.2)
    ctx.save();
    ctx.fillStyle = '#1e1b4b';
    const bldCount = 14;
    const bldWidth = 80;
    for (let i = -2; i < bldCount + 2; i++) {
      const bx = i * bldWidth - ((camX * 0.2) % bldWidth);
      const bh = 140 + ((i * 37) % 100);
      ctx.fillRect(bx, viewH - bh - 100, bldWidth - 6, bh + 100);

      // Lit windows
      ctx.fillStyle = 'rgba(253, 224, 71, 0.4)';
      for (let wy = viewH - bh - 80; wy < viewH - 120; wy += 26) {
        for (let wx = bx + 12; wx < bx + bldWidth - 20; wx += 20) {
          if ((wx + wy) % 3 === 0) {
            ctx.fillRect(wx, wy, 8, 12);
          }
        }
      }
      ctx.fillStyle = '#1e1b4b';
    }

    // Mid city skyline (Parallax 0.45)
    ctx.fillStyle = '#312e81';
    for (let i = -2; i < bldCount + 2; i++) {
      const bx = i * 110 - ((camX * 0.45) % 110);
      const bh = 180 + ((i * 53) % 130);
      ctx.fillRect(bx, viewH - bh - 60, 95, bh + 60);

      // Antennas
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx + 47, viewH - bh - 60);
      ctx.lineTo(bx + 47, viewH - bh - 85);
      ctx.stroke();

      if (Math.sin(time * 4 + i) > 0) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(bx + 47, viewH - bh - 86, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#312e81';
      }
    }
    ctx.restore();

  } else if (level.theme === 'masmorra') {
    // Castelo Medieval Masmorra: Ancient stone dungeon chamber with torches and arches
    const dungeonSky = ctx.createLinearGradient(0, 0, 0, viewH);
    dungeonSky.addColorStop(0, '#020617'); // obsidian dark
    dungeonSky.addColorStop(0.5, '#1e1b4b'); // deep gothic indigo
    dungeonSky.addColorStop(1, '#0f172a');
    ctx.fillStyle = dungeonSky;
    ctx.fillRect(0, 0, viewW, viewH);

    // Stone brick patterns on background dungeon walls
    ctx.save();
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.25)';
    ctx.lineWidth = 1.5;
    const brickW = 60;
    const brickH = 28;
    for (let by = 0; by < viewH; by += brickH) {
      const rowOffset = ((by / brickH) % 2) * (brickW / 2);
      for (let bx = -brickW; bx < viewW + brickW; bx += brickW) {
        const xPos = bx + rowOffset - ((camX * 0.12) % brickW);
        ctx.strokeRect(xPos, by, brickW, brickH);
      }
    }

    // Grand Gothic Castle Archways (Parallax 0.28)
    ctx.fillStyle = '#0f172a';
    for (let i = -1; i < 9; i++) {
      const archX = i * 160 - ((camX * 0.28) % 160);
      const archW = 110;
      // Stone pillar columns
      ctx.fillRect(archX, 0, 16, viewH);
      ctx.fillRect(archX + archW - 16, 0, 16, viewH);
      // Pointed Gothic arch curve
      ctx.beginPath();
      ctx.moveTo(archX, 240);
      ctx.quadraticCurveTo(archX + archW / 2, 70, archX + archW, 240);
      ctx.lineTo(archX + archW, 0);
      ctx.lineTo(archX, 0);
      ctx.closePath();
      ctx.fill();

      // Medieval Wall Torch with glowing warm fire
      const torchX = archX + archW / 2;
      const torchY = 220;
      // Torch sconce bracket
      ctx.fillStyle = '#334155';
      ctx.fillRect(torchX - 3, torchY, 6, 22);
      ctx.fillRect(torchX - 7, torchY - 2, 14, 5);

      // Warm fire glow
      const fireGlow = 38 + Math.sin(time * 8 + i) * 6;
      const glowGrad = ctx.createRadialGradient(torchX, torchY - 8, 2, torchX, torchY - 8, fireGlow);
      glowGrad.addColorStop(0, 'rgba(251, 146, 60, 0.45)');
      glowGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.18)');
      glowGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(torchX, torchY - 8, fireGlow, 0, Math.PI * 2);
      ctx.fill();

      // Fire Flame
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(torchX, torchY - 8, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(torchX, torchY - 10, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

  } else if (level.theme === 'castelo') {
    // Castelo: Royal Twilight Night Sky
    const castleSky = ctx.createLinearGradient(0, 0, 0, viewH);
    castleSky.addColorStop(0, '#0f172a'); // deep midnight
    castleSky.addColorStop(0.5, '#3b0764'); // royal purple
    castleSky.addColorStop(1, '#581c87');
    ctx.fillStyle = castleSky;
    ctx.fillRect(0, 0, viewW, viewH);

    // Glowing crescent/full moon
    ctx.save();
    const moonX = viewW - 90;
    const moonY = 80;
    ctx.fillStyle = 'rgba(253, 230, 138, 0.25)';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Twinkling stars
    ctx.save();
    for (let s = 0; s < 35; s++) {
      const sx = ((s * 97) % viewW);
      const sy = ((s * 53) % (viewH * 0.5));
      const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(time * 2 + s));
      ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
      ctx.fillRect(sx, sy, 2, 2);
    }

    // Castle spires silhouette in background (Parallax 0.3)
    ctx.fillStyle = '#1e1035';
    for (let i = -1; i < 8; i++) {
      const spX = i * 160 - ((camX * 0.3) % 160);
      const spW = 90;
      const spH = 220 + ((i * 41) % 90);
      ctx.fillRect(spX, viewH - spH - 60, spW, spH + 60);

      ctx.beginPath();
      ctx.moveTo(spX - 5, viewH - spH - 60);
      ctx.lineTo(spX + spW / 2, viewH - spH - 120);
      ctx.lineTo(spX + spW + 5, viewH - spH - 60);
      ctx.closePath();
      ctx.fill();

      // Glowing magical stained window
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(spX + spW / 2, viewH - spH - 10, 12, Math.PI, 0);
      ctx.rect(spX + spW / 2 - 12, viewH - spH - 10, 24, 28);
      ctx.fill();
      ctx.fillStyle = '#1e1035';
    }
    ctx.restore();

  } else if (level.theme === 'doces') {
    // Floresta dos Doces: Sweet pastel pink & lavender candy sky
    const candySky = ctx.createLinearGradient(0, 0, 0, viewH);
    candySky.addColorStop(0, '#f472b6'); // pastel pink
    candySky.addColorStop(0.4, '#c084fc'); // candy lavender
    candySky.addColorStop(0.8, '#a7f3d0'); // mint green horizon
    candySky.addColorStop(1, '#fef08a'); // soft cream yellow
    ctx.fillStyle = candySky;
    ctx.fillRect(0, 0, viewW, viewH);

    // Giant Sugar Candy Clouds (Parallax 0.15)
    drawParallaxClouds(ctx, camX * 0.15, viewW, viewH, time);

    // Far marshmallow hills (Parallax 0.25)
    ctx.save();
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.moveTo(0, viewH);
    for (let x = -200; x <= viewW + 200; x += 180) {
      const hillX = x - ((camX * 0.25) % 180);
      const hillY = viewH - 200 + Math.sin(x * 0.01) * 35;
      ctx.quadraticCurveTo(hillX + 90, hillY - 40, hillX + 180, hillY);
    }
    ctx.lineTo(viewW, viewH);
    ctx.closePath();
    ctx.fill();

    // Near candy cane & lollipop hills (Parallax 0.4)
    ctx.fillStyle = '#f9a8d4';
    ctx.beginPath();
    ctx.moveTo(0, viewH);
    for (let x = -200; x <= viewW + 200; x += 160) {
      const hillX = x - ((camX * 0.4) % 160);
      const hillY = viewH - 150 + Math.cos(x * 0.015) * 25;
      ctx.quadraticCurveTo(hillX + 80, hillY - 30, hillX + 160, hillY);
    }
    ctx.lineTo(viewW, viewH);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

  } else if (level.theme === 'cristais') {
    // Vale dos Cristais Arco-Íris: Deep twilight crystal cavern with glowing neon prisms
    const crystalSky = ctx.createLinearGradient(0, 0, 0, viewH);
    crystalSky.addColorStop(0, '#020617'); // dark space
    crystalSky.addColorStop(0.4, '#2e1065'); // deep indigo purple
    crystalSky.addColorStop(0.8, '#581c87'); // jewel violet
    crystalSky.addColorStop(1, '#0c4a6e'); // deep cyan
    ctx.fillStyle = crystalSky;
    ctx.fillRect(0, 0, viewW, viewH);

    // Twinkling crystal dust
    ctx.save();
    for (let s = 0; s < 40; s++) {
      const sx = ((s * 89) % viewW);
      const sy = ((s * 47) % (viewH * 0.7));
      const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(time * 3 + s));
      const colors = ['#38bdf8', '#c084fc', '#f472b6', '#facc15'];
      ctx.fillStyle = colors[s % colors.length];
      ctx.globalAlpha = twinkle;
      ctx.fillRect(sx, sy, 3, 3);
    }
    ctx.globalAlpha = 1;

    // Distant giant glowing crystal pillars (Parallax 0.3)
    for (let i = -1; i < 9; i++) {
      const cx = i * 150 - ((camX * 0.3) % 150);
      const ch = 200 + ((i * 37) % 80);
      ctx.fillStyle = i % 2 === 0 ? '#3b0764' : '#1e1b4b';
      ctx.beginPath();
      ctx.moveTo(cx, viewH);
      ctx.lineTo(cx + 25, viewH - ch);
      ctx.lineTo(cx + 50, viewH);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = i % 2 === 0 ? '#c084fc' : '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.restore();

  } else if (level.theme === 'nuvens') {
    // Reino das Nuvens e Balões: Sunny bright sky with distant rainbows
    const cloudSky = ctx.createLinearGradient(0, 0, 0, viewH);
    cloudSky.addColorStop(0, '#0284c7'); // sky blue
    cloudSky.addColorStop(0.5, '#7dd3fc');
    cloudSky.addColorStop(1, '#fef08a'); // sunny gold horizon
    ctx.fillStyle = cloudSky;
    ctx.fillRect(0, 0, viewW, viewH);

    // Giant Rainbow in background
    ctx.save();
    const rbX = viewW * 0.5 - ((camX * 0.05) % (viewW * 1.5));
    const rbY = viewH + 80;
    const rbColors = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#a855f7'];
    rbColors.forEach((color, idx) => {
      ctx.beginPath();
      ctx.arc(rbX, rbY, 280 + idx * 8, Math.PI, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = 8;
      ctx.globalAlpha = 0.45;
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    ctx.restore();

    // Floating puffy clouds (Parallax 0.2)
    drawParallaxClouds(ctx, camX * 0.2, viewW, viewH, time);

  } else if (level.theme === 'brinquedos') {
    // Fábrica de Brinquedos: Colorful playful playroom backdrop
    const toySky = ctx.createLinearGradient(0, 0, 0, viewH);
    toySky.addColorStop(0, '#1e1b4b'); // playful midnight indigo
    toySky.addColorStop(0.5, '#312e81');
    toySky.addColorStop(1, '#1e293b');
    ctx.fillStyle = toySky;
    ctx.fillRect(0, 0, viewW, viewH);

    // Giant spinning gears & building block silhouette in background (Parallax 0.25)
    ctx.save();
    for (let i = -1; i < 8; i++) {
      const gx = i * 160 - ((camX * 0.25) % 160);
      const gy = 120 + ((i * 43) % 90);
      const gColor = ['#ef4444', '#3b82f6', '#eab308', '#10b981'][i % 4];
      ctx.strokeStyle = gColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(gx, gy, 36, 0, Math.PI * 2);
      ctx.stroke();
      // Gear spokes
      for (let s = 0; s < 6; s++) {
        const ang = (s * Math.PI) / 3 + time * 0.8 * (i % 2 === 0 ? 1 : -1);
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(gx + Math.cos(ang) * 36, gy + Math.sin(ang) * 36);
        ctx.stroke();
      }
    }
    ctx.restore();

  } else if (level.theme === 'neve') {
    // Palácio de Neve: Aurora Borealis winter sky with sparkling snow
    const snowSky = ctx.createLinearGradient(0, 0, 0, viewH);
    snowSky.addColorStop(0, '#090d16');
    snowSky.addColorStop(0.4, '#0f172a');
    snowSky.addColorStop(0.8, '#1e293b');
    snowSky.addColorStop(1, '#0e7490'); // cyan glacier horizon
    ctx.fillStyle = snowSky;
    ctx.fillRect(0, 0, viewW, viewH);

    // Aurora Borealis luminous waves
    ctx.save();
    const auroraAlpha = 0.28 + Math.sin(time * 2) * 0.08;
    ctx.fillStyle = `rgba(45, 212, 191, ${auroraAlpha})`;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let x = 0; x <= viewW; x += 40) {
      const ay = 90 + Math.sin((x + camX * 0.1) * 0.015 + time * 1.5) * 35;
      ctx.lineTo(x, ay);
    }
    ctx.lineTo(viewW, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = `rgba(192, 132, 252, ${auroraAlpha * 0.8})`;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let x = 0; x <= viewW; x += 40) {
      const ay = 120 + Math.cos((x + camX * 0.08) * 0.018 - time * 1.2) * 30;
      ctx.lineTo(x, ay);
    }
    ctx.lineTo(viewW, 0);
    ctx.closePath();
    ctx.fill();

    // Falling gently animated snowflakes
    for (let i = 0; i < 45; i++) {
      const sx = ((i * 73 + time * 25) % (viewW + 100)) - 50;
      const sy = (i * 37 + time * 45) % viewH;
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.4 + 0.5 * Math.sin(time * 3 + i);
      ctx.beginPath();
      ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

function drawParallaxClouds(ctx: CanvasRenderingContext2D, offset: number, viewW: number, _viewH: number, time: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  const cloudPositions = [
    { x: 50, y: 80, s: 1.0 },
    { x: 260, y: 140, s: 0.8 },
    { x: 480, y: 90, s: 1.2 },
    { x: 720, y: 130, s: 0.9 },
    { x: 960, y: 70, s: 1.1 },
  ];

  for (const c of cloudPositions) {
    const cx = ((c.x + time * 8 - offset) % (viewW + 250)) - 100;
    drawPuffyCloud(ctx, cx, c.y, c.s);
  }
  ctx.restore();
}

function drawPuffyCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.arc(22, -10, 26, 0, Math.PI * 2);
  ctx.arc(48, -4, 20, 0, Math.PI * 2);
  ctx.arc(66, 0, 18, 0, Math.PI * 2);
  ctx.arc(33, 10, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawScenery(
  ctx: CanvasRenderingContext2D,
  level: LevelData,
  camX: number
) {
  for (const el of level.sceneryElements) {
    const sx = el.x - camX;
    if (sx < -200 || sx > 800) continue;

    ctx.save();
    ctx.translate(sx, el.y);
    const s = el.scale || 1.0;
    ctx.scale(s, s);

    if (el.type === 'tree') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-12, 40, 24, 90);
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(0, 30, 46, 0, Math.PI * 2);
      ctx.arc(-26, 10, 38, 0, Math.PI * 2);
      ctx.arc(26, 10, 38, 0, Math.PI * 2);
      ctx.arc(0, -20, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f43f5e';
      drawMiniHeart(ctx, -14, 0, 8);
      drawMiniHeart(ctx, 16, 18, 7);
      drawMiniHeart(ctx, -2, -12, 9);
    } else if (el.type === 'flower') {
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(-2, 0, 4, 18);
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (el.type === 'bench') {
      ctx.fillStyle = '#92400e';
      ctx.fillRect(-24, 0, 48, 8);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-20, 8, 6, 16);
      ctx.fillRect(14, 8, 6, 16);
    } else if (el.type === 'lamppost') {
      ctx.fillStyle = '#475569';
      ctx.fillRect(-4, 0, 8, 90);
      ctx.fillRect(-16, -4, 32, 6);
      ctx.fillStyle = 'rgba(253, 224, 71, 0.3)';
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (el.type === 'pillar') {
      ctx.fillStyle = '#475569';
      ctx.fillRect(-18, 0, 36, 140);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-24, -10, 48, 14);
      ctx.fillRect(-24, 136, 48, 14);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      for (let y = 14; y < 130; y += 22) {
        ctx.beginPath();
        ctx.moveTo(-18, y);
        ctx.lineTo(18, y);
        ctx.stroke();
      }
    } else if (el.type === 'banner') {
      ctx.fillStyle = '#be123c';
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(18, 0);
      ctx.lineTo(18, 55);
      ctx.lineTo(0, 72);
      ctx.lineTo(-18, 55);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      drawMiniHeart(ctx, 0, 28, 10);
    } else if (el.type === 'torch') {
      // Medieval Wall Torch
      ctx.fillStyle = '#475569';
      ctx.fillRect(-3, 0, 6, 26);
      ctx.fillRect(-7, -2, 14, 5);
      // Flame
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.ellipse(0, -9, 6, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(0, -7, 3.5, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (el.type === 'chain') {
      // Iron chains hanging from ceiling
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2.5;
      for (let cy = 0; cy < 60; cy += 12) {
        ctx.strokeRect(-4, cy, 8, 10);
      }
    } else if (el.type === 'shieldDecal') {
      // Wall Knight Crest
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(14, -10);
      ctx.lineTo(12, 10);
      ctx.lineTo(0, 20);
      ctx.lineTo(-12, 10);
      ctx.lineTo(-14, -10);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      drawMiniHeart(ctx, 0, 2, 7);
    } else if (el.type === 'lollipop') {
      // Giant Swirl Lollipop
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-3, 0, 6, 80);
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 1.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI);
      ctx.stroke();
    } else if (el.type === 'candyCane') {
      // Striped Candy Cane
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(0, 70);
      ctx.lineTo(0, 12);
      ctx.arc(10, 12, 10, Math.PI, 0, false);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 70);
      ctx.lineTo(0, 12);
      ctx.arc(10, 12, 10, Math.PI, 0, false);
      ctx.stroke();
    } else if (el.type === 'giantCrystal') {
      // Shimmering Crystal Gem Spire
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(0, -50);
      ctx.lineTo(18, -15);
      ctx.lineTo(12, 60);
      ctx.lineTo(-12, 60);
      ctx.lineTo(-18, -15);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.moveTo(0, -50);
      ctx.lineTo(18, -15);
      ctx.lineTo(0, 60);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (el.type === 'balloon') {
      // Cheerful Hot Air Balloon
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.ellipse(0, -20, 24, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(0, -20, 12, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#92400e';
      ctx.fillRect(-7, 16, 14, 10);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-6, 10);
      ctx.lineTo(-6, 16);
      ctx.moveTo(6, 10);
      ctx.lineTo(6, 16);
      ctx.stroke();
    } else if (el.type === 'toyBlock') {
      // Kindergarten Toy Block with Star
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(-20, -10, 40, 40, 6);
      ctx.fill();
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      drawMiniHeart(ctx, 0, 10, 9);
    } else if (el.type === 'snowTree') {
      // Snow-covered Pine Tree
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-8, 30, 16, 50);
      ctx.fillStyle = '#065f46';
      ctx.beginPath();
      ctx.moveTo(0, -35);
      ctx.lineTo(26, 0);
      ctx.lineTo(-26, 0);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(34, 30);
      ctx.lineTo(-34, 30);
      ctx.closePath();
      ctx.fill();
      // White snow caps
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, -35);
      ctx.lineTo(12, -20);
      ctx.lineTo(-12, -20);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(16, 6);
      ctx.lineTo(-16, 6);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
}

export function drawPlatforms(
  ctx: CanvasRenderingContext2D,
  platforms: Platform[],
  camX: number
) {
  for (const p of platforms) {
    const rx = p.x - camX;
    if (rx + p.w < -50 || rx > 600) continue;

    ctx.save();

    if (p.type === 'spring') {
      const cx = rx + p.w / 2;
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - 14, p.y + p.h);
      ctx.lineTo(cx + 14, p.y + p.h - 6);
      ctx.lineTo(cx - 14, p.y + p.h - 12);
      ctx.lineTo(cx + 14, p.y + 4);
      ctx.stroke();

      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.ellipse(cx, p.y + 4, p.w / 2, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⭐', cx, p.y + 4);

    } else if (p.type === 'moving') {
      const grad = ctx.createLinearGradient(rx, p.y, rx, p.y + p.h);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(1, '#0284c7');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(rx, p.y, p.w, p.h, 10);
      ctx.fill();

      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.roundRect(rx + 4, p.y + 2, p.w - 8, 4, 3);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('◄  ►', rx + p.w / 2, p.y + p.h / 2);

    } else if (p.type === 'stone') {
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.roundRect(rx, p.y, p.w, p.h, [8, 8, 0, 0]);
      ctx.fill();

      ctx.fillStyle = '#64748b';
      ctx.fillRect(rx, p.y, p.w, 6);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      for (let bx = rx + 16; bx < rx + p.w; bx += 32) {
        ctx.beginPath();
        ctx.moveTo(bx, p.y + 6);
        ctx.lineTo(bx, p.y + Math.min(p.h, 30));
        ctx.stroke();
      }

    } else if (p.type === 'rooftop') {
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(rx, p.y, p.w, p.h, [6, 6, 0, 0]);
      ctx.fill();

      ctx.fillStyle = '#f97316';
      ctx.fillRect(rx, p.y, p.w, 5);

    } else if (p.type === 'candy') {
      // Frosted Pink & Cream Candy Platform
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.roundRect(rx, p.y, p.w, p.h, 10);
      ctx.fill();
      // White vanilla frosting dripping
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(rx, p.y, p.w, 8, [10, 10, 0, 0]);
      ctx.fill();
      // Rainbow sprinkles
      const sprinkles = ['#f43f5e', '#38bdf8', '#facc15', '#4ade80'];
      for (let sx = rx + 8; sx < rx + p.w - 8; sx += 18) {
        ctx.fillStyle = sprinkles[Math.floor(sx) % sprinkles.length];
        ctx.fillRect(sx, p.y + 2, 5, 3);
      }

    } else if (p.type === 'crystal') {
      // Translucent Gem Amethyst/Cyan Crystal Platform
      const cGrad = ctx.createLinearGradient(rx, p.y, rx, p.y + p.h);
      cGrad.addColorStop(0, '#38bdf8');
      cGrad.addColorStop(0.5, '#818cf8');
      cGrad.addColorStop(1, '#4c1d95');
      ctx.fillStyle = cGrad;
      ctx.beginPath();
      ctx.roundRect(rx, p.y, p.w, p.h, 8);
      ctx.fill();
      ctx.strokeStyle = '#e0e7ff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

    } else if (p.type === 'cloud') {
      // Puffy White Cloud Platform
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(rx, p.y, p.w, p.h, 14);
      ctx.fill();
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.roundRect(rx + 4, p.y + p.h - 6, p.w - 8, 4, 2);
      ctx.fill();

    } else if (p.type === 'toy') {
      // Vibrant Lego-style Toy Block with Pegs
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.roundRect(rx, p.y, p.w, p.h, 6);
      ctx.fill();
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(rx + 2, p.y + p.h - 5, p.w - 4, 3);
      // Stud pegs on top
      ctx.fillStyle = '#fde047';
      for (let px = rx + 8; px < rx + p.w - 8; px += 20) {
        ctx.fillRect(px, p.y - 3, 10, 3);
      }

    } else if (p.type === 'ice') {
      // Shimmering Glacial Ice Platform
      const iGrad = ctx.createLinearGradient(rx, p.y, rx, p.y + p.h);
      iGrad.addColorStop(0, '#e0f2fe');
      iGrad.addColorStop(0.6, '#7dd3fc');
      iGrad.addColorStop(1, '#0284c7');
      ctx.fillStyle = iGrad;
      ctx.beginPath();
      ctx.roundRect(rx, p.y, p.w, p.h, 8);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Icicle teeth
      ctx.fillStyle = '#bae6fd';
      for (let ix = rx + 6; ix < rx + p.w - 6; ix += 16) {
        ctx.beginPath();
        ctx.moveTo(ix, p.y + p.h);
        ctx.lineTo(ix + 3, p.y + p.h + 5);
        ctx.lineTo(ix + 6, p.y + p.h);
        ctx.fill();
      }

    } else if (p.type === 'web') {
      // Silken Web Trampoline
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(rx, p.y + p.h / 2);
      ctx.quadraticCurveTo(rx + p.w / 2, p.y + p.h / 2 + 8, rx + p.w, p.y + p.h / 2);
      ctx.stroke();

    } else if (p.type === 'wood') {
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(rx, p.y, p.w, p.h, 8);
      ctx.fill();

      ctx.fillStyle = '#d97706';
      ctx.fillRect(rx + 4, p.y + 2, p.w - 8, 4);

    } else {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(rx, p.y + 12, p.w, p.h - 12);

      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.roundRect(rx, p.y, p.w, 16, [10, 10, 0, 0]);
      ctx.fill();

      ctx.fillStyle = '#4ade80';
      for (let gx = rx + 6; gx < rx + p.w - 6; gx += 14) {
        ctx.beginPath();
        ctx.moveTo(gx, p.y);
        ctx.lineTo(gx + 3, p.y - 5);
        ctx.lineTo(gx + 6, p.y);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}

/**
 * Draws Cogumelos (Mushroom Enemies)
 */
export function drawEnemies(
  ctx: CanvasRenderingContext2D,
  enemies: Enemy[],
  camX: number,
  time: number
) {
  for (const en of enemies) {
    if (!en.alive && (!en.squishTimer || en.squishTimer <= 0)) continue;

    const ex = en.x - camX;
    if (ex < -40 || ex > 600) continue;

    ctx.save();
    ctx.translate(ex + en.w / 2, en.y + en.h);

    if (en.squishTimer && en.squishTimer > 0) {
      // Squished state
      ctx.scale(1.4, 0.25);
    } else {
      // Step wobble
      const waddle = Math.sin(time * 10 + en.id) * 0.08;
      ctx.rotate(waddle);
    }

    // Stem (Stalk)
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.roundRect(-10, -18, 20, 18, [0, 0, 6, 6]);
    ctx.fill();

    // Little feet
    ctx.fillStyle = '#78350f';
    const footOffset = Math.sin(time * 12 + en.id) * 3;
    ctx.beginPath();
    ctx.arc(-8 + footOffset, -2, 4, 0, Math.PI * 2);
    ctx.arc(8 - footOffset, -2, 4, 0, Math.PI * 2);
    ctx.fill();

    // Mushroom Red Cap with white spots
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -18, 17, Math.PI, 0);
    ctx.lineTo(17, -15);
    ctx.lineTo(-17, -15);
    ctx.closePath();
    ctx.fill();

    // White polka dots
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-7, -24, 3.5, 0, Math.PI * 2);
    ctx.arc(7, -24, 3.5, 0, Math.PI * 2);
    ctx.arc(0, -29, 3, 0, Math.PI * 2);
    ctx.fill();

    // Angry/Mischievous Eyes
    if (!en.squishTimer) {
      const eyeDir = en.vx > 0 ? 1 : -1;
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(-4 + eyeDir, -10, 2.5, 0, Math.PI * 2);
      ctx.arc(4 + eyeDir, -10, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Eyebrows
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-6, -14);
      ctx.lineTo(-2, -12);
      ctx.moveTo(6, -14);
      ctx.lineTo(2, -12);
      ctx.stroke();
    }

    ctx.restore();
  }
}

/**
 * Draws Rewards (Baú do Amor, Estrela, Escudo)
 */
export function drawRewards(
  ctx: CanvasRenderingContext2D,
  rewards: RewardItem[],
  camX: number,
  time: number
) {
  for (const rw of rewards) {
    if (rw.collected && rw.type !== 'chest') continue;
    const rx = rw.x - camX;
    if (rx < -40 || rx > 600) continue;

    ctx.save();
    ctx.translate(rx + rw.w / 2, rw.y + rw.h / 2);

    if (rw.type === 'star') {
      // Golden Star of Invincibility
      const floatY = Math.sin(time * 5 + rw.id) * 5;
      ctx.translate(0, floatY);
      ctx.rotate(time * 2);

      // Rainbow halo
      ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();

      // 5-point Star
      drawStar(ctx, 0, 0, 5, 16, 7, '#facc15');

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-3, -3, 2, 0, Math.PI * 2);
      ctx.fill();

    } else if (rw.type === 'shield') {
      // Golden / Cyan Shield of Love
      const floatY = Math.sin(time * 4 + rw.id) * 4;
      ctx.translate(0, floatY);

      // Glowing aura
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();

      // Shield body
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(13, -8);
      ctx.lineTo(11, 6);
      ctx.lineTo(0, 15);
      ctx.lineTo(-11, 6);
      ctx.lineTo(-13, -8);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner Heart
      ctx.fillStyle = '#f43f5e';
      drawMiniHeart(ctx, 0, 0, 8);

    } else if (rw.type === 'chest') {
      // Baú do Amor (Treasure Chest)
      if (rw.opened) {
        // Opened chest
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-14, 0, 28, 14);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-16, -6, 32, 6);
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Unopened shining chest
        const bounce = Math.sin(time * 3 + rw.id) * 3;
        ctx.translate(0, bounce);

        // Glow
        ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();

        // Chest base
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-15, -4, 30, 18);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(-13, -2, 26, 14);

        // Gold bands
        ctx.fillStyle = '#facc15';
        ctx.fillRect(-15, -4, 4, 18);
        ctx.fillRect(11, -4, 4, 18);

        // Chest lid
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(0, -4, 15, Math.PI, 0);
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Red Heart Lock in the center
        ctx.fillStyle = '#ef4444';
        drawMiniHeart(ctx, 0, 2, 7);
      }
    } else if (rw.type === 'armor') {
      // Armadura Dourada do Herói (Armor Collectible)
      const floatY = Math.sin(time * 3.5 + rw.id) * 5;
      ctx.translate(0, floatY);

      // Golden radiance aura
      ctx.fillStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();

      // Golden Breastplate (Peitoral Dourado)
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(-14, -14, 28, 26, [8, 8, 4, 4]);
      ctx.fill();

      // Shiny highlight
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.roundRect(-11, -12, 22, 12, [5, 5, 2, 2]);
      ctx.fill();

      // Shoulder Pauldrons (Ombreiras)
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(-15, -10, 6, 0, Math.PI * 2);
      ctx.arc(15, -10, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(-15, -10, 3, 0, Math.PI * 2);
      ctx.arc(15, -10, 3, 0, Math.PI * 2);
      ctx.fill();

      // Heart emblem in the center of armor
      ctx.fillStyle = '#ef4444';
      drawMiniHeart(ctx, 0, -2, 9);

      // Floating "ARMADURA" tiny label
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 9px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ARMADURA', 0, 20);

    } else if (rw.type === 'moto') {
      // Super Moto Heroica do Theo Lucca (Collectible)
      const floatY = Math.sin(time * 3.5 + rw.id) * 4;
      ctx.translate(0, floatY);

      // Energetic golden / orange halo
      ctx.fillStyle = 'rgba(249, 115, 22, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.fill();

      // Draw parked motorcycle awaiting Theo!
      drawMotorcycle(ctx, 0, 0, 'right', 0, time, false);

      // Floating "MOTO 🏍️" label
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 10px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText('SUPER MOTO 🏍️', 0, -22);
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }
}

/**
 * Draws the high-performance Super Moto do Amor
 * Can be drawn standalone (collectible) or mounted with Theo in biker posture!
 */
export function drawMotorcycle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  facing: 'right' | 'left',
  vx: number,
  time: number,
  isMounted: boolean = false
) {
  ctx.save();
  ctx.translate(x, y);

  const dir = facing === 'right' ? 1 : -1;
  ctx.scale(dir, 1);

  const wheelSpin = (time * (Math.abs(vx) > 0.5 ? Math.abs(vx) * 9 : 4)) % (Math.PI * 2);

  // 1. Dual Exhaust flame & turbo sparks at rear
  if (isMounted) {
    const isMoving = Math.abs(vx) > 0.5;
    const flameFlicker = Math.sin(time * 32) * 4;
    const flameLength = isMoving ? 16 + Math.abs(vx) * 2.5 : 6;

    // Outer flame
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-32, 11);
    ctx.lineTo(-32 - flameLength - flameFlicker, 14);
    ctx.lineTo(-32, 17);
    ctx.closePath();
    ctx.fill();

    // Inner bright core flame
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(-32, 12);
    ctx.lineTo(-32 - flameLength * 0.6, 14);
    ctx.lineTo(-32, 16);
    ctx.closePath();
    ctx.fill();
  }

  // 2. Rear Wheel
  ctx.save();
  ctx.translate(-24, 16);
  ctx.rotate(wheelSpin);
  // Black tire
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(0, 0, 13, 0, Math.PI * 2);
  ctx.fill();
  // Tire treads
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI * 2);
  ctx.stroke();
  // Silver alloy rim
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fill();
  // Spokes
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.4;
  for (let s = 0; s < 4; s++) {
    ctx.beginPath();
    ctx.moveTo(-7, 0);
    ctx.lineTo(7, 0);
    ctx.stroke();
    ctx.rotate(Math.PI / 4);
  }
  // Hub
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Front Wheel
  ctx.save();
  ctx.translate(26, 16);
  ctx.rotate(wheelSpin);
  // Black tire
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(0, 0, 13, 0, Math.PI * 2);
  ctx.fill();
  // Tire treads
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI * 2);
  ctx.stroke();
  // Silver alloy rim
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fill();
  // Spokes
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.4;
  for (let s = 0; s < 4; s++) {
    ctx.beginPath();
    ctx.moveTo(-7, 0);
    ctx.lineTo(7, 0);
    ctx.stroke();
    ctx.rotate(Math.PI / 4);
  }
  // Hub
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4. Chrome Engine Block & Exhaust
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.roundRect(-12, 6, 20, 13, 3);
  ctx.fill();
  // Cooling fins
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-10, 8, 16, 2);
  ctx.fillRect(-10, 12, 16, 2);
  ctx.fillRect(-10, 15, 16, 2);

  // Chrome exhaust pipe stretching from engine to rear
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-6, 15);
  ctx.lineTo(-22, 14);
  ctx.lineTo(-32, 14);
  ctx.stroke();
  // Muffler tip
  ctx.fillStyle = '#334155';
  ctx.fillRect(-33, 12, 3, 4);

  // 5. Rear Swingarm & Front Forks
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-6, 9);
  ctx.lineTo(-24, 16);
  ctx.stroke();

  // Front telescopic forks
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(16, -4);
  ctx.lineTo(26, 16);
  ctx.stroke();

  // 6. Motorcycle Body / Fairing (Crimson Red & Golden Racing Stripes)
  ctx.fillStyle = '#dc2626'; // Sporty Racing Red
  ctx.beginPath();
  ctx.moveTo(-20, 5);
  ctx.lineTo(-5, -2); // seat slope
  ctx.lineTo(10, -5); // tank rise
  ctx.lineTo(22, -4); // cowl / headlight
  ctx.lineTo(24, 4);
  ctx.lineTo(14, 10);
  ctx.lineTo(-10, 8);
  ctx.closePath();
  ctx.fill();

  // Golden Speed Stripe
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(-16, 3);
  ctx.lineTo(8, -2);
  ctx.lineTo(20, -1);
  ctx.lineTo(18, 2);
  ctx.lineTo(6, 1);
  ctx.lineTo(-14, 6);
  ctx.closePath();
  ctx.fill();

  // Leather Racer Seat
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(-14, -3, 13, 5, 2);
  ctx.fill();

  // Aerodynamic Windshield
  ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
  ctx.beginPath();
  ctx.moveTo(16, -5);
  ctx.lineTo(23, -13);
  ctx.lineTo(26, -6);
  ctx.closePath();
  ctx.fill();

  // Handlebars
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(14, -6);
  ctx.lineTo(18, -11);
  ctx.lineTo(13, -13);
  ctx.stroke();
  // Handlebar rubber grip
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(13, -13, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Mini Heart Emblem on Gas Tank 💖
  ctx.fillStyle = '#ef4444';
  drawMiniHeart(ctx, 4, -1, 5);

  // 7. Bright Glowing Headlight
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(24, 0, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Headlight beam casting light forward onto the course
  const beamGrad = ctx.createLinearGradient(26, 0, 100, 0);
  beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
  beamGrad.addColorStop(0.6, 'rgba(254, 240, 138, 0.15)');
  beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
  ctx.fillStyle = beamGrad;
  ctx.beginPath();
  ctx.moveTo(25, -2);
  ctx.lineTo(100, -15);
  ctx.lineTo(100, 18);
  ctx.lineTo(25, 4);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

/**
 * Draws the Fruits along the way:
 * 1. Apple (Maçã 🍎 - cresce um pouco)
 * 2. Banana (Banana 🍌 - cresce mais um pouco)
 * 3. Watermelon slice (Fatia de Melancia 🍉 - chega ao tamanho máximo)
 */
export function drawFruits(
  ctx: CanvasRenderingContext2D,
  fruits: FruitItem[],
  camX: number,
  time: number
) {
  for (const f of fruits) {
    if (f.collected) continue;
    const fx = f.x - camX;
    if (fx < -40 || fx > 600) continue;

    ctx.save();
    const floatY = Math.sin(time * 4 + f.id) * 5;
    ctx.translate(fx + f.w / 2, f.y + f.h / 2 + floatY);

    // Subtle gentle pulse
    const pulse = 1.0 + Math.sin(time * 5 + f.id) * 0.06;
    ctx.scale(pulse, pulse);

    if (f.type === 'apple') {
      // 🍎 MAÇÃ
      // Red aura
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();

      // Apple body (Red)
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(-5, 0, 10, 0, Math.PI * 2);
      ctx.arc(5, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      // Apple shine
      ctx.fillStyle = '#f87171';
      ctx.beginPath();
      ctx.arc(-6, -4, 3, 0, Math.PI * 2);
      ctx.fill();

      // Stem (Brown)
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.quadraticCurveTo(2, -14, 4, -15);
      ctx.stroke();

      // Leaf (Green)
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(5, -12, 5, 2.5, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 9px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MAÇÃ', 0, 18);

    } else if (f.type === 'banana') {
      // 🍌 BANANA
      // Yellow aura
      ctx.fillStyle = 'rgba(234, 179, 8, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();

      // Banana crescent curve
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 0, 13, -Math.PI * 0.75, Math.PI * 0.15);
      ctx.stroke();

      // Inner lighter yellow stripe
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 13, -Math.PI * 0.65, Math.PI * 0.05);
      ctx.stroke();

      // Banana tips
      ctx.fillStyle = '#854d0e';
      ctx.beginPath();
      ctx.arc(-9, -9, 2.5, 0, Math.PI * 2);
      ctx.arc(13, 4, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 9px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BANANA', 0, 18);

    } else if (f.type === 'watermelon') {
      // 🍉 FATIA DE MELANCIA
      // Emerald / red aura
      ctx.fillStyle = 'rgba(225, 29, 72, 0.28)';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();

      // Outer Green Rind
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(0, -4, 15, 0, Math.PI);
      ctx.closePath();
      ctx.fill();

      // White inner rind
      ctx.fillStyle = '#ecfdf5';
      ctx.beginPath();
      ctx.arc(0, -4, 13, 0, Math.PI);
      ctx.closePath();
      ctx.fill();

      // Red Juicy Pulp
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.arc(0, -4, 11, 0, Math.PI);
      ctx.closePath();
      ctx.fill();

      // Seeds
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-5, 0, 1.2, 0, Math.PI * 2);
      ctx.arc(0, 3, 1.2, 0, Math.PI * 2);
      ctx.arc(5, 0, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Label: MELANCIA MÁX
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 9px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MELANCIA', 0, 18);
    }

    ctx.restore();
  }
}

export function drawHearts(
  ctx: CanvasRenderingContext2D,
  hearts: HeartItem[],
  camX: number,
  time: number
) {
  for (const h of hearts) {
    if (h.collected) continue;
    const hx = h.x - camX;
    if (hx < -40 || hx > 600) continue;

    const floatY = h.y + Math.sin(time * 4 + h.id) * 6;
    ctx.save();
    ctx.translate(hx, floatY);

    const pulse = 1.0 + Math.sin(time * 5 + h.id) * 0.08;
    ctx.scale(pulse, pulse);

    ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f43f5e';
    drawMiniHeart(ctx, 0, 0, 14);

    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.arc(-4, -4, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

export function drawHazards(
  ctx: CanvasRenderingContext2D,
  hazards: Hazard[],
  camX: number,
  time: number
) {
  for (const hz of hazards) {
    const rx = hz.x - camX;
    if (rx < -120 || rx > 700) continue;

    ctx.save();
    ctx.translate(rx + hz.w / 2, hz.y + hz.h / 2);

    if (hz.type === 'lowBeam') {
      // Overhead Stone & Iron Beam: Theo must duck / crouch under!
      ctx.fillStyle = '#334155';
      ctx.fillRect(-hz.w / 2, -hz.h / 2, hz.w, hz.h);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(-hz.w / 2, -hz.h / 2, hz.w, hz.h);

      // Warning hazard stripes (Yellow / Black)
      ctx.save();
      ctx.beginPath();
      ctx.rect(-hz.w / 2 + 2, -hz.h / 2 + 2, hz.w - 4, hz.h - 4);
      ctx.clip();
      ctx.fillStyle = '#eab308';
      for (let sx = -hz.w / 2 - 20; sx < hz.w / 2 + 20; sx += 18) {
        ctx.beginPath();
        ctx.moveTo(sx, -hz.h / 2);
        ctx.lineTo(sx + 10, -hz.h / 2);
        ctx.lineTo(sx - 2, hz.h / 2);
        ctx.lineTo(sx - 12, hz.h / 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Sharp iron spikes underneath the beam
      ctx.fillStyle = '#94a3b8';
      const spikeCount = Math.max(2, Math.floor(hz.w / 16));
      const spikeSpacing = hz.w / spikeCount;
      for (let i = 0; i < spikeCount; i++) {
        const spx = -hz.w / 2 + i * spikeSpacing + spikeSpacing / 2;
        ctx.beginPath();
        ctx.moveTo(spx - 5, hz.h / 2);
        ctx.lineTo(spx, hz.h / 2 + 7);
        ctx.lineTo(spx + 5, hz.h / 2);
        ctx.closePath();
        ctx.fill();
      }

      // Overhead prompt banner: "⬇️ ABAIXE-SE"
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 10px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 4;
      ctx.fillText('⬇️ ABAIXE-SE', 0, -2);
      ctx.shadowBlur = 0;

    } else if (hz.type === 'spikeCeiling') {
      // Iron ceiling spikes hanging down: must crouch
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-hz.w / 2, -hz.h / 2, hz.w, 6);

      ctx.fillStyle = '#e2e8f0';
      const spikeCount = Math.max(2, Math.floor(hz.w / 14));
      const spikeSpacing = hz.w / spikeCount;
      for (let i = 0; i < spikeCount; i++) {
        const spx = -hz.w / 2 + i * spikeSpacing + spikeSpacing / 2;
        ctx.beginPath();
        ctx.moveTo(spx - 6, -hz.h / 2 + 6);
        ctx.lineTo(spx, hz.h / 2);
        ctx.lineTo(spx + 6, -hz.h / 2 + 6);
        ctx.closePath();
        ctx.fill();
      }

      // Overhead text
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 9px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 4;
      ctx.fillText('⬇️ ABAIXE-SE', 0, -hz.h / 2 - 8);
      ctx.shadowBlur = 0;

    } else if (hz.type === 'pendulum') {
      // Swinging battle axe / pendulum in dungeon
      const swingAngle = Math.sin(time * 3 + hz.x) * 0.55;
      ctx.rotate(swingAngle);

      // Iron chain/rod
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -hz.h / 2);
      ctx.lineTo(0, hz.h / 2 - 12);
      ctx.stroke();

      // Axe blade / spiked ball
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, hz.h / 2 - 12, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Metal spikes
      ctx.fillStyle = '#ffffff';
      for (let a = 0; a < 6; a++) {
        const ang = (a * Math.PI) / 3;
        ctx.beginPath();
        ctx.arc(Math.cos(ang) * 13, hz.h / 2 - 12 + Math.sin(ang) * 13, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (hz.type === 'cone') {
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(0, -hz.h / 2);
      ctx.lineTo(hz.w / 2, hz.h / 2);
      ctx.lineTo(-hz.w / 2, hz.h / 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-6, -1, 12, 4);
    } else if (hz.type === 'slime') {
      const squish = 1 + Math.sin(time * 6) * 0.15;
      ctx.scale(squish, 1 / squish);
      ctx.fillStyle = '#84cc16';
      ctx.beginPath();
      ctx.ellipse(0, 0, hz.w / 2, hz.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(4, -3, 3, 0, Math.PI * 2);
      ctx.arc(-4, -3, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(4, -3, 1.5, 0, Math.PI * 2);
      ctx.arc(-4, -3, 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (hz.type === 'spark') {
      const flicker = 1 + Math.sin(time * 12) * 0.2;
      ctx.scale(flicker, flicker);
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(0, 0, hz.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e9d5ff';
      ctx.beginPath();
      ctx.arc(0, 0, hz.w / 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#713f12';
      ctx.beginPath();
      ctx.ellipse(0, 2, hz.w / 2, hz.h / 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

/**
 * Draws the Goal at the end of each stage:
 * In Stage 1 & 2: Archway portal/gate
 * In Stage 3: The Teddy Bear "Amor" on a velvet royal pedestal!
 */
export function drawGoal(
  ctx: CanvasRenderingContext2D,
  level: LevelData,
  camX: number,
  time: number,
  hideAmorOnPedestal: boolean = false
) {
  const g = level.goal;
  const gx = g.x - camX;
  if (gx < -250 || gx > 1400) return;

  ctx.save();

  if (level.id === 11) {
    // Pequena casinha na cidade + Papai e Mamãe esperando felizes!
    const houseX = gx + 35;
    const houseY = g.y + g.h - 125;
    const houseW = 135;
    const houseH = 125;

    // Chaminé com fumacinha de coração
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(houseX + 95, houseY - 22, 20, 32);
    const puffY = houseY - 32 - ((time * 18) % 25);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.arc(houseX + 105, puffY, 7, 0, Math.PI * 2);
    ctx.arc(houseX + 112, puffY - 8, 5, 0, Math.PI * 2);
    ctx.fill();

    // Paredes da casinha
    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.fillRect(houseX, houseY + 35, houseW, houseH - 35);
    ctx.strokeRect(houseX, houseY + 35, houseW, houseH - 35);

    // Telhado vermelho aconchegante
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.moveTo(houseX - 12, houseY + 38);
    ctx.lineTo(houseX + houseW / 2, houseY - 10);
    ctx.lineTo(houseX + houseW + 12, houseY + 38);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#9f1239';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Porta de madeira
    ctx.fillStyle = '#92400e';
    ctx.fillRect(houseX + 52, houseY + 72, 32, 53);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(houseX + 78, houseY + 98, 3, 0, Math.PI * 2);
    ctx.fill();

    // Janelas iluminadas
    ctx.fillStyle = '#fde047';
    ctx.fillRect(houseX + 16, houseY + 55, 26, 26);
    ctx.fillRect(houseX + 94, houseY + 55, 26, 26);
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 2;
    ctx.strokeRect(houseX + 16, houseY + 55, 26, 26);
    ctx.strokeRect(houseX + 94, houseY + 55, 26, 26);

    // Papai e Mamãe esperando na frente da casinha muito felizes!
    const parentsY = g.y + g.h;
    const wave = Math.sin(time * 6) * 0.35;

    // Papai (esquerda)
    const dadX = gx - 10;
    ctx.save();
    ctx.translate(dadX, parentsY);
    // Corpo
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-10, -44, 20, 26);
    // Pernas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-9, -18, 7, 18);
    ctx.fillRect(2, -18, 7, 18);
    // Cabeça
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -56, 12, 0, Math.PI * 2);
    ctx.fill();
    // Cabelo
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(0, -60, 12, Math.PI, Math.PI * 2);
    ctx.fill();
    // Sorriso
    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -55, 5, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    // Braço acenando
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-10, -40);
    ctx.lineTo(-22, -54 + Math.sin(time * 6) * 6);
    ctx.stroke();
    ctx.restore();

    // Mamãe (direita do papai)
    const momX = gx + 22;
    ctx.save();
    ctx.translate(momX, parentsY);
    // Vestido
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(-12, -16);
    ctx.lineTo(12, -16);
    ctx.lineTo(8, -44);
    ctx.lineTo(-8, -44);
    ctx.closePath();
    ctx.fill();
    // Pernas
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -16, 4, 16);
    ctx.fillRect(2, -16, 4, 16);
    // Cabelo longo
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, -56, 14, 0, Math.PI * 2);
    ctx.fill();
    // Rosto
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -55, 11, 0, Math.PI * 2);
    ctx.fill();
    // Sorriso
    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -54, 5, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    // Braço acenando
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(8, -40);
    ctx.lineTo(20, -54 - Math.sin(time * 6) * 6);
    ctx.stroke();
    ctx.restore();

    // Coração flutuando acima dos pais
    const heartY = parentsY - 82 + Math.sin(time * 4) * 4;
    drawMiniHeart(ctx, gx + 6, heartY, 10);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Papai & Mamãe ❤️', gx + 6, parentsY - 96);

    ctx.restore();
    return;
  }

  if (level.rescueTarget === 'carinho') {
    const pedX = gx + g.w / 2;
    const pedY = g.y + g.h - 10;

    // Snowflake Ice Throne Pedestal
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(pedX - 44, pedY - 14, 88, 24);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(pedX - 48, pedY - 18, 96, 6);

    // Soft sky-blue velvet cushion
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.ellipse(pedX, pedY - 22, 38, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    if (!hideAmorOnPedestal) {
      // Shimmering Snowflake Halo around Carinho
      const haloRadius = 46 + Math.sin(time * 4) * 6;
      const haloGrad = ctx.createRadialGradient(pedX, pedY - 55, 10, pedX, pedY - 55, haloRadius);
      haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
      haloGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(pedX, pedY - 55, haloRadius, 0, Math.PI * 2);
      ctx.fill();

      // Floating Ursinho Carinho (White Bear)
      const floatY = pedY - 60 + Math.sin(time * 3) * 5;
      ctx.save();
      ctx.translate(pedX, floatY);
      drawTeddyBearCarinho(ctx, 0, 0, time);
      ctx.restore();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText('🧸 Ursinho Carinho 🤍', pedX, pedY - 105 + Math.sin(time * 3) * 3);
      ctx.shadowBlur = 0;
    }

  } else if (level.theme === 'castelo') {
    const pedX = gx + g.w / 2;
    const pedY = g.y + g.h - 10;

    // Royal Altar / Pedestal
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(pedX - 44, pedY - 14, 88, 24);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(pedX - 48, pedY - 18, 96, 6);

    // Velvet cushion
    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.ellipse(pedX, pedY - 22, 38, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    if (!hideAmorOnPedestal) {
      // Magical Heart Halo around Amor
      const haloRadius = 46 + Math.sin(time * 4) * 6;
      const haloGrad = ctx.createRadialGradient(pedX, pedY - 55, 10, pedX, pedY - 55, haloRadius);
      haloGrad.addColorStop(0, 'rgba(244, 63, 94, 0.45)');
      haloGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(pedX, pedY - 55, haloRadius, 0, Math.PI * 2);
      ctx.fill();

      // Floating heart indicator above Amor
      const floatY = pedY - 60 + Math.sin(time * 3) * 5;
      ctx.save();
      ctx.translate(pedX, floatY);
      drawTeddyBearAmor(ctx, 0, 0, time);
      ctx.restore();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 15px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText('🧸 Ursinho Amor 💖', pedX, pedY - 105 + Math.sin(time * 3) * 3);
      ctx.shadowBlur = 0;
    }

  } else {
    ctx.translate(gx + g.w / 2, g.y + g.h / 2);

    ctx.fillStyle = 'rgba(250, 204, 21, 0.2)';
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-36, -45, 14, 90);
    ctx.fillRect(22, -45, 14, 90);

    ctx.beginPath();
    ctx.arc(0, -45, 36, Math.PI, 0);
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    const pulse = 1.0 + Math.sin(time * 5) * 0.12;
    ctx.save();
    ctx.scale(pulse, pulse);
    ctx.fillStyle = '#ef4444';
    drawMiniHeart(ctx, 0, -10, 18);
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 3;
    ctx.fillText(g.label, 0, 56);
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}

/**
 * Renders the adorable Teddy Bear "Amor"
 */
export function drawTeddyBearAmor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number,
  armsOpen: boolean = false
) {
  ctx.save();
  ctx.translate(x, y);

  const breath = 1.0 + Math.sin(time * 3.5) * 0.04;
  ctx.scale(breath, breath);

  const furDark = '#78350f';
  const furBrown = '#92400e';
  const furMuzzle = '#fed7aa';

  // Ears
  ctx.fillStyle = furBrown;
  ctx.beginPath();
  ctx.arc(-18, -26, 9, 0, Math.PI * 2);
  ctx.arc(18, -26, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fbcfe8';
  ctx.beginPath();
  ctx.arc(-18, -26, 5, 0, Math.PI * 2);
  ctx.arc(18, -26, 5, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = furBrown;
  ctx.beginPath();
  ctx.arc(0, -14, 22, 0, Math.PI * 2);
  ctx.fill();

  // Muzzle
  ctx.fillStyle = furMuzzle;
  ctx.beginPath();
  ctx.ellipse(0, -10, 11, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.ellipse(0, -12, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  ctx.strokeStyle = '#1c1917';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.lineTo(0, -7);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-3, -7, 3, 0, Math.PI);
  ctx.arc(3, -7, 3, 0, Math.PI);
  ctx.stroke();

  // Eyes
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.arc(-7, -17, 3.5, 0, Math.PI * 2);
  ctx.arc(7, -17, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-8, -18, 1.4, 0, Math.PI * 2);
  ctx.arc(6, -18, 1.4, 0, Math.PI * 2);
  ctx.fill();

  // Blushing cheeks
  ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
  ctx.beginPath();
  ctx.arc(-13, -11, 4, 0, Math.PI * 2);
  ctx.arc(13, -11, 4, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = furDark;
  ctx.beginPath();
  ctx.ellipse(0, 12, 17, 19, 0, 0, Math.PI * 2);
  ctx.fill();

  // Paws
  ctx.fillStyle = furBrown;
  ctx.beginPath();
  ctx.arc(-14, 25, 7, 0, Math.PI * 2);
  ctx.arc(14, 25, 7, 0, Math.PI * 2);
  ctx.fill();

  if (armsOpen) {
    // Joyful open arms running into hug!
    ctx.fillStyle = furBrown;
    ctx.beginPath();
    ctx.ellipse(-20, 6, 8, 5, -0.4, 0, Math.PI * 2);
    ctx.ellipse(20, 6, 8, 5, 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ef4444';
    drawMiniHeart(ctx, 0, 11, 12);
  } else {
    // Hands holding the big red heart
    ctx.fillStyle = '#ef4444';
    drawMiniHeart(ctx, 0, 11, 14);

    ctx.fillStyle = furBrown;
    ctx.beginPath();
    ctx.arc(-11, 10, 5, 0, Math.PI * 2);
    ctx.arc(11, 10, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Renders the adorable White Teddy Bear "Carinho" (amigo de Amor)
 */
export function drawTeddyBearCarinho(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number,
  armsOpen: boolean = false
) {
  ctx.save();
  ctx.translate(x, y);

  const breath = 1.0 + Math.sin(time * 3.5) * 0.04;
  ctx.scale(breath, breath);

  // Soft pure white and pearl fur
  const furWhite = '#f8fafc';
  const furShade = '#cbd5e1';
  const furInner = '#ffffff';

  // Ears
  ctx.fillStyle = furWhite;
  ctx.beginPath();
  ctx.arc(-18, -26, 9, 0, Math.PI * 2);
  ctx.arc(18, -26, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fbcfe8'; // soft pastel pink
  ctx.beginPath();
  ctx.arc(-18, -26, 5, 0, Math.PI * 2);
  ctx.arc(18, -26, 5, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = furWhite;
  ctx.beginPath();
  ctx.arc(0, -14, 22, 0, Math.PI * 2);
  ctx.fill();

  // Muzzle
  ctx.fillStyle = furInner;
  ctx.beginPath();
  ctx.ellipse(0, -10, 11, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nose: cute soft chocolate button
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.ellipse(0, -12, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.lineTo(0, -7);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-3, -7, 3, 0, Math.PI);
  ctx.arc(3, -7, 3, 0, Math.PI);
  ctx.stroke();

  // Sparkling Blue Eyes with gleam
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(-7, -17, 3.5, 0, Math.PI * 2);
  ctx.arc(7, -17, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-8, -18, 1.4, 0, Math.PI * 2);
  ctx.arc(6, -18, 1.4, 0, Math.PI * 2);
  ctx.fill();

  // Rosy cheeks
  ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
  ctx.beginPath();
  ctx.arc(-13, -11, 4, 0, Math.PI * 2);
  ctx.arc(13, -11, 4, 0, Math.PI * 2);
  ctx.fill();

  // Cute sky-blue bowtie
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(0, -3);
  ctx.lineTo(-7, -8);
  ctx.lineTo(-7, 2);
  ctx.closePath();
  ctx.moveTo(0, -3);
  ctx.lineTo(7, -8);
  ctx.lineTo(7, 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(0, -3, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = furShade;
  ctx.beginPath();
  ctx.ellipse(0, 12, 17, 19, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = furWhite;
  ctx.beginPath();
  ctx.ellipse(0, 12, 14, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Paws
  ctx.fillStyle = furWhite;
  ctx.beginPath();
  ctx.arc(-14, 25, 7, 0, Math.PI * 2);
  ctx.arc(14, 25, 7, 0, Math.PI * 2);
  ctx.fill();

  if (armsOpen) {
    // Open arms running for hug
    ctx.fillStyle = furWhite;
    ctx.beginPath();
    ctx.ellipse(-20, 6, 8, 5, -0.4, 0, Math.PI * 2);
    ctx.ellipse(20, 6, 8, 5, 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    drawMiniHeart(ctx, 0, 11, 12);
  } else {
    // Holding glowing heart
    ctx.fillStyle = '#f43f5e';
    drawMiniHeart(ctx, 0, 11, 14);

    ctx.fillStyle = furWhite;
    ctx.beginPath();
    ctx.arc(-11, 10, 5, 0, Math.PI * 2);
    ctx.arc(11, 10, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draws Theo Lucca character sprite with running / jumping animations and powerups
 */
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  facing: 'right' | 'left',
  isGrounded: boolean,
  vx: number,
  vy: number,
  invincibleTimer: number,
  hasStarPower: boolean,
  hasShield: boolean,
  hasArmor: boolean,
  growthStage: number, // 0 = normal, 1 = maçã, 2 = banana, 3 = melancia máxima
  swordSlashTimer: number,
  shieldBlockActive: boolean,
  time: number,
  sprites: CharacterSprites,
  hasMoto: boolean = false,
  isRunning: boolean = false,
  isCrouching: boolean = false,
  hasBackpackBears: boolean = false
) {
  // Invincible flash: skip drawing every few frames if hurt, but if StarPower, show rainbow glow
  if (invincibleTimer > 0 && !hasStarPower && Math.floor(time * 30) % 2 === 0) {
    return;
  }

  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);

  const dir = facing === 'right' ? 1 : -1;
  const isMoving = Math.abs(vx) > 0.4;

  // Mochila com os dois ursinhos (Amor e Carinho) na Fase 11
  if (hasBackpackBears) {
    const bpX = -dir * (w * 0.34);
    const bpY = -4;
    // Mochila azul/vermelha
    ctx.fillStyle = '#2563eb';
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(bpX - 11, bpY - 14, 22, 28, 6);
    ctx.fill();
    ctx.stroke();

    // Ursinho Amor (marrom) espiando da mochila
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.arc(bpX - 4, bpY - 17, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bpX - 8, bpY - 22, 2.5, 0, Math.PI * 2);
    ctx.arc(bpX, bpY - 22, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Ursinho Carinho (branco) espiando da mochila
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(bpX + 5, bpY - 16, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bpX + 1, bpY - 21, 2.5, 0, Math.PI * 2);
    ctx.arc(bpX + 9, bpY - 21, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rainbow aura if Star Power is active
  if (hasStarPower) {
    const starHue = Math.floor((time * 360) % 360);
    ctx.fillStyle = `hsla(${starHue}, 90%, 60%, 0.4)`;
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.75, 0, Math.PI * 2);
    ctx.fill();
  }

  // Protective Bubble Shield
  if (hasShield) {
    const shieldPulse = 1 + Math.sin(time * 6) * 0.05;
    ctx.save();
    ctx.scale(shieldPulse, shieldPulse);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }

  let tilt = 0;
  let bounceY = 0;
  let scaleX = 1;
  let scaleY = 1;

  if (isCrouching) {
    // ==========================================
    // FUNÇÃO ABAIXAR (CROUCH / DUCK POSTURE)
    // ==========================================
    scaleX = 1.20;
    scaleY = 0.52; // Encolhe para passar por baixo de vigas e espinhos
    tilt = isMoving ? dir * 0.12 : 0;
    bounceY = isMoving ? Math.sin(time * 16) * 1.5 : 0;
  } else if (hasMoto) {
    // ==========================================
    // POSIÇÃO DE MOTOQUEIRO
    // ==========================================
    if (!isGrounded) {
      if (vy < -1) {
        tilt = -dir * 0.24; // Empina a moto no pulo (wheelie heróico!)
      } else {
        tilt = dir * 0.12; // Mergulho suave ao descer
      }
    } else if (isMoving) {
      tilt = dir * (isRunning ? 0.22 : 0.15); // Inclinação aerodinâmica de piloto sobre o guidão
      bounceY = Math.sin(time * 36) * 1.5; // Vibração suave do motor
    } else {
      tilt = dir * 0.08; // Posição de repouso na moto
    }
  } else if (!isGrounded) {
    if (vy < 0) {
      scaleX = 0.92;
      scaleY = 1.08;
    } else {
      scaleX = 1.04;
      scaleY = 0.96;
    }
  } else if (isMoving) {
    if (isRunning) {
      // ==========================================
      // NO SENTIDO DE CORRER (ATHLETIC SPRINT LEAN)
      // ==========================================
      tilt = dir * 0.25; // Inclinação marcante para a frente no sentido de correr
      bounceY = Math.abs(Math.sin(time * 22)) * 6.5; // Passadas rápidas e enérgicas de corrida
    } else {
      const runCycle = time * 14;
      tilt = (facing === 'right' ? 0.08 : -0.08) * Math.sin(runCycle);
      bounceY = Math.abs(Math.sin(runCycle)) * 4;
    }
  } else {
    scaleY = 1.0 + Math.sin(time * 3) * 0.02;
  }

  ctx.translate(0, -bounceY);
  ctx.rotate(tilt);

  // Efeitos visuais de corrida rápida ou deslizamento abaixado
  if (isCrouching && isMoving && isGrounded) {
    // Deslizando abaixado
    ctx.save();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.55)';
    for (let d = 0; d < 3; d++) {
      const dustX = -dir * (w * 0.4 + d * 10);
      const dustY = h * 0.42;
      ctx.beginPath();
      ctx.arc(dustX, dustY, 4 - d, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else if (!hasMoto && isRunning && isMoving) {
    // Linhas aerodinâmicas de vento no sentido de correr (Sprint Wind Streaks)
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      const lineY = -h * 0.32 + i * (h * 0.22);
      const lineLen = 22 + (i % 2) * 12;
      const animOffset = (time * 180 + i * 35) % 40;
      ctx.beginPath();
      ctx.moveTo(-dir * (w * 0.45 + animOffset), lineY);
      ctx.lineTo(-dir * (w * 0.45 + animOffset + lineLen), lineY);
      ctx.stroke();
    }
    // Poeirinha nos pés
    if (isGrounded) {
      ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
      for (let d = 0; d < 3; d++) {
        const dustX = -dir * (w * 0.35 + d * 14 + (time * 40) % 15);
        const dustY = h * 0.42;
        ctx.beginPath();
        ctx.arc(dustX, dustY, 4 - d, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // Fixed Hero size
  const growthMultiplier = 1.2;
  ctx.scale(scaleX * growthMultiplier, scaleY * growthMultiplier);

  // Red Knight Cape behind player
  if (hasArmor || hasMoto) {
    const capeFlutter = Math.sin(time * (isMoving ? 26 : 12)) * (isMoving ? 8 : 4);
    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.05);
    ctx.lineTo(-dir * (w * (hasMoto ? 0.6 : 0.45)), h * 0.35 + capeFlutter);
    ctx.lineTo(-dir * (w * (hasMoto ? 0.4 : 0.25)), h * 0.4 + capeFlutter);
    ctx.lineTo(0, h * 0.1);
    ctx.closePath();
    ctx.fill();
  }

  // Sombra no chão se estiver a pé
  if (isGrounded && !hasMoto) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, h / 2 - 2, w * 0.4, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Se estiver na moto, desenha a Super Moto sob o Theo!
  if (hasMoto) {
    drawMotorcycle(ctx, 0, h * 0.20, facing, vx, time, true);
  }

  // Desenha o sprite do Theo (ou fallback)
  const spriteCanvas = sprites?.loaded ? (facing === 'left' ? sprites.flipped : sprites.normal) : null;

  ctx.save();
  if (hasMoto) {
    // Na posição de motoqueiro, acomoda o Theo no assento
    ctx.translate(dir * 2, -h * 0.05);
  }

  if (spriteCanvas) {
    ctx.drawImage(
      spriteCanvas,
      -w / 2,
      -h / 2,
      w,
      h
    );

    // Overlay Golden Armor Breastplate and Pauldrons when armor is equipped
    if (hasArmor) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(-w * 0.26, -h * 0.04, w * 0.52, h * 0.28, 4);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-w * 0.22, -h * 0.03, w * 0.44, 3);

      ctx.fillStyle = '#ef4444';
      drawMiniHeart(ctx, 0, h * 0.06, 9);

      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(-w * 0.26, -h * 0.02, 6, 0, Math.PI * 2);
      ctx.arc(w * 0.26, -h * 0.02, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(-w * 0.26, -h * 0.02, 3, 0, Math.PI * 2);
      ctx.arc(w * 0.26, -h * 0.02, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    drawFallbackTheoLucca(ctx, w, h, facing, hasArmor);
  }

  // Acessórios de Motoqueiro quando na moto (Viseira aerodinâmica e mãos segurando guidão)
  if (hasMoto) {
    // Viseira aerodinâmica de piloto sobre a cabeça
    ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
    ctx.beginPath();
    ctx.roundRect(dir * 2 - 8, -h * 0.34, 22, 10, [4, 4, 4, 4]);
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Reflexo luminoso na viseira
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(dir * 2 - 4, -h * 0.33, 10, 2);

    // Braços e mãos esticadas segurando o guidão da moto
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.02);
    ctx.lineTo(dir * 16, h * 0.09);
    ctx.stroke();

    // Mãos segurando a manopla
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.arc(dir * 16, h * 0.09, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Pés apoiados na pedaleira traseira da moto
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(-dir * 10, h * 0.38, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  // Active Shield Block Defense (Escudo ativo)
  if (shieldBlockActive) {
    const dir = facing === 'right' ? 1 : -1;
    ctx.save();
    ctx.translate(dir * (w * 0.42), 0);

    // Shield aura
    ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    // Knight Shield Body
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(14, -10);
    ctx.lineTo(12, 8);
    ctx.lineTo(0, 18);
    ctx.lineTo(-12, 8);
    ctx.lineTo(-14, -10);
    ctx.closePath();
    ctx.fill();

    // Golden rim
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Heart Emblem
    ctx.fillStyle = '#ef4444';
    drawMiniHeart(ctx, 0, 0, 10);
    ctx.restore();
  }

  // Heroic Sword Slash Arc Attack (Espada do Amor)
  if (swordSlashTimer > 0) {
    const dir = facing === 'right' ? 1 : -1;
    const slashRatio = swordSlashTimer / 0.25; // 1 down to 0
    ctx.save();
    ctx.translate(dir * (w * 0.35), -h * 0.05);

    // Crescent Arc Slash wave
    ctx.strokeStyle = hasArmor ? '#fef08a' : '#f43f5e';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      36,
      dir > 0 ? -Math.PI * 0.4 : -Math.PI * 0.6,
      dir > 0 ? Math.PI * 0.4 : Math.PI * 0.6,
      dir < 0
    );
    ctx.stroke();

    // Inner bright core
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Sword Blade in Theo's hand
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.rect(dir * 8, -4, dir * 26, 7);
    ctx.fill();
    // Golden hilt
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(dir * 4, -8, dir * 5, 15);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(dir * 6, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
}

function drawFallbackTheoLucca(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  facing: 'right' | 'left',
  hasArmor: boolean = false
) {
  const isLeft = facing === 'left';
  const flip = isLeft ? -1 : 1;
  ctx.scale(flip, 1);

  ctx.fillStyle = '#292524';
  ctx.beginPath();
  ctx.arc(0, -h * 0.22, w * 0.36, 0, Math.PI * 2);
  ctx.fill();
  for (let a = -Math.PI; a <= 0; a += 0.5) {
    const hx = Math.cos(a) * w * 0.34;
    const hy = -h * 0.22 + Math.sin(a) * w * 0.34;
    ctx.beginPath();
    ctx.arc(hx, hy, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#a16207';
  ctx.beginPath();
  ctx.arc(0, -h * 0.16, w * 0.26, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-6, -h * 0.18, 5, 0, Math.PI * 2);
  ctx.arc(8, -h * 0.18, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.arc(-5, -h * 0.18, 3, 0, Math.PI * 2);
  ctx.arc(9, -h * 0.18, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(1, -h * 0.11, 6, 0, Math.PI);
  ctx.fill();

  // Clothes or Golden Armor
  if (hasArmor) {
    // Golden Armor Breastplate
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(-w * 0.24, -h * 0.04, w * 0.48, h * 0.28, 4);
    ctx.fill();

    // Heart Insignia
    ctx.fillStyle = '#ef4444';
    drawMiniHeart(ctx, 0, h * 0.08, 8);

    // Golden Greaves / Shorts
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-w * 0.24, h * 0.22, w * 0.48, h * 0.14);

    // Golden Boots
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-w * 0.24, h * 0.4, 14, 8);
    ctx.fillRect(w * 0.24 - 14, h * 0.4, 14, 8);
  } else {
    // Normal shirt: cream/beige with blue collar and dino truck
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.roundRect(-w * 0.24, -h * 0.04, w * 0.48, h * 0.28, 4);
    ctx.fill();

    // Blue collar & pocket
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-w * 0.14, -h * 0.04, w * 0.28, 3);
    ctx.fillRect(-w * 0.12, h * 0.05, w * 0.24, h * 0.12);

    // Shorts: blue
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(-w * 0.24, h * 0.22, w * 0.48, h * 0.14);

    // Sneakers
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(-w * 0.24, h * 0.4, 14, 8);
    ctx.fillRect(w * 0.24 - 14, h * 0.4, 14, 8);
  }
}

/**
 * Draws the LIVE In-Game Cutscene when Theo Lucca reaches Amor!
 * They run towards each other, hug, and love hearts fill the screen!
 */
export function drawReunionCutscene(
  ctx: CanvasRenderingContext2D,
  camX: number,
  theoX: number,
  theoY: number,
  amorX: number,
  amorY: number,
  cutsceneProgress: number, // 0 to 1
  time: number,
  sprites: CharacterSprites,
  rescueTarget?: 'amor' | 'carinho'
) {
  const tx = theoX - camX;
  const ax = amorX - camX;

  // Draw Theo Lucca
  ctx.save();
  drawPlayer(
    ctx,
    tx,
    theoY,
    62,
    89,
    'right',
    true,
    cutsceneProgress < 0.4 ? 2 : 0,
    0,
    0,
    false,
    false,
    false, // hasArmor
    0,     // growthStage
    0,     // swordSlashTimer
    false, // shieldBlockActive
    time,
    sprites
  );
  ctx.restore();

  // Draw Teddy Bear (Amor or Carinho) hopping/running to Theo
  ctx.save();
  const hop = cutsceneProgress < 0.4 ? Math.abs(Math.sin(time * 12)) * 12 : 0;
  if (rescueTarget === 'carinho') {
    drawTeddyBearCarinho(ctx, ax, amorY - hop, time, cutsceneProgress >= 0.4);
  } else {
    drawTeddyBearAmor(ctx, ax, amorY - hop, time, cutsceneProgress >= 0.4);
  }
  ctx.restore();

  // When they meet (progress > 0.4), draw giant heart embrace & speech balloon!
  if (cutsceneProgress >= 0.4) {
    const midX = (tx + ax) / 2;
    const midY = (theoY + amorY) / 2 - 40;

    // Beating love hearts around them
    const pulse = 1.0 + Math.sin(time * 8) * 0.25;
    ctx.save();
    ctx.translate(midX, midY - 20);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = rescueTarget === 'carinho' ? '#38bdf8' : '#ef4444';
    drawMiniHeart(ctx, 0, 0, 24);
    ctx.restore();

    // Floating love sparkles
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 + time * 3;
      const r = 40 + Math.sin(time * 5 + i) * 15;
      const hx = midX + Math.cos(a) * r;
      const hy = midY - 10 + Math.sin(a) * r;
      ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#facc15';
      drawMiniHeart(ctx, hx, hy, 10);
    }

    // Dialogue Bubble
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(midX - 105, midY - 70, 210, 36, 12);
    ctx.fill();
    ctx.strokeStyle = rescueTarget === 'carinho' ? '#0284c7' : '#f43f5e';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Bubble pointer
    ctx.beginPath();
    ctx.moveTo(midX - 10, midY - 34);
    ctx.lineTo(midX, midY - 24);
    ctx.lineTo(midX + 10, midY - 34);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = rescueTarget === 'carinho' ? '#0369a1' : '#be123c';
    ctx.font = 'bold 13px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      rescueTarget === 'carinho'
        ? '🤍 Carinho! Eu te encontrei! 🤍'
        : '❤️ Amor! Eu te encontrei! ❤️',
      midX,
      midY - 52
    );
    ctx.restore();
  }
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  camX: number
) {
  for (const p of particles) {
    const px = p.x - camX;
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;

    if (p.isHeart) {
      drawMiniHeart(ctx, px, p.y, p.size);
    } else if (p.isStar) {
      drawStar(ctx, px, p.y, 5, p.size, p.size * 0.4, p.color);
    } else {
      ctx.beginPath();
      ctx.arc(px, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

export function drawMiniHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(0, topCurveHeight);
  ctx.bezierCurveTo(
    -size / 2, -size / 2,
    -size, size / 3,
    0, size
  );
  ctx.bezierCurveTo(
    size, size / 3,
    size / 2, -size / 2,
    0, topCurveHeight
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Draws Floating Golden Web Anchor Orbs across abysses
 */
export function drawWebAnchors(
  ctx: CanvasRenderingContext2D,
  anchors: WebAnchor[] | undefined,
  camX: number,
  time: number,
  playerX?: number,
  playerY?: number
) {
  if (!anchors || anchors.length === 0) return;

  for (const anchor of anchors) {
    const ax = anchor.x - camX;
    if (ax < -100 || ax > 900) continue;

    ctx.save();
    ctx.translate(ax, anchor.y);

    const bob = Math.sin(time * 3 + anchor.id) * 4;
    ctx.translate(0, bob);

    // Check if player is within range (~380px)
    let inRange = false;
    if (playerX !== undefined && playerY !== undefined) {
      const dist = Math.hypot(anchor.x - playerX, anchor.y - playerY);
      inRange = dist < 400;
    }

    // Outer spinning golden spider-web aura
    const glowPulse = 1.0 + Math.sin(time * 6 + anchor.id) * 0.15;
    ctx.save();
    ctx.scale(glowPulse, glowPulse);
    ctx.strokeStyle = inRange ? '#fbbf24' : 'rgba(250, 204, 21, 0.4)';
    ctx.lineWidth = inRange ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.stroke();

    // Web radial spokes inside orb
    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI) / 3 + time * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(ang) * 24, Math.sin(ang) * 24);
      ctx.stroke();
    }
    ctx.restore();

    // Central glowing crystal orb
    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 18);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, inRange ? '#facc15' : '#38bdf8');
    grad.addColorStop(1, inRange ? '#eab308' : '#0284c7');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();

    // Spider silhouette in center
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    // Tiny legs
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(side * 3, -2);
      ctx.lineTo(side * 9, -5);
      ctx.moveTo(side * 4, 0);
      ctx.lineTo(side * 10, 0);
      ctx.moveTo(side * 3, 2);
      ctx.lineTo(side * 9, 5);
      ctx.stroke();
    }

    // If player is in range, show pulsating "TEIA" indicator badge
    if (inRange) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-24, -38, 48, 18, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#be123c';
      ctx.font = 'bold 10px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🕸️ TEIA', 0, -29);
    }

    ctx.restore();
  }
}

/**
 * Draws active Web Grapple line while Theo swings or zips across an abyss
 */
export function drawWebGrapple(
  ctx: CanvasRenderingContext2D,
  playerX: number,
  playerY: number,
  anchorX: number,
  anchorY: number,
  camX: number,
  time: number
) {
  const px = playerX - camX;
  const ax = anchorX - camX;

  ctx.save();

  // Draw glowing silken web strand
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(px, playerY);

  const midX = (px + ax) / 2;
  const midY = (playerY + anchorY) / 2 + Math.sin(time * 15) * 4;
  ctx.quadraticCurveTo(midX, midY, ax, anchorY);
  ctx.stroke();

  // Golden glow outer stroke
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(px, playerY);
  ctx.quadraticCurveTo(midX, midY, ax, anchorY);
  ctx.stroke();

  // Web nodes / dew drops along the strand
  for (let i = 1; i <= 3; i++) {
    const t = i / 4;
    const nx = (1 - t) * (1 - t) * px + 2 * (1 - t) * t * midX + t * t * ax;
    const ny = (1 - t) * (1 - t) * playerY + 2 * (1 - t) * t * midY + t * t * anchorY;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(nx, ny, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
