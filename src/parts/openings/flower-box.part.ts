// Flower box (Houses owner; dressed onto windows by D09). A wooden trough on
// the sill with a row of flower heads over a little green.
//
// Frame: the 'window' socket: the front of the sill, +Z out.

import { definePart } from '@/gen/api';

export default definePart({
  prop: 'flower-box',
  build(_item, ctx) {
    // Monument Valley: keep arched window cutouts crisp and unadorned.
    return { mesh: ctx.mesh().build() };
  },
});
