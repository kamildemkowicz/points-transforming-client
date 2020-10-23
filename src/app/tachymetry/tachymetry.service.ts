import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ADDR_SERVER } from '../general/app-const';
import { Tachymetry } from './models/tachymetry.model';

@Injectable()
export class TachymetryService {
  tachymetryUrl = ADDR_SERVER + 'tachymetry';

  constructor(
    private http: HttpClient
  ) { }

  createTachymetry(tachymetry: Tachymetry): Observable<any> {
    return this.http.post(this.tachymetryUrl, tachymetry);
  }

  getTachymetries(measurementInternalId: string): Observable<any> {
    return this.http.get(this.tachymetryUrl + '/' + measurementInternalId);
  }
}
