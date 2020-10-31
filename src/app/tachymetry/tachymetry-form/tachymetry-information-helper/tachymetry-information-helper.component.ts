import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tachymetry-information-helper',
  templateUrl: './tachymetry-information-helper.component.html',
  styleUrls: ['./tachymetry-information-helper.component.scss']
})
export class TachymetryInformationHelperComponent implements OnInit {

  constructor(
    private activeModal: NgbModal
  ) { }

  ngOnInit() {
  }

}
