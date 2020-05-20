import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { MeasurementsResolverService } from '../measurements/measurements-resolver.service';
import { MeasurementsModel } from '../measurements/measurements.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  measurements: MeasurementsModel[];

  constructor(
    private route: ActivatedRoute,
    private spinnerService: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinnerService.show('spinner');
    this.route.data.subscribe((resolve) => {
      const allMeasurements =  resolve.measurements || [];
      this.measurements = allMeasurements.slice(0, 3);
      this.spinnerService.hide('spinner');
    });
  }
}

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      measurements: MeasurementsResolverService
    }
  }
];

export const dashboardProviders = [
  MeasurementsResolverService
];
