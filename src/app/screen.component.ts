import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreenService } from './shared/screen.service';
import { Observable, Subscriber } from 'rxjs';

declare var ScreenHelper: any;


@Component({
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit, OnDestroy {
  public screenId: string = '';

  private _route_subscription = null;

  constructor(private screenService: ScreenService,
              private router: Router,
              private route: ActivatedRoute) {
              console.log('have router', router);}


  ngOnInit() {
    this._route_subscription = this.route.params.subscribe(p => {
      this.screenId = p['id'];
      this.screenService.setSizeProvider(ScreenHelper.windowSize);
      this.screenService.connectToScreen(
        this.screenId,
        resp => {/* FIXME we currently ignore default values */},
        resp => this.router.navigate(['']) );
    });
  }

  ngOnDestroy() {
    this._route_subscription.unsubscribe();
    this.screenService.leave();
  }

  toggleFS() {
    ScreenHelper.toggleFullScreen();
    this.screenService.notifyResize();
  }
}
