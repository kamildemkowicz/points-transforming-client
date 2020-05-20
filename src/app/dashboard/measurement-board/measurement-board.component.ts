import { Component, Input, OnInit } from '@angular/core';
import { MeasurementsModel } from '../../measurements/measurements.model';

@Component({
  selector: 'app-measurement-board',
  templateUrl: './measurement-board.component.html',
  styleUrls: ['./measurement-board.component.scss']
})
export class MeasurementBoardComponent implements OnInit {
  @Input() measurement: MeasurementsModel;

  constructor() { }

  ngOnInit() {
  }

}
