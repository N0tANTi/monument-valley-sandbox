// Awning (Houses owner; dressed onto shops by D07). A sloping cloth with a
// scalloped valance, striped in one accent colour and white. Its free edge
// moves with the wind (sway), the edge on the wall does not.
//
// Frame: the 'awning-mount' socket: on the wall above the shopfront, +Z out.

import { definePart } from '@/gen/api';
import { PATTERN } from '@/gen/mesh';
import { PALETTE } from '@/style/palette';

export default definePart({
  prop: 'awning',
  build(_item, ctx) {
    // Monument Valley minimalist architectural stone cornice ledge instead of striped market awning.
    const b = ctx.mesh();
    b.with({ color: PALETTE.white, pattern: PATTERN.none, ink: 'awning' }, () => {
      b.box([-0.38, -0.025, 0], [0.38, 0.025, 0.14], { skip: ['n'] });
    });
    return { mesh: b.build() };
  },
});
