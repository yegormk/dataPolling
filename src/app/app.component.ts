import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  fromEvent,
  Observable,
  repeatWhen,
  Subject,
  switchMap,
  takeUntil, tap,
  timer,
} from 'rxjs';

import { PollingService } from './services/polling.service';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private stopStream = new Subject();
  private startStream = new Subject();
  public observeStream$!: Observable<string>;
  clickObservable: Observable<Event> = fromEvent(document, 'click');

  status: OnlineStatusType = this.onlineStatusService.getStatus();

  constructor(
    private pollingService: PollingService,
    private onlineStatusService: OnlineStatusService,
    private bnIdle: BnNgIdleService,
  ) {}

  ngOnInit(): void {
    this.clickObservable.subscribe(() => {
      this.start();
      this.bnIdle.resetTimer();
    });

    this.bnIdle.startWatching(10).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        this.stop();
        this.bnIdle.stopTimer();
      }
    });

    this.onlineStatusService.status.subscribe((status: OnlineStatusType) => {
      this.status = status;
      status ? this.start() : this.stop();
    });

    this.observeStream$ = timer(0, 10000).pipe(
      switchMap(() => this.pollingService.fetchUrl()),
      takeUntil(this.stopStream),
      repeatWhen(() => this.startStream),
    );
  }

  ngOnDestroy() {
    this.startStream.unsubscribe();
    this.stopStream.unsubscribe();
  }

  start(): void {
    this.startStream.next(event);
  }

  stop(): void {
    this.stopStream.next(event);
  }
}
