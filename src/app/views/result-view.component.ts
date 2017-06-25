import { Component, animate, trigger, style, transition } from '@angular/core';
import {
  WebsocketService,
  WebSocketChannel
} from '../shared/websocket.service';
import { Logger } from '../shared/logger.service';
import { Observable } from 'rxjs';


interface IResult {
  name: string;
  time: string;
  rank: string;
  rankCat: string;
  cat: string;
}

const UPDATE_SPEED = 3000;


@Component({
    selector: 'result-view',
    templateUrl: './result-view.component.html',
    styleUrls: ['./result-view.component.css'],
    animations: [
      trigger('anim', [
        transition(':enter', [
          style({transform: 'translateY(100%)'}),
          animate('500ms', style({transform: 'translateY(0%)'}))
        ]),
        transition(':leave', [
          animate('500ms', style({transform: 'translateY(-100%)'}))
        ]),
        transition('* => *', [
          animate('500ms', style({transform: 'translateY(-100%)'}))
        ])
      ])
    ]
})
export class ResultViewComponent {
  private chan: WebSocketChannel;
  public results: IResult[] = [];
  private _sub;
  public displayStart: number = 0;
  public ROWCOUNT = 8;

  constructor(private ws: WebsocketService,
  private log: Logger) {
    this.chan = ws.channel("result");
    this.chan.on("result", r => this.updateResults(r['result']));
    this.chan.join_noreturn()
      .receive("ok", r => this.updateResults(r['result']))
      .receive("error", err =>
        this.log.error(`Couldn't reach the result channel! ${err}`));
  }

  ngOnInit() {
    this._sub = Observable.interval(UPDATE_SPEED)
      .subscribe(o => this.displayStart = o % this.results.length);
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

  updateResults(r: IResult[]) {
    this.log.log(`Received results: ${JSON.stringify(r)}`);
    if (r && r.length > 1)
      this.results = r;
  }
}


