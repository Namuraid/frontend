import {
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ScreenService } from '../shared/screen.service';
import { resetTimer } from '../shared/utils';
import { Logger } from '../shared/logger.service';
import {
  WebSocketChannel,
  WebsocketService,
  SERVICE_URL
} from '../shared/websocket.service';
import { zoomInZoomOutAnimation } from '../shared/zoom-in-zoom-out.animation';

const DEFAULT_INTERVAL = 5000;

interface ISponsor {
  url: string;
  id: number;
  orientation: string;
  background: string;
}


@Component({
    selector: 'sponsors-view',
    templateUrl: './sponsors-view.component.html',
    styleUrls: ['./sponsors-view.component.css'],
    animations: [ zoomInZoomOutAnimation ]
})
export class SponsorsViewComponent implements OnInit, OnDestroy {
  sponsors: ISponsor[] = [];
  activeSponsor: number;
  private _sub = null;
  private channel;
  @Input() forcePortrait: Boolean = false;

  constructor(private screen: ScreenService, private ws: WebsocketService,
              private log: Logger) {
  }

  refreshSponsors(l: ISponsor[]) {
    this.log.log(`Received new sponsor list: ${JSON.stringify(l)}`);
    if (l && l.length > 1) {
      this.sponsors = l.map((v, _idx, _array) => {
        return {url: `http://${SERVICE_URL}${v.url}`, id: v.id,
          orientation: v.orientation,
          background: v.background}; })
        if (!this._sub)
          this.startTimer();
    }
  }

  ngOnInit() {
    this.channel = this.ws.channel("sponsors");
    this.channel.on("sponsors", e => this.refreshSponsors(e["sponsors"]))
      .join_noreturn()
      .receive("ok", e => this.refreshSponsors(e["sponsors"]))
      .receive("error",
               e => this.log.error("Failed to join the sponsor channel"));
  }

  startTimer() {
    this._sub = resetTimer(DEFAULT_INTERVAL,
                           t => this.sponsors[t % this.sponsors.length])
      .subscribe(o => this.activeSponsor = o.id);
  }

  ngOnDestroy() {
    if (this._sub) {
      this._sub.unsubscribe();
      this._sub = null;
    }
    if (this.channel)
      this.channel.leave();
  }
}
