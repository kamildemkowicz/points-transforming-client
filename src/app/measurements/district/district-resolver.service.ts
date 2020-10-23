import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { District } from './district.model';
import { DistrictService } from './district.service';

@Injectable()
export class DistrictResolverService implements Resolve<District[]> {
  constructor(
    private districtService: DistrictService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<District[]> |
    Promise<District[]> |
    District[] {
    return this.districtService.getDistricts();
  }
}
