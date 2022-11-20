import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { OnlineStatusModule } from 'ngx-online-status';

import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service

import { MatButtonModule } from '@angular/material/button';

export const materialModules = [MatButtonModule];

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, OnlineStatusModule, materialModules],
  providers: [BnNgIdleService],
  bootstrap: [AppComponent],
})
export class AppModule {}
