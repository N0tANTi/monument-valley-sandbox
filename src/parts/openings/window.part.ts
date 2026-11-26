// Windows (Houses owner; catalogue J09). One window per facade cell, bold
// enough to read at the zoom the player sees: a trim frame standing proud of
// the wall with its sill, and the pane with its glazing bars. Frame, sill,
// pane and bars are ONE ink group, so a window is outlined once and the bars
// read by colour; that is what keeps a street of windows from turning into
// ink blots when the view zooms out (ART.md section 4).
//
// Frame: the wall plane (see lib.ts). The storey's floor is y = 0 and the
// cell is 1 wide; the 'window' socket is the centre of the sill.

import { CELL_H } from '@/core/grid';
import { translation, type Mat4Like } from '@/core/mat4';
import { definePart } from '@/gen/api';
import { PATTERN, type MeshBuilder } from '@/gen/mesh';
import { PALETTE } from '@/style/palette';
import { archPts, circlePts, face, personaOf, plate, shrink, type P2 } from './lib';

const DEPTH = 0.04;

function glass(b: MeshBuilder, pts: readonly P2[], z: number): void {
  b.with({ color: PALETTE.glass, pattern: PATTERN.glass }, () => face(b, pts, z));
}

export default definePart({
  feature: 'window',
  build(item, ctx) {
    const b = ctx.mesh();
    const p = personaOf(ctx);
    const variant = item.variant ?? 'square';
    // Monument Valley openings: crisp recessed dark-indigo geometric arches, lancets, and circular oculi.
    const y = item.params?.lift ?? 0;
    const zp = DEPTH + 0.004;
    let sill: [number, number, number] = [0, 0.22 + y, 0.06];
    const anchors: Record<string, Mat4Like> = {};
    b.setColor(p.trim).setInk('window');

    const recessedArch = (w: number, straightH: number, y0: number, border = 0.036): void => {
      const outer = archPts(w, straightH, y0);
      plate(b, outer, 0, DEPTH);
      glass(b, shrink(outer, border), zp);
    };

    if (variant === 'rose' || variant === 'round') {
      const r = variant === 'rose' ? 0.15 : 0.115;
      const cy = CELL_H / 2;
      plate(b, circlePts(r, 0, cy, 20), 0, DEPTH);
      glass(b, circlePts(r - 0.035, 0, cy, 20), zp);
      sill = [0, cy - r, DEPTH];
    } else if (variant === 'shopfront') {
      // Twin Monument Valley gallery arches along the ground floor.
      const y0 = 0.08 + y * 0.2;
      for (const ox of [-0.21, 0.21]) {
        const outer = archPts(0.32, 0.3, y0).map(([px, py]) => [px + ox, py] as P2);
        plate(b, outer, 0, DEPTH);
        glass(b, shrink(outer, 0.034), zp);
      }
      sill = [0, y0, DEPTH];
      anchors['awning-mount'] = translation(0, y0 + 0.56, DEPTH);
    } else if (variant === 'slit' || variant === 'pointed') {
      const y0 = 0.14 + y * 0.4;
      recessedArch(0.16, 0.42, y0, 0.028);
      sill = [0, y0, DEPTH];
    } else if (variant === 'tall') {
      const y0 = 0.18 + y;
      recessedArch(0.24, 0.34, y0, 0.034);
      sill = [0, y0, DEPTH];
    } else {
      const y0 = 0.2 + y;
      recessedArch(0.26, 0.26, y0, 0.036);
      sill = [0, y0, DEPTH];
    }
    anchors.window = translation(...sill);
    return { mesh: b.build(), anchors };
  },
});
