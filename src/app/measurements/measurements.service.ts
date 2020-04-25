import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MeasurementsModel } from './measurements.model';
import { HttpClient } from '@angular/common/http';
import { ADDR_SERVER } from '../general/app-const';

@Injectable()
export class MeasurementsService {
  measurementsUrl = ADDR_SERVER + 'measurements';

  constructor(
    private http: HttpClient
  ) { }

  getMeasurements(): Observable<MeasurementsModel[]> {
    return this.http.get<MeasurementsModel[]>(this.measurementsUrl);
  }
}
