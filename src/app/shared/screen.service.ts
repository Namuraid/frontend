import { Injectable } from '@angular/core';

import { WebsocketService, WebSocketChannel } from './websocket.service';
import { Logger } from './logger.service';


@Injectable()
export class ScreenService {
  private channel: WebSocketChannel = null;
  public activeScreen = null;
  public dimension  = null;
  private getsize = null;
  private _init_val_subscription = null;

	constructor(private wsService: WebsocketService, private log: Logger) {
    this.log = log.getLogger("ScreenService");
	}

  public connectToScreen(name: string, success = _ => {}, error = _ => {}) {
    this.log.log(`Moving to channel ${name}`);
    if (this.channel != null)
      this.channel.leave();
    this.channel = this.wsService.channel(`screen:${name}`);
    this.dimension = this.channel.subscribe("dimension");
    this.activeScreen = this.channel.subscribe("activescreen");
    if (this._init_val_subscription != null)
      this._init_val_subscription.unsubscribe();
    this._init_val_subscription = this.channel
      .join().subscribe(success, error);
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
    this._init_val_subscription.unsubscribe();
    this.clearSizeProvider();
  }

  public name() {
    return this.channel.topic;
  }
}
