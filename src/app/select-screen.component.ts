import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Logger } from './shared/logger.service';


@Component({
  templateUrl: './select-screen.component.html',
  styleUrls: ['./select-screen.component.css']
})
export class SelectScreenComponent {
  constructor(private router: Router, private log: Logger) {}

  public displayScreen(form: NgForm) {
    let screenId = form.value['screenId'];
    this.log.log(`Displaying screen named <${screenId}>`);
    this.router.navigate(['screen', screenId]);
  }
}
