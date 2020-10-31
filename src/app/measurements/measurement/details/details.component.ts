import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MeasurementsModel } from '../../measurements.model';
import { Picket } from '../../pickets/picket.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnChanges {
  @Input() measurement: MeasurementsModel;
  @Input() offTachymetry: boolean;

  @Output() picketChanged = new EventEmitter<Picket>();
  @Output() showTachymetry = new EventEmitter<boolean>();
  @Output() showGeodeticObjects = new EventEmitter<boolean>();

  isTachymetryShown = false;
  isGeodeticObjectsShown = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.offTachymetry && changes.offTachymetry.currentValue) {
      this.showTachymetry = changes.offTachymetry.currentValue;
    }
  }

  onPicketChanged(picket: Picket) {
    this.picketChanged.emit(picket);
  }

  showTachymetryOnMap() {
    this.isTachymetryShown = !this.isTachymetryShown;
    this.showTachymetry.emit(this.isTachymetryShown);
  }

  showGeodeticObjectsOnMap() {
    this.isGeodeticObjectsShown = !this.isGeodeticObjectsShown;
    this.showGeodeticObjects.emit(this.isGeodeticObjectsShown);
  }
}
