import { Component, Input, OnInit } from '@angular/core';
import { HistoryChanges } from '../../models/history-changes.model';

@Component({
  selector: 'app-history-search-results',
  templateUrl: './history-search-results.component.html',
  styleUrls: ['./history-search-results.component.scss']
})
export class HistorySearchResultsComponent implements OnInit {
  @Input() historyChanges: HistoryChanges;

  constructor() { }

  ngOnInit() {
  }

}
