import { Component, Input, OnInit } from '@angular/core';
import { TachymetryReport } from '../../models/tachymetry-report/tachymetry-report.model';

@Component({
  selector: 'app-tachymetry-report',
  templateUrl: './tachymetry-report.component.html',
  styleUrls: ['./tachymetry-report.component.scss']
})
export class TachymetryReportComponent implements OnInit {
  @Input() tachymetryReport: TachymetryReport;

  constructor() { }

  ngOnInit() {

  }

}
