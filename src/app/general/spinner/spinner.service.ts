import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class SpinnerService {
  constructor(private spinner: NgxSpinnerService) {}

  show(): void {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 10000);
  }

  hide(): void {
    this.spinner.hide();
  }
}
