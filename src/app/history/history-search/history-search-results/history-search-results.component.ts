import { Component, OnInit } from '@angular/core';
import { HistoryChanges } from '../../models/history-changes.model';
import { ActivatedRoute, Routes } from '@angular/router';
import { HistoryResultResolverService } from './history-result-resolver.service';

@Component({
  selector: 'app-history-search-results',
  templateUrl: './history-search-results.component.html',
  styleUrls: ['./history-search-results.component.scss']
})
export class HistorySearchResultsComponent implements OnInit {
  historyChanges: HistoryChanges;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe((resolve) => {
      this.historyChanges = resolve.historyChanges;
    });
  }
}

export const historyResultRoutes: Routes = [
  {
    path: ':id',
    component: HistorySearchResultsComponent,
    resolve: {
      historyChanges: HistoryResultResolverService
    }
  }
];

export const historyResultProviders = [
  HistoryResultResolverService
];
