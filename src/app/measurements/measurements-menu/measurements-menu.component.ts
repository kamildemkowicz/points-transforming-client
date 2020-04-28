import { Component, Input, OnInit } from '@angular/core';
import { MeasurementsModel } from '../measurements.model';

@Component({
  selector: 'app-measurements-menu',
  templateUrl: './measurements-menu.component.html',
  styleUrls: ['./measurements-menu.component.scss']
})
export class MeasurementsMenuComponent implements OnInit {
  @Input() measurements: MeasurementsModel[];

  constructor() { }

  ngOnInit() { }

}
