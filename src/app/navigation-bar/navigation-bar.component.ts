import { Component, OnInit } from '@angular/core';
import {SpinnerService} from "../general/spinner/spinner.service";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  constructor(
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() {
  }

  showSpinner() {
    this.spinnerService.show();
  }
}
