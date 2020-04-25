import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { MeasurementsResolverService } from '../measurements-resolver.service';
import { MeasurementsComponent } from '../measurements.component';
import { MeasurementsModel } from '../measurements.model';

@Component({
  selector: 'app-measurements-menu',
  templateUrl: './measurements-menu.component.html',
  styleUrls: ['./measurements-menu.component.scss']
})
export class MeasurementsMenuComponent implements OnInit {
  measurements: MeasurementsModel[];

  constructor(
    private route: ActivatedRoute
  ) { }

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
    }
  }
];

export const measurementsProviders = [
  MeasurementsResolverService
];
