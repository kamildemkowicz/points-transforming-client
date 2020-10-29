import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { MeasurementResolverService } from './measurement-resolver.service';
import { MeasurementsModel } from '../measurements.model';
import { Picket } from '../pickets/picket.model';
import { TachymetryService } from '../../tachymetry/tachymetry.service';
import { ToastrService } from 'ngx-toastr';
import { TachymetryReport } from '../../tachymetry/models/tachymetry-report/tachymetry-report.model';
import { LatLngLiteral } from '@agm/core';
import { PicketReport } from '../../tachymetry/models/tachymetry-report/picket-report.model';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TachymetryViewComponent } from './tachymetry/tachymetry-view/tachymetry-view.component';
import { UtilsService } from '../../general/utils.service';

@Component({
  selector: 'app-measurement',
  templateUrl: './measurement.component.html',
  styleUrls: ['./measurement.component.scss']
})
export class MeasurementComponent implements OnInit {
  measurement: MeasurementsModel;
  tachymetries: TachymetryReport[];
  pathsList: {
    startingPoint: PicketReport,
    endPoint: PicketReport,
    angle: number,
    distance: number,
    controlPointsDistance: number,
    measuredPicket: PicketReport,
    isEndPoint: boolean,
    path: LatLngLiteral[]
  } [] = [];
  currentDisplayedLatitude: number;
  currentDisplayedLongitude: number;
  zoom: number;
  isTachymetryOn = false;

  constructor(
    private route: ActivatedRoute,
    private tachymetryService: TachymetryService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private utilsService: UtilsService
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe((resolve) => {
      this.measurement = resolve.measurement;
      if (this.measurement && this.measurement.pickets && this.measurement.pickets.length) {
        this.currentDisplayedLongitude = this.measurement.pickets[0].longitude;
        this.currentDisplayedLatitude = this.measurement.pickets[0].latitude;
      }
    }, error => {
      this.utilsService.createErrorMessage(error.error.errors);
    });
  }

  onPicketChanged(picket: Picket) {
    this.currentDisplayedLongitude = picket.longitude;
    this.currentDisplayedLatitude = picket.latitude;
    this.zoom = this.zoom === 20 ? 19 : 20;
  }

  onShowTachymetry(showTachymetry: boolean) {
    if (!showTachymetry) {
      this.pathsList = [];
      return;
    }

    this.tachymetryService.getTachymetries(this.measurement.measurementInternalId).subscribe((tachymetries: TachymetryReport[]) => {
      this.tachymetries = tachymetries;
      this.createPathsForMap(tachymetries);
    }, (error => {
      this.toastr.error(error.errors);
    }));
  }

  onLineClicked(event: {angle: number, distance: number}) {
    const ngbModalOptions: NgbModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'xl'
    };

    const modalRef = this.modalService.open(TachymetryViewComponent, ngbModalOptions);
    modalRef.componentInstance.pathDetails = event;
  }

  private createPathsForMap(tachymetries: TachymetryReport[]) {
    tachymetries.forEach((tachymetry) => {
      tachymetry.measuringStations.forEach((station) => {
        const controlPointsDistance = this.calculateControlPointsDistance(station.startingPoint, station.endPoint);
        this.pathsList.push({
          startingPoint: station.startingPoint,
          endPoint: station.endPoint,
          distance: 0,
          controlPointsDistance,
          angle: 0,
          measuredPicket: station.endPoint,
          path: this.createPath(station.startingPoint, station.endPoint),
          isEndPoint: true
        });

        station.measuringPickets.forEach((measuredPicket) => {
          this.pathsList.push({
            startingPoint: station.startingPoint,
            endPoint: station.endPoint,
            distance: measuredPicket.distance,
            controlPointsDistance,
            angle: measuredPicket.angle,
            measuredPicket: measuredPicket.calculatedPicket,
            path: this.createPath(station.startingPoint, measuredPicket.calculatedPicket),
            isEndPoint: false
          });
        });
      });
    });
  }

  private calculateControlPointsDistance(startingPoint: PicketReport, endPoint: PicketReport): number {
    const res1 = Math.pow((endPoint.latitude - startingPoint.latitude), 2);
    const res2 = Math.pow((Math.cos(((startingPoint.latitude * Math.PI) / 180)) * (endPoint.longitude - startingPoint.longitude)), 2);

    return +((Math.sqrt(res1 + res2)) * (40075.704 / 360) * 1000).toFixed(2) ;
  }

  private createPath(picketFrom: PicketReport, picketTo: PicketReport): LatLngLiteral[] {
    return [
      { lat: picketFrom.latitude,  lng: picketFrom.longitude },
      { lat: picketTo.latitude,  lng: picketTo.longitude }
    ];
  }
}

export const measurementRoutes: Routes = [
  {
    path: ':id',
    component: MeasurementComponent,
    resolve: {
      measurement: MeasurementResolverService
    }
  }
];

export const measurementProviders = [
  MeasurementResolverService
];
