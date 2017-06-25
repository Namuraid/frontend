import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Socket, Channel } from 'phoenix';
import 'rxjs/add/operator/map';

import { Logger } from './logger.service';


/* FIXME remap dynamically hostname/port */
export const SERVICE_URL = `localhost:4000/`;
const API_ENDPOINT = `ws://${SERVICE_URL}socket`;


export class WebSocketChannel {
  private channel: Channel;

  constructor(private socket: Socket, public readonly topic: string,
              private log: Logger, options = {}) {
    this.channel = socket.channel(topic, options);
  }

  /* Join the channel and start receiving events (or push them) */
  public join(options = {}) {
    return new Observable(o => {
      this.log.log(`Connecting to ${this.topic}`);
      this.channel.join()
        .receive("ok", resp => {
          this.log.log(`Connected to ${this.topic}/${JSON.stringify(resp)}`);
          o.next(resp);
        }).receive("error", resp => {
          this.log.error(`Unable to join ${this.topic}/${JSON.stringify(resp)}`);
          o.error(resp); });
    });
  }

  public join_noreturn(options = {}) {
    return this.channel.join();
  }

  /* Subscribe to events in the channel named 'key',
  * and parse their associated meaning */
  public subscribe<T>(key) : Observable<T> {
    return new Observable(o => {
      this.channel.on(key, resp => {
        this.log.log(`New message for ${this.topic}[${key}]: ${JSON.stringify(resp)}`);
        o.next(resp); });
    }).map(resp => resp as T);
  }

  /* Execute the given function when an event is received in the channel */
  public on(key, f) {
    this.channel.on(key, f);
    return this;
  }

  /* Push a message to the channel, optionally with a payload */
  public push(key, val = {}) {
    this.channel.push(key, val);
  }

  /* Close the underlying socket channel, both on the client and the server */
  public leave() {
    if (!this.isActive()) {
        this.log.warn(`Tried to leave ${this.topic}
                      in state: ${this.channel.state}`);
        return;
    }
    this.channel.leave()
      .receive("ok", () => console.log(`Left channel ${ this.topic }`));
  }

  /* Return whether this channel is joined/joining and thus able to be used */
  public isActive() {
    return this.channel.isJoined() || this.channel.isJoining();
  }
}


@Injectable()
export class WebsocketService implements OnDestroy {
  private socket: Socket = new Socket(API_ENDPOINT);
  private _channels: Channel[] = [];

  constructor(private log: Logger) {
    this.log = this.log.getLogger("Websocket");
    this.socket.connect();
  }

  public channel(topic, options = {}) {
    let chan = new WebSocketChannel(this.socket, topic, this.log, options);
    this._channels.push(chan);
    return chan;
  }

  ngOnDestroy() {
    this.log.log('Clossing websocket');
    for (let chan of this._channels)
          chan.leave()
  }
}
