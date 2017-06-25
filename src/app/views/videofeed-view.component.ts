import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import {
  WebsocketService,
  WebSocketChannel
} from '../shared/websocket.service';

@Component({
    selector: 'videofeed-view',
    templateUrl: './videofeed-view.component.html',
    styleUrls: ['./videofeed-view.component.css']
})
export class VideofeedViewComponent {
  private chan: WebSocketChannel;
  feed$: Observable<string>;

  constructor(private ws: WebsocketService, private http: Http,
              private sanitizer: DomSanitizer) {
    this.chan = this.ws.channel('livefeed');
    const subscription = this.chan.join().take(1)
      .subscribe(({ token, pageId }) => {
        this.loadFeed(token, pageId, subscription) })
  }

  loadFeed(token: string, pageId: string, subscription) {
    this.feed$ = this.http.get(`https://graph.facebook.com/v2.9/${pageId}?fields=live_videos.limit(1).order(chronological)%7Bembed_html%7D&access_token=${token}`)
      .map((res) => this.sanitizer.bypassSecurityTrustHtml(
        res.json().live_videos.data[0].embed_html))
    subscription.unsubscribe()
  }
}
