// The lighthouse (R-L01): a tapering round tower in red and white bands, one
// per storey, on a stone plinth. Its top storey is the lantern stage: a dark
// gallery with a rail, a glazed lantern room that glows at night, and a red
// cone roof. Six storeys or more get a second gallery half-way up.

import { above, CELL_H, columnIndex, keyX, keyY, keyZ, SEA_Y, type Dir4 } from '@/core/grid';
import { compose, rotationX, rotationY, rotationZ, translation, type Mat4, type Mat4Like } from '@/core/mat4';
import { rand } from '@/core/rand';
import { defineGenerator, placeFeature } from '@/gen/api';
import { featureFrame } from '@/gen/frames';
import { MeshBuilder, PATTERN } from '@/gen/mesh';
import type { Feature, ShapePlan, Structure } from '@/resolve/plan';
import { MONUMENTS } from '@/style/monuments';
import { PALETTE } from '@/style/palette';
import { around, ball, ownSockets, ring, wallFrame } from '@/parts/monuments/kit';
import { slitWindow, towerDoor } from '@/parts/monuments/openings';

export interface LighthouseShape {
  storeys: number;
  /** Banded storeys under the lantern stage. */
  bands: number;
  /** Height of the gallery deck above the foot of the stack. */
  deck: number;
  foot: number;
  lantern: boolean;
  world: Mat4;
}

export function lighthouseShape(s: Structure, plan: ShapePlan): LighthouseShape {
  const bottom = s.cells[0]!;
  const top = s.cells[s.cells.length - 1]!;
  const n = s.cells.length;
  const features = plan.featuresByStructure.get(s.id) ?? [];
  // R-L02: a folly's belvedere stands where a lantern room would, on the same deck.
  const lantern = features.some((f) => f.type === 'cap' && (f.variant === 'lantern-room' || f.variant === 'belvedere'));
  const inWater = keyY(bottom) === 0 && plan.terrain.height[columnIndex(keyX(bottom), keyZ(bottom))] === 0;
  const free = !plan.kinds.has(above(top));
  const lean = free && n >= 2 ? MONUMENTS.towerLean * 0.5 : 0;
  return {
    storeys: n,
    bands: lantern ? Math.max(1, n - 1) : n,
    deck: lantern ? (n > 1 ? (n - 1) * CELL_H : 0.36) : n * CELL_H,
    foot: inWater ? SEA_Y + MONUMENTS.footingRise : 0,
    lantern,
    world: compose(
      translation(keyX(bottom) + 0.5, keyY(bottom) * CELL_H, keyZ(bottom) + 0.5),
      rotationZ((rand(s.seed, 'lean-x') - 0.5) * 2 * lean),
      rotationX((rand(s.seed, 'lean-z') - 0.5) * 2 * lean),
    ),
  };
}

/** Monument Valley sanctuary beacon gallery: alabaster deck with a slim golden ring rail. */
function gallery(b: MeshBuilder, wallR: number, out: number): Record<string, Mat4Like> {
  const R = wallR + out, h = MONUMENTS.railHeight;
  b.with({ color: PALETTE.white, pattern: PATTERN.none, ink: 'deck' }, () =>
    b.lathe([[wallR, -0.14], [R - 0.02, -0.05], [R, -0.04], [R, 0], [wallR - 0.08, 0]], { segments: 20 }),
  );
  b.with({ color: PALETTE.yellow, pattern: PATTERN.none, ink: 'rail' }, () => {
    around(b, 8, R - 0.025, Math.PI / 8, () => b.boxAt([0, 0, 0], [0.02, h, 0.02], { skip: ['bottom', 'top'] }));
    ring(b, R - 0.025, h - 0.005, 0.026, 0.024, 20);
  });
  return {
    'flag-mount': compose(rotationY(Math.PI * 0.75), translation(0, h + 0.03, R - 0.03)),
    perch: compose(rotationY(-Math.PI * 0.4), translation(0, h + 0.03, R - 0.03)),
  };
}

