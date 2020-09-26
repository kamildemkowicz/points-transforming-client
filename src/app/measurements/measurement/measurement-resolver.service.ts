import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { MeasurementsModel } from '../measurements.model';
import { MeasurementsService } from '../measurements.service';
import { Observable } from 'rxjs';

@Injectable()
export class MeasurementResolverService implements Resolve<MeasurementsModel> {
  constructor(
    private measurementsService: MeasurementsService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<MeasurementsModel> |
    Promise<MeasurementsModel> |
    MeasurementsModel {
    return this.measurementsService.getMeasurement(route.params.id);
  }
}
