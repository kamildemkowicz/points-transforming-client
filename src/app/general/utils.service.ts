import { Injectable } from '@angular/core';
import {PicketReport} from "../tachymetry/models/tachymetry-report/picket-report.model";
import {LatLngLiteral} from "@agm/core";

@Injectable()
export class UtilsService {

  createErrorMessage(errors) {
    let errorMessage = '';

    errors.forEach(error => {
      if (error.message) {
        errorMessage = 'Error message: ' + error.message + '\n';
      }
      if (error.field) {
        errorMessage += 'Error field: ' + error.field + '\n';
      }

      if (error.reasons && error.reasons.length) {
        errorMessage += 'Reasons: \n';
        error.reasons.forEach(reason => {
          if (reason.message) {
            errorMessage += reason.message + '\n';
          }
        });
      }
    });

    return errorMessage;
  }

  calculateControlPointsDistance(startingPoint: PicketReport, endPoint: PicketReport): number {
    const res1 = Math.pow((endPoint.latitude - startingPoint.latitude), 2);
    const res2 = Math.pow((Math.cos(((startingPoint.latitude * Math.PI) / 180)) * (endPoint.longitude - startingPoint.longitude)), 2);

    return +((Math.sqrt(res1 + res2)) * (40075.704 / 360) * 1000).toFixed(2) ;
  }

  createPath(picketFrom: PicketReport, picketTo: PicketReport): LatLngLiteral[] {
    return [
      { lat: picketFrom.latitude,  lng: picketFrom.longitude },
      { lat: picketTo.latitude,  lng: picketTo.longitude }
    ];
  }
}
