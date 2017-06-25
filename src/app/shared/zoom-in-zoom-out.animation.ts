import { trigger, animate, transition, style } from '@angular/animations';

const TRANSITION_DURATION = '500ms';


export const zoomInZoomOutAnimation = trigger('zoomInZoomOut', [
  transition(':enter', [
    style({transform: 'scale(3) translateX(-100%) translateY(-100%)',
          opacity: 0}),
    animate(`${TRANSITION_DURATION} ease-out`,
            style({transform: 'scale(1) translateX(0) translateY(0)',
                  opacity: 1}))
  ]),
  transition(':leave', [
    animate(`${TRANSITION_DURATION} ease-in`,
            style({transform: 'scale(0) translateX(100%) translateY(100%)',
                  opacity: 0}))
  ])
]);
