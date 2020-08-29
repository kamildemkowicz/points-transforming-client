import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ADDR_SERVER } from '../general/app-const';
import { HistoryChanges } from './models/history-changes.model';

@Injectable()
export class HistoryService {
  historyMeasurementUrl = ADDR_SERVER + 'history/';

  constructor(
    private http: HttpClient
  ) { }

  getMeasurementHistory(measurementId: string): Observable<HistoryChanges> {
    return this.http.get<HistoryChanges>(this.historyMeasurementUrl + measurementId);
  }
}
