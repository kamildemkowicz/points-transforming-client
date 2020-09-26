import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HistoryChanges } from '../../models/history-changes.model';
import { HistoryService } from '../../history.service';

@Injectable()
export class HistoryResultResolverService implements Resolve<HistoryChanges> {
  constructor(
    private historyService: HistoryService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<HistoryChanges> |
    Promise<HistoryChanges> |
    HistoryChanges {
    return this.historyService.getMeasurementHistory(route.params.id);
  }
}
