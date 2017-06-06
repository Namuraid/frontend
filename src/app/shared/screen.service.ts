import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WebsocketService, WebSocketChannel } from './websocket.service';
import { Logger } from './logger.service';


interface IScreenProp {
  x: number;
  y: number;
  width: number;
  height: number;
  bgColor: string;
}


@Injectable()
export class ScreenService {
  private channel: WebSocketChannel = null;
  public activeScreen: Observable<string> = null;
  public dimension: Observable<IScreenProp> = null;

	constructor(private wsService: WebsocketService, private log: Logger) {
    this.log = log.getLogger("ScreenService");
	}

  public connectToScreen(name: string) {
    this.log.log(`Moving to channel ${name}`);
    if (this.channel != null)
      this.channel.leave();
    this.channel = this.wsService.channel(`screen:${name}`);
    this.dimension = this.channel.subscribe<IScreenProp>("dimension");
    this.activeScreen = this.channel.subscribe<string>("activeScreen");
  }
}