export default defineGenerator({
  kind: 'lighthouse',
  build(s, plan, parts) {
    const b = new MeshBuilder({ ink: s.id });
    const anchors: Record<string, Mat4Like> = {};
    const shape = lighthouseShape(s, plan);
    const { storeys: n, bands, deck, foot, world } = shape;
    const bottomY = keyY(s.cells[0]!);
    const RF = MONUMENTS.lightRadiusFoot;
    // Tall lighthouses keep a sturdier top, short ones narrow quickly.
    const RT = Math.min(RF - 0.05, MONUMENTS.lightRadiusTop + 0.012 * Math.max(0, n - 4));
    const rAt = (y: number): number => RF + ((RT - RF) * Math.min(y, deck)) / deck;
    const features = plan.featuresByStructure.get(s.id) ?? [];
    // R-L02: a folly is plain coursed stone, not red and white.
    const folly = plan.roles.get(s.id)?.role === 'folly-tower';

    b.at(world, () => {
      if (foot > 0) {
        b.with({ color: PALETTE.stoneShade, pattern: PATTERN.stone, ink: 'footing' }, () =>
          b.lathe([[RF + 0.14, 0], [RF + 0.14, foot - 0.05], [RF + 0.09, foot], [0, foot]], { segments: 18 }),
        );
      }
      const plinthTop = foot + 0.12;
      b.with({ color: PALETTE.stoneShade, pattern: PATTERN.stone, ink: 'plinth' }, () =>
        b.lathe([[RF + 0.075, foot], [RF + 0.075, foot + 0.08], [rAt(plinthTop) + 0.01, plinthTop]], { segments: 18 }),
      );
      // Monument Valley alabaster & warm champagne stone tiers (replacing red-and-white stripes).
      for (let i = 0; i < bands; i++) {
        const y0 = i === 0 ? plinthTop : (i * deck) / bands;
        const y1 = ((i + 1) * deck) / bands;
        const accent = (bands - 1 - i) % 2 === 0;
        b.with({ color: folly ? (i % 2 === 0 ? PALETTE.stone : PALETTE.stoneShade) : accent ? PALETTE.stoneShade : PALETTE.white, pattern: PATTERN.plaster, ink: `band${i}` }, () =>
          b.lathe([[rAt(y0), y0], [rAt(y1), y1]], { segments: 20, capTop: !shape.lantern && i === bands - 1 }),
        );
      }
    });

    const draw = (id: string, local: Mat4Like, fn: (mb: MeshBuilder) => Record<string, Mat4Like> | void): void => {
      const mb = new MeshBuilder({ ink: id });
      const sockets = fn(mb);
      const at = compose(world, local);
      b.add(mb, at);
      if (sockets) ownSockets(plan, anchors, id, at, sockets);
    };
    const storeyOf = (f: Feature): number => keyY(f.cell!) - bottomY;
    const wall = (f: Feature, y: number, sink = 0.014): Mat4 => wallFrame(f.dir as Dir4, rAt(y) - sink, y);
    for (const f of features) {
      switch (f.type) {
        case 'gallery': {
          const top = storeyOf(f) === n - 1 && shape.lantern;
          const y = top ? deck : storeyOf(f) * CELL_H;
          draw(f.id, translation(0, y, 0), (mb) => gallery(mb, rAt(y), top ? MONUMENTS.galleryOut : MONUMENTS.galleryOut * 0.85));
          break;
        }
        case 'cap': {
          if (f.variant === 'belvedere') {
            // R-L02: an open belvedere: four slim posts on a kerb under a little dome, a finial on top.
            draw(f.id, translation(0, deck, 0), (mb) => {
              const r = Math.min(0.2, RT - 0.06);
              mb.with({ color: PALETTE.stoneShade, pattern: PATTERN.none, ink: 'kerb' }, () => mb.lathe([[r + 0.035, 0], [r + 0.035, 0.08], [r, 0.08]], { segments: 12 }));
              mb.with({ color: PALETTE.stone, pattern: PATTERN.none, ink: 'posts' }, () => around(mb, 4, r - 0.02, Math.PI / 4, () => mb.boxAt([0, 0.08, 0], [0.045, 0.32, 0.045], { skip: ['bottom', 'top'] })));
              mb.with({ color: PALETTE.stone, pattern: PATTERN.none, ink: 'entablature' }, () => mb.lathe([[r + 0.01, 0.4], [r + 0.05, 0.4], [r + 0.05, 0.46], [r * 0.2, 0.46]], { segments: 12 }));
              mb.with({ color: PALETTE.glass, pattern: PATTERN.shingles, ink: 'dome' }, () =>
                mb.lathe([[r + 0.05, 0.46], [r * 0.95, 0.56], [r * 0.7, 0.64], [r * 0.35, 0.69], [0, 0.7]], { segments: 14 }),
              );
              mb.with({ color: PALETTE.yellow, pattern: PATTERN.metal, ink: 'finial' }, () => ball(mb, 0, 0.74, 0, 0.035, 0.04, 8));
              return { 'tower-top': translation(0, 0.78, 0), 'flag-mount': translation(0, 0.78, 0) };
            });
            break;
          }
          if (f.variant !== 'lantern-room') break;
          draw(f.id, translation(0, deck, 0), (mb) => {
            const r = Math.min(0.2, RT - 0.06);
            mb.with({ color: PALETTE.white, pattern: PATTERN.none, ink: 'kerb' }, () => mb.lathe([[r + 0.04, 0], [r + 0.04, 0.11], [r, 0.11]], { segments: 20 }));
            mb.setInk('lantern');
            mb.with({ color: PALETTE.yellow, pattern: PATTERN.glow }, () => mb.lathe([[r, 0.11], [r, 0.44]], { segments: 18 }));
            mb.with({ color: PALETTE.white, pattern: PATTERN.none }, () => around(mb, 4, r + 0.005, 0, () => mb.box([-0.014, 0.11, 0], [0.014, 0.44, 0.014], { skip: ['bottom', 'top', 'n'] })));
            // Floating golden Monument Valley sacred halo ring around the beacon
            mb.with({ color: PALETTE.yellow, pattern: PATTERN.none, ink: 'halo-ring' }, () => ring(mb, r + 0.13, 0.28, 0.022, 0.022, 24));
            // Sculpted teal dome & tall golden needle spire
            mb.with({ color: PALETTE.seaDeep, pattern: PATTERN.none, ink: 'roof' }, () =>
              mb.lathe([[r + 0.05, 0.44], [r + 0.03, 0.56], [r * 0.65, 0.68], [r * 0.25, 0.76], [0, 0.82]], { segments: 20 }),
            );
            mb.with({ color: PALETTE.yellow, pattern: PATTERN.none, ink: 'finial' }, () =>
              mb.lathe([[0.035, 0.8], [0.012, 0.92], [0.032, 0.96], [0.01, 1.01], [0, 1.18]], { segments: 12 }),
            );
            return { lantern: translation(0, 0.27, 0), 'tower-top': translation(0, 1.18, 0), 'flag-mount': translation(0, 1.18, 0) };
          });
          break;
        }
        case 'window': {
          const y = Math.max(storeyOf(f) * CELL_H, foot) + 0.28 + (rand(s.seed, f.id) - 0.5) * 0.03;
          draw(f.id, wall(f, y), (mb) => slitWindow(mb, 'w', PALETTE.white, 0.9));
          break;
        }
        case 'door': {
          const y = Math.max(storeyOf(f) * CELL_H, foot);
          draw(f.id, wall(f, y, 0.025), (mb) => towerDoor(mb, PALETTE.white, PALETTE.glass, (f.params as { steps?: number } | undefined)?.steps ?? 0, parts.has('actor', 'door-leaf')));
          break;
        }
        default: {
          const at = featureFrame(f);
          if (at) placeFeature(b, anchors, f, at, { plan, structure: s, parts });
        }
      }
    }
    return { mesh: b.build(), anchors };
  },
});
