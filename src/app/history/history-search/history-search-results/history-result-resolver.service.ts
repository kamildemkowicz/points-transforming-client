import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import {Observable, of} from 'rxjs';
import { HistoryChanges } from '../../models/history-changes.model';
import { HistoryService } from '../../history.service';
import {catchError, map} from "rxjs/operators";
import {SpinnerService} from "../../../general/spinner/spinner.service";
import {NotificationService} from "../../../general/notification.service";
import {UtilsService} from "../../../general/utils.service";
import {HistoryChange} from "../../models/history-change.model";

@Injectable()
export class HistoryResultResolverService implements Resolve<HistoryChanges> {
  constructor(
    private historyService: HistoryService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private utilsService: UtilsService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<HistoryChanges> |
    Promise<HistoryChanges> |
    HistoryChanges {
    return this.historyService.getMeasurementHistory(route.params.id).pipe(
      map(result => result),
      catchError((error) => {
        this.spinnerService.hide();
        this.notificationService.showError(this.utilsService.createErrorMessage(error.error.errors), null);

        return of({ changes: [] });
      })
    );
  }
}
