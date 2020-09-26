import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MeasurementsModel } from '../../measurements.model';
import { Picket } from '../../pickets/picket.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @Input() measurement: MeasurementsModel;
  @Output() picketChanged = new EventEmitter<Picket>();

  constructor() { }

  ngOnInit() {
  }

  onPicketChanged(picket: Picket) {
    this.picketChanged.emit(picket);
  }

}
