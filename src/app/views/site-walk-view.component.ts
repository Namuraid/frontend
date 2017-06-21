import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { Logger } from '../shared/logger.service';
import { WebsocketService, SERVICE_URL } from '../shared/websocket.service';


const DEFAULT_INTERVAL = 3000;


@Component({
    selector: 'site-walk-view',
    templateUrl: './site-walk-view.component.html',
    styleUrls: ['./site-walk-view.component.css']
})
export class SiteWalkViewComponent implements OnInit, OnDestroy {
  public picture;
  public view = null;
  public prefix = SERVICE_URL;
  private panValues = [{
    legend: 'Welcome!',
    style: {'width.px': 200, 'height.px': 100, 'margin': '-75px 0 0 -100px'}
  }];
  private chan;

  constructor(private log: Logger, private ws: WebsocketService) {
    this.log = this.log.getLogger("SiteWalkView");
    this.chan = this.ws.channel(`sitewalk`);
    this.resetTimer(DEFAULT_INTERVAL);
    this.chan.on('panValues', v => this.panValues = v['panValues']);
    this.picture = this.chan.join()
  }

  ngOnInit() {
    this.log.log('Site walk is active');
  }

  ngOnDestroy() {
  }

  private resetTimer(interval) {
    this.view = Observable.interval(interval)
      .map(t => this.panValues[t % this.panValues.length]);
  }
}
