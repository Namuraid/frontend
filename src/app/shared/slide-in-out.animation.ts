import { trigger, animate, transition, style } from '@angular/animations';

const TRANSITION_DURATION = '500ms';


export const slideInOutXAnimation = trigger('slideInOutX', [
  transition(':enter', [
    style({transform: 'translateX(-100%)'}),
    animate(`${TRANSITION_DURATION} ease-out`,
          style({transform: 'translateX(0)'}))
  ]),
  transition(':leave', [
    animate(`${TRANSITION_DURATION} ease-in`,
            style({transform: 'translateX(100%)'}))
  ])
]);
