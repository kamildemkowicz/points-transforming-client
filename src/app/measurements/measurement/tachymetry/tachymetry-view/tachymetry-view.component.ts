import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Picket } from '../../../pickets/picket.model';
import {PicketReport} from "../../../../tachymetry/models/tachymetry-report/picket-report.model";
import {LatLngLiteral} from "@agm/core";

@Component({
  selector: 'app-tachymetry-view',
  templateUrl: './tachymetry-view.component.html',
  styleUrls: ['./tachymetry-view.component.scss']
})
export class TachymetryViewComponent implements OnInit {
  @Input() pathDetails: {
    startingPoint: PicketReport,
    endPoint: PicketReport,
    angle: number,
    distance: number,
    controlPointsDistance: number,
    measuredPicket: PicketReport,
    isEndPoint: boolean,
    path: LatLngLiteral[]
  };

  isLeftLineHighLighted = false;
  isRightLineHighLighted = false;
  isLeftPointHighLighted = false;
  isRightPointHighLighted = false;
  isMiddlePointHighLighted = false;
  isAngleHighLighted = false;

  constructor(
    private activeModal: NgbModal
  ) { }

  ngOnInit() {
  }

  turnOnLeftLineColor() {
    this.isLeftLineHighLighted = true;
  }

  turnOffLeftLineColor() {
    this.isLeftLineHighLighted = false;
  }

  turnOnRightLineColor() {
    this.isRightLineHighLighted = true;
  }

  turnOffRightLineColor() {
    this.isRightLineHighLighted = false;
  }

  turnOnLeftPointColor() {
    this.isLeftPointHighLighted = true;
  }

  turnOffLeftPointColor() {
    this.isLeftPointHighLighted = false;
  }

  turnOnRightPointColor() {
    this.isRightPointHighLighted = true;
  }

  turnOffRightPointColor() {
    this.isRightPointHighLighted = false;
  }

  turnOnMiddlePointColor() {
    this.isMiddlePointHighLighted = true;
  }

  turnOffMiddlePointColor() {
    this.isMiddlePointHighLighted = false;
  }

  turnOnAngleColor() {
    this.isAngleHighLighted = true;
  }

  turnOffAngleColor() {
    this.isAngleHighLighted = false;
  }
}
