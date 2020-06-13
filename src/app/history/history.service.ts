import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MeasurementsModel } from '../measurements/measurements.model';
import { HttpClient } from '@angular/common/http';
import { ADDR_SERVER } from '../general/app-const';

@Injectable()
export class MeasurementsService {
  measurementsUrl = ADDR_SERVER + 'measurements';
  measurementUrl = ADDR_SERVER + 'measurements';

  constructor(
    private http: HttpClient
  ) { }

  getMeasurementHistory(): Observable<MeasurementsModel[]> {
    return this.http.get<MeasurementsModel[]>(this.measurementsUrl);
  }

  getMeasurement(measurementId: string): Observable<MeasurementsModel> {
    return this.http.get<MeasurementsModel>(this.measurementUrl + '/' + measurementId);
  }

  createMeasurement(measurement: MeasurementsModel): Observable<any> {
    return this.http.post(this.measurementsUrl, measurement);
  }

  updateMeasurement(measurement: MeasurementsModel): Observable<any> {
    return this.http.post(this.measurementsUrl + '/' + measurement.measurementInternalId, measurement);
  }
}
