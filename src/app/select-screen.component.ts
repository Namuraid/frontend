import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { Logger } from './shared/logger.service';
import { WebsocketService } from './shared/websocket.service';


@Component({
  templateUrl: './select-screen.component.html',
  styleUrls: ['./select-screen.component.css']
})
export class SelectScreenComponent implements OnInit, OnDestroy {
  public chanList;
  public screenId;
  private chan;

  constructor(private router: Router,
              private log: Logger,
              private sock: WebsocketService) {}

  ngOnInit() {
    this.chan = this.sock.channel("screen:all");
    this.chanList = Observable.merge(
      this.chan.join(), this.chan.subscribe("update"));
  }

  ngOnDestroy() {
    this.chan.leave();
  }

  public displayScreen(form: NgForm) {
    this.log.log(`Displaying screen named <${this.screenId}>`);
    this.router.navigate(['screen', this.screenId]);
  }
}
