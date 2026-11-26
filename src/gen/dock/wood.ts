// The woods of a dock, shared by the dock generator and the dock parts
// (src/parts/ground: ramp, pier head, bollard, piles, crane, goods), so a
// part always matches the deck it stands on.

import { mixColor, type Rgb } from '@/parts/ground/kit';
import { PALETTE } from '@/style/palette';

export interface DockColors {
  /** Deck boards: the dock's own stain (Block.color on the wood ramp). */
  deck: Rgb;
  /** The frame under the deck, sills, crane timbers: a step darker. */
  frame: Rgb;
  /** Stilts and posts: dark, wet wood. */
  pile: Rgb;
  /** Sun-bleached boards: ramps, crates, seats. */
  pale: Rgb;
  /** Rope. */
  rope: Rgb;
}

export function dockColors(_color: number): DockColors {
  // Monument Valley pale alabaster & warm travertine stone piers (replacing rustic brown timber).
  const deck = mixColor(PALETTE.stone, PALETTE.white, 0.35);
  return {
    deck,
    frame: mixColor(PALETTE.stoneShade, PALETTE.dirt, 0.25),
    pile: mixColor(PALETTE.stoneShade, PALETTE.ink, 0.28),
    pale: mixColor(PALETTE.white, PALETTE.sand, 0.25),
    rope: mixColor(PALETTE.yellow, PALETTE.sand, 0.5),
  };
}
