import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Picket } from '../picket.model';

@Component({
  selector: 'app-pickets-table',
  templateUrl: './pickets-table.component.html',
  styleUrls: ['./pickets-table.component.scss']
})
export class PicketsTableComponent implements OnInit, OnChanges {
  @Input() pickets: Picket[];
  @Output() picketChanged = new EventEmitter<Picket>();

  selectedPicket: Picket;

  constructor() { }

  ngOnInit() {
    if (this.pickets.length) {
      this.selectedPicket = this.pickets[0];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pickets && changes.pickets.currentValue) {
      this.selectedPicket = changes.pickets.currentValue[0];
    }
  }

  onPicketTableClicked(picket: Picket) {
    this.selectedPicket = picket;
    this.picketChanged.emit(picket);
  }
}
