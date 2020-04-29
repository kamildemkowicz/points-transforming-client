import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
@Component({
  selector: 'app-new-measurement',
  templateUrl: './new-measurement.component.html',
  styleUrls: ['./new-measurement.component.scss']
})
export class NewMeasurementComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

export const createNewMeasurementRoutes: Routes = [
  {
    path: 'create-new',
    component: NewMeasurementComponent
  }
];
