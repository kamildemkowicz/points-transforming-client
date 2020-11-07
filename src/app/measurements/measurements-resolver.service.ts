import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MeasurementsService } from './measurements.service';
import { MeasurementsModel } from './measurements.model';
import { catchError, map } from 'rxjs/operators';
import { SpinnerService } from '../general/spinner/spinner.service';
import { NotificationService } from '../general/notification.service';
import { UtilsService } from '../general/utils.service';

@Injectable()
export class MeasurementsResolverService implements Resolve<MeasurementsModel[]> {
  constructor(
    private measurementsService: MeasurementsService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private utilsService: UtilsService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<MeasurementsModel[]> |
    Promise<MeasurementsModel[]> |
    MeasurementsModel[] {
    return this.measurementsService.getMeasurements().pipe(
      map(result => result),
      catchError((error) => {
        this.spinnerService.hide();
        this.notificationService.showError(this.utilsService.createErrorMessage(error.error.errors), null);

        return of([]);
      })
    );
  }
}
