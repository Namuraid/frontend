import { ActivatedRoute } from '@angular/router';
import { ScreenService } from './../shared/screen.service';
import { Component, OnInit } from '@angular/core';
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
export class VideofeedViewComponent implements OnInit{
  private chan: WebSocketChannel;
  private channel: WebSocketChannel;
  private screenWidth: number;
  private screenHeight: number;
  private _route_subscription = null;
  private screenName;
  feed$: Observable<string>;
  style = '';

  constructor(private ws: WebsocketService, private http: Http,
              private sanitizer: DomSanitizer,
              private screen: ScreenService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this._route_subscription = this.route.params.subscribe(
      p => {
        this.screenName = p['id']

        this.chan = this.ws.channel('livefeed');

        this.channel = this.ws.channel(`screen:${this.screenName}`);
        this.channel.join_noreturn()
          .receive("ok", ({style}) => {
          console.log("screen");

          this.screenWidth = style["width.px"]
          this.screenHeight = style["height.px"]

          const subscription = this.chan.join()
          .subscribe(({ token, pageId, style }) => {
            this.loadFeed(token, pageId, subscription, style) })

        });
      });
  }

  loadFeed(token: string, pageId: string, subscription, style: string) {
    this.style = style

    this.feed$ = this.http.get(`https://graph.facebook.com/v2.9/${pageId}?fields=live_videos.limit(1).order(chronological)%7Bembed_html%7D&access_token=${token}`)
      .map((res) => {

        let embed:string = res.json().live_videos.data[0].embed_html;
        const heightRatio = this.screenHeight / 640
        const widthRatio = this.screenWidth / 360
        const ratio = Math.min(heightRatio, widthRatio)
        console.log(this);
        const width = 360 * ratio
        const height = 100000//this.screenHeight / ratio
        embed = embed.replace(`width="360"`, `width="${width}"`)
        embed = embed.replace(`height="640"`, `height="${height}"`)
        return this.sanitizer.bypassSecurityTrustHtml(embed);
      })
    subscription.unsubscribe()
  }
}
