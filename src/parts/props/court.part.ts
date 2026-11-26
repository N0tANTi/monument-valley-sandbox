// Monument Valley courtyard accents (replacing basketball hoops, tennis nets,
// football goals, and umpire chairs with serene minimalist corner stone plinths).

import { DIR4, type Dir4 } from '@/core/grid';
import { definePart } from '@/gen/api';
import { PATTERN } from '@/gen/mesh';
import { PALETTE } from '@/style/palette';

function local(face: Dir4 | undefined, dx: number, dz: number): [number, number] {
  const [zx, zz] = face !== undefined ? DIR4[face]! : [0, 1];
  return [dx * zz - dz * zx, dx * zx + dz * zz];
}
function faceOf(at: unknown): Dir4 | undefined {
  return (at as { face?: Dir4 }).face;
}

export const courtHoop = definePart({
  prop: 'court-hoop',
  build(item, ctx) {
    const b = ctx.mesh();
    const [ox, oz] = local(faceOf(item.at), item.params?.dx ?? 0, item.params?.dz ?? 0);
    b.translate(ox, 0, oz);
    // Minimalist alabaster courtyard stele with golden capstone
    b.with({ color: PALETTE.white, pattern: PATTERN.none, ink: 'stele' }, () => {
      b.box([-0.08, 0, -0.08], [0.08, 0.52, 0.08], { skip: ['bottom'] });
    });
    b.with({ color: PALETTE.yellow, pattern: PATTERN.none, ink: 'stele-cap' }, () => {
      b.lathe([[0.075, 0.52], [0, 0.66]], { segments: 4 });
    });
    return { mesh: b.build() };
  },
});

export const courtNet = definePart({
  prop: 'court-net',
  build(_item, ctx) {
    return { mesh: ctx.mesh().build() };
  },
});

export const courtGoal = definePart({
  prop: 'court-goal',
  build(_item, ctx) {
    return { mesh: ctx.mesh().build() };
  },
});

export const umpireChair = definePart({
  prop: 'umpire-chair',
  build(_item, ctx) {
    return { mesh: ctx.mesh().build() };
  },
});
