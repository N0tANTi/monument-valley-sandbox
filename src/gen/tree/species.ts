// Monument Valley geometric flora (V2): sculpted cypress cones, smooth topiary
// spheres in serene jade/mint/blossom pastels, and stepped alabaster planters.
// Preserves all exported species functions & signatures used by tree.gen.ts and gardens.ts.

import { FOLIAGE } from '@/gen/foliage';
import { PATTERN, type MeshBuilder, type SwayInput } from '@/gen/mesh';
import { lump, mixColor, TONE, type Rgb, type Rng } from '@/parts/ground/kit';
import { TREE } from '@/style/ground';
import { PALETTE } from '@/style/palette';

function swayTo(top: number): SwayInput {
  return (_x, y) => {
    const t = Math.max(0, Math.min(1, y / top));
    return t * t * TREE.sway * 0.45;
  };
}

/** Crisp straight Monument Valley architectural stem. */
function stem(b: MeshBuilder, h: number, rBot: number, rTop: number, sway: SwayInput): void {
  b.with({ color: PALETTE.white, pattern: PATTERN.none, ink: 'trunk', sway }, () => {
    b.lathe([[rBot, -0.02], [rBot, 0.04], [rTop, h]], { segments: 10 });
  });
}

/** Smooth Monument Valley geometric topiary orb. */
function orb(b: MeshBuilder, x: number, y: number, z: number, r: number, color: Rgb | string, sway: SwayInput, ink = 'crown', edge: number = FOLIAGE.evergreen): void {
  b.with({ color, pattern: PATTERN.none, ink, sway, edge }, () => {
    lump(b, x, y, z, r, r * 0.98, r, { seg: 16, rings: 8 });
  });
}

/** Slender Monument Valley tapered architectural cypress cone on a crisp stem. */
function spireCone(b: MeshBuilder, r: Rng, h: number, rad: number, color: Rgb | string, tiers = 1): number {
  const y0 = 0.22;
  const top = y0 + h;
  const sway = swayTo(top);
  stem(b, y0 + 0.12, 0.036, 0.026, sway);
  b.with({ color, pattern: PATTERN.none, ink: 'crown', sway, edge: FOLIAGE.evergreen }, () => {
    if (tiers <= 1) {
      b.lathe(
        [
          [0, y0],
          [rad, y0 + 0.04],
          [rad * 0.88, y0 + h * 0.28],
          [rad * 0.46, y0 + h * 0.68],
          [0, top],
        ],
        { segments: 12 },
      );
    } else {
      const segH = h / (tiers * 0.72 + 0.28);
      for (let k = 0; k < tiers; k++) {
        const yb = y0 + k * segH * 0.68;
        const rk = rad * (1 - k * 0.22);
        const tierCol = k % 2 === 0 ? color : mixColor(color, PALETTE.white, 0.14);
        b.with({ color: tierCol }, () => {
          b.lathe([[0, yb], [rk, yb + 0.02], [rk * 0.52, yb + segH * 0.55], [0, yb + segH]], { segments: 10 });
        });
      }
    }
  });
  void r;
  return top;
}

const TEMPLE_PALETTE = [PALETTE.leaf, PALETTE.leafDark, PALETTE.bush, '#8ec9bf', '#f0a6b3', '#b8d9ce'] as const;

export interface RoundOptions {
  tall?: number;
  size?: number;
  color?: Rgb;
  fruit?: Rgb | string;
  fruitCount?: number;
}

/** Sculpted Monument Valley topiary sphere tree (single or double orb on slender alabaster stem). */
export function roundTree(b: MeshBuilder, r: Rng, o: RoundOptions = {}): number {
  const th = (0.38 + r('th') * 0.14) * (o.tall ?? 1);
  const R = (0.24 + r('R') * 0.04) * (o.size ?? 1);
  const stacked = r('stack') < 0.38;
  const cy = th + R * 0.85;
  const top = stacked ? cy + R * 1.65 : cy + R;
  const sway = swayTo(top);
  stem(b, cy, 0.036, 0.024, sway);
  const pick = TEMPLE_PALETTE[Math.floor(r('mv-col') * TEMPLE_PALETTE.length)]!;
  const col = o.color ?? mixColor(pick, PALETTE.leaf, 0.25);
  orb(b, 0, cy, 0, R, col, sway, 'crown', FOLIAGE.crown);
  if (stacked) orb(b, 0, cy + R * 1.15, 0, R * 0.58, mixColor(col, PALETTE.white, 0.18), sway, 'crown', FOLIAGE.crown);
  return top;
}

