// Monument Valley: domestic laundry lines are omitted to keep temple facades clean and serene.

import { translation } from '@/core/mat4';
import { definePart } from '@/gen/api';

export const LINE_LIFT = 0.25;

export default definePart({
  prop: 'laundry-line',
  build(_item, ctx) {
    const span = Math.max(0.4, ctx.span);
    return { mesh: ctx.mesh().build(), anchors: { perch: translation(span / 2, LINE_LIFT, 0) } };
  },
});
