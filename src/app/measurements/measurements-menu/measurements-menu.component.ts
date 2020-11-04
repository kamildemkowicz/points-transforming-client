import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MeasurementsModel } from '../measurements.model';
import { SpinnerService } from '../../general/spinner/spinner.service';

@Component({
  selector: 'app-measurements-menu',
  templateUrl: './measurements-menu.component.html',
  styleUrls: ['./measurements-menu.component.scss']
})
export class MeasurementsMenuComponent implements OnInit, AfterViewInit {
  @Input() measurements: MeasurementsModel[];

  constructor(
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.spinnerService.hide();
  }

}
