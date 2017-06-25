import { Component, trigger, animate, transition, style } from '@angular/core';
import {
  WebsocketService,
  WebSocketChannel
} from '../shared/websocket.service';
import { Logger } from '../shared/logger.service';
import { Observable } from 'rxjs';


export interface IStartInfo {
  interval: number;
  from: number;
  count: number;
  running: string;
}

export interface INextStart {
  lastNum: number;
  firstNum: number;
  nextFirst: number;
  nextLast: number;
}


const RATE = 10; /* 10/s */
const FS_SPONSOR_DURATION = 20000; /* 20s */


@Component({
    selector: 'start-view',
    templateUrl: './start-view.component.html',
    styleUrls: ['./start-view.component.css'],
    animations: [
      trigger('zoomIn', [transition(':enter', [
        style({transform: 'scale(10) translateY(-35%)', opacity: 0}),
        animate('950ms ease-out', style({opacity: 1,
                                        transform: 'scale(2) translateY(-5%)'}))
      ])])],
})
export class StartViewComponent {
  params: IStartInfo;
  timer = null;
  m: string = "00";
  s: string = "00";
  ds: string = "0";
  chan: WebSocketChannel;
  maximizeSponsors = false;
  firstNum = 1;
  lastNum = 30;


  constructor(private ws: WebsocketService, private log: Logger) {}

  restartFrom(v: IStartInfo) {
    this.stopTimer();
    this.params = v;
    this.firstNum = +this.params.from;
    this.updateLastNum();
    this.pushNextStart();
    if (this.canStart())
      this.startTimer();
    else
      this.tick(v.interval * RATE);
  }

  updateLastNum() {
    this.lastNum = this.firstNum + (+this.params.count) - 1;
  }

  stopTimer() {
    if (this.timer) {
      this.timer.unsubscribe();
      this.timer = null;
    }
  }

  startTimer() {
    this.stopTimer();
    const tickCount = this.params.interval * RATE;
    this.timer = Observable.interval(1000 / RATE)
      .take(tickCount)
      .subscribe(i => this.tick(tickCount - i),
                 err => this.log.error(`Time crashed ? ${err}`),
                 () => this.checkRestart());
  }

  tick(v: number) {
    this.m = ("0" + Math.floor(v / RATE / 60)).slice(-1);
    this.s = ("00" + Math.floor((v / RATE) % 60)).slice(-2);
    this.ds = ("0" + Math.floor(v % RATE)).slice(-1);
  }

  checkRestart() {
    this.stopTimer();
    if (this.canStart())
      this.startTimer();
    this.maximizeSponsors = true
    Observable.interval(FS_SPONSOR_DURATION)
      .take(1)
      .subscribe( e => this.maximizeSponsors = false );
    this.firstNum = this.lastNum + 1;
    this.updateLastNum();
    this.pushNextStart();
  }

  pushNextStart() {
    this.chan.push("nextStart", {lastNum: this.lastNum,
                   firstNum: this.firstNum,
                   nextFirst: this.firstNum + (+this.params.count),
                   nextLast: this.lastNum + (+this.params.count),
    });
  }

  canStart() {
    return this.params.running === "true";
  }

  ngOnInit() {
    this.chan = this.ws.channel("start");
    this.chan.on("start", v => this.restartFrom(v));
    this.chan.on("getNextStart", e => this.pushNextStart());
    this.chan.join_noreturn()
      .receive("ok", v => this.restartFrom(v))
      .receive("error", err => this.log.error(`Cannot connect to the start
                                              backend: ${err}`));
  }

  ngOnDestroy() {
    this.chan.leave();
  }
}
