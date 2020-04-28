import { Component, Input, OnInit } from '@angular/core';
import { MeasurementsModel } from '../../measurements.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @Input() measurement: MeasurementsModel;

  constructor() { }

  ngOnInit() {
  }

}
