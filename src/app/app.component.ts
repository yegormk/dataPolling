import { Component, OnInit } from '@angular/core';

import { PollingService } from './services/polling.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private pollingService: PollingService) {}

  ngOnInit(): void {
    this.pollingService.startPolling().subscribe((x: string) => console.log(x));
  }
}
