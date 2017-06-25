import { Component } from '@angular/core';
import {
  WebsocketService,
  WebSocketChannel
} from '../shared/websocket.service';
// import { INextStart } from './start-view.component';

export interface INextStart {
  lastNum: number;
  firstNum: number;
  nextFirst: number;
  nextLast: number;
}

@Component({
    selector: 'info-start-view',
    templateUrl: './info-start-view.component.html',
    styleUrls: ['./info-start-view.component.css'],
})
export class InfoStartViewComponent {

  chan: WebSocketChannel;
  nextStart: INextStart;

  constructor(private ws: WebsocketService) {}

  ngOnInit() {
    this.chan = this.ws.channel("start");
    this.chan.on("nextStart", e => this.nextStart = e);
    this.chan.join_noreturn();
    this.chan.push("getNextStart");
  }

  ngOnDestroy() {
    this.chan.leave();
  }
}
