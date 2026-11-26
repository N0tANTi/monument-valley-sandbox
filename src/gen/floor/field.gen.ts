// Playing fields (R-G03). A field region is one low slab like a garden's;
// on it the court R-G03 found (its role and `field-court` feature) is
// painted in chalk and flat colour by courts.ts. Cells of the region
// outside the court are a little grass apron round it. The furniture that
// stands (hoops, the net, goals, the umpire's chair) is D40's props.
//
// Reads: the region's cells, its role and its features. Nothing else.

import { CELL_H, keyX, keyY, keyZ, neighbor, type CellKey, type Dir4 } from '@/core/grid';
import type { Mat4Like } from '@/core/mat4';
import { defineGenerator, placeFeatures } from '@/gen/api';
import { MeshBuilder, PATTERN } from '@/gen/mesh';
import { fieldCourtOf, FIELD_LIFT } from '@/rules/roles/field.lib';
import { PALETTE } from '@/style/palette';
import { cellSlab } from './sheet';

export default defineGenerator({
  kind: 'field',
  build(s, plan, parts) {
    const anchors: Record<string, Mat4Like> = {};
    const b = new MeshBuilder({ ink: s.id });
    const cells = new Set<CellKey>(s.cells);
    const court = fieldCourtOf(plan, s, CELL_H);
    const r = court?.rect;
    const inRect = (c: CellKey): boolean => !!r && keyX(c) >= r.x0 && keyX(c) < r.x0 + r.w && keyZ(c) >= r.z0 && keyZ(c) < r.z0 + r.d;
    b.setInk('field');
    // Monument Valley sacred meditation courtyard: pale alabaster rim framing a calm sunken jade reflecting pool.
    for (const cell of s.cells) {
      const y0 = keyY(cell) * CELL_H;
      const here = (d: Dir4): boolean => cells.has(neighbor(cell, d));
      const inner = inRect(cell);
      const allIn = inner && ([0, 1, 2, 3] as const).every((d) => inRect(neighbor(cell, d)));
      if (allIn) {
        b.with({ color: PALETTE.sea, pattern: PATTERN.water }, () => cellSlab(b, cell, here, { y0, y1: y0 + FIELD_LIFT * 0.7, round: 0.02 }));
      } else {
        b.with({ color: inner ? PALETTE.plaza : PALETTE.path, pattern: PATTERN.paving }, () => cellSlab(b, cell, here, { y0, y1: y0 + FIELD_LIFT, round: 0.02 }));
      }
    }
    if (r) {
      const cx = r.x0 + r.w / 2;
      const cz = r.z0 + r.d / 2;
      const yBase = (court?.y ?? keyY(s.cells[0]!) * CELL_H + FIELD_LIFT);
      // Central Monument Valley geometric stepped plinth & golden diamond inlay.
      b.with({ color: PALETTE.white, pattern: PATTERN.none, ink: 'mv-altar' }, () => {
        b.box([cx - 0.55, yBase, cz - 0.55], [cx + 0.55, yBase + 0.08, cz + 0.55], { skip: ['bottom'] });
        b.box([cx - 0.34, yBase + 0.08, cz - 0.34], [cx + 0.34, yBase + 0.16, cz + 0.34], { skip: ['bottom'] });
      });
      b.with({ color: PALETTE.yellow, pattern: PATTERN.none, ink: 'mv-altar-gem' }, () => {
        b.lathe([[0.16, yBase + 0.16], [0.06, yBase + 0.42], [0, yBase + 0.56]], { segments: 4 });
      });
    }
    placeFeatures(b, anchors, s, plan, parts, (f) => (f.type === 'field-court' || f.type === 'floor-link' ? null : undefined));
    return { mesh: b.build(), anchors };
  },
});
