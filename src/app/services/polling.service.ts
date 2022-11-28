import { Injectable } from '@angular/core';

import {
  BehaviorSubject,
  delay,
  from,
  fromEvent,
  mergeMap,
  of,
  repeatWhen,
  share,
  switchMap,
  takeWhile,
  timer,
} from 'rxjs';

import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { BnNgIdleService } from 'bn-ng-idle';

@Injectable({
  providedIn: 'root',
})
export class PollingService {
  private renewStream = new BehaviorSubject<boolean>(true);

  constructor(private onlineStatusService: OnlineStatusService, private countIdleService: BnNgIdleService) {}

  fetchUrl = () => of(`Generating http response ${Date.now()}`).pipe(delay(100));

  startPolling(): void {
    const events = ['keypress', 'mousedown', 'scroll'];
    from(events)
      .pipe(mergeMap(event => fromEvent(document, event)))
      .subscribe(event => {
        if (this.onlineStatusService.getStatus()) {
          this.renewStream.next(true);
          this.countIdleService.resetTimer();
        }
      });

    this.countIdleService.startWatching(10).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        this.renewStream.next(false);
        this.countIdleService.stopTimer();
      }
    });

    this.onlineStatusService.status.subscribe((status: OnlineStatusType) => {
      status ? this.countIdleService.resetTimer() : this.countIdleService.stopTimer();
      this.renewStream.next(Boolean(status));
    });

    timer(0, 10000)
      .pipe(
        switchMap(() => this.fetchUrl()),
        share(),
        takeWhile(() => this.renewStream.value),
        repeatWhen(() => this.renewStream),
      )
      .subscribe(x => console.log(x));
  }

  ngOnDestroy(): void {
    this.renewStream.unsubscribe();
  }
}
