/**
 * Extended Level specifications for Theo Lucca, o Herói do Amor
 * 5 Epic Stages calibrated for ~2 minutes of gameplay each (~11,500px to 13,500px)
 * Featuring checkpoints, upper/lower paths, moving platforms, springs,
 * crouching/crawling low-beam tunnels, Super Moto speedways, mushroom enemies,
 * and the live in-game reunion with Ursinho Amor at the Royal Throne!
 */

export interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  type?: 'ground' | 'wood' | 'moving' | 'spring' | 'stone' | 'cloud' | 'rooftop' | 'candy' | 'crystal' | 'toy' | 'ice' | 'web';
  moveRange?: number;
  moveSpeed?: number;
  direction?: 'horizontal' | 'vertical';
  startX?: number;
  startY?: number;
}

export interface WebAnchor {
  id: number;
  x: number;
  y: number;
  label?: string;
}

export interface HeartItem {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

export interface Enemy {
  id: number;
  type: 'mushroom';
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  minX: number;
  maxX: number;
  alive: boolean;
  squishTimer?: number;
}

export interface RewardItem {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'star' | 'chest' | 'shield' | 'superHeart' | 'armor' | 'moto';
  collected: boolean;
  opened?: boolean;
}

export interface FruitItem {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'apple' | 'banana' | 'watermelon';
  collected: boolean;
}

export interface Hazard {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'slime' | 'cone' | 'spark' | 'puddle' | 'lowBeam' | 'spikeCeiling' | 'pendulum';
  vx?: number;
  minX?: number;
  maxX?: number;
  isOverhead?: boolean; // Obstáculo suspenso: desvie andando agachado (ABAIXAR)!
}

export interface Checkpoint {
  x: number;
  y: number;
  reached: boolean;
}

export interface LevelData {
  id: number;
  name: string;
  subtitle: string;
  theme: 'parque' | 'cidade' | 'castelo' | 'masmorra' | 'doces' | 'cristais' | 'nuvens' | 'brinquedos' | 'neve';
  mission?: 1 | 2;
  rescueTarget?: 'amor' | 'carinho';
  hasWebPower?: boolean;
  webAnchors?: WebAnchor[];
  worldWidth: number;
  worldHeight: number;
  playerStart: { x: number; y: number };
  goal: { x: number; y: number; w: number; h: number; label: string };
  platforms: Platform[];
  hearts: HeartItem[];
  enemies: Enemy[];
  rewards: RewardItem[];
  fruits?: FruitItem[];
  hazards: Hazard[];
  checkpoints: Checkpoint[];
  sceneryElements: {
    type: 'tree' | 'bench' | 'cloud' | 'building' | 'lamppost' | 'banner' | 'pillar' | 'flower' | 'torch' | 'chain' | 'shieldDecal' | 'lollipop' | 'candyCane' | 'giantCrystal' | 'balloon' | 'toyBlock' | 'snowTree';
    x: number;
    y: number;
    scale?: number;
  }[];
}

export const LEVELS: LevelData[] = [
  // ==========================================
  // FASE 1: O PARQUE DAS BORBOLETAS (~11,500px, ~2 minutos)
  // ==========================================
  {
    id: 1,
    name: 'Fase 1: O Parque das Borboletas',
    subtitle: 'Corra pelas copas das árvores, pegue a Super Moto e derrote os cogumelos!',
    theme: 'parque',
    worldWidth: 11500,
    worldHeight: 700,
    playerStart: { x: 80, y: 440 },
    goal: { x: 11300, y: 430, w: 90, h: 120, label: 'Portal das Borboletas' },
    checkpoints: [
      { x: 80, y: 440, reached: true },
      { x: 2800, y: 440, reached: false },
      { x: 5600, y: 440, reached: false },
      { x: 8400, y: 440, reached: false },
    ],
    platforms: [
      // Ground segments along the 11,500px course
      { x: 0, y: 550, w: 750, h: 150, type: 'ground' },
      { x: 850, y: 550, w: 700, h: 150, type: 'ground' },
      { x: 1650, y: 550, w: 750, h: 150, type: 'ground' },
      { x: 2500, y: 550, w: 800, h: 150, type: 'ground' },
      { x: 3400, y: 550, w: 750, h: 150, type: 'ground' },
      { x: 4250, y: 550, w: 800, h: 150, type: 'ground' },
      // Super Moto Highway section (smooth long run)
      { x: 5150, y: 550, w: 2200, h: 150, type: 'ground' },
      { x: 7450, y: 550, w: 800, h: 150, type: 'ground' },
      { x: 8350, y: 550, w: 750, h: 150, type: 'ground' },
      { x: 9200, y: 550, w: 800, h: 150, type: 'ground' },
      { x: 10100, y: 550, w: 750, h: 150, type: 'ground' },
      { x: 10950, y: 550, w: 600, h: 150, type: 'ground' },

      // Canopy treetop pathways & springs
      { x: 220, y: 440, w: 120, h: 22, type: 'wood' },
      { x: 380, y: 360, w: 130, h: 22, type: 'wood' },
      { x: 550, y: 280, w: 120, h: 22, type: 'wood' },
      { x: 780, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 920, y: 440, w: 120, h: 22, type: 'wood' },
      { x: 1100, y: 350, w: 130, h: 22, type: 'moving', moveRange: 110, moveSpeed: 1.3, direction: 'horizontal' },
      { x: 1320, y: 430, w: 120, h: 22, type: 'wood' },
      { x: 1580, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 1750, y: 440, w: 120, h: 22, type: 'wood' },
      { x: 1920, y: 340, w: 130, h: 22, type: 'wood' },
      { x: 2110, y: 250, w: 140, h: 22, type: 'wood' },
      { x: 2320, y: 370, w: 120, h: 22, type: 'wood' },
      { x: 2430, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 2600, y: 440, w: 120, h: 22, type: 'wood' },
      { x: 2780, y: 340, w: 120, h: 22, type: 'moving', moveRange: 90, moveSpeed: 1.2, direction: 'vertical' },
      { x: 2980, y: 260, w: 130, h: 22, type: 'wood' },
      { x: 3180, y: 380, w: 120, h: 22, type: 'wood' },
      { x: 3330, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 3520, y: 440, w: 120, h: 22, type: 'wood' },
      { x: 3700, y: 350, w: 130, h: 22, type: 'moving', moveRange: 130, moveSpeed: 1.4, direction: 'horizontal' },
      { x: 3920, y: 260, w: 120, h: 22, type: 'wood' },
      { x: 4120, y: 380, w: 120, h: 22, type: 'wood' },
      { x: 4200, y: 535, w: 46, h: 20, type: 'spring' },

      // High wooden bridge before moto pickup
      { x: 4400, y: 430, w: 130, h: 22, type: 'wood' },
      { x: 4600, y: 340, w: 140, h: 22, type: 'wood' },
      { x: 4820, y: 440, w: 130, h: 22, type: 'wood' },

      // Second half of Stage 1 (after motorcycle speedway)
      { x: 7550, y: 440, w: 120, h: 22, type: 'wood' },
      { x: 7750, y: 340, w: 130, h: 22, type: 'moving', moveRange: 110, moveSpeed: 1.3, direction: 'horizontal' },
      { x: 7980, y: 260, w: 130, h: 22, type: 'wood' },
      { x: 8200, y: 380, w: 120, h: 22, type: 'wood' },
      { x: 8280, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 8480, y: 440, w: 120, h: 22, type: 'wood' },
      { x: 8680, y: 330, w: 130, h: 22, type: 'moving', moveRange: 90, moveSpeed: 1.2, direction: 'vertical' },
      { x: 8900, y: 250, w: 140, h: 22, type: 'wood' },
      { x: 9110, y: 370, w: 120, h: 22, type: 'wood' },
      { x: 9160, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 9350, y: 440, w: 120, h: 22, type: 'wood' },
      { x: 9550, y: 340, w: 130, h: 22, type: 'moving', moveRange: 120, moveSpeed: 1.4, direction: 'horizontal' },
      { x: 9780, y: 260, w: 130, h: 22, type: 'wood' },
      { x: 10000, y: 380, w: 120, h: 22, type: 'wood' },
      { x: 10060, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 10250, y: 440, w: 120, h: 22, type: 'wood' },
      { x: 10450, y: 340, w: 130, h: 22, type: 'wood' },
      { x: 10680, y: 260, w: 140, h: 22, type: 'wood' },
      { x: 10900, y: 380, w: 120, h: 22, type: 'wood' },
      { x: 11150, y: 460, w: 110, h: 22, type: 'wood' },
    ],
    enemies: [
      { id: 1, type: 'mushroom', x: 420, y: 520, w: 34, h: 32, vx: 1.1, minX: 320, maxX: 640, alive: true },
      { id: 2, type: 'mushroom', x: 980, y: 520, w: 34, h: 32, vx: -1.2, minX: 860, maxX: 1200, alive: true },
      { id: 3, type: 'mushroom', x: 1800, y: 520, w: 34, h: 32, vx: 1.3, minX: 1680, maxX: 2000, alive: true },
      { id: 4, type: 'mushroom', x: 2700, y: 520, w: 34, h: 32, vx: -1.2, minX: 2550, maxX: 2900, alive: true },
      { id: 5, type: 'mushroom', x: 3600, y: 520, w: 34, h: 32, vx: 1.4, minX: 3450, maxX: 3800, alive: true },
      // Motorcycle ramp targets:
      { id: 6, type: 'mushroom', x: 5500, y: 520, w: 34, h: 32, vx: 1.2, minX: 5300, maxX: 5800, alive: true },
      { id: 7, type: 'mushroom', x: 6000, y: 520, w: 34, h: 32, vx: -1.3, minX: 5850, maxX: 6400, alive: true },
      { id: 8, type: 'mushroom', x: 6600, y: 520, w: 34, h: 32, vx: 1.2, minX: 6450, maxX: 7000, alive: true },
      { id: 9, type: 'mushroom', x: 7600, y: 520, w: 34, h: 32, vx: -1.2, minX: 7480, maxX: 7900, alive: true },
      { id: 10, type: 'mushroom', x: 8600, y: 520, w: 34, h: 32, vx: 1.3, minX: 8400, maxX: 8800, alive: true },
      { id: 11, type: 'mushroom', x: 9400, y: 520, w: 34, h: 32, vx: -1.2, minX: 9250, maxX: 9700, alive: true },
      { id: 12, type: 'mushroom', x: 10300, y: 520, w: 34, h: 32, vx: 1.3, minX: 10150, maxX: 10600, alive: true },
    ],
    rewards: [
      { id: 1, type: 'chest', x: 2110, y: 206, w: 34, h: 30, collected: false },
      { id: 2, type: 'star', x: 2980, y: 218, w: 32, h: 32, collected: false },
      { id: 3, type: 'moto', x: 5000, y: 516, w: 46, h: 34, collected: false }, // Super Moto Pickup!
      { id: 4, type: 'chest', x: 6500, y: 512, w: 34, h: 30, collected: false },
      { id: 5, type: 'shield', x: 8900, y: 210, w: 32, h: 32, collected: false },
      { id: 6, type: 'chest', x: 10680, y: 216, w: 34, h: 30, collected: false },
    ],
    fruits: [
      { id: 1, type: 'apple', x: 550, y: 240, w: 26, h: 26, collected: false },
      { id: 2, type: 'banana', x: 1920, y: 298, w: 26, h: 26, collected: false },
      { id: 3, type: 'watermelon', x: 4600, y: 298, w: 28, h: 28, collected: false },
      { id: 4, type: 'apple', x: 7980, y: 220, w: 26, h: 26, collected: false },
      { id: 5, type: 'watermelon', x: 10450, y: 298, w: 28, h: 28, collected: false },
    ],
    hazards: [
      { x: 690, y: 536, w: 38, h: 16, type: 'slime' },
      { x: 1520, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 2360, y: 536, w: 42, h: 16, type: 'slime' },
      { x: 3280, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 4180, y: 536, w: 42, h: 16, type: 'slime' },
      { x: 7380, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 8250, y: 536, w: 42, h: 16, type: 'slime' },
      { x: 9120, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 10040, y: 536, w: 42, h: 16, type: 'slime' },
    ],
    hearts: [
      { id: 1, x: 220, y: 400, collected: false },
      { id: 2, x: 380, y: 320, collected: false },
      { id: 3, x: 550, y: 240, collected: false },
      { id: 4, x: 1100, y: 310, collected: false },
      { id: 5, x: 1320, y: 380, collected: false },
      { id: 6, x: 1750, y: 390, collected: false },
      { id: 7, x: 2780, y: 300, collected: false },
      { id: 8, x: 3700, y: 310, collected: false },
      { id: 9, x: 4400, y: 390, collected: false },
      { id: 10, x: 5300, y: 500, collected: false },
      { id: 11, x: 5800, y: 500, collected: false },
      { id: 12, x: 6300, y: 500, collected: false },
      { id: 13, x: 6800, y: 500, collected: false },
      { id: 14, x: 7750, y: 300, collected: false },
      { id: 15, x: 8680, y: 290, collected: false },
      { id: 16, x: 9550, y: 300, collected: false },
      { id: 17, x: 10250, y: 400, collected: false },
      { id: 18, x: 10900, y: 340, collected: false },
    ],
    sceneryElements: [
      { type: 'tree', x: 100, y: 460, scale: 1.1 },
      { type: 'flower', x: 280, y: 532 },
      { type: 'bench', x: 460, y: 534 },
      { type: 'tree', x: 880, y: 460, scale: 1.0 },
      { type: 'tree', x: 1700, y: 450, scale: 1.2 },
      { type: 'tree', x: 2550, y: 460, scale: 1.1 },
      { type: 'tree', x: 3450, y: 450, scale: 1.1 },
      { type: 'tree', x: 4300, y: 460, scale: 1.2 },
      { type: 'tree', x: 5200, y: 450, scale: 1.0 },
      { type: 'tree', x: 6800, y: 460, scale: 1.2 },
      { type: 'tree', x: 8400, y: 450, scale: 1.1 },
      { type: 'tree', x: 10150, y: 460, scale: 1.2 },
      { type: 'flower', x: 11180, y: 532 },
    ],
  },

  // ==========================================
  // FASE 2: A METRÓPOLE DOS AMORES (~12,000px, ~2 minutos)
  // ==========================================
  {
    id: 2,
    name: 'Fase 2: Metrópole dos Amores',
    subtitle: 'Salte entre telhados de arranha-céus e acelere na rodovia iluminada!',
    theme: 'cidade',
    worldWidth: 12000,
    worldHeight: 700,
    playerStart: { x: 80, y: 440 },
    goal: { x: 11800, y: 430, w: 90, h: 120, label: 'Portão da Metrópole' },
    checkpoints: [
      { x: 80, y: 440, reached: true },
      { x: 3000, y: 440, reached: false },
      { x: 6000, y: 440, reached: false },
      { x: 9000, y: 440, reached: false },
    ],
    platforms: [
      { x: 0, y: 550, w: 750, h: 150, type: 'ground' },
      { x: 850, y: 550, w: 720, h: 150, type: 'ground' },
      { x: 1670, y: 550, w: 750, h: 150, type: 'ground' },
      { x: 2520, y: 550, w: 780, h: 150, type: 'ground' },
      { x: 3400, y: 550, w: 750, h: 150, type: 'ground' },
      { x: 4250, y: 550, w: 780, h: 150, type: 'ground' },
      // Urban Expressway (Super Moto run)
      { x: 5130, y: 550, w: 2400, h: 150, type: 'ground' },
      { x: 7630, y: 550, w: 750, h: 150, type: 'ground' },
      { x: 8480, y: 550, w: 780, h: 150, type: 'ground' },
      { x: 9360, y: 550, w: 780, h: 150, type: 'ground' },
      { x: 10240, y: 550, w: 780, h: 150, type: 'ground' },
      { x: 11120, y: 550, w: 850, h: 150, type: 'ground' },

      // Rooftops & Construction elevators
      { x: 240, y: 440, w: 130, h: 22, type: 'rooftop' },
      { x: 420, y: 350, w: 140, h: 22, type: 'rooftop' },
      { x: 610, y: 260, w: 130, h: 22, type: 'rooftop' },
      { x: 790, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 950, y: 430, w: 130, h: 22, type: 'rooftop' },
      { x: 1140, y: 340, w: 140, h: 22, type: 'moving', moveRange: 130, moveSpeed: 1.4, direction: 'horizontal' },
      { x: 1370, y: 250, w: 130, h: 22, type: 'rooftop' },
      { x: 1610, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 1780, y: 440, w: 130, h: 22, type: 'rooftop' },
      { x: 1970, y: 330, w: 140, h: 22, type: 'moving', moveRange: 90, moveSpeed: 1.2, direction: 'vertical' },
      { x: 2200, y: 240, w: 140, h: 22, type: 'rooftop' },
      { x: 2450, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 2630, y: 430, w: 130, h: 22, type: 'rooftop' },
      { x: 2830, y: 340, w: 140, h: 22, type: 'rooftop' },
      { x: 3040, y: 250, w: 130, h: 22, type: 'rooftop' },
      { x: 3330, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 3520, y: 440, w: 130, h: 22, type: 'rooftop' },
      { x: 3730, y: 340, w: 140, h: 22, type: 'moving', moveRange: 140, moveSpeed: 1.5, direction: 'horizontal' },
      { x: 3960, y: 250, w: 130, h: 22, type: 'rooftop' },
      { x: 4180, y: 535, w: 46, h: 20, type: 'spring' },

      // Second half of Stage 2
      { x: 7750, y: 430, w: 130, h: 22, type: 'rooftop' },
      { x: 7960, y: 330, w: 140, h: 22, type: 'moving', moveRange: 100, moveSpeed: 1.3, direction: 'vertical' },
      { x: 8200, y: 240, w: 140, h: 22, type: 'rooftop' },
      { x: 8410, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 8590, y: 440, w: 130, h: 22, type: 'rooftop' },
      { x: 8790, y: 340, w: 140, h: 22, type: 'moving', moveRange: 120, moveSpeed: 1.4, direction: 'horizontal' },
      { x: 9020, y: 250, w: 130, h: 22, type: 'rooftop' },
      { x: 9280, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 9470, y: 440, w: 130, h: 22, type: 'rooftop' },
      { x: 9680, y: 330, w: 140, h: 22, type: 'moving', moveRange: 90, moveSpeed: 1.2, direction: 'vertical' },
      { x: 9910, y: 240, w: 140, h: 22, type: 'rooftop' },
      { x: 10160, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 10350, y: 430, w: 130, h: 22, type: 'rooftop' },
      { x: 10560, y: 340, w: 140, h: 22, type: 'rooftop' },
      { x: 10790, y: 250, w: 130, h: 22, type: 'rooftop' },
      { x: 11020, y: 380, w: 120, h: 22, type: 'rooftop' },
    ],
    enemies: [
      { id: 101, type: 'mushroom', x: 450, y: 520, w: 34, h: 32, vx: 1.2, minX: 350, maxX: 680, alive: true },
      { id: 102, type: 'mushroom', x: 1050, y: 520, w: 34, h: 32, vx: -1.3, minX: 900, maxX: 1250, alive: true },
      { id: 103, type: 'mushroom', x: 1850, y: 520, w: 34, h: 32, vx: 1.2, minX: 1720, maxX: 2100, alive: true },
      { id: 104, type: 'mushroom', x: 2750, y: 520, w: 34, h: 32, vx: -1.4, minX: 2600, maxX: 3000, alive: true },
      // Motorcycle straightaway:
      { id: 105, type: 'mushroom', x: 5500, y: 520, w: 34, h: 32, vx: 1.3, minX: 5300, maxX: 5800, alive: true },
      { id: 106, type: 'mushroom', x: 6100, y: 520, w: 34, h: 32, vx: -1.3, minX: 5900, maxX: 6500, alive: true },
      { id: 107, type: 'mushroom', x: 6800, y: 520, w: 34, h: 32, vx: 1.4, minX: 6600, maxX: 7200, alive: true },
      { id: 108, type: 'mushroom', x: 7850, y: 520, w: 34, h: 32, vx: -1.3, minX: 7700, maxX: 8100, alive: true },
      { id: 109, type: 'mushroom', x: 8750, y: 520, w: 34, h: 32, vx: 1.3, minX: 8600, maxX: 9000, alive: true },
      { id: 110, type: 'mushroom', x: 9600, y: 520, w: 34, h: 32, vx: -1.3, minX: 9450, maxX: 9900, alive: true },
      { id: 111, type: 'mushroom', x: 10500, y: 520, w: 34, h: 32, vx: 1.4, minX: 10300, maxX: 10800, alive: true },
    ],
    rewards: [
      { id: 101, type: 'chest', x: 2200, y: 200, w: 34, h: 30, collected: false },
      { id: 102, type: 'star', x: 3040, y: 210, w: 32, h: 32, collected: false },
      { id: 103, type: 'moto', x: 4980, y: 516, w: 46, h: 34, collected: false }, // Super Moto in City!
      { id: 104, type: 'chest', x: 6600, y: 512, w: 34, h: 30, collected: false },
      { id: 105, type: 'shield', x: 8200, y: 200, w: 32, h: 32, collected: false },
      { id: 106, type: 'chest', x: 9910, y: 200, w: 34, h: 30, collected: false },
    ],
    fruits: [
      { id: 101, type: 'banana', x: 610, y: 220, w: 26, h: 26, collected: false },
      { id: 102, type: 'watermelon', x: 1370, y: 210, w: 28, h: 28, collected: false },
      { id: 103, type: 'apple', x: 3960, y: 210, w: 26, h: 26, collected: false },
      { id: 104, type: 'watermelon', x: 9020, y: 210, w: 28, h: 28, collected: false },
    ],
    hazards: [
      { x: 700, y: 535, w: 36, h: 18, type: 'cone' },
      { x: 1540, y: 535, w: 36, h: 18, type: 'cone' },
      { x: 2380, y: 535, w: 36, h: 18, type: 'cone' },
      { x: 3260, y: 535, w: 38, h: 18, type: 'spark' },
      { x: 4120, y: 535, w: 36, h: 18, type: 'cone' },
      { x: 7520, y: 535, w: 36, h: 18, type: 'cone' },
      { x: 8380, y: 535, w: 38, h: 18, type: 'spark' },
      { x: 9240, y: 535, w: 36, h: 18, type: 'cone' },
      { x: 10120, y: 535, w: 38, h: 18, type: 'spark' },
    ],
    hearts: [
      { id: 101, x: 240, y: 400, collected: false },
      { id: 102, x: 420, y: 310, collected: false },
      { id: 103, x: 610, y: 220, collected: false },
      { id: 104, x: 1140, y: 300, collected: false },
      { id: 105, x: 1970, y: 290, collected: false },
      { id: 106, x: 2830, y: 300, collected: false },
      { id: 107, x: 3730, y: 300, collected: false },
      { id: 108, x: 5350, y: 500, collected: false },
      { id: 109, x: 5850, y: 500, collected: false },
      { id: 110, x: 6350, y: 500, collected: false },
      { id: 111, x: 6850, y: 500, collected: false },
      { id: 112, x: 7960, y: 290, collected: false },
      { id: 113, x: 8790, y: 300, collected: false },
      { id: 114, x: 9680, y: 290, collected: false },
      { id: 115, x: 10560, y: 300, collected: false },
      { id: 116, x: 11020, y: 340, collected: false },
    ],
    sceneryElements: [
      { type: 'lamppost', x: 200, y: 460 },
      { type: 'lamppost', x: 900, y: 460 },
      { type: 'lamppost', x: 1720, y: 460 },
      { type: 'lamppost', x: 2580, y: 460 },
      { type: 'lamppost', x: 3460, y: 460 },
      { type: 'lamppost', x: 5200, y: 460 },
      { type: 'lamppost', x: 6900, y: 460 },
      { type: 'lamppost', x: 8550, y: 460 },
      { type: 'lamppost', x: 10300, y: 460 },
    ],
  },

  // ==========================================
  // FASE 3: AS CATACUMBAS DO CASTELO (~12,500px, ~2 minutos)
  // Requer andar abaixado (ABAIXAR) sob vigas e espinhos
  // ==========================================
  {
    id: 3,
    name: 'Fase 3: As Catacumbas do Castelo',
    subtitle: 'Abaixe-se e engatinhe para passar por vigas pontiagudas e pêndulos mortais!',
    theme: 'masmorra',
    worldWidth: 12500,
    worldHeight: 700,
    playerStart: { x: 80, y: 440 },
    goal: { x: 12300, y: 430, w: 90, h: 120, label: 'Portal das Catacumbas' },
    checkpoints: [
      { x: 80, y: 440, reached: true },
      { x: 2600, y: 440, reached: false },
      { x: 5200, y: 440, reached: false },
      { x: 7800, y: 440, reached: false },
      { x: 10200, y: 440, reached: false },
    ],
    platforms: [
      { x: 0, y: 550, w: 800, h: 150, type: 'stone' },
      { x: 900, y: 550, w: 800, h: 150, type: 'stone' },
      { x: 1800, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 2750, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 3700, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 4650, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 5600, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 6550, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 7500, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 8450, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 9400, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 10350, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 11300, y: 550, w: 1200, h: 150, type: 'stone' },

      // Catacombs elevated stone chambers
      { x: 260, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 450, y: 340, w: 140, h: 24, type: 'stone' },
      { x: 650, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 840, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 1020, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 1220, y: 340, w: 140, h: 24, type: 'moving', moveRange: 120, moveSpeed: 1.3, direction: 'horizontal' },
      { x: 1480, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 1740, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 1950, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 2160, y: 330, w: 140, h: 24, type: 'moving', moveRange: 90, moveSpeed: 1.2, direction: 'vertical' },
      { x: 2400, y: 240, w: 150, h: 24, type: 'stone' },
      { x: 2680, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 2900, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 3120, y: 340, w: 140, h: 24, type: 'stone' },
      { x: 3350, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 3630, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 3850, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 4070, y: 340, w: 140, h: 24, type: 'moving', moveRange: 130, moveSpeed: 1.4, direction: 'horizontal' },
      { x: 4320, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 4580, y: 535, w: 46, h: 20, type: 'spring' },

      // Second half of catacombs
      { x: 5750, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 5970, y: 340, w: 140, h: 24, type: 'moving', moveRange: 110, moveSpeed: 1.3, direction: 'vertical' },
      { x: 6220, y: 250, w: 150, h: 24, type: 'stone' },
      { x: 6480, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 6700, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 6920, y: 340, w: 140, h: 24, type: 'stone' },
      { x: 7150, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 7420, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 7650, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 7870, y: 340, w: 140, h: 24, type: 'moving', moveRange: 120, moveSpeed: 1.4, direction: 'horizontal' },
      { x: 8120, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 8380, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 8600, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 8820, y: 330, w: 140, h: 24, type: 'moving', moveRange: 90, moveSpeed: 1.2, direction: 'vertical' },
      { x: 9060, y: 240, w: 150, h: 24, type: 'stone' },
      { x: 9320, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 9550, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 9770, y: 340, w: 140, h: 24, type: 'stone' },
      { x: 10000, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 10270, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 10500, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 10720, y: 340, w: 140, h: 24, type: 'stone' },
      { x: 10950, y: 250, w: 150, h: 24, type: 'stone' },
      { x: 11180, y: 380, w: 130, h: 24, type: 'stone' },
    ],
    enemies: [
      { id: 201, type: 'mushroom', x: 500, y: 520, w: 34, h: 32, vx: 1.2, minX: 380, maxX: 720, alive: true },
      { id: 202, type: 'mushroom', x: 1350, y: 520, w: 34, h: 32, vx: -1.3, minX: 1100, maxX: 1600, alive: true },
      { id: 203, type: 'mushroom', x: 2200, y: 520, w: 34, h: 32, vx: 1.3, minX: 1950, maxX: 2500, alive: true },
      { id: 204, type: 'mushroom', x: 3100, y: 520, w: 34, h: 32, vx: -1.2, minX: 2900, maxX: 3400, alive: true },
      { id: 205, type: 'mushroom', x: 4100, y: 520, w: 34, h: 32, vx: 1.3, minX: 3850, maxX: 4400, alive: true },
      { id: 206, type: 'mushroom', x: 6000, y: 520, w: 34, h: 32, vx: -1.3, minX: 5750, maxX: 6300, alive: true },
      { id: 207, type: 'mushroom', x: 7000, y: 520, w: 34, h: 32, vx: 1.3, minX: 6750, maxX: 7300, alive: true },
      { id: 208, type: 'mushroom', x: 8000, y: 520, w: 34, h: 32, vx: -1.3, minX: 7750, maxX: 8300, alive: true },
      { id: 209, type: 'mushroom', x: 9000, y: 520, w: 34, h: 32, vx: 1.3, minX: 8750, maxX: 9300, alive: true },
      { id: 210, type: 'mushroom', x: 10100, y: 520, w: 34, h: 32, vx: -1.4, minX: 9800, maxX: 10300, alive: true },
    ],
    rewards: [
      { id: 201, type: 'armor', x: 2400, y: 196, w: 34, h: 34, collected: false }, // Armadura Dourada!
      { id: 202, type: 'chest', x: 3350, y: 206, w: 34, h: 30, collected: false },
      { id: 203, type: 'star', x: 4320, y: 206, w: 32, h: 32, collected: false },
      { id: 204, type: 'armor', x: 7150, y: 196, w: 34, h: 34, collected: false }, // Segunda Armadura!
      { id: 205, type: 'chest', x: 8120, y: 206, w: 34, h: 30, collected: false },
      { id: 206, type: 'shield', x: 10950, y: 206, w: 32, h: 32, collected: false },
    ],
    fruits: [
      { id: 201, type: 'apple', x: 650, y: 210, w: 26, h: 26, collected: false },
      { id: 202, type: 'banana', x: 1480, y: 210, w: 26, h: 26, collected: false },
      { id: 203, type: 'watermelon', x: 6220, y: 210, w: 28, h: 28, collected: false },
      { id: 204, type: 'watermelon', x: 9060, y: 200, w: 28, h: 28, collected: false },
    ],
    hazards: [
      // OVERHEAD HAZARDS: Low beams, ceiling spikes, pendulums requiring walking while crouching (ABAIXAR)!
      { x: 1080, y: 470, w: 180, h: 34, type: 'lowBeam', isOverhead: true },
      { x: 1980, y: 468, w: 200, h: 34, type: 'lowBeam', isOverhead: true },
      { x: 2880, y: 466, w: 190, h: 34, type: 'spikeCeiling', isOverhead: true },
      { x: 3800, y: 420, w: 40, h: 90, type: 'pendulum' },
      { x: 4780, y: 470, w: 210, h: 34, type: 'lowBeam', isOverhead: true },
      { x: 5800, y: 466, w: 200, h: 34, type: 'spikeCeiling', isOverhead: true },
      { x: 6780, y: 420, w: 40, h: 90, type: 'pendulum' },
      { x: 7700, y: 470, w: 220, h: 34, type: 'lowBeam', isOverhead: true },
      { x: 8680, y: 466, w: 210, h: 34, type: 'spikeCeiling', isOverhead: true },
      { x: 9680, y: 420, w: 40, h: 90, type: 'pendulum' },
      { x: 10600, y: 470, w: 230, h: 34, type: 'lowBeam', isOverhead: true },

      // Ground slimes & gaps
      { x: 830, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 1730, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 2680, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 3620, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 4570, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 6470, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 7410, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 8370, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 9310, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 10260, y: 536, w: 40, h: 16, type: 'slime' },
    ],
    hearts: [
      { id: 201, x: 260, y: 390, collected: false },
      { id: 202, x: 450, y: 300, collected: false },
      { id: 203, x: 650, y: 210, collected: false },
      { id: 204, x: 1140, y: 510, collected: false }, // Heart inside low beam crawlway!
      { id: 205, x: 1480, y: 210, collected: false },
      { id: 206, x: 2050, y: 510, collected: false }, // Heart inside low beam crawlway!
      { id: 207, x: 2950, y: 510, collected: false }, // Heart inside ceiling spike crawlway!
      { id: 208, x: 3350, y: 210, collected: false },
      { id: 209, x: 4850, y: 510, collected: false },
      { id: 210, x: 5900, y: 510, collected: false },
      { id: 211, x: 6220, y: 210, collected: false },
      { id: 212, x: 7150, y: 210, collected: false },
      { id: 213, x: 7780, y: 510, collected: false },
      { id: 214, x: 8750, y: 510, collected: false },
      { id: 215, x: 9770, y: 300, collected: false },
      { id: 216, x: 10700, y: 510, collected: false },
      { id: 217, x: 11180, y: 340, collected: false },
    ],
    sceneryElements: [
      { type: 'torch', x: 200, y: 340 },
      { type: 'chain', x: 500, y: 120 },
      { type: 'shieldDecal', x: 800, y: 280 },
      { type: 'torch', x: 1100, y: 340 },
      { type: 'torch', x: 2000, y: 340 },
      { type: 'chain', x: 2300, y: 120 },
      { type: 'torch', x: 2900, y: 340 },
      { type: 'shieldDecal', x: 3800, y: 280 },
      { type: 'torch', x: 4800, y: 340 },
      { type: 'chain', x: 5800, y: 120 },
      { type: 'torch', x: 6800, y: 340 },
      { type: 'shieldDecal', x: 7800, y: 280 },
      { type: 'torch', x: 8800, y: 340 },
      { type: 'chain', x: 9800, y: 120 },
      { type: 'torch', x: 10700, y: 340 },
    ],
  },

  // ==========================================
  // FASE 4: A FORTALEZA DOS CAVALEIROS (~13,000px, ~2 minutos)
  // Super Moto no pátio real, novas vigas para engatinhar e desafios
  // ==========================================
  {
    id: 4,
    name: 'Fase 4: A Fortaleza dos Cavaleiros',
    subtitle: 'Corra pelas muralhas do castelo, use a Super Moto e desvie de armadilhas!',
    theme: 'masmorra',
    worldWidth: 13000,
    worldHeight: 700,
    playerStart: { x: 80, y: 440 },
    goal: { x: 12800, y: 430, w: 90, h: 120, label: 'Ponte Levadiça Real' },
    checkpoints: [
      { x: 80, y: 440, reached: true },
      { x: 2700, y: 440, reached: false },
      { x: 5500, y: 440, reached: false },
      { x: 8300, y: 440, reached: false },
      { x: 10800, y: 440, reached: false },
    ],
    platforms: [
      { x: 0, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 950, y: 550, w: 800, h: 150, type: 'stone' },
      { x: 1850, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 2800, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 3750, y: 550, w: 850, h: 150, type: 'stone' },
      // Castle Courtyard Grand Speedway (Super Moto section!)
      { x: 4700, y: 550, w: 2600, h: 150, type: 'stone' },
      { x: 7400, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 8350, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 9300, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 10250, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 11200, y: 550, w: 900, h: 150, type: 'stone' },
      { x: 12200, y: 550, w: 800, h: 150, type: 'stone' },

      // Ramparts & Castle Towers
      { x: 280, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 480, y: 340, w: 140, h: 24, type: 'stone' },
      { x: 690, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 880, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 1080, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 1300, y: 340, w: 140, h: 24, type: 'moving', moveRange: 130, moveSpeed: 1.4, direction: 'horizontal' },
      { x: 1550, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 1780, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 2000, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 2220, y: 330, w: 140, h: 24, type: 'moving', moveRange: 90, moveSpeed: 1.2, direction: 'vertical' },
      { x: 2470, y: 240, w: 150, h: 24, type: 'stone' },
      { x: 2730, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 2950, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 3170, y: 340, w: 140, h: 24, type: 'stone' },
      { x: 3400, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 3670, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 3880, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 4100, y: 340, w: 140, h: 24, type: 'moving', moveRange: 130, moveSpeed: 1.4, direction: 'horizontal' },
      { x: 4350, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 4620, y: 535, w: 46, h: 20, type: 'spring' },

      // Second half of Fortress
      { x: 7550, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 7780, y: 340, w: 140, h: 24, type: 'moving', moveRange: 110, moveSpeed: 1.3, direction: 'vertical' },
      { x: 8030, y: 250, w: 150, h: 24, type: 'stone' },
      { x: 8290, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 8500, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 8730, y: 340, w: 140, h: 24, type: 'stone' },
      { x: 8970, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 9230, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 9450, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 9680, y: 330, w: 140, h: 24, type: 'moving', moveRange: 100, moveSpeed: 1.3, direction: 'horizontal' },
      { x: 9930, y: 240, w: 150, h: 24, type: 'stone' },
      { x: 10180, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 10400, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 10630, y: 340, w: 140, h: 24, type: 'stone' },
      { x: 10870, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 11100, y: 380, w: 130, h: 24, type: 'stone' },
    ],
    enemies: [
      { id: 301, type: 'mushroom', x: 550, y: 520, w: 34, h: 32, vx: 1.3, minX: 420, maxX: 780, alive: true },
      { id: 302, type: 'mushroom', x: 1400, y: 520, w: 34, h: 32, vx: -1.4, minX: 1150, maxX: 1650, alive: true },
      { id: 303, type: 'mushroom', x: 2300, y: 520, w: 34, h: 32, vx: 1.3, minX: 2050, maxX: 2600, alive: true },
      { id: 304, type: 'mushroom', x: 3200, y: 520, w: 34, h: 32, vx: -1.3, minX: 2950, maxX: 3500, alive: true },
      // Moto rampage targets in courtyard:
      { id: 305, type: 'mushroom', x: 5100, y: 520, w: 34, h: 32, vx: 1.4, minX: 4900, maxX: 5400, alive: true },
      { id: 306, type: 'mushroom', x: 5700, y: 520, w: 34, h: 32, vx: -1.4, minX: 5500, maxX: 6100, alive: true },
      { id: 307, type: 'mushroom', x: 6400, y: 520, w: 34, h: 32, vx: 1.4, minX: 6200, maxX: 6800, alive: true },
      { id: 308, type: 'mushroom', x: 7800, y: 520, w: 34, h: 32, vx: -1.3, minX: 7600, maxX: 8100, alive: true },
      { id: 309, type: 'mushroom', x: 8800, y: 520, w: 34, h: 32, vx: 1.3, minX: 8600, maxX: 9100, alive: true },
      { id: 310, type: 'mushroom', x: 9800, y: 520, w: 34, h: 32, vx: -1.4, minX: 9600, maxX: 10100, alive: true },
      { id: 311, type: 'mushroom', x: 10800, y: 520, w: 34, h: 32, vx: 1.3, minX: 10600, maxX: 11100, alive: true },
    ],
    rewards: [
      { id: 301, type: 'armor', x: 2470, y: 196, w: 34, h: 34, collected: false },
      { id: 302, type: 'chest', x: 3400, y: 206, w: 34, h: 30, collected: false },
      { id: 303, type: 'moto', x: 4750, y: 516, w: 46, h: 34, collected: false }, // Super Moto in Fortress!
      { id: 304, type: 'chest', x: 6700, y: 512, w: 34, h: 30, collected: false },
      { id: 305, type: 'star', x: 8030, y: 206, w: 32, h: 32, collected: false },
      { id: 306, type: 'shield', x: 10870, y: 206, w: 32, h: 32, collected: false },
    ],
    fruits: [
      { id: 301, type: 'apple', x: 690, y: 210, w: 26, h: 26, collected: false },
      { id: 302, type: 'watermelon', x: 1550, y: 210, w: 28, h: 28, collected: false },
      { id: 303, type: 'banana', x: 4350, y: 210, w: 26, h: 26, collected: false },
      { id: 304, type: 'watermelon', x: 9930, y: 200, w: 28, h: 28, collected: false },
    ],
    hazards: [
      // Overhead low beams and spikes
      { x: 1150, y: 470, w: 190, h: 34, type: 'lowBeam', isOverhead: true },
      { x: 2050, y: 466, w: 210, h: 34, type: 'spikeCeiling', isOverhead: true },
      { x: 3020, y: 420, w: 40, h: 90, type: 'pendulum' },
      { x: 3950, y: 470, w: 200, h: 34, type: 'lowBeam', isOverhead: true },
      { x: 7600, y: 420, w: 40, h: 90, type: 'pendulum' },
      { x: 8550, y: 470, w: 220, h: 34, type: 'lowBeam', isOverhead: true },
      { x: 9520, y: 466, w: 210, h: 34, type: 'spikeCeiling', isOverhead: true },
      { x: 10480, y: 420, w: 40, h: 90, type: 'pendulum' },
      { x: 11450, y: 470, w: 220, h: 34, type: 'lowBeam', isOverhead: true },

      { x: 870, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 1770, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 2720, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 3660, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 4610, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 7320, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 8270, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 9220, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 10170, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 11120, y: 536, w: 40, h: 16, type: 'slime' },
    ],
    hearts: [
      { id: 301, x: 280, y: 390, collected: false },
      { id: 302, x: 480, y: 300, collected: false },
      { id: 303, x: 690, y: 210, collected: false },
      { id: 304, x: 1220, y: 510, collected: false },
      { id: 305, x: 2120, y: 510, collected: false },
      { id: 306, x: 3400, y: 210, collected: false },
      { id: 307, x: 4020, y: 510, collected: false },
      { id: 308, x: 4950, y: 500, collected: false },
      { id: 309, x: 5450, y: 500, collected: false },
      { id: 310, x: 6050, y: 500, collected: false },
      { id: 311, x: 6750, y: 500, collected: false },
      { id: 312, x: 8030, y: 210, collected: false },
      { id: 313, x: 8620, y: 510, collected: false },
      { id: 314, x: 9600, y: 510, collected: false },
      { id: 315, x: 10870, y: 210, collected: false },
      { id: 316, x: 11520, y: 510, collected: false },
      { id: 317, x: 12400, y: 430, collected: false },
    ],
    sceneryElements: [
      { type: 'torch', x: 250, y: 340 },
      { type: 'chain', x: 600, y: 120 },
      { type: 'shieldDecal', x: 950, y: 280 },
      { type: 'torch', x: 1300, y: 340 },
      { type: 'torch', x: 2200, y: 340 },
      { type: 'shieldDecal', x: 3100, y: 280 },
      { type: 'torch', x: 4800, y: 340 },
      { type: 'torch', x: 6000, y: 340 },
      { type: 'chain', x: 7000, y: 120 },
      { type: 'shieldDecal', x: 8000, y: 280 },
      { type: 'torch', x: 9200, y: 340 },
      { type: 'chain', x: 10300, y: 120 },
      { type: 'torch', x: 11500, y: 340 },
    ],
  },

  // ==========================================
  // FASE 5: O TRONO CELESTIAL DO AMOR (~13,500px, ~2 minutos)
  // Grande Fase Final onde Ursinho Amor é resgatado com Cutscene ao vivo!
  // ==========================================
  {
    id: 5,
    name: 'Fase 5: O Trono do Amor',
    subtitle: 'A grande fase final: escale as torres reais para resgatar o Ursinho Amor!',
    theme: 'castelo',
    worldWidth: 13500,
    worldHeight: 700,
    playerStart: { x: 80, y: 440 },
    goal: { x: 13260, y: 430, w: 100, h: 120, label: 'O Trono do Amor' },
    checkpoints: [
      { x: 80, y: 440, reached: true },
      { x: 2900, y: 440, reached: false },
      { x: 5900, y: 440, reached: false },
      { x: 8900, y: 440, reached: false },
      { x: 11500, y: 440, reached: false },
    ],
    platforms: [
      { x: 0, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 950, y: 550, w: 820, h: 150, type: 'stone' },
      { x: 1870, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 2820, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 3770, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 4720, y: 550, w: 900, h: 150, type: 'stone' },
      { x: 5720, y: 550, w: 900, h: 150, type: 'stone' },
      { x: 6720, y: 550, w: 900, h: 150, type: 'stone' },
      { x: 7720, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 8670, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 9620, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 10570, y: 550, w: 850, h: 150, type: 'stone' },
      { x: 11520, y: 550, w: 850, h: 150, type: 'stone' },
      // Grand Royal Throne Platform where Amor sits!
      { x: 12470, y: 550, w: 1030, h: 150, type: 'stone' },

      // High Royal Spires & Golden Balconies
      { x: 280, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 490, y: 340, w: 140, h: 24, type: 'stone' },
      { x: 710, y: 250, w: 150, h: 24, type: 'stone' },
      { x: 890, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 1100, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 1330, y: 340, w: 140, h: 24, type: 'moving', moveRange: 130, moveSpeed: 1.4, direction: 'horizontal' },
      { x: 1590, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 1810, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 2030, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 2260, y: 330, w: 140, h: 24, type: 'moving', moveRange: 90, moveSpeed: 1.2, direction: 'vertical' },
      { x: 2520, y: 240, w: 150, h: 24, type: 'stone' },
      { x: 2750, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 2980, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 3210, y: 340, w: 140, h: 24, type: 'stone' },
      { x: 3450, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 3700, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 3930, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 4160, y: 340, w: 140, h: 24, type: 'moving', moveRange: 140, moveSpeed: 1.4, direction: 'horizontal' },
      { x: 4420, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 4650, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 4900, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 5150, y: 340, w: 140, h: 24, type: 'moving', moveRange: 100, moveSpeed: 1.3, direction: 'vertical' },
      { x: 5410, y: 250, w: 150, h: 24, type: 'stone' },
      { x: 5650, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 5900, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 6150, y: 340, w: 140, h: 24, type: 'moving', moveRange: 130, moveSpeed: 1.4, direction: 'horizontal' },
      { x: 6410, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 6650, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 6900, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 7150, y: 340, w: 140, h: 24, type: 'moving', moveRange: 100, moveSpeed: 1.3, direction: 'vertical' },
      { x: 7410, y: 250, w: 150, h: 24, type: 'stone' },
      { x: 7650, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 7900, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 8140, y: 340, w: 140, h: 24, type: 'stone' },
      { x: 8390, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 8600, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 8850, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 9100, y: 340, w: 140, h: 24, type: 'moving', moveRange: 130, moveSpeed: 1.4, direction: 'horizontal' },
      { x: 9360, y: 250, w: 140, h: 24, type: 'stone' },
      { x: 9550, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 9800, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 10050, y: 340, w: 140, h: 24, type: 'moving', moveRange: 100, moveSpeed: 1.3, direction: 'vertical' },
      { x: 10310, y: 250, w: 150, h: 24, type: 'stone' },
      { x: 10500, y: 535, w: 46, h: 20, type: 'spring' },

      { x: 10750, y: 430, w: 140, h: 24, type: 'stone' },
      { x: 11000, y: 340, w: 140, h: 24, type: 'stone' },
      { x: 11250, y: 250, w: 150, h: 24, type: 'stone' },
      { x: 11450, y: 535, w: 46, h: 20, type: 'spring' },

      // Final staircase to the throne!
      { x: 11700, y: 440, w: 140, h: 24, type: 'stone' },
      { x: 11950, y: 370, w: 140, h: 24, type: 'stone' },
      { x: 12200, y: 300, w: 150, h: 24, type: 'stone' },
      { x: 12450, y: 230, w: 160, h: 24, type: 'stone' },
      { x: 12720, y: 350, w: 140, h: 24, type: 'stone' },
      { x: 12980, y: 450, w: 130, h: 24, type: 'stone' },
    ],
    enemies: [
      { id: 401, type: 'mushroom', x: 550, y: 520, w: 34, h: 32, vx: 1.3, minX: 420, maxX: 780, alive: true },
      { id: 402, type: 'mushroom', x: 1450, y: 520, w: 34, h: 32, vx: -1.4, minX: 1200, maxX: 1700, alive: true },
      { id: 403, type: 'mushroom', x: 2350, y: 520, w: 34, h: 32, vx: 1.3, minX: 2100, maxX: 2650, alive: true },
      { id: 404, type: 'mushroom', x: 3300, y: 520, w: 34, h: 32, vx: -1.3, minX: 3050, maxX: 3600, alive: true },
      { id: 405, type: 'mushroom', x: 4250, y: 520, w: 34, h: 32, vx: 1.4, minX: 4000, maxX: 4550, alive: true },
      { id: 406, type: 'mushroom', x: 5250, y: 520, w: 34, h: 32, vx: -1.3, minX: 5000, maxX: 5550, alive: true },
      { id: 407, type: 'mushroom', x: 6250, y: 520, w: 34, h: 32, vx: 1.4, minX: 6000, maxX: 6550, alive: true },
      { id: 408, type: 'mushroom', x: 7250, y: 520, w: 34, h: 32, vx: -1.3, minX: 7000, maxX: 7550, alive: true },
      { id: 409, type: 'mushroom', x: 8250, y: 520, w: 34, h: 32, vx: 1.4, minX: 8000, maxX: 8550, alive: true },
      { id: 410, type: 'mushroom', x: 9250, y: 520, w: 34, h: 32, vx: -1.3, minX: 9000, maxX: 9550, alive: true },
      { id: 411, type: 'mushroom', x: 10250, y: 520, w: 34, h: 32, vx: 1.4, minX: 10000, maxX: 10550, alive: true },
      { id: 412, type: 'mushroom', x: 11250, y: 520, w: 34, h: 32, vx: -1.3, minX: 11000, maxX: 11500, alive: true },
    ],
    rewards: [
      { id: 401, type: 'armor', x: 2520, y: 196, w: 34, h: 34, collected: false },
      { id: 402, type: 'chest', x: 3450, y: 206, w: 34, h: 30, collected: false },
      { id: 403, type: 'star', x: 5410, y: 206, w: 32, h: 32, collected: false },
      { id: 404, type: 'chest', x: 7410, y: 206, w: 34, h: 30, collected: false },
      { id: 405, type: 'shield', x: 9360, y: 206, w: 32, h: 32, collected: false },
      { id: 406, type: 'armor', x: 10310, y: 196, w: 34, h: 34, collected: false },
      { id: 407, type: 'chest', x: 12450, y: 186, w: 34, h: 30, collected: false }, // Grand Royal Chest before Throne!
    ],
    fruits: [
      { id: 401, type: 'apple', x: 710, y: 210, w: 26, h: 26, collected: false },
      { id: 402, type: 'banana', x: 1590, y: 210, w: 26, h: 26, collected: false },
      { id: 403, type: 'watermelon', x: 4420, y: 210, w: 28, h: 28, collected: false },
      { id: 404, type: 'banana', x: 8390, y: 210, w: 26, h: 26, collected: false },
      { id: 405, type: 'watermelon', x: 11250, y: 210, w: 28, h: 28, collected: false },
    ],
    hazards: [
      // Overhead and ground obstacles
      { x: 1200, y: 470, w: 200, h: 34, type: 'lowBeam', isOverhead: true },
      { x: 2100, y: 466, w: 210, h: 34, type: 'spikeCeiling', isOverhead: true },
      { x: 3100, y: 420, w: 40, h: 90, type: 'pendulum' },
      { x: 4050, y: 470, w: 220, h: 34, type: 'lowBeam', isOverhead: true },
      { x: 5050, y: 466, w: 210, h: 34, type: 'spikeCeiling', isOverhead: true },
      { x: 6050, y: 420, w: 40, h: 90, type: 'pendulum' },
      { x: 7050, y: 470, w: 220, h: 34, type: 'lowBeam', isOverhead: true },
      { x: 8050, y: 466, w: 210, h: 34, type: 'spikeCeiling', isOverhead: true },
      { x: 9050, y: 420, w: 40, h: 90, type: 'pendulum' },
      { x: 10050, y: 470, w: 220, h: 34, type: 'lowBeam', isOverhead: true },
      { x: 11050, y: 466, w: 210, h: 34, type: 'spikeCeiling', isOverhead: true },

      { x: 870, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 1790, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 2740, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 3690, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 4640, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 5640, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 6640, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 7640, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 8590, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 9540, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 10490, y: 536, w: 40, h: 16, type: 'slime' },
      { x: 11440, y: 536, w: 40, h: 16, type: 'slime' },
    ],
    hearts: [
      { id: 401, x: 280, y: 390, collected: false },
      { id: 402, x: 490, y: 300, collected: false },
      { id: 403, x: 710, y: 210, collected: false },
      { id: 404, x: 1250, y: 510, collected: false },
      { id: 405, x: 1590, y: 210, collected: false },
      { id: 406, x: 2150, y: 510, collected: false },
      { id: 407, x: 3210, y: 300, collected: false },
      { id: 408, x: 4120, y: 510, collected: false },
      { id: 409, x: 5120, y: 510, collected: false },
      { id: 410, x: 6150, y: 300, collected: false },
      { id: 411, x: 7120, y: 510, collected: false },
      { id: 412, x: 8140, y: 300, collected: false },
      { id: 413, x: 9100, y: 300, collected: false },
      { id: 414, x: 10120, y: 510, collected: false },
      { id: 415, x: 11100, y: 510, collected: false },
      { id: 416, x: 12200, y: 260, collected: false },
      { id: 417, x: 12720, y: 310, collected: false },
      { id: 418, x: 13100, y: 440, collected: false },
    ],
    sceneryElements: [
      { type: 'pillar', x: 200, y: 410 },
      { type: 'banner', x: 400, y: 300 },
      { type: 'pillar', x: 800, y: 410 },
      { type: 'banner', x: 1600, y: 300 },
      { type: 'pillar', x: 2600, y: 410 },
      { type: 'banner', x: 3600, y: 300 },
      { type: 'pillar', x: 4600, y: 410 },
      { type: 'banner', x: 5600, y: 300 },
      { type: 'pillar', x: 6600, y: 410 },
      { type: 'banner', x: 7600, y: 300 },
      { type: 'pillar', x: 8600, y: 410 },
      { type: 'banner', x: 9600, y: 300 },
      { type: 'pillar', x: 10600, y: 410 },
      { type: 'banner', x: 11600, y: 300 },
      { type: 'pillar', x: 12600, y: 410 },
      { type: 'banner', x: 13150, y: 290 },
    ],
  },

  // ==========================================
  // FASE 6 (MISSÃO 2 - FASE 1): A FLORESTA ENCANTADA DOS DOCES (~11,800px, ~2 min)
  // Tema Doce e Infantil: Árvores de algodão doce, pontes de marshmallow, caramelos e Teia Mágica!
  // ==========================================
  {
    id: 6,
    name: 'Fase 6: Floresta dos Doces',
    subtitle: 'Use a Teia Mágica nos orbes dourados para cruzar os abismos de calda doce!',
    theme: 'doces',
    mission: 2,
    hasWebPower: true,
    worldWidth: 11800,
    worldHeight: 600,
    playerStart: { x: 80, y: 420 },
    goal: { x: 11500, y: 420, w: 100, h: 100, label: 'Portal dos Cristais' },
    webAnchors: [
      { id: 601, x: 2650, y: 180, label: 'Orbe de Teia' },
      { id: 602, x: 5350, y: 170, label: 'Orbe de Teia' },
      { id: 603, x: 7950, y: 180, label: 'Orbe de Teia' },
      { id: 604, x: 10450, y: 170, label: 'Orbe de Teia' },
    ],
    platforms: [
      // Zona 1: Bosque dos Marshmallows (0 - 2,500px)
      { x: 0, y: 520, w: 2500, h: 80, type: 'candy' },
      { x: 400, y: 410, w: 220, h: 32, type: 'candy' },
      { x: 820, y: 320, w: 240, h: 32, type: 'candy' },
      { x: 1200, y: 240, w: 200, h: 32, type: 'moving', moveRange: 160, moveSpeed: 1.8, direction: 'horizontal' },
      { x: 1650, y: 380, w: 180, h: 32, type: 'candy' },
      { x: 2050, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 2200, y: 280, w: 240, h: 32, type: 'candy' },

      // ABISMO DE CALDA DOCE 1 (2,500px - 2,850px) - Travessia com Teia!
      // Plataforma de aterrissagem segura
      { x: 2800, y: 520, w: 2350, h: 80, type: 'candy' },
      { x: 3100, y: 400, w: 240, h: 32, type: 'candy' },
      { x: 3550, y: 310, w: 200, h: 32, type: 'moving', moveRange: 150, moveSpeed: 2.0, direction: 'vertical' },
      { x: 3950, y: 240, w: 240, h: 32, type: 'candy' },
      { x: 4400, y: 370, w: 220, h: 32, type: 'candy' },
      { x: 4850, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 5000, y: 290, w: 200, h: 32, type: 'candy' },

      // ABISMO DE CALDA DOCE 2 (5,150px - 5,550px) - Travessia com Teia!
      { x: 5500, y: 520, w: 2300, h: 80, type: 'candy' },
      { x: 5800, y: 400, w: 220, h: 32, type: 'candy' },
      { x: 6250, y: 300, w: 240, h: 32, type: 'moving', moveRange: 180, moveSpeed: 2.1, direction: 'horizontal' },
      { x: 6700, y: 220, w: 200, h: 32, type: 'candy' },
      { x: 7100, y: 350, w: 220, h: 32, type: 'candy' },
      { x: 7550, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 7700, y: 290, w: 180, h: 32, type: 'candy' },

      // ABISMO DE CALDA DOCE 3 (7,800px - 8,150px) - Travessia com Teia!
      { x: 8100, y: 520, w: 2200, h: 80, type: 'candy' },
      { x: 8400, y: 400, w: 240, h: 32, type: 'candy' },
      { x: 8850, y: 310, w: 200, h: 32, type: 'moving', moveRange: 160, moveSpeed: 2.2, direction: 'vertical' },
      { x: 9250, y: 230, w: 240, h: 32, type: 'candy' },
      { x: 9700, y: 360, w: 220, h: 32, type: 'candy' },
      { x: 10150, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 10280, y: 300, w: 180, h: 32, type: 'candy' },

      // ABISMO DE CALDA DOCE 4 (10,300px - 10,650px) - Travessia com Teia!
      { x: 10600, y: 520, w: 1200, h: 80, type: 'candy' },
      { x: 10850, y: 410, w: 240, h: 32, type: 'candy' },
      { x: 11200, y: 330, w: 220, h: 32, type: 'candy' },
    ],
    checkpoints: [
      { x: 2400, y: 440, reached: false },
      { x: 5050, y: 440, reached: false },
      { x: 7700, y: 440, reached: false },
      { x: 10250, y: 440, reached: false },
    ],
    hazards: [
      { x: 1100, y: 505, w: 70, h: 15, type: 'puddle' },
      { x: 1800, y: 260, w: 90, h: 26, type: 'lowBeam', isOverhead: true },
      { x: 3700, y: 505, w: 80, h: 15, type: 'puddle' },
      { x: 4200, y: 220, w: 100, h: 26, type: 'lowBeam', isOverhead: true },
      { x: 6500, y: 505, w: 80, h: 15, type: 'puddle' },
      { x: 6900, y: 200, w: 90, h: 26, type: 'lowBeam', isOverhead: true },
      { x: 8900, y: 505, w: 80, h: 15, type: 'puddle' },
      { x: 9450, y: 210, w: 100, h: 26, type: 'lowBeam', isOverhead: true },
    ],
    enemies: [
      { id: 601, type: 'mushroom', x: 650, y: 476, w: 44, h: 44, vx: 1.4, minX: 500, maxX: 800, alive: true },
      { id: 602, type: 'mushroom', x: 1450, y: 476, w: 44, h: 44, vx: -1.5, minX: 1300, maxX: 1650, alive: true },
      { id: 603, type: 'mushroom', x: 3350, y: 476, w: 44, h: 44, vx: 1.5, minX: 3200, maxX: 3550, alive: true },
      { id: 604, type: 'mushroom', x: 4600, y: 476, w: 44, h: 44, vx: -1.6, minX: 4450, maxX: 4800, alive: true },
      { id: 605, type: 'mushroom', x: 6050, y: 476, w: 44, h: 44, vx: 1.6, minX: 5900, maxX: 6300, alive: true },
      { id: 606, type: 'mushroom', x: 7350, y: 476, w: 44, h: 44, vx: -1.6, minX: 7200, maxX: 7550, alive: true },
      { id: 607, type: 'mushroom', x: 8650, y: 476, w: 44, h: 44, vx: 1.7, minX: 8500, maxX: 8900, alive: true },
      { id: 608, type: 'mushroom', x: 9950, y: 476, w: 44, h: 44, vx: -1.7, minX: 9800, maxX: 10200, alive: true },
    ],
    rewards: [
      { id: 601, x: 880, y: 265, w: 32, h: 32, type: 'star', collected: false },
      { id: 602, x: 2350, y: 220, w: 38, h: 36, type: 'chest', collected: false },
      { id: 603, x: 4100, y: 185, w: 32, h: 32, type: 'shield', collected: false },
      { id: 604, x: 4950, y: 235, w: 38, h: 36, type: 'chest', collected: false },
      { id: 605, x: 6850, y: 165, w: 32, h: 32, type: 'armor', collected: false },
      { id: 606, x: 7650, y: 235, w: 38, h: 36, type: 'chest', collected: false },
      { id: 607, x: 9400, y: 175, w: 32, h: 32, type: 'star', collected: false },
      { id: 608, x: 10200, y: 245, w: 38, h: 36, type: 'chest', collected: false },
    ],
    hearts: [
      { id: 601, x: 480, y: 350, collected: false },
      { id: 602, x: 940, y: 260, collected: false },
      { id: 603, x: 1300, y: 180, collected: false },
      { id: 604, x: 1720, y: 320, collected: false },
      { id: 605, x: 2300, y: 220, collected: false },
      { id: 606, x: 2650, y: 240, collected: false }, // No ar do abismo da teia!
      { id: 607, x: 3200, y: 340, collected: false },
      { id: 608, x: 4050, y: 180, collected: false },
      { id: 609, x: 4500, y: 310, collected: false },
      { id: 610, x: 5350, y: 230, collected: false }, // No ar do abismo da teia!
      { id: 611, x: 5900, y: 340, collected: false },
      { id: 612, x: 6800, y: 160, collected: false },
      { id: 613, x: 7950, y: 240, collected: false }, // No ar do abismo da teia!
      { id: 614, x: 8500, y: 340, collected: false },
      { id: 615, x: 9350, y: 170, collected: false },
      { id: 616, x: 10450, y: 230, collected: false }, // No ar do abismo da teia!
      { id: 617, x: 10950, y: 350, collected: false },
      { id: 618, x: 11300, y: 270, collected: false },
    ],
    sceneryElements: [
      { type: 'lollipop', x: 200, y: 440 },
      { type: 'candyCane', x: 600, y: 440 },
      { type: 'lollipop', x: 1100, y: 440 },
      { type: 'cloud', x: 1400, y: 100 },
      { type: 'candyCane', x: 1800, y: 440 },
      { type: 'lollipop', x: 3000, y: 440 },
      { type: 'candyCane', x: 3800, y: 440 },
      { type: 'cloud', x: 4200, y: 100 },
      { type: 'lollipop', x: 4700, y: 440 },
      { type: 'candyCane', x: 5700, y: 440 },
      { type: 'lollipop', x: 6500, y: 440 },
      { type: 'cloud', x: 7000, y: 100 },
      { type: 'candyCane', x: 7400, y: 440 },
      { type: 'lollipop', x: 8300, y: 440 },
      { type: 'candyCane', x: 9100, y: 440 },
      { type: 'cloud', x: 9600, y: 100 },
      { type: 'lollipop', x: 10000, y: 440 },
      { type: 'candyCane', x: 10900, y: 440 },
      { type: 'lollipop', x: 11400, y: 440 },
    ],
  },

  // ==========================================
  // FASE 7 (MISSÃO 2 - FASE 2): O VALE DOS CRISTAIS ARCO-ÍRIS (~12,200px, ~2 min)
  // Tema Caverna de Cristais e Gemas reluzentes, abismos profundos e teias luminosas
  // ==========================================
  {
    id: 7,
    name: 'Fase 7: Vale dos Cristais',
    subtitle: 'Dispare teias nos cristais suspensos para cruzar as grandes fendas iluminadas!',
    theme: 'cristais',
    mission: 2,
    hasWebPower: true,
    worldWidth: 12200,
    worldHeight: 600,
    playerStart: { x: 80, y: 420 },
    goal: { x: 11900, y: 420, w: 100, h: 100, label: 'Portal das Nuvens' },
    webAnchors: [
      { id: 701, x: 2600, y: 170, label: 'Cristal de Teia' },
      { id: 702, x: 5100, y: 170, label: 'Cristal de Teia' },
      { id: 703, x: 7600, y: 180, label: 'Cristal de Teia' },
      { id: 704, x: 10100, y: 170, label: 'Cristal de Teia' },
    ],
    platforms: [
      { x: 0, y: 520, w: 2450, h: 80, type: 'crystal' },
      { x: 420, y: 400, w: 220, h: 32, type: 'crystal' },
      { x: 850, y: 310, w: 240, h: 32, type: 'crystal' },
      { x: 1250, y: 230, w: 200, h: 32, type: 'moving', moveRange: 160, moveSpeed: 2.0, direction: 'horizontal' },
      { x: 1700, y: 370, w: 180, h: 32, type: 'crystal' },
      { x: 2100, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 2250, y: 280, w: 200, h: 32, type: 'crystal' },

      // ABISMO DE CRISTAL 1 (2,450px - 2,800px)
      { x: 2750, y: 520, w: 2200, h: 80, type: 'crystal' },
      { x: 3050, y: 390, w: 240, h: 32, type: 'crystal' },
      { x: 3500, y: 300, w: 200, h: 32, type: 'moving', moveRange: 150, moveSpeed: 2.1, direction: 'vertical' },
      { x: 3900, y: 220, w: 240, h: 32, type: 'crystal' },
      { x: 4350, y: 360, w: 220, h: 32, type: 'crystal' },
      { x: 4750, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 4900, y: 290, w: 180, h: 32, type: 'crystal' },

      // ABISMO DE CRISTAL 2 (4,950px - 5,300px)
      { x: 5250, y: 520, w: 2200, h: 80, type: 'crystal' },
      { x: 5550, y: 400, w: 220, h: 32, type: 'crystal' },
      { x: 6000, y: 300, w: 240, h: 32, type: 'moving', moveRange: 180, moveSpeed: 2.2, direction: 'horizontal' },
      { x: 6450, y: 220, w: 200, h: 32, type: 'crystal' },
      { x: 6850, y: 350, w: 220, h: 32, type: 'crystal' },
      { x: 7250, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 7400, y: 290, w: 180, h: 32, type: 'crystal' },

      // ABISMO DE CRISTAL 3 (7,450px - 7,800px)
      { x: 7750, y: 520, w: 2200, h: 80, type: 'crystal' },
      { x: 8050, y: 390, w: 240, h: 32, type: 'crystal' },
      { x: 8500, y: 300, w: 200, h: 32, type: 'moving', moveRange: 160, moveSpeed: 2.3, direction: 'vertical' },
      { x: 8900, y: 220, w: 240, h: 32, type: 'crystal' },
      { x: 9350, y: 360, w: 220, h: 32, type: 'crystal' },
      { x: 9750, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 9900, y: 290, w: 180, h: 32, type: 'crystal' },

      // ABISMO DE CRISTAL 4 (9,950px - 10,300px)
      { x: 10250, y: 520, w: 1950, h: 80, type: 'crystal' },
      { x: 10550, y: 400, w: 240, h: 32, type: 'crystal' },
      { x: 11000, y: 310, w: 220, h: 32, type: 'crystal' },
      { x: 11450, y: 230, w: 200, h: 32, type: 'crystal' },
    ],
    checkpoints: [
      { x: 2350, y: 440, reached: false },
      { x: 4850, y: 440, reached: false },
      { x: 7350, y: 440, reached: false },
      { x: 9850, y: 440, reached: false },
    ],
    hazards: [
      { x: 1050, y: 505, w: 70, h: 15, type: 'spark' },
      { x: 1850, y: 250, w: 90, h: 26, type: 'lowBeam', isOverhead: true },
      { x: 3600, y: 505, w: 80, h: 15, type: 'spark' },
      { x: 4150, y: 200, w: 100, h: 26, type: 'lowBeam', isOverhead: true },
      { x: 6100, y: 505, w: 80, h: 15, type: 'spark' },
      { x: 6650, y: 200, w: 90, h: 26, type: 'lowBeam', isOverhead: true },
      { x: 8600, y: 505, w: 80, h: 15, type: 'spark' },
      { x: 9150, y: 200, w: 100, h: 26, type: 'lowBeam', isOverhead: true },
    ],
    enemies: [
      { id: 701, type: 'mushroom', x: 600, y: 476, w: 44, h: 44, vx: 1.5, minX: 450, maxX: 750, alive: true },
      { id: 702, type: 'mushroom', x: 1500, y: 476, w: 44, h: 44, vx: -1.6, minX: 1350, maxX: 1700, alive: true },
      { id: 703, type: 'mushroom', x: 3300, y: 476, w: 44, h: 44, vx: 1.6, minX: 3150, maxX: 3500, alive: true },
      { id: 704, type: 'mushroom', x: 4500, y: 476, w: 44, h: 44, vx: -1.7, minX: 4350, maxX: 4700, alive: true },
      { id: 705, type: 'mushroom', x: 5800, y: 476, w: 44, h: 44, vx: 1.7, minX: 5650, maxX: 6000, alive: true },
      { id: 706, type: 'mushroom', x: 7100, y: 476, w: 44, h: 44, vx: -1.7, minX: 6950, maxX: 7300, alive: true },
      { id: 707, type: 'mushroom', x: 8300, y: 476, w: 44, h: 44, vx: 1.8, minX: 8150, maxX: 8500, alive: true },
      { id: 708, type: 'mushroom', x: 9600, y: 476, w: 44, h: 44, vx: -1.8, minX: 9450, maxX: 9800, alive: true },
    ],
    rewards: [
      { id: 701, x: 920, y: 255, w: 32, h: 32, type: 'star', collected: false },
      { id: 702, x: 2300, y: 220, w: 38, h: 36, type: 'chest', collected: false },
      { id: 703, x: 4050, y: 165, w: 32, h: 32, type: 'shield', collected: false },
      { id: 704, x: 4850, y: 235, w: 38, h: 36, type: 'chest', collected: false },
      { id: 705, x: 6600, y: 165, w: 32, h: 32, type: 'armor', collected: false },
      { id: 706, x: 7350, y: 235, w: 38, h: 36, type: 'chest', collected: false },
      { id: 707, x: 9050, y: 165, w: 32, h: 32, type: 'star', collected: false },
      { id: 708, x: 9850, y: 235, w: 38, h: 36, type: 'chest', collected: false },
    ],
    hearts: [
      { id: 701, x: 500, y: 340, collected: false },
      { id: 702, x: 980, y: 250, collected: false },
      { id: 703, x: 1350, y: 170, collected: false },
      { id: 704, x: 1780, y: 310, collected: false },
      { id: 705, x: 2600, y: 230, collected: false }, // No ar do abismo de teia!
      { id: 706, x: 3150, y: 330, collected: false },
      { id: 707, x: 4000, y: 160, collected: false },
      { id: 708, x: 4450, y: 300, collected: false },
      { id: 709, x: 5100, y: 230, collected: false }, // No ar do abismo de teia!
      { id: 710, x: 5650, y: 340, collected: false },
      { id: 711, x: 6550, y: 160, collected: false },
      { id: 712, x: 7600, y: 240, collected: false }, // No ar do abismo de teia!
      { id: 713, x: 8150, y: 330, collected: false },
      { id: 714, x: 9000, y: 160, collected: false },
      { id: 715, x: 10100, y: 230, collected: false }, // No ar do abismo de teia!
      { id: 716, x: 10650, y: 340, collected: false },
      { id: 717, x: 11100, y: 250, collected: false },
      { id: 718, x: 11550, y: 170, collected: false },
    ],
    sceneryElements: [
      { type: 'giantCrystal', x: 250, y: 440 },
      { type: 'giantCrystal', x: 700, y: 440 },
      { type: 'giantCrystal', x: 1150, y: 440 },
      { type: 'giantCrystal', x: 1650, y: 440 },
      { type: 'giantCrystal', x: 3100, y: 440 },
      { type: 'giantCrystal', x: 3750, y: 440 },
      { type: 'giantCrystal', x: 4450, y: 440 },
      { type: 'giantCrystal', x: 5650, y: 440 },
      { type: 'giantCrystal', x: 6300, y: 440 },
      { type: 'giantCrystal', x: 7150, y: 440 },
      { type: 'giantCrystal', x: 8150, y: 440 },
      { type: 'giantCrystal', x: 8900, y: 440 },
      { type: 'giantCrystal', x: 9600, y: 440 },
      { type: 'giantCrystal', x: 10650, y: 440 },
      { type: 'giantCrystal', x: 11400, y: 440 },
    ],
  },

  // ==========================================
  // FASE 8 (MISSÃO 2 - FASE 3): O REINO DAS NUVENS E BALÕES (~12,500px, ~2 min)
  // Tema Céu Aberto, Ilhas de Algodão, Balões e Vãos Celestes
  // ==========================================
  {
    id: 8,
    name: 'Fase 8: Reino das Nuvens',
    subtitle: 'Salte entre ilhas flutuantes e ancore suas teias em balões celestes!',
    theme: 'nuvens',
    mission: 2,
    hasWebPower: true,
    worldWidth: 12500,
    worldHeight: 600,
    playerStart: { x: 80, y: 420 },
    goal: { x: 12200, y: 420, w: 100, h: 100, label: 'Portal dos Brinquedos' },
    webAnchors: [
      { id: 801, x: 2500, y: 160, label: 'Balão de Teia' },
      { id: 802, x: 5000, y: 160, label: 'Balão de Teia' },
      { id: 803, x: 7500, y: 160, label: 'Balão de Teia' },
      { id: 804, x: 10000, y: 160, label: 'Balão de Teia' },
      { id: 805, x: 11500, y: 160, label: 'Balão de Teia' },
    ],
    platforms: [
      { x: 0, y: 520, w: 2350, h: 80, type: 'cloud' },
      { x: 400, y: 390, w: 240, h: 32, type: 'cloud' },
      { x: 820, y: 290, w: 220, h: 32, type: 'cloud' },
      { x: 1200, y: 210, w: 200, h: 32, type: 'moving', moveRange: 160, moveSpeed: 2.0, direction: 'horizontal' },
      { x: 1650, y: 350, w: 200, h: 32, type: 'cloud' },
      { x: 2050, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 2200, y: 270, w: 180, h: 32, type: 'cloud' },

      // ABISMO CELESTIAL 1 (2,350px - 2,750px)
      { x: 2700, y: 520, w: 2150, h: 80, type: 'cloud' },
      { x: 3000, y: 390, w: 240, h: 32, type: 'cloud' },
      { x: 3450, y: 290, w: 200, h: 32, type: 'moving', moveRange: 160, moveSpeed: 2.1, direction: 'vertical' },
      { x: 3850, y: 210, w: 240, h: 32, type: 'cloud' },
      { x: 4300, y: 350, w: 220, h: 32, type: 'cloud' },
      { x: 4700, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 4850, y: 270, w: 180, h: 32, type: 'cloud' },

      // ABISMO CELESTIAL 2 (4,850px - 5,250px)
      { x: 5200, y: 520, w: 2150, h: 80, type: 'cloud' },
      { x: 5500, y: 390, w: 240, h: 32, type: 'cloud' },
      { x: 5950, y: 290, w: 200, h: 32, type: 'moving', moveRange: 180, moveSpeed: 2.2, direction: 'horizontal' },
      { x: 6350, y: 210, w: 240, h: 32, type: 'cloud' },
      { x: 6800, y: 350, w: 220, h: 32, type: 'cloud' },
      { x: 7200, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 7350, y: 270, w: 180, h: 32, type: 'cloud' },

      // ABISMO CELESTIAL 3 (7,350px - 7,750px)
      { x: 7700, y: 520, w: 2150, h: 80, type: 'cloud' },
      { x: 8000, y: 390, w: 240, h: 32, type: 'cloud' },
      { x: 8450, y: 290, w: 200, h: 32, type: 'moving', moveRange: 160, moveSpeed: 2.3, direction: 'vertical' },
      { x: 8850, y: 210, w: 240, h: 32, type: 'cloud' },
      { x: 9300, y: 350, w: 220, h: 32, type: 'cloud' },
      { x: 9700, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 9850, y: 270, w: 180, h: 32, type: 'cloud' },

      // ABISMO CELESTIAL 4 (9,850px - 10,250px)
      { x: 10200, y: 520, w: 2300, h: 80, type: 'cloud' },
      { x: 10500, y: 390, w: 240, h: 32, type: 'cloud' },
      { x: 10950, y: 290, w: 220, h: 32, type: 'cloud' },
      { x: 11400, y: 210, w: 200, h: 32, type: 'moving', moveRange: 160, moveSpeed: 2.3, direction: 'horizontal' },
      { x: 11800, y: 330, w: 240, h: 32, type: 'cloud' },
    ],
    checkpoints: [
      { x: 2300, y: 440, reached: false },
      { x: 4800, y: 440, reached: false },
      { x: 7300, y: 440, reached: false },
      { x: 9800, y: 440, reached: false },
      { x: 11300, y: 440, reached: false },
    ],
    hazards: [
      { x: 1000, y: 505, w: 70, h: 15, type: 'spark' },
      { x: 1750, y: 230, w: 90, h: 26, type: 'lowBeam', isOverhead: true },
      { x: 3500, y: 505, w: 80, h: 15, type: 'spark' },
      { x: 4100, y: 190, w: 100, h: 26, type: 'lowBeam', isOverhead: true },
      { x: 6000, y: 505, w: 80, h: 15, type: 'spark' },
      { x: 6600, y: 190, w: 90, h: 26, type: 'lowBeam', isOverhead: true },
      { x: 8500, y: 505, w: 80, h: 15, type: 'spark' },
      { x: 9100, y: 190, w: 100, h: 26, type: 'lowBeam', isOverhead: true },
    ],
    enemies: [
      { id: 801, type: 'mushroom', x: 650, y: 476, w: 44, h: 44, vx: 1.6, minX: 500, maxX: 800, alive: true },
      { id: 802, type: 'mushroom', x: 1500, y: 476, w: 44, h: 44, vx: -1.6, minX: 1350, maxX: 1680, alive: true },
      { id: 803, type: 'mushroom', x: 3250, y: 476, w: 44, h: 44, vx: 1.7, minX: 3100, maxX: 3450, alive: true },
      { id: 804, type: 'mushroom', x: 4450, y: 476, w: 44, h: 44, vx: -1.7, minX: 4300, maxX: 4650, alive: true },
      { id: 805, type: 'mushroom', x: 5750, y: 476, w: 44, h: 44, vx: 1.8, minX: 5600, maxX: 5950, alive: true },
      { id: 806, type: 'mushroom', x: 7050, y: 476, w: 44, h: 44, vx: -1.8, minX: 6900, maxX: 7250, alive: true },
      { id: 807, type: 'mushroom', x: 8250, y: 476, w: 44, h: 44, vx: 1.8, minX: 8100, maxX: 8450, alive: true },
      { id: 808, type: 'mushroom', x: 9550, y: 476, w: 44, h: 44, vx: -1.8, minX: 9400, maxX: 9750, alive: true },
    ],
    rewards: [
      { id: 801, x: 880, y: 235, w: 32, h: 32, type: 'star', collected: false },
      { id: 802, x: 2250, y: 210, w: 38, h: 36, type: 'chest', collected: false },
      { id: 803, x: 4000, y: 155, w: 32, h: 32, type: 'shield', collected: false },
      { id: 804, x: 4800, y: 215, w: 38, h: 36, type: 'chest', collected: false },
      { id: 805, x: 6500, y: 155, w: 32, h: 32, type: 'armor', collected: false },
      { id: 806, x: 7300, y: 215, w: 38, h: 36, type: 'chest', collected: false },
      { id: 807, x: 9000, y: 155, w: 32, h: 32, type: 'star', collected: false },
      { id: 808, x: 9800, y: 215, w: 38, h: 36, type: 'chest', collected: false },
    ],
    hearts: [
      { id: 801, x: 480, y: 330, collected: false },
      { id: 802, x: 940, y: 230, collected: false },
      { id: 803, x: 1300, y: 150, collected: false },
      { id: 804, x: 1720, y: 290, collected: false },
      { id: 805, x: 2500, y: 220, collected: false }, // No ar do abismo de teia!
      { id: 806, x: 3100, y: 330, collected: false },
      { id: 807, x: 3950, y: 150, collected: false },
      { id: 808, x: 4400, y: 290, collected: false },
      { id: 809, x: 5000, y: 220, collected: false }, // No ar do abismo de teia!
      { id: 810, x: 5600, y: 330, collected: false },
      { id: 811, x: 6450, y: 150, collected: false },
      { id: 812, x: 7500, y: 220, collected: false }, // No ar do abismo de teia!
      { id: 813, x: 8100, y: 330, collected: false },
      { id: 814, x: 8950, y: 150, collected: false },
      { id: 815, x: 10000, y: 220, collected: false }, // No ar do abismo de teia!
      { id: 816, x: 10600, y: 330, collected: false },
      { id: 817, x: 11500, y: 220, collected: false }, // No ar do abismo de teia!
      { id: 818, x: 11900, y: 270, collected: false },
    ],
    sceneryElements: [
      { type: 'balloon', x: 250, y: 200 },
      { type: 'cloud', x: 600, y: 120 },
      { type: 'balloon', x: 1100, y: 180 },
      { type: 'cloud', x: 1600, y: 100 },
      { type: 'balloon', x: 3100, y: 190 },
      { type: 'cloud', x: 3800, y: 110 },
      { type: 'balloon', x: 4400, y: 180 },
      { type: 'cloud', x: 5500, y: 100 },
      { type: 'balloon', x: 6200, y: 190 },
      { type: 'cloud', x: 6900, y: 110 },
      { type: 'balloon', x: 8200, y: 180 },
      { type: 'cloud', x: 8900, y: 100 },
      { type: 'balloon', x: 9500, y: 190 },
      { type: 'cloud', x: 10600, y: 110 },
      { type: 'balloon', x: 11700, y: 180 },
    ],
  },

  // ==========================================
  // FASE 9 (MISSÃO 2 - FASE 4): A FÁBRICA DE BRINQUEDOS MÁGICOS (~13,000px, ~2 min)
  // Tema Blocos de montar, engrenagens coloridas, esteiras e Teia em anéis giratórios
  // ==========================================
  {
    id: 9,
    name: 'Fase 9: Fábrica de Brinquedos',
    subtitle: 'Aventure-se por engrenagens coloridas e balance na teia sobre blocos gigantes!',
    theme: 'brinquedos',
    mission: 2,
    hasWebPower: true,
    worldWidth: 13000,
    worldHeight: 600,
    playerStart: { x: 80, y: 420 },
    goal: { x: 12700, y: 420, w: 100, h: 100, label: 'Portal do Palácio de Neve' },
    webAnchors: [
      { id: 901, x: 2550, y: 170, label: 'Argola de Teia' },
      { id: 902, x: 5100, y: 160, label: 'Argola de Teia' },
      { id: 903, x: 7600, y: 170, label: 'Argola de Teia' },
      { id: 904, x: 10100, y: 160, label: 'Argola de Teia' },
      { id: 905, x: 11800, y: 170, label: 'Argola de Teia' },
    ],
    platforms: [
      { x: 0, y: 520, w: 2400, h: 80, type: 'toy' },
      { x: 420, y: 400, w: 240, h: 32, type: 'toy' },
      { x: 850, y: 300, w: 220, h: 32, type: 'toy' },
      { x: 1250, y: 220, w: 200, h: 32, type: 'moving', moveRange: 160, moveSpeed: 2.1, direction: 'horizontal' },
      { x: 1700, y: 360, w: 200, h: 32, type: 'toy' },
      { x: 2100, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 2250, y: 280, w: 180, h: 32, type: 'toy' },

      // ABISMO DE BRINQUEDO 1 (2,400px - 2,800px)
      { x: 2750, y: 520, w: 2200, h: 80, type: 'toy' },
      { x: 3050, y: 390, w: 240, h: 32, type: 'toy' },
      { x: 3500, y: 290, w: 200, h: 32, type: 'moving', moveRange: 160, moveSpeed: 2.2, direction: 'vertical' },
      { x: 3900, y: 210, w: 240, h: 32, type: 'toy' },
      { x: 4350, y: 350, w: 220, h: 32, type: 'toy' },
      { x: 4750, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 4900, y: 270, w: 180, h: 32, type: 'toy' },

      // ABISMO DE BRINQUEDO 2 (4,950px - 5,350px)
      { x: 5300, y: 520, w: 2150, h: 80, type: 'toy' },
      { x: 5600, y: 390, w: 240, h: 32, type: 'toy' },
      { x: 6050, y: 290, w: 200, h: 32, type: 'moving', moveRange: 180, moveSpeed: 2.2, direction: 'horizontal' },
      { x: 6450, y: 210, w: 240, h: 32, type: 'toy' },
      { x: 6900, y: 350, w: 220, h: 32, type: 'toy' },
      { x: 7300, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 7450, y: 270, w: 180, h: 32, type: 'toy' },

      // ABISMO DE BRINQUEDO 3 (7,450px - 7,850px)
      { x: 7800, y: 520, w: 2150, h: 80, type: 'toy' },
      { x: 8100, y: 390, w: 240, h: 32, type: 'toy' },
      { x: 8550, y: 290, w: 200, h: 32, type: 'moving', moveRange: 160, moveSpeed: 2.3, direction: 'vertical' },
      { x: 8950, y: 210, w: 240, h: 32, type: 'toy' },
      { x: 9400, y: 350, w: 220, h: 32, type: 'toy' },
      { x: 9800, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 9950, y: 270, w: 180, h: 32, type: 'toy' },

      // ABISMO DE BRINQUEDO 4 (9,950px - 10,350px)
      { x: 10300, y: 520, w: 2700, h: 80, type: 'toy' },
      { x: 10600, y: 390, w: 240, h: 32, type: 'toy' },
      { x: 11050, y: 290, w: 220, h: 32, type: 'toy' },
      { x: 11500, y: 210, w: 200, h: 32, type: 'moving', moveRange: 160, moveSpeed: 2.3, direction: 'horizontal' },
      { x: 12100, y: 330, w: 240, h: 32, type: 'toy' },
    ],
    checkpoints: [
      { x: 2350, y: 440, reached: false },
      { x: 4850, y: 440, reached: false },
      { x: 7350, y: 440, reached: false },
      { x: 9850, y: 440, reached: false },
      { x: 11600, y: 440, reached: false },
    ],
    hazards: [
      { x: 1050, y: 505, w: 70, h: 15, type: 'puddle' },
      { x: 1800, y: 240, w: 90, h: 26, type: 'lowBeam', isOverhead: true },
      { x: 3600, y: 505, w: 80, h: 15, type: 'puddle' },
      { x: 4150, y: 190, w: 100, h: 26, type: 'lowBeam', isOverhead: true },
      { x: 6100, y: 505, w: 80, h: 15, type: 'puddle' },
      { x: 6700, y: 190, w: 90, h: 26, type: 'lowBeam', isOverhead: true },
      { x: 8600, y: 505, w: 80, h: 15, type: 'puddle' },
      { x: 9200, y: 190, w: 100, h: 26, type: 'lowBeam', isOverhead: true },
    ],
    enemies: [
      { id: 901, type: 'mushroom', x: 650, y: 476, w: 44, h: 44, vx: 1.6, minX: 500, maxX: 800, alive: true },
      { id: 902, type: 'mushroom', x: 1500, y: 476, w: 44, h: 44, vx: -1.7, minX: 1350, maxX: 1680, alive: true },
      { id: 903, type: 'mushroom', x: 3300, y: 476, w: 44, h: 44, vx: 1.7, minX: 3150, maxX: 3500, alive: true },
      { id: 904, type: 'mushroom', x: 4500, y: 476, w: 44, h: 44, vx: -1.7, minX: 4350, maxX: 4700, alive: true },
      { id: 905, type: 'mushroom', x: 5800, y: 476, w: 44, h: 44, vx: 1.8, minX: 5650, maxX: 6000, alive: true },
      { id: 906, type: 'mushroom', x: 7100, y: 476, w: 44, h: 44, vx: -1.8, minX: 6950, maxX: 7300, alive: true },
      { id: 907, type: 'mushroom', x: 8300, y: 476, w: 44, h: 44, vx: 1.8, minX: 8150, maxX: 8500, alive: true },
      { id: 908, type: 'mushroom', x: 9600, y: 476, w: 44, h: 44, vx: -1.8, minX: 9450, maxX: 9800, alive: true },
    ],
    rewards: [
      { id: 901, x: 900, y: 245, w: 32, h: 32, type: 'star', collected: false },
      { id: 902, x: 2300, y: 220, w: 38, h: 36, type: 'chest', collected: false },
      { id: 903, x: 4050, y: 155, w: 32, h: 32, type: 'shield', collected: false },
      { id: 904, x: 4850, y: 215, w: 38, h: 36, type: 'chest', collected: false },
      { id: 905, x: 6600, y: 155, w: 32, h: 32, type: 'armor', collected: false },
      { id: 906, x: 7400, y: 215, w: 38, h: 36, type: 'chest', collected: false },
      { id: 907, x: 9100, y: 155, w: 32, h: 32, type: 'star', collected: false },
      { id: 908, x: 9900, y: 215, w: 38, h: 36, type: 'chest', collected: false },
    ],
    hearts: [
      { id: 901, x: 500, y: 340, collected: false },
      { id: 902, x: 980, y: 240, collected: false },
      { id: 903, x: 1350, y: 160, collected: false },
      { id: 904, x: 1780, y: 300, collected: false },
      { id: 905, x: 2550, y: 230, collected: false }, // No ar do abismo de teia!
      { id: 906, x: 3150, y: 330, collected: false },
      { id: 907, x: 4000, y: 150, collected: false },
      { id: 908, x: 4450, y: 290, collected: false },
      { id: 909, x: 5100, y: 220, collected: false }, // No ar do abismo de teia!
      { id: 910, x: 5700, y: 330, collected: false },
      { id: 911, x: 6550, y: 150, collected: false },
      { id: 912, x: 7600, y: 230, collected: false }, // No ar do abismo de teia!
      { id: 913, x: 8200, y: 330, collected: false },
      { id: 914, x: 9050, y: 150, collected: false },
      { id: 915, x: 10100, y: 220, collected: false }, // No ar do abismo de teia!
      { id: 916, x: 10700, y: 330, collected: false },
      { id: 917, x: 11800, y: 230, collected: false }, // No ar do abismo de teia!
      { id: 918, x: 12200, y: 270, collected: false },
    ],
    sceneryElements: [
      { type: 'toyBlock', x: 250, y: 450 },
      { type: 'toyBlock', x: 750, y: 450 },
      { type: 'toyBlock', x: 1300, y: 450 },
      { type: 'toyBlock', x: 1850, y: 450 },
      { type: 'toyBlock', x: 3200, y: 450 },
      { type: 'toyBlock', x: 3950, y: 450 },
      { type: 'toyBlock', x: 4600, y: 450 },
      { type: 'toyBlock', x: 5750, y: 450 },
      { type: 'toyBlock', x: 6500, y: 450 },
      { type: 'toyBlock', x: 7250, y: 450 },
      { type: 'toyBlock', x: 8350, y: 450 },
      { type: 'toyBlock', x: 9100, y: 450 },
      { type: 'toyBlock', x: 9800, y: 450 },
      { type: 'toyBlock', x: 10800, y: 450 },
      { type: 'toyBlock', x: 11950, y: 450 },
    ],
  },

  // ==========================================
  // FASE 10 (MISSÃO 2 - FASE 5 - FINAL): O PALÁCIO DE NEVE E ALGODÃO (~13,500px, ~2 min)
  // O Grande Encontro: Theo Lucca resgata o URSINHO CARINHO no Trono de Neve!
  // ==========================================
  {
    id: 10,
    name: 'Fase 10: Palácio de Neve',
    subtitle: 'Supere o Grande Abismo de Gelo com a Teia Mágica para resgatar o Ursinho Carinho!',
    theme: 'neve',
    mission: 2,
    rescueTarget: 'carinho',
    hasWebPower: true,
    worldWidth: 13500,
    worldHeight: 600,
    playerStart: { x: 80, y: 420 },
    goal: { x: 13260, y: 440, w: 90, h: 90, label: 'Ursinho Carinho!' },
    webAnchors: [
      { id: 1001, x: 2600, y: 170, label: 'Estrela de Neve' },
      { id: 1002, x: 5200, y: 160, label: 'Estrela de Neve' },
      { id: 1003, x: 7800, y: 170, label: 'Estrela de Neve' },
      { id: 1004, x: 10400, y: 160, label: 'Estrela de Neve' },
      { id: 1005, x: 12400, y: 170, label: 'Estrela de Neve' },
    ],
    platforms: [
      { x: 0, y: 520, w: 2450, h: 80, type: 'ice' },
      { x: 420, y: 400, w: 240, h: 32, type: 'ice' },
      { x: 850, y: 300, w: 220, h: 32, type: 'ice' },
      { x: 1250, y: 220, w: 200, h: 32, type: 'moving', moveRange: 160, moveSpeed: 2.1, direction: 'horizontal' },
      { x: 1700, y: 360, w: 200, h: 32, type: 'ice' },
      { x: 2100, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 2250, y: 280, w: 180, h: 32, type: 'ice' },

      // GRANDE ABISMO DE GELO 1 (2,450px - 2,850px)
      { x: 2800, y: 520, w: 2250, h: 80, type: 'ice' },
      { x: 3100, y: 390, w: 240, h: 32, type: 'ice' },
      { x: 3550, y: 290, w: 200, h: 32, type: 'moving', moveRange: 160, moveSpeed: 2.2, direction: 'vertical' },
      { x: 3950, y: 210, w: 240, h: 32, type: 'ice' },
      { x: 4400, y: 350, w: 220, h: 32, type: 'ice' },
      { x: 4800, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 4950, y: 270, w: 180, h: 32, type: 'ice' },

      // GRANDE ABISMO DE GELO 2 (5,050px - 5,450px)
      { x: 5400, y: 520, w: 2250, h: 80, type: 'ice' },
      { x: 5700, y: 390, w: 240, h: 32, type: 'ice' },
      { x: 6150, y: 290, w: 200, h: 32, type: 'moving', moveRange: 180, moveSpeed: 2.2, direction: 'horizontal' },
      { x: 6550, y: 210, w: 240, h: 32, type: 'ice' },
      { x: 7000, y: 350, w: 220, h: 32, type: 'ice' },
      { x: 7400, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 7550, y: 270, w: 180, h: 32, type: 'ice' },

      // GRANDE ABISMO DE GELO 3 (7,650px - 8,050px)
      { x: 8000, y: 520, w: 2250, h: 80, type: 'ice' },
      { x: 8300, y: 390, w: 240, h: 32, type: 'ice' },
      { x: 8750, y: 290, w: 200, h: 32, type: 'moving', moveRange: 160, moveSpeed: 2.3, direction: 'vertical' },
      { x: 9150, y: 210, w: 240, h: 32, type: 'ice' },
      { x: 9600, y: 350, w: 220, h: 32, type: 'ice' },
      { x: 10000, y: 430, w: 80, h: 26, type: 'spring' },
      { x: 10150, y: 270, w: 180, h: 32, type: 'ice' },

      // GRANDE ABISMO DE GELO 4 (10,250px - 10,650px)
      { x: 10600, y: 520, w: 2900, h: 80, type: 'ice' },
      { x: 10900, y: 390, w: 240, h: 32, type: 'ice' },
      { x: 11350, y: 290, w: 220, h: 32, type: 'ice' },
      { x: 11800, y: 210, w: 200, h: 32, type: 'moving', moveRange: 160, moveSpeed: 2.3, direction: 'horizontal' },
      { x: 12500, y: 330, w: 240, h: 32, type: 'ice' },
      // O Trono Real de Neve e Algodão (onde o Ursinho Carinho espera!)
      { x: 13150, y: 500, w: 350, h: 100, type: 'ice' },
    ],
    checkpoints: [
      { x: 2400, y: 440, reached: false },
      { x: 4950, y: 440, reached: false },
      { x: 7550, y: 440, reached: false },
      { x: 10150, y: 440, reached: false },
      { x: 12200, y: 440, reached: false },
    ],
    hazards: [
      { x: 1050, y: 505, w: 70, h: 15, type: 'spark' },
      { x: 1800, y: 240, w: 90, h: 26, type: 'lowBeam', isOverhead: true },
      { x: 3600, y: 505, w: 80, h: 15, type: 'spark' },
      { x: 4150, y: 190, w: 100, h: 26, type: 'lowBeam', isOverhead: true },
      { x: 6100, y: 505, w: 80, h: 15, type: 'spark' },
      { x: 6700, y: 190, w: 90, h: 26, type: 'lowBeam', isOverhead: true },
      { x: 8600, y: 505, w: 80, h: 15, type: 'spark' },
      { x: 9200, y: 190, w: 100, h: 26, type: 'lowBeam', isOverhead: true },
    ],
    enemies: [
      { id: 1001, type: 'mushroom', x: 650, y: 476, w: 44, h: 44, vx: 1.6, minX: 500, maxX: 800, alive: true },
      { id: 1002, type: 'mushroom', x: 1500, y: 476, w: 44, h: 44, vx: -1.7, minX: 1350, maxX: 1680, alive: true },
      { id: 1003, type: 'mushroom', x: 3300, y: 476, w: 44, h: 44, vx: 1.7, minX: 3150, maxX: 3500, alive: true },
      { id: 1004, type: 'mushroom', x: 4500, y: 476, w: 44, h: 44, vx: -1.7, minX: 4350, maxX: 4700, alive: true },
      { id: 1005, type: 'mushroom', x: 5800, y: 476, w: 44, h: 44, vx: 1.8, minX: 5650, maxX: 6000, alive: true },
      { id: 1006, type: 'mushroom', x: 7100, y: 476, w: 44, h: 44, vx: -1.8, minX: 6950, maxX: 7300, alive: true },
      { id: 1007, type: 'mushroom', x: 8300, y: 476, w: 44, h: 44, vx: 1.8, minX: 8150, maxX: 8500, alive: true },
      { id: 1008, type: 'mushroom', x: 9600, y: 476, w: 44, h: 44, vx: -1.8, minX: 9450, maxX: 9800, alive: true },
    ],
    rewards: [
      { id: 1001, x: 900, y: 245, w: 32, h: 32, type: 'star', collected: false },
      { id: 1002, x: 2300, y: 220, w: 38, h: 36, type: 'chest', collected: false },
      { id: 1003, x: 4050, y: 155, w: 32, h: 32, type: 'shield', collected: false },
      { id: 1004, x: 4850, y: 215, w: 38, h: 36, type: 'chest', collected: false },
      { id: 1005, x: 6600, y: 155, w: 32, h: 32, type: 'armor', collected: false },
      { id: 1006, x: 7400, y: 215, w: 38, h: 36, type: 'chest', collected: false },
      { id: 1007, x: 9100, y: 155, w: 32, h: 32, type: 'star', collected: false },
      { id: 1008, x: 9900, y: 215, w: 38, h: 36, type: 'chest', collected: false },
    ],
    hearts: [
      { id: 1001, x: 500, y: 340, collected: false },
      { id: 1002, x: 980, y: 240, collected: false },
      { id: 1003, x: 1350, y: 160, collected: false },
      { id: 1004, x: 1780, y: 300, collected: false },
      { id: 1005, x: 2600, y: 230, collected: false }, // No ar do abismo de teia!
      { id: 1006, x: 3150, y: 330, collected: false },
      { id: 1007, x: 4000, y: 150, collected: false },
      { id: 1008, x: 4450, y: 290, collected: false },
      { id: 1009, x: 5200, y: 220, collected: false }, // No ar do abismo de teia!
      { id: 1010, x: 5700, y: 330, collected: false },
      { id: 1011, x: 6550, y: 150, collected: false },
      { id: 1012, x: 7800, y: 230, collected: false }, // No ar do abismo de teia!
      { id: 1013, x: 8200, y: 330, collected: false },
      { id: 1014, x: 9050, y: 150, collected: false },
      { id: 1015, x: 10400, y: 220, collected: false }, // No ar do abismo de teia!
      { id: 1016, x: 10700, y: 330, collected: false },
      { id: 1017, x: 12400, y: 230, collected: false }, // No ar do abismo de teia!
      { id: 1018, x: 12900, y: 270, collected: false },
    ],
    sceneryElements: [
      { type: 'snowTree', x: 250, y: 440 },
      { type: 'snowTree', x: 750, y: 440 },
      { type: 'snowTree', x: 1300, y: 440 },
      { type: 'snowTree', x: 1850, y: 440 },
      { type: 'snowTree', x: 3200, y: 440 },
      { type: 'snowTree', x: 3950, y: 440 },
      { type: 'snowTree', x: 4600, y: 440 },
      { type: 'snowTree', x: 5750, y: 440 },
      { type: 'snowTree', x: 6500, y: 440 },
      { type: 'snowTree', x: 7250, y: 440 },
      { type: 'snowTree', x: 8350, y: 440 },
      { type: 'snowTree', x: 9100, y: 440 },
      { type: 'snowTree', x: 9800, y: 440 },
      { type: 'snowTree', x: 10800, y: 440 },
      { type: 'snowTree', x: 12000, y: 440 },
      { type: 'snowTree', x: 13000, y: 440 },
    ],
  },
  {
    id: 11,
    name: 'Fase 11: Caminho de Casa',
    subtitle: 'Com Amor e Carinho na mochila, volte para casa!',
    theme: 'cidade',
    hasWebPower: true,
    webAnchors: [
      { id: 1101, x: 2460, y: 170, label: 'Argola de Teia' },
      { id: 1102, x: 5010, y: 160, label: 'Argola de Teia' },
      { id: 1103, x: 7510, y: 170, label: 'Argola de Teia' },
      { id: 1104, x: 10010, y: 160, label: 'Argola de Teia' },
    ],
    worldWidth: 12200,
    worldHeight: 580,
    playerStart: { x: 80, y: 420 },
    goal: { x: 11750, y: 380, w: 180, h: 140, label: 'Casinha do Theo' },
    checkpoints: [
      { x: 3000, y: 420, reached: false },
      { x: 6000, y: 420, reached: false },
      { x: 9000, y: 420, reached: false },
    ],
    platforms: [
      { x: 0, y: 520, w: 2250, h: 60, type: 'ground' },
      { x: 450, y: 400, w: 170, h: 24, type: 'rooftop' },
      { x: 820, y: 310, w: 180, h: 24, type: 'wood' },
      { x: 1200, y: 230, w: 190, h: 24, type: 'rooftop' },
      { x: 1620, y: 360, w: 180, h: 24, type: 'wood' },
      { x: 2050, y: 440, w: 150, h: 24, type: 'spring' },

      // Abismo 1 (Teia: 2250 -> 2670, 420px)
      { x: 2670, y: 520, w: 2130, h: 60, type: 'ground' },
      { x: 3350, y: 390, w: 170, h: 24, type: 'moving', moveRange: 140, moveSpeed: 2, direction: 'horizontal', startX: 3350, startY: 390 },
      { x: 3850, y: 270, w: 180, h: 24, type: 'rooftop' },
      { x: 4300, y: 370, w: 180, h: 24, type: 'wood' },
      { x: 4650, y: 440, w: 140, h: 24, type: 'spring' },

      // Abismo 2 (Teia: 4800 -> 5220, 420px)
      { x: 5220, y: 520, w: 2080, h: 60, type: 'ground' },
      { x: 5900, y: 380, w: 170, h: 24, type: 'rooftop' },
      { x: 6350, y: 260, w: 180, h: 24, type: 'moving', moveRange: 130, moveSpeed: 2.2, direction: 'horizontal', startX: 6350, startY: 260 },
      { x: 6850, y: 370, w: 170, h: 24, type: 'wood' },
      { x: 7150, y: 440, w: 140, h: 24, type: 'spring' },

      // Abismo 3 (Teia: 7300 -> 7720, 420px)
      { x: 7720, y: 520, w: 2080, h: 60, type: 'ground' },
      { x: 8400, y: 380, w: 170, h: 24, type: 'rooftop' },
      { x: 8850, y: 260, w: 180, h: 24, type: 'wood' },
      { x: 9350, y: 370, w: 170, h: 24, type: 'rooftop' },
      { x: 9650, y: 440, w: 140, h: 24, type: 'spring' },

      // Abismo 4 (Teia: 9800 -> 10220, 420px) -> Reta final para a Casinha na Cidade!
      { x: 10220, y: 520, w: 1980, h: 60, type: 'ground' },
      { x: 10800, y: 400, w: 170, h: 24, type: 'rooftop' },
      { x: 11200, y: 330, w: 170, h: 24, type: 'wood' },
    ],
    hazards: [
      { x: 1050, y: 492, w: 60, h: 28, type: 'cone' },
      { x: 3650, y: 492, w: 70, h: 28, type: 'puddle' },
      { x: 6200, y: 492, w: 60, h: 28, type: 'cone' },
      { x: 8700, y: 492, w: 70, h: 28, type: 'puddle' },
    ],
    enemies: [
      { id: 1101, type: 'mushroom', x: 650, y: 476, w: 44, h: 44, vx: 1.6, minX: 500, maxX: 800, alive: true },
      { id: 1102, type: 'mushroom', x: 1500, y: 476, w: 44, h: 44, vx: -1.7, minX: 1350, maxX: 1680, alive: true },
      { id: 1103, type: 'mushroom', x: 3250, y: 476, w: 44, h: 44, vx: 1.7, minX: 3100, maxX: 3450, alive: true },
      { id: 1104, type: 'mushroom', x: 4200, y: 476, w: 44, h: 44, vx: -1.7, minX: 4050, maxX: 4400, alive: true },
      { id: 1105, type: 'mushroom', x: 5800, y: 476, w: 44, h: 44, vx: 1.8, minX: 5650, maxX: 6000, alive: true },
      { id: 1106, type: 'mushroom', x: 6800, y: 476, w: 44, h: 44, vx: -1.8, minX: 6650, maxX: 7000, alive: true },
      { id: 1107, type: 'mushroom', x: 8300, y: 476, w: 44, h: 44, vx: 1.8, minX: 8150, maxX: 8500, alive: true },
      { id: 1108, type: 'mushroom', x: 9300, y: 476, w: 44, h: 44, vx: -1.8, minX: 9150, maxX: 9500, alive: true },
    ],
    rewards: [
      { id: 1101, x: 320, y: 475, w: 44, h: 36, type: 'moto', collected: false },
      { id: 1102, x: 880, y: 265, w: 32, h: 32, type: 'star', collected: false },
      { id: 1103, x: 1260, y: 185, w: 38, h: 36, type: 'chest', collected: false },
      { id: 1104, x: 3100, y: 475, w: 44, h: 36, type: 'moto', collected: false },
      { id: 1105, x: 3910, y: 225, w: 32, h: 32, type: 'shield', collected: false },
      { id: 1106, x: 5950, y: 335, w: 32, h: 32, type: 'armor', collected: false },
      { id: 1107, x: 8100, y: 475, w: 44, h: 36, type: 'moto', collected: false },
      { id: 1108, x: 8910, y: 215, w: 38, h: 36, type: 'chest', collected: false },
      { id: 1109, x: 10860, y: 355, w: 32, h: 32, type: 'superHeart', collected: false },
    ],
    hearts: [
      { id: 1101, x: 500, y: 350, collected: false },
      { id: 1102, x: 900, y: 260, collected: false },
      { id: 1103, x: 1280, y: 180, collected: false },
      { id: 1104, x: 1700, y: 310, collected: false },
      { id: 1105, x: 2550, y: 220, collected: false },
      { id: 1106, x: 3420, y: 340, collected: false },
      { id: 1107, x: 3920, y: 220, collected: false },
      { id: 1108, x: 4380, y: 320, collected: false },
      { id: 1109, x: 5100, y: 220, collected: false },
      { id: 1110, x: 5980, y: 330, collected: false },
      { id: 1111, x: 6420, y: 210, collected: false },
      { id: 1112, x: 7600, y: 220, collected: false },
      { id: 1113, x: 8480, y: 330, collected: false },
      { id: 1114, x: 8920, y: 210, collected: false },
      { id: 1115, x: 10100, y: 220, collected: false },
      { id: 1116, x: 10880, y: 350, collected: false },
      { id: 1117, x: 11280, y: 280, collected: false },
    ],
    sceneryElements: [
      { type: 'building', x: 200, y: 520 },
      { type: 'tree', x: 600, y: 520 },
      { type: 'building', x: 1100, y: 520 },
      { type: 'building', x: 3000, y: 520 },
      { type: 'tree', x: 3600, y: 520 },
      { type: 'building', x: 5600, y: 520 },
      { type: 'tree', x: 6200, y: 520 },
      { type: 'building', x: 8100, y: 520 },
      { type: 'tree', x: 8800, y: 520 },
      { type: 'building', x: 10600, y: 520 },
      { type: 'tree', x: 11100, y: 520 },
    ],
  },
];