/** Tall Monument Valley cypress monolith cone. */
export function cypress(b: MeshBuilder, r: Rng): number {
  const h = 1.05 + r('h') * 0.35;
  const rad = 0.17 + r('rad') * 0.03;
  const col = mixColor(PALETTE.leafDark, PALETTE.seaDeep, 0.35);
  return spireCone(b, r, h, rad, col, 1);
}

/** Minimalist smooth geometric shrub orb. */
export function bush(b: MeshBuilder, r: Rng, size = 1, x = 0, z = 0, ink = 'bush', _flowers: boolean | string = false): void {
  const R = 0.13 * size;
  const sway: SwayInput = (_px, y) => Math.max(0, Math.min(1, y / (R * 2))) * TREE.sway * 0.2;
  const col = mixColor(PALETTE.bush, PALETTE.leaf, r('bc') * 0.4);
  b.with({ color: col, pattern: PATTERN.none, ink, sway, edge: FOLIAGE.shrub }, () => {
    lump(b, x, R * 0.72, z, R, R * 0.88, R, { seg: 12, rings: 6, normal: TONE.lit });
  });
}

export function shrubbery(b: MeshBuilder, r: Rng): number {
  bush(b, (...p) => r('big', ...p), 1.35, 0, 0, 'crown', false);
  bush(b, (...p) => r('small', ...p), 0.85, 0.2, 0.14, 'crown2', false);
  return 0.42;
}

/** Coastal sanctuary palm reimagined as a graceful slender triple-tier teal spire. */
export function palm(b: MeshBuilder, r: Rng): number {
  return spireCone(b, r, 1.1 + r('h') * 0.25, 0.24, PALETTE.leaf, 3);
}

/** Waterside willow reimagined as a luminous soft blossom-mint twin sphere tree. */
export function willow(b: MeshBuilder, r: Rng): number {
  return roundTree(b, r, { tall: 1.15, size: 1.05, color: mixColor(PALETTE.grassHigh, PALETTE.leaf, 0.45) });
}

/** Mountain pine reimagined as a crisp 3-tier Monument Valley pagoda-cone tree. */
export function pine(b: MeshBuilder, r: Rng): number {
  const col = mixColor(PALETTE.leafDark, PALETTE.seaDeep, 0.45);
  return spireCone(b, r, 1.05 + r('h') * 0.3, 0.26, col, 3);
}

/** Crisp stepped alabaster planter box with a perfect geometric sphere topiary. */
export function planterTree(b: MeshBuilder, r: Rng): number {
  const box = 0.48, bh = 0.22;
  b.with({ color: PALETTE.white, pattern: PATTERN.none, ink: 'planter' }, () => {
    b.boxAt([0, 0, 0], [box, bh, box], { skip: ['bottom'] });
    b.boxAt([0, bh, 0], [box + 0.06, 0.045, box + 0.06], { skip: ['bottom'] });
  });
  const th = 0.36;
  const R = 0.27;
  const double = r('double') < 0.45;
  const cy = bh + th + R * 0.72;
  const top = double ? cy + R * 1.55 : cy + R;
  const sway = swayTo(top);
  stem(b, cy, 0.032, 0.024, sway);
  const col = r('pink') < 0.28 ? PALETTE.pink : PALETTE.leafDark;
  orb(b, 0, cy, 0, R, col, sway);
  if (double) orb(b, 0, cy + R * 1.12, 0, R * 0.56, mixColor(col, PALETTE.white, 0.22), sway);
  return top;
}

/** Blossom sanctuary tree (coral-pink or pale gold geometric sphere). */
export function fruitTree(b: MeshBuilder, r: Rng): number {
  const col = r('fruit') < 0.65 ? mixColor(PALETTE.pink, PALETTE.white, 0.15) : mixColor(PALETTE.yellow, PALETTE.white, 0.2);
  return roundTree(b, r, { tall: 0.9, size: 0.92, color: col });
}

/** Tall sacred cypress grove tree (clean, zero undergrowth clutter). */
export function groveTree(b: MeshBuilder, r: Rng): number {
  return spireCone(b, r, 1.3 + r('h') * 0.3, 0.22, mixColor(PALETTE.leafDark, PALETTE.seaDeep, 0.4), 2);
}

/** Minimalist companion topiary sphere beside solitary trees. */
export function companion(b: MeshBuilder, r: Rng, x: number, z: number): void {
  if (r('what') < 0.5) {
    bush(b, (...p) => r('bush', ...p), 0.75 + r('size') * 0.25, x, z, 'companion', false);
  }
}
