import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

interface Picket {
  picketId: string;
  coordinateX: number;
  coordinateY: number;
}

interface Measurement {
  name: string;
  creationDate: string;
  place: string;
  pickets: Picket[];
}

@Injectable()
export class MeasurementsResolverService implements Resolve<Measurement> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Measurement> | Promise<Measurement> | Measurement {
    return undefined;
  }
}
