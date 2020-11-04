import { Component, HostListener, OnInit } from '@angular/core';
import { HistoryChanges } from '../../models/history-changes.model';
import { ActivatedRoute, Routes } from '@angular/router';
import { HistoryResultResolverService } from './history-result-resolver.service';
import { SpinnerService } from '../../../general/spinner/spinner.service';
import { UtilsService } from '../../../general/utils.service';
import { NotificationService } from '../../../general/notification.service';

@Component({
  selector: 'app-history-search-results',
  templateUrl: './history-search-results.component.html',
  styleUrls: ['./history-search-results.component.scss']
})
export class HistorySearchResultsComponent implements OnInit {
  historyChanges: HistoryChanges;
  tableHeight: string;

  constructor(
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private utilsService: UtilsService,
    private notificationService: NotificationService
  ) {
    this.tableHeight = (window.innerHeight * 0.065).toFixed(0) + 'vh';
  }

  ngOnInit() {
    this.route.data.subscribe((resolve) => {
      this.historyChanges = resolve.historyChanges;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
      this.notificationService.showError(this.utilsService.createErrorMessage(error.errors.error), null);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.tableHeight = (window.innerHeight * 0.065).toFixed(0) + 'vh';
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
