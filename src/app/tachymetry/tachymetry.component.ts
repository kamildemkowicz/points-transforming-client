import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { tachymetryFormRoutes } from './tachymetry-form/tachymetry-form.component';

@Component({
  selector: 'app-tachymetry',
  templateUrl: './tachymetry.component.html',
  styleUrls: ['./tachymetry.component.scss']
})
export class TachymetryComponent implements OnInit {
  measurementId: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  openTachymetryForm(measurementId: string) {
    this.router.navigate(['tachymetry', measurementId]);
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
