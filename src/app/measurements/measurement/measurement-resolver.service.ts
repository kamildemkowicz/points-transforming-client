import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { MeasurementsModel } from '../measurements.model';
import { MeasurementsService } from '../measurements.service';
import {Observable, of} from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {SpinnerService} from "../../general/spinner/spinner.service";
import {NotificationService} from "../../general/notification.service";
import {UtilsService} from "../../general/utils.service";
import {District} from "../district/district.model";
import {Picket} from "../pickets/picket.model";

@Injectable()
export class MeasurementResolverService implements Resolve<MeasurementsModel> {
  constructor(
    private measurementsService: MeasurementsService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private utilsService: UtilsService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<MeasurementsModel> |
    Promise<MeasurementsModel> |
    MeasurementsModel {
    return this.measurementsService.getMeasurement(route.params.id).pipe(
      map(result => result),
      catchError((error) => {
        this.spinnerService.hide();
        this.notificationService.showError(this.utilsService.createErrorMessage(error.error.errors), null);

        return of({
          measurementInternalId: '',
          name: '',
          creationDate: '',
          place: '',
          owner: '',
          district: {id: undefined, name: '', zone: undefined },
          pickets: []
        });
      })
    );
  }
}
