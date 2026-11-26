// Lamps (D01, D02, D20, R-D02). Four of one family, all cast iron with a
// four-sided glowing lantern under a pyramid cap:
//
//   post       the street lamp: a stepped foot, a slim post with the
//              lamplighter's ladder bar, the lantern on top
//   four-arm   the centre of a big square: a taller post carrying a ring of
//              four lanterns on scrolled arms round a fifth
//   bridge     short, standing on a parapet
//   pier       a timber post with an iron bracket, a hanging lantern and a
//              lifebuoy: the harbour's lamp
//
// The glass is PATTERN.glow: unshaded by day, lit at dusk. The part owns the
// socket 'lamp-head' (the light itself).
//
// Frame: a floor slot or a socket top; the lamp stands on the origin.

import { compose, rotationY, translation, type Mat4 } from '@/core/mat4';
import { definePart } from '@/gen/api';
import { PATTERN, type MeshBuilder } from '@/gen/mesh';
import { PROP } from '@/style/dressing';
import { PALETTE } from '@/style/palette';

/** Monument Valley sleek alabaster obelisk lantern post. */
function stoneObelisk(b: MeshBuilder, top: number, r: number, foot = 0.1): void {
  b.with({ color: PALETTE.white, pattern: PATTERN.none, ink: 'post' }, () => {
    b.boxAt([0, 0, 0], [foot, 0.05, foot], { skip: ['bottom'] });
    b.lathe([[foot * 0.4, 0.05], [r * 1.15, 0.14], [r * 0.72, top]], { segments: 4 });
  });
}

/** Floating luminous golden orb resting inside a minimalist alabaster collar. */
function orbLantern(b: MeshBuilder, size: number, ink: string): number {
  const r = size * 0.52;
  b.with({ color: PALETTE.stoneShade, pattern: PATTERN.none, ink: `${ink}-base` }, () => {
    b.lathe([[r * 1.15, 0], [r * 1.15, 0.025], [r * 0.6, 0.04]], { segments: 12 });
  });
  b.with({ color: PALETTE.yellow, pattern: PATTERN.glow, ink }, () => {
    b.lathe(
      [
        [0, 0.035],
        [r * 0.78, 0.035 + r * 0.35],
        [r, 0.035 + r],
        [r * 0.78, 0.035 + r * 1.65],
        [0, 0.035 + r * 2],
      ],
      { segments: 12 },
    );
  });
  return 0.035 + r;
}

export default definePart({
  prop: 'lamp',
  build(item, ctx) {
    const b = ctx.mesh();
    const variant = item.variant ?? 'post';
    let head: Mat4 = translation(0, 0.7, 0);
    const back = item.params?.back ?? 0;
    b.at(translation(0, 0, -back), () => {
      if (variant === 'four-arm') {
        const h = PROP.fourArmHeight;
        const reach = PROP.fourArmReach * 0.78, armY = h - 0.32;
        stoneObelisk(b, h - 0.22, 0.044, 0.19);
        b.with({ color: PALETTE.yellow, pattern: PATTERN.none, ink: 'arms' }, () => {
          for (let k = 0; k < 4; k++) {
            b.at(rotationY((k * Math.PI) / 2), () => {
              b.box([0.015, armY, -0.012], [reach + 0.015, armY + 0.022, 0.012], { skip: ['w'] });
            });
          }
        });
        for (let k = 0; k < 4; k++) {
          b.at(compose(rotationY((k * Math.PI) / 2), translation(reach, armY + 0.022, 0)), () => orbLantern(b, PROP.lampLantern * 0.75, `l${k}`));
        }
        let mid = 0;
        b.at(translation(0, h - 0.22, 0), () => {
          mid = orbLantern(b, PROP.lampLantern * 1.05, 'top');
        });
        head = translation(0, h - 0.22 + mid, 0);
      } else {
        const bridge = variant === 'bridge';
        const h = bridge ? PROP.bridgeLampHeight : PROP.lampHeight;
        const size = PROP.lampLantern * (bridge ? 0.88 : 1);
        const top = h - size * 1.4;
        stoneObelisk(b, top, PROP.lampPost * 1.05, bridge ? 0.085 : 0.11);
        let mid = 0;
        b.at(translation(0, top, 0), () => {
          mid = orbLantern(b, size, 'lantern');
        });
        head = translation(0, top + mid, 0);
      }
    });
    return { mesh: b.build(), anchors: { 'lamp-head': compose(translation(0, 0, -back), head) } };
  },
});
