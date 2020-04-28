import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { MeasurementResolverService } from './measurement-resolver.service';
import { MeasurementsModel } from '../measurements.model';

@Component({
  selector: 'app-measurement',
  templateUrl: './measurement.component.html',
  styleUrls: ['./measurement.component.scss']
})
export class MeasurementComponent implements OnInit {
  measurement: MeasurementsModel;

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe((resolve) => {
      this.measurement = resolve.measurement;
    });
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
