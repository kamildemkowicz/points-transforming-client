import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

export const historyRoutes: Routes = [
  {
    path: 'history',
    component: HistoryComponent
  }
];
