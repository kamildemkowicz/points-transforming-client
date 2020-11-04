import {AfterViewInit, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { MeasurementsResolverService } from '../measurements/measurements-resolver.service';
import { MeasurementsModel } from '../measurements/measurements.model';
import { SpinnerService } from '../general/spinner/spinner.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  measurements: MeasurementsModel[];

  constructor(
    private route: ActivatedRoute,
    private spinnerService: SpinnerService
  ) {
    this.spinnerService.show();
  }

  ngOnInit() {
    this.route.data.subscribe((resolve) => {
      const allMeasurements =  resolve.measurements || [];
      this.measurements = allMeasurements.slice(0, 3);
    });
  }

  ngAfterViewInit(): void {
    this.spinnerService.hide();
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
