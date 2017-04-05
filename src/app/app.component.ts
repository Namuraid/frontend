import { Component } from '@angular/core';
import { Subject } from 'rxjs'
import { ScreenService, Message } from './shared/screen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  message: Subject<Message>  = new Subject<Message>();

  constructor(private screenService: ScreenService) {
  }

  ngOnInit() {
    this.screenService.messages;
  }
}
