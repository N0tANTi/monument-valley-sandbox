// The shape of the ground (design section 6, "Look"). Owner: Look. Read by
// src/gen/terrain. All lengths are world units (a cell is 1 wide, 0.8 tall).

import { defineStyle } from '@/core/style';
import { PALETTE } from './palette';

export const TERRAIN = defineStyle(
  'terrain',
  {
    /** Crisp Monument Valley geometric terraces with micro-chamfered corners. */
    radius: 0.06,
    radiusVary: 0,
    radiusBuilt: 0.03,
    /** Ruler-clean geometric plateau edges (zero organic wobble). */
    wobble: 0,
    /** Each ascending plateau steps toward luminous seafoam-mint. */
    levelTint: 0.32,
    /** Crisp thin top coping lip on terraces. */
    turf: 0.06,
    /** Smooth sheer monument cliff faces (no rough protruding ledges). */
    ledge: 0,
    turfOut: 0,
    /** Clean sheer geometric stone banks. */
    beachRun: 0.04,
    earthRun: 0,
    rockRun: 0,
    shoreRun: 0.03,
    bankRun: 0.04,
    /** Monument Valley sandstone plateau tops. */
    rockTop: '#f1dad0',
    rockMoss: '#a8d1c4',
    grassDry: '#9fcbb9',
    rockWander: 0.12,
    rockTufts: 0,
    screeDrop: 8,
    /** Crisp sculpted floating monument slab. */
    slabRadius: 0.5,
    seaDepth: 0.48,
    earthDepth: 0.92,
  },
  {
    radius: [0.1, 0.5, 0.01],
    radiusVary: [0, 0.3, 0.01],
    radiusBuilt: [0.02, 0.5, 0.01],
    wobble: [0, 0.12, 0.005],
    levelTint: [0, 1, 0.02],
    turf: [0, 0.3, 0.01],
    ledge: [0, 0.3, 0.01],
    turfOut: [0, 0.08, 0.005],
    beachRun: [0, 0.45, 0.01],
    earthRun: [0, 0.2, 0.01],
    rockRun: [0, 0.2, 0.01],
    shoreRun: [0, 0.3, 0.01],
    bankRun: [0, 0.45, 0.01],
    rockWander: [0, 1.2, 0.02],
    rockTufts: [0, 0.6, 0.01],
    screeDrop: [2, 8, 1],
    slabRadius: [0.5, 4, 0.1],
    seaDepth: [0.1, 1.5, 0.02],
    earthDepth: [0.2, 2, 0.05],
  },
);

/**
 * The grass colour of the terrain at a level (1 is the lowest land): each terrace above the first
 * leans a step toward PALETTE.grassHigh, so plateaus read from every side. A lawn or garden piece
 * that should melt into the ground it lies on uses this instead of PALETTE.grass.
 */
export function terraceGrass(level: number): [number, number, number] {
  const rgb = (hex: string): [number, number, number] => {
    const n = Number.parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const a = rgb(PALETTE.grass), b = rgb(PALETTE.grassHigh);
  const t = Math.min(1, Math.max(0, level - 1) * TERRAIN.levelTint);
  return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)];
}
