import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { WebsocketService } from './websocket.service';
import 'rxjs/add/operator/map';

const SCREEN_URL = `ws://localhost:4000/socket/websocket`;

export interface Message {
	viewName: string,
	displayDate: Date,
  viewData: {}
}

@Injectable()
export class ScreenService {
	public messages: Subject<Message>  = new Subject<Message>();

	constructor(private wsService: WebsocketService) {
		this.messages   = <Subject<Message>>this.wsService
			.connect(SCREEN_URL)
			.map((response: MessageEvent): Message => {
				return JSON.parse(response.data) as Message;
			});
	}
}