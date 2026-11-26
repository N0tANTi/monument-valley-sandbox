// Hanging shop sign (Houses owner; dressed onto shops by D07). An iron
// bracket with a small board hanging from it, a pictogram of the trade on
// both faces: a loaf, a cup, a book, a flower, a fish, a spool, a wedge of
// cheese, a ball. The board swings in gusts (L29 moves the instance).
//
// Frame: the 'sign-bracket' socket: on the wall beside the door at head
// height, +Z out. The board hangs across the street's line of sight.

import { definePart } from '@/gen/api';

export default definePart({
  prop: 'hanging-sign',
  build(_item, ctx) {
    // Monument Valley: omit rustic medieval pub/shop hanging signboards.
    return { mesh: ctx.mesh().build(), animated: false };
  },
});
