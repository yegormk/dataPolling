import { Injectable } from '@angular/core';

import {
  delay,
  from,
  fromEvent,
  mergeMap,
  of,
  repeatWhen,
  share,
  startWith,
  Subject,
  switchMap,
  takeWhile, tap,
  timer,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PollingService {
  fetchUrl = () => of(`Generating http response ${Date.now()}`).pipe(delay(100));

  startPolling(): any {
    let idleTime = 0;
    const timer$ = new Subject();

    const events = ['scroll', 'wheel', 'touchmove', 'touchend', 'mousemove'];
    from(events)
      .pipe(
        takeWhile(x => navigator.onLine),
        mergeMap(event => fromEvent(document, event)),
        repeatWhen(() => fromEvent(window, 'online')),
      )
      .subscribe(x => {
        idleTime === 3 ? timer$.next('') : '';
        idleTime = 0;
      });

    return timer$.pipe(
      startWith(0),
      switchMap(() =>
        timer(0, 10000).pipe(
          tap(x => (idleTime += 1)),
          takeWhile(x => navigator.onLine && idleTime !== 3),
          switchMap(() => this.fetchUrl()),
          share(),
          repeatWhen(() => fromEvent(window, 'online')),
        ),
      ),
    );
  }
}
