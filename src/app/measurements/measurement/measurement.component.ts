import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { MeasurementResolverService } from './measurement-resolver.service';
import { MeasurementsModel } from '../measurements.model';
import { Picket } from '../pickets/picket.model';
import { TachymetryService } from '../../tachymetry/tachymetry.service';
import { ToastrService } from 'ngx-toastr';
import { TachymetryReport } from '../../tachymetry/models/tachymetry-report/tachymetry-report.model';
import { LatLngLiteral } from '@agm/core';
import {PicketReport} from "../../tachymetry/models/tachymetry-report/picket-report.model";

@Component({
  selector: 'app-measurement',
  templateUrl: './measurement.component.html',
  styleUrls: ['./measurement.component.scss']
})
export class MeasurementComponent implements OnInit {
  measurement: MeasurementsModel;
  tachymetries: TachymetryReport[];
  pathsList: {angle: number, distance: number, path: LatLngLiteral[]}[] = [];
  currentDisplayedLatitude: number;
  currentDisplayedLongitude: number;
  zoom: number;
  isTachymetryOn = false;

  constructor(
    private route: ActivatedRoute,
    private tachymetryService: TachymetryService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe((resolve) => {
      this.measurement = resolve.measurement;
      if (this.measurement && this.measurement.pickets && this.measurement.pickets.length) {
        this.currentDisplayedLongitude = this.measurement.pickets[0].longitude;
        this.currentDisplayedLatitude = this.measurement.pickets[0].latitude;
      }
    });
  }

  onPicketChanged(picket: Picket) {
    this.currentDisplayedLongitude = picket.longitude;
    this.currentDisplayedLatitude = picket.latitude;
    this.zoom = 20;
  }

  onShowTachymetry(showTachymetry: boolean) {
    if (!showTachymetry) {
      this.pathsList = [];
      return;
    }

    this.tachymetryService.getTachymetries(this.measurement.measurementInternalId).subscribe((tachymetries: TachymetryReport[]) => {
      this.tachymetries = tachymetries;
      this.createPathsForMap(tachymetries);
    }, (error => {
      this.toastr.error(error.errors);
    }));
  }

  private createPathsForMap(tachymetries: TachymetryReport[]) {
    tachymetries.forEach((tachymetry) => {
      tachymetry.measuringStations.forEach((station) => {
        this.pathsList.push({
          distance: 0,
          angle: 0,
          path: this.createPath(station.startingPoint, station.endPoint)
        });

        station.measuringPickets.forEach((measuredPicket) => {
          this.pathsList.push({
            distance: measuredPicket.distance,
            angle: measuredPicket.angle,
            path: this.createPath(station.startingPoint, measuredPicket.calculatedPicket)
          });
        });
      });
    });
  }

  private createPath(picketFrom: PicketReport, picketTo: PicketReport): LatLngLiteral[] {
    return [
      { lat: picketFrom.latitude,  lng: picketFrom.longitude },
      { lat: picketTo.latitude,  lng: picketTo.longitude }
    ];
  }
}

export const measurementRoutes: Routes = [
  {
    path: ':id',
    component: MeasurementComponent,
    resolve: {
      measurement: MeasurementResolverService
    }
  }
];

export const measurementProviders = [
  MeasurementResolverService
];
