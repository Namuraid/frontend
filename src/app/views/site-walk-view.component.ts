import { Component, OnInit, OnDestroy } from '@angular/core';

import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { Logger } from '../shared/logger.service';
import {
  WebsocketService,
  WebSocketChannel,
  SERVICE_URL } from '../shared/websocket.service';
import { resetTimer } from '../shared/utils'


const DEFAULT_INTERVAL = 3000;


interface POI {
  legend: string;
  style: SafeStyle;
}


@Component({
    selector: 'site-walk-view',
    templateUrl: './site-walk-view.component.html',
    styleUrls: ['./site-walk-view.component.css']
})
export class SiteWalkViewComponent implements OnInit, OnDestroy {
  private _timer = null;
  public prefix = SERVICE_URL;
  private panValues: POI[];
  public view: POI;
  private chan: WebSocketChannel;

  constructor(private log: Logger, private ws: WebsocketService,
             private sanitizer: DomSanitizer) {
    this.changePanValues([{
      legend: 'Welcome!',
      /* top margin, right margin, bottom margin, left margin*/
      style: "clip-path: inset(15%, 35%, 20%, 10%);"
    }]);
    this.view = this.panValues[0];
    this.log = this.log.getLogger("SiteWalkView");
    this.chan = this.ws.channel('sitewalk');
    this.chan.on('panValues', v => this.changePanValues(v['panValues']));
  }

  changePanValues(values: any[]) {
    this.log.log('Changing panValues');
    if (values && values.length > 0)
      this.panValues = values.map((v, _index, _array) => { return {
        legend: v.legend,
        style: this.sanitizer.bypassSecurityTrustStyle(v.style)
      };});
  }

  ngOnInit() {
    this.chan.join_noreturn()
        .receive("ok", _ => this.chan.push("refresh"))
        .receive("error",
                 resp => this.log.error('Unable to join channel'));
    this.resetTimer(DEFAULT_INTERVAL);
  }

  ngOnDestroy() {
    if (this._timer)
      this._timer.unsubscribe();
  }

  private resetTimer(interval) {
    if (this._timer)
      this._timer.unsubscribe();
    this._timer = resetTimer(interval,
                             t => this.panValues[t % this.panValues.length])
      .subscribe(o => this.view = o);
  }
}
