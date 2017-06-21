import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ScreenService } from '../shared/screen.service'
import { resetTimer } from '../shared/utils'

const DEFAULT_INTERVAL = 5000;

@Component({
    selector: 'sponsors-view',
    templateUrl: './sponsors-view.component.html',
    styleUrls: ['./sponsors-view.component.css']
})
export class SponsorsViewComponent {
  @Input() sponsors: string[] = [];
  sponsorImgUrl: Observable<string>;

  constructor(private screen: ScreenService) {
    this.resetTimer(DEFAULT_INTERVAL)
  }

  private resetTimer(interval) {
    this.sponsorImgUrl = resetTimer(interval, t => this.sponsors[t % this.sponsors.length]);
  }
}
