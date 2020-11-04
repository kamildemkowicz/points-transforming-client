import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { MeasurementsResolverService } from './measurements-resolver.service';
import { MeasurementsModel } from './measurements.model';
import { measurementRoutes } from './measurement/measurement.component';
import { SpinnerService } from '../general/spinner/spinner.service';

@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.scss']
})
export class MeasurementsComponent implements OnInit {
  measurements: MeasurementsModel[];

  constructor(
    private route: ActivatedRoute,
    private spinnerService: SpinnerService
  ) {
    this.spinnerService.show();
  }

  ngOnInit() {
    this.route.data.subscribe((resolve) => {
      this.measurements =  resolve.measurements || [];
    });
  }
}

export const measurementsRoutes: Routes = [
  {
    path: 'measurements',
    component: MeasurementsComponent,
    resolve: {
      measurements: MeasurementsResolverService
    },
    children: [
      ...measurementRoutes
    ]
  }
];

export const measurementsProviders = [
  MeasurementsResolverService
];
