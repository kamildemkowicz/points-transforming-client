import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ADDR_SERVER } from '../../general/app-const';
import { District } from './district.model';

@Injectable()
export class DistrictService {
  districtsUrl = ADDR_SERVER + 'districts';

  constructor(
    private http: HttpClient
  ) { }

  getDistricts(): Observable<District[]> {
    return this.http.get<District[]>(this.districtsUrl);
  }
}
