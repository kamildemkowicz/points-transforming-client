import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Picket } from './picket.model';

@Component({
  selector: 'app-pickets',
  templateUrl: './pickets.component.html',
  styleUrls: ['./pickets.component.scss']
})
export class PicketsComponent implements OnInit {
  @Input() pickets: Picket[];
  @Output() picketChanged = new EventEmitter<Picket>();

  constructor() { }

  ngOnInit() {
  }

  onPicketChanged(picket: Picket) {
    this.picketChanged.emit(picket);
  }
}
