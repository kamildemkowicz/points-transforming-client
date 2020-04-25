import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MeasurementsService } from './measurements.service';
import { MeasurementsModel } from './measurements.model';

@Injectable()
export class MeasurementsResolverService implements Resolve<MeasurementsModel[]> {
  constructor(
    private measurementsService: MeasurementsService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<MeasurementsModel[]> |
    Promise<MeasurementsModel[]> |
    MeasurementsModel[] {
    return this.measurementsService.getMeasurements();
  }
}
