import { Component, Input, OnInit } from '@angular/core';
import { Picket } from '../picket.model';

@Component({
  selector: 'app-pickets-table',
  templateUrl: './pickets-table.component.html',
  styleUrls: ['./pickets-table.component.scss']
})
export class PicketsTableComponent implements OnInit {
  @Input() pickets: Picket[];

  constructor() { }

  ngOnInit() {
  }

}
