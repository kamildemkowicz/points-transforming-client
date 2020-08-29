import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../history.service';
import { HistoryChanges } from '../models/history-changes.model';

@Component({
  selector: 'app-history-search',
  templateUrl: './history-search.component.html',
  styleUrls: ['./history-search.component.scss']
})
export class HistorySearchComponent implements OnInit {
  measurementId: string;
  historyChanges: HistoryChanges;

  constructor(
    private historyService: HistoryService
  ) { }

  ngOnInit() {
  }

  searchHistory(measurementId: string) {
    this.historyService.getMeasurementHistory(measurementId).subscribe((historyChanges: HistoryChanges) => {
      this.historyChanges = historyChanges;
    });
  }

}
