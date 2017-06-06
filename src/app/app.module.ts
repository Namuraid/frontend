import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/* We use angular metarial components */
import { MdInputModule, MdButtonModule } from '@angular/material';

/* Base imports to bootstrap everything */
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SelectScreenComponent } from './select-screen.component';
import { ScreenComponent } from './screen.component';
/* Screen subviews components */
import { SiteWalkViewComponent } from './views/site-walk-view.component';
import { StartViewComponent } from './views/start-view.component';
import { VideofeedViewComponent } from './views/videofeed-view.component';
import {
  PictureSlideshowViewComponent
} from './views/picture-slideshow-view.component';
import { ResultViewComponent } from './views/result-view.component';
import { SponsorsViewComponent } from './views/sponsors-view.component';
/* Services */
import { Logger } from './shared/logger.service';
import { ScreenService } from './shared/screen.service';
import { WebsocketService } from './shared/websocket.service';


@NgModule({
  declarations: [
    AppComponent,
    SelectScreenComponent,
    ScreenComponent,
    SiteWalkViewComponent,
    StartViewComponent,
    VideofeedViewComponent,
    PictureSlideshowViewComponent,
    ResultViewComponent,
    SponsorsViewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MdInputModule,
    MdButtonModule
  ],
  providers: [
    Logger,
    ScreenService,
    WebsocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
