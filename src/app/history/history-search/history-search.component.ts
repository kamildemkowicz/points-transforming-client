import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {SpinnerService} from "../../general/spinner/spinner.service";

@Component({
  selector: 'app-history-search',
  templateUrl: './history-search.component.html',
  styleUrls: ['./history-search.component.scss']
})
export class HistorySearchComponent implements OnInit, AfterViewInit {
  measurementId: string;

  constructor(
    private router: Router,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() {
  }

  searchHistory(measurementId: string) {
    this.spinnerService.show();
    this.router.navigate(['history', measurementId]);
  }

  ngAfterViewInit(): void {
    this.spinnerService.hide();
  }

}
