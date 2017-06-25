import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreenService } from './shared/screen.service';
import { WebSocketChannel } from './shared/websocket.service';
import { Observable, Subscriber } from 'rxjs';
import { slideInOutXAnimation } from './shared/slide-in-out.animation';

declare var ScreenHelper: any;


@Component({
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css'],
  animations: [ slideInOutXAnimation ]
})
export class ScreenComponent implements OnInit, OnDestroy {
  public screenId: string = '';
  public style;
  public activeScreen = '';

  private _route_subscription = null;
  private _properties_subscription = null;

  constructor(private screenService: ScreenService,
              private router: Router,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer) {
  }


  ngOnInit() {
    this._route_subscription = this.route.params.subscribe(
      p => this.switchTo(p['id']));
    this._properties_subscription = this.screenService.properties
      .subscribe(prop => this.updateProperties(prop));
  }

  switchTo(id) {
      this.screenId = id;
      this.screenService.setSizeProvider(ScreenHelper.windowSize);
      this.screenService.connectToScreen(this.screenId);
  }

  ngOnDestroy() {
    this._properties_subscription.unsubscribe();
    this._route_subscription.unsubscribe();
    this.screenService.leave();
  }

  toggleFS() {
    ScreenHelper.toggleFullScreen();
    this.screenService.notifyResize();
  }

  updateProperties(prop) {
    this.style = this.sanitizer.bypassSecurityTrustStyle(
      `top:${prop.style.top}px; left: ${prop.style.left}px;
      width:${prop.style['width.px']}px; height:${prop.style['height.px']}px;
      background-color: ${prop.style['background']};`);
    this.activeScreen = prop.activeScreen;
  }
}
