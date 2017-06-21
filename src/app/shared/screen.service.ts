import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WebsocketService, WebSocketChannel } from './websocket.service';
import { Logger } from './logger.service';


@Injectable()
export class ScreenService {
  private channel: WebSocketChannel = null;
  public properties = null;
  private getsize = null;

	constructor(private wsService: WebsocketService, private log: Logger) {
    this.log = log.getLogger("ScreenService");
	}

  public connectToScreen(name: string) {
    this.log.log(`Moving to channel ${name}`);
    if (this.channel != null)
      this.channel.leave();
    this.channel = this.wsService.channel(`screen:${name}`);
    let _obs = this.channel.subscribe("properties");
    this.properties = Observable.merge(this.channel.join(), _obs);
  }

  public notifyResize() {
    if (this.getsize != null)
      this.channel.push('resize', this.getsize());
  }

  public setSizeProvider(f) {
    this.getsize = f;
  }

  public clearSizeProvider() {
    this.getsize = null;
  }

  public leave() {
    this.clearSizeProvider();
  }

  public name() {
    return this.channel.topic;
  }
}
