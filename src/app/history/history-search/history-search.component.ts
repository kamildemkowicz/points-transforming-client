import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history-search',
  templateUrl: './history-search.component.html',
  styleUrls: ['./history-search.component.scss']
})
export class HistorySearchComponent implements OnInit {
  measurementId: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  searchHistory(measurementId: string) {
    this.router.navigate(['history', measurementId]);
  }

}
