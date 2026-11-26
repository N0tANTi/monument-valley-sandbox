// Seasons and weather (design section 13a). Owner: Seasons. Read by src/life/season.ts (the
// signals) and by the page every frame (src/render/season.ts), so changing a value here never
// rebuilds the town.

import { defineStyle } from '@/core/style';

/**
 * The year. It turns with the dusk cycle: one season is `days` day-night loops (TIME, 8 minutes
 * each), so with 3 a season is 24 minutes and the year an hour and a half: a player who leaves the
 * game running sees autumn come in well within a sitting, and the whole year in an evening.
 * Positions in the year run 0 to 1 from the start of spring: spring, summer, autumn, winter.
 */
export const SEASON = defineStyle(
  'season',
  {
    /** Day-night loops in one season. */
    days: 3,
    /** How many loops the change from one season to the next takes (centred on the boundary). */
    blend: 0.6,
    /** Where a new town starts its year: the second day of summer, so a town opens as it always has. */
    start: 1 / 3,
    /** Where the season slider holds each season (0 to 1 through that season), and the festival. */
    holdSpring: 0.45,
    holdSummer: 0.5,
    holdAutumn: 0.58,
    holdWinter: 0.35,
    holdFestival: 0.84,
    /** The midwinter festival: from this far through winter (its last third), the lights go up over `festivalUp`, and come down from `festivalEnd` over `festivalDown` (both shares of a season). */
    festivalStart: 0.667,
    festivalUp: 0.08,
    festivalEnd: 0.975,
    festivalDown: 0.05,
  },
  {
    days: [1, 12, 1],
    blend: [0.1, 2, 0.05],
    start: [0, 1, 0.01],
    holdSpring: [0, 1, 0.01],
    holdSummer: [0, 1, 0.01],
    holdAutumn: [0, 1, 0.01],
    holdWinter: [0, 1, 0.01],
    holdFestival: [0, 1, 0.01],
    festivalStart: [0, 1, 0.01],
    festivalUp: [0.01, 0.3, 0.01],
    festivalEnd: [0, 1, 0.01],
    festivalDown: [0.01, 0.3, 0.01],
  },
);

/**
 * The weather: spells of one kind each, a few minutes long, chosen by a seeded roll weighted by the
 * season. Amounts ease in and out; settled snow and wetness build up and go away at their own rates.
 */
export const WEATHER = defineStyle(
  'weather',
  {
    /** Mean length of a spell, seconds, and how far each one is jittered either way (share of it). */
    spell: 160,
    jitter: 0.45,
    /** Seconds for the falling rain or snow, cloud and fog to ease fully in or out. */
    ease: 18,
    /** Seconds of steady snow (at full strength) to cover everything. */
    settle: 70,
    /** Seconds for a full cover of snow to melt once it is warm. */
    melt: 110,
    /** Seconds of steady rain to soak the town, and for a soaked town to dry. */
    soak: 25,
    dry: 140,
    /** Ink and graphite: how dark falling rain streaks and the rim of a flake are (0 to 1). */
    rainInk: 0.55,
    flakeInk: 0.45,
    /** Most falling streaks or flakes on screen, desktop and phone. */
    capDesktop: 14000,
    capPhone: 4000,
  },
  {
    spell: [20, 600, 5],
    jitter: [0, 0.9, 0.05],
    ease: [2, 60, 1],
    settle: [5, 300, 5],
    melt: [5, 400, 5],
    soak: [2, 120, 1],
    dry: [5, 600, 5],
    rainInk: [0, 1, 0.01],
    flakeInk: [0, 1, 0.01],
    capDesktop: [0, 30000, 500],
    capPhone: [0, 10000, 250],
  },
);

/**
 * How each season draws the island: per material shifts the surface shader applies on top of the
 * colours the pieces were built with (summer is the colours as built). Hex colours are multipliers
 * or mix targets, as the comments say.
 */
export const SEASON_LOOK = defineStyle('season-look', {
  /** Spring: luminous pastel mint. */
  springGreen: '#9dd9c8',
  springMix: 0.32,
  /** Autumn grass: warm Monument Valley rose-apricot sandstone. */
  autumnGrass: '#e6b89c',
  autumnGrassMix: 0.65,
  /** Autumn crowns: coral, apricot, plum, gold. */
  leafYellow: '#f5c77e',
  leafOrange: '#ee9b76',
  leafRusset: '#de786b',
  leafBrown: '#b58498',
  /** Winter grass: serene frost-lavender. */
  frost: '#d8e3ec',
  frostMix: 0.55,
  /** Settled snow: crisp alabaster with soft periwinkle shade. */
  snow: '#fbf9f6',
  snowShade: '#c2d0ea',
  /** Whisper-soft snow edge. */
  snowEdge: 0.12,
  /** Wet ground and roofs. */
  wet: '#c4cdd9',
  /** Sky backdrop by season. */
  paperWinter: '#dbe6f2',
  paperAutumn: '#f0e2d8',
  /** Sky backdrop under heavy cloud or rain. */
  paperGrey: '#cfdbe4',
  /** Ice on still and sheltered water. */
  ice: '#d8eef5',
  /** Bare willow whips in winter. */
  twig: '#b89496',
});
