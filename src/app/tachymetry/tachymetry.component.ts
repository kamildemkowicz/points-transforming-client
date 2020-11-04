import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Router, Routes } from '@angular/router';
import { tachymetryFormRoutes } from './tachymetry-form/tachymetry-form.component';
import { SpinnerService } from '../general/spinner/spinner.service';

@Component({
  selector: 'app-tachymetry',
  templateUrl: './tachymetry.component.html',
  styleUrls: ['./tachymetry.component.scss']
})
export class TachymetryComponent implements OnInit, AfterViewInit {
  measurementId: string;

  constructor(
    private router: Router,
    private spinnerService: SpinnerService
  ) {
    this.spinnerService.show();
  }

  ngOnInit() {
  }

  openTachymetryForm(measurementId: string) {
    this.spinnerService.show();
    this.router.navigate(['tachymetry', measurementId]);
  }

  ngAfterViewInit(): void {
    this.spinnerService.hide();
  }
}

export const tachymetryRoutes: Routes = [
  {
    path: 'tachymetry',
    component: TachymetryComponent,
    children: [
      ...tachymetryFormRoutes
    ]
  }
];
