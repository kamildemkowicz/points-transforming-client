import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ADDR_SERVER } from '../../../general/app-const';
import { GeodeticObjectDto } from './geodetic-object-dto.model';
import { GeodeticObject } from './geodetic-object.model';

@Injectable()
export class GeodeticObjectService {
  geodeticObjectsUrl = ADDR_SERVER + 'geodeticObjects';

  constructor(
    private http: HttpClient
  ) { }

  getGeodeticObjects(measurementInternalId: string): Observable<GeodeticObjectDto[]> {
    return this.http.get<GeodeticObjectDto[]>(this.geodeticObjectsUrl + '/' + measurementInternalId);
  }

  createGeodeticObject(geodeticObject: GeodeticObject): Observable<GeodeticObjectDto> {
    return this.http.post<GeodeticObjectDto>(this.geodeticObjectsUrl, geodeticObject);
  }

  updateGeodeticObject(geodeticObject: GeodeticObject): Observable<GeodeticObjectDto> {
    return this.http.put<GeodeticObjectDto>(this.geodeticObjectsUrl, geodeticObject);
  }

  deleteObject(objectId: number): Observable<{id: number}> {
    return this.http.delete<{id: number}>(this.geodeticObjectsUrl + '/' + objectId);
  }
}
