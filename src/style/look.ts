// The look of the page: ink, pencil, paper and the dusk grade. Owner: Look.
// Every value is live: the gallery sliders change them and the renderer
// reads them each frame.

import { defineStyle } from '@/core/style';

/** Ink lines, pencil hatching and paper grain. */
export const LOOK = defineStyle(
  'look',
  {
    /**
     * Monument Valley look: ultra-delicate geometric silhouettes, zero sketch wobble or hatching,
     * whisper-subtle museum matte paper grain.
     */
    inkWidth: 0.56,
    inkWidthInner: 0.34,
    inkWidthFar: 0.42,
    /** Screen pixels per world unit at which the line reaches each width. */
    inkNearPx: 110,
    inkFarPx: 18,
    /** Ultra-delicate Monument Valley plane separation (near-lineless tonal aesthetic). */
    inkSilhouette: 0.2,
    inkSeam: 0.08,
    inkCrease: 0.04,
    /** Seams and creases fade gently at overview. */
    inkDetailFar: 0.25,
    /** Depth jump (world units, after removing the surface's own slope) that counts as an edge. */
    inkDepth: 0.09,
    /** Clean ruler-straight architectural lines (no pen wobble). */
    wobble: 0,
    /** Re-roll the wobble twice a second (line boil). Off. */
    boil: 0,
    /** Pencil hatching off for smooth Monument Valley matte geometry. */
    hatch: 0,
    hatchSpacing: 5.5,
    /** Pencil pattern marks off (clean geometric surfaces). */
    pencil: 0,
    /** Whisper-subtle matte print grain. */
    paper: 0.09,
    /** Grounding: crisp soft architectural ambient occlusion and cast shadows. */
    ground: 0.94,
    /** Sea hue retention under warm sunset tint. */
    seaKeep: 1.08,
    /** Soft floating monument shadow below the island slab. */
    slabShadow: 0.12,
    /** Luminous golden-teal halo around lit windows and portals at night. */
    halo: 0.85,
    /** Gentle serene wind sway. */
    sway: 0.04,
  },
  {
    inkWidth: [0.6, 3, 0.05],
    inkWidthInner: [0.4, 3, 0.05],
    inkWidthFar: [0.4, 2, 0.05],
    inkSilhouette: [0, 1, 0.05],
    inkSeam: [0, 1, 0.05],
    inkCrease: [0, 1, 0.05],
    inkDetailFar: [0, 1, 0.05],
    inkDepth: [0.01, 0.3, 0.01],
    wobble: [0, 2, 0.05],
    boil: [0, 1, 1],
    hatch: [0, 1, 0.05],
    hatchSpacing: [3, 12, 0.5],
    pencil: [0, 1.5, 0.05],
    paper: [0, 2, 0.05],
    ground: [0, 1.5, 0.05],
    seaKeep: [0, 2, 0.05],
    slabShadow: [0, 0.4, 0.01],
    halo: [0, 1, 0.05],
    sway: [0, 0.3, 0.01],
  },
);

/**
 * The colour grade at the four anchors of the dusk cycle (src/render/grade.ts applies it). Per part:
 *
 *   Tint      multiplies faces turned to the light, and the bare paper
 *   Shade     multiplies faces turned away from it (dusk: warm light, cool violet shade)
 *   Lift      is added afterwards
 *   Ink       is the line colour
 *   Chroma    saturation of the drawing BEFORE the tint: above 1 pushes materials apart in hue, so
 *             a strong tint does not turn stone, path and sand into one colour
 *   Contrast  a curve on brightness before the tint: above 1 keeps pale things (stone, white trim)
 *             up and lets mid-tones (grass) drop, so monuments stand off the ground at night
 *   Sat       saturation after the tint
 *   Sea       multiplies the sea alone (night: a step darker than the land)
 *   Slope, Cast   the cast shade: how steeply the light falls (lower is longer), how dark it is
 *
 * Dusk and dawn are the values at the peak of those stretches; the grade eases between neighbours.
 */
export const GRADE = defineStyle(
  'grade',
  {
    dayTint: '#fffcf7',
    dayShade: '#e5e2f2',
    dayLift: '#040508',
    dayInk: '#3d4f69',
    dayChroma: 1.06,
    dayContrast: 1.02,
    daySat: 1.04,
    daySea: 1,
    daySlope: 1.15,
    dayCast: 0.48,
    duskTint: '#ffd9c2',
    duskShade: '#bea6d4',
    duskLift: '#0e0714',
    duskInk: '#432e4f',
    duskChroma: 1.25,
    duskContrast: 1.25,
    duskSat: 1.04,
    duskSea: 0.96,
    duskSlope: 0.65,
    duskCast: 0.62,
    nightTint: '#4f6096',
    nightShade: '#354272',
    nightLift: '#0a0f24',
    nightInk: '#16203a',
    nightChroma: 1.08,
    nightContrast: 2.15,
    /** Dreamy Monument Valley twilight: cool indigo stone, luminous gold & turquoise portals. */
    nightSat: 0.85,
    nightSea: 0.72,
    nightSlope: 1.35,
    nightCast: 0.35,
    dawnTint: '#f5dceb',
    dawnShade: '#c6c0e6',
    dawnLift: '#090710',
    dawnInk: '#3d3352',
    dawnChroma: 1.14,
    dawnContrast: 1.18,
    dawnSat: 1.0,
    dawnSea: 0.96,
    dawnSlope: 0.7,
    dawnCast: 0.52,
    /** Lit portals and lanterns: luminous Monument Valley warm gold. */
    lamp: '#ffe494',
    lampWarm: '#ffbf70',
    /** Stars and the beacon beam. */
    star: '#fff8e2',
  },
  Object.fromEntries(
    ['day', 'dusk', 'night', 'dawn'].flatMap((part) => [
      [`${part}Chroma`, [0, 2, 0.01]],
      [`${part}Contrast`, [0.5, 4, 0.05]],
      [`${part}Sat`, [0, 1.5, 0.01]],
      [`${part}Sea`, [0.3, 1.2, 0.01]],
      [`${part}Slope`, [0.3, 3, 0.05]],
      [`${part}Cast`, [0, 1, 0.05]],
    ]),
  ),
);
