import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ADDR_SERVER } from '../../../general/app-const';
import { GeodeticObjectDto } from './geodetic-object-dto.model';

@Injectable()
export class GeodeticObjectService {
  geodeticObjectsUrl = ADDR_SERVER + 'geodeticObjects/';

  constructor(
    private http: HttpClient
  ) { }

  getGeodeticObjects(measurementInternalId: string): Observable<GeodeticObjectDto[]> {
    return this.http.get<GeodeticObjectDto[]>(this.geodeticObjectsUrl + measurementInternalId);
  }

  deleteObject(objectId: number): Observable<string> {
    return this.http.delete<string>(this.geodeticObjectsUrl + objectId);
  }
}
