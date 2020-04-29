import { Component, Input, OnInit } from '@angular/core';
import { Picket } from './picket.model';

@Component({
  selector: 'app-pickets',
  templateUrl: './pickets.component.html',
  styleUrls: ['./pickets.component.scss']
})
export class PicketsComponent implements OnInit {
  @Input() pickets: Picket[];

  constructor() { }

  ngOnInit() {
  }

}
