import { Injectable } from '@angular/core';

import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PollingService {
  constructor() {}

  random(min: number, max: number) {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  fetchUrl = () => of(`Generating http response ${Date.now()}`).pipe(delay(this.random(100, 300)));
}
