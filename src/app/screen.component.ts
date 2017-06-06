import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
              private route: ActivatedRoute) {}

  ngOnInit() {
    this._route_subscription = this.route.params.subscribe(p => {
      this.screenId = p['id'];
      this.screenService.connectToScreen(this.screenId);
    });
  }

  ngOnDestroy() {
    this._route_subscription.unsubscribe();
  }

  toggleFS() {
    ScreenHelper.toggleFullScreen();
  }
}
