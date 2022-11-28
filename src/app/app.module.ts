import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { OnlineStatusModule } from 'ngx-online-status';

import { BnNgIdleService } from 'bn-ng-idle';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, OnlineStatusModule],
  providers: [BnNgIdleService],
  bootstrap: [AppComponent],
})
export class AppModule {}
