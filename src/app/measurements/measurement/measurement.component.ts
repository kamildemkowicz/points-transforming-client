import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { MeasurementResolverService } from './measurement-resolver.service';
import { MeasurementsModel } from '../measurements.model';
import { Picket } from '../pickets/picket.model';

@Component({
  selector: 'app-measurement',
  templateUrl: './measurement.component.html',
  styleUrls: ['./measurement.component.scss']
})
export class MeasurementComponent implements OnInit {
  measurement: MeasurementsModel;
  currentDisplayedLatitude: number;
  currentDisplayedLongitude: number;

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe((resolve) => {
      this.measurement = resolve.measurement;
      if (this.measurement && this.measurement.pickets && this.measurement.pickets.length) {
        this.currentDisplayedLongitude = this.measurement.pickets[0].coordinateX;
        this.currentDisplayedLatitude = this.measurement.pickets[0].coordinateY;
      }
    });
  }

  onPicketChanged(picket: Picket) {
    this.currentDisplayedLongitude = picket.coordinateX;
    this.currentDisplayedLatitude = picket.coordinateY;
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
