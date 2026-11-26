// Colours (from the spike). Owner: Look (Stage 1) refines these with the art
// guide. Only palette colours appear in the game.

import { defineStyle } from '@/core/style';
import type { StructureKind } from '@/core/kinds';

export const PALETTE = defineStyle('palette', {
  ink: '#3a4a63',
  paper: '#dce7ef',
  grass: '#8cc4b6',
  grassSide: '#72ae9f',
  /** High ground: each terrace above the first leans toward luminous seafoam-mint. */
  grassHigh: '#c4e4d9',
  dirt: '#e2ae9b',
  dirtDark: '#c98e7c',
  sand: '#f6ead9',
  /** Cliff rock: Monument Valley terracotta-sandstone. */
  rock: '#d89f8e',
  path: '#f7f1e7',
  plaza: '#efe5d8',
  garden: '#96ceb9',
  sea: '#5db3b5',
  seaDeep: '#3d8f98',
  seaSide: '#327885',
  foam: '#eaf9f8',
  shallow: '#9ad8d3',
  stone: '#f7f1e8',
  stoneShade: '#e4d8ca',
  wood: '#d9a482',
  white: '#fdfbf7',
  glass: '#25354f',
  leaf: '#6cb3a3',
  leafDark: '#478d82',
  bush: '#7cc0ae',
  trunk: '#8d6c75',
  brick: '#e38474',
  redDark: '#c25750',
  red: '#ee7b6c',
  yellow: '#f5c77e',
  pink: '#f0a6b3',
  metal: '#3b4a62',
  marble: '#fbf7f1',
  magic: '#b5a8ec',
});

/** Block.color indexes one of these, depending on KINDS[kind].ramp. Eight entries each. */
export const RAMPS = defineStyle('ramps', {
  wall: ['#f39686', '#f7efe6', '#f4c784', '#90c7be', '#9cb4db', '#ebb0bc', '#e2846e', '#c6b7e2'],
  stone: ['#f8f3ec', '#efe4d7', '#e6d8cc', '#f4e5dc', '#dce6ee', '#f3ede5', '#ebd6ca', '#d6dfe9'],
  wood: ['#d9a482', '#cb9373', '#e2b494', '#ba8266', '#d09b7c', '#e8c1a5', '#c38c6e', '#ae785d'],
  roof: ['#36858f', '#e57463', '#4f6594', '#eaa858', '#896a8f'],
});

const FLAT: Partial<Record<StructureKind, keyof typeof PALETTE>> = {
  lighthouse: 'white',
  windmill: 'white',
  tree: 'leaf',
  fountain: 'shallow',
  stall: 'red',
  fence: 'white',
  path: 'path',
  plaza: 'plaza',
  garden: 'garden',
};
const RAMP_OF: Partial<Record<StructureKind, 'wall' | 'stone' | 'wood'>> = {
  house: 'wall',
  tower: 'stone',
  arch: 'stone',
  marble: 'stone',
  pillar: 'stone',
  stairs: 'stone',
  wall: 'stone',
  dock: 'wood',
};

/** The base colour of a structure kind for a palette index. */
export function rampColor(kind: StructureKind, index: number): string {
  const ramp = RAMP_OF[kind];
  if (ramp) {
    const colors = RAMPS[ramp];
    return colors[((index % colors.length) + colors.length) % colors.length]!;
  }
  return PALETTE[FLAT[kind] ?? 'stone'];
}
