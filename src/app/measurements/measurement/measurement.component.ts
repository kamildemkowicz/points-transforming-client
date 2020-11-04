import {Component, HostListener, OnInit} from '@angular/core';
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
import { GeodeticObjectDto } from './geodeticobject/geodetic-object-dto.model';
import { GeodeticObjectService } from './geodeticobject/geodetic-object.service';
import { NotificationService } from '../../general/notification.service';
import { EditObjectModalComponent } from '../../edit-measurement-form/edit-object-modal/edit-object-modal.component';

@Component({
  selector: 'app-measurement',
  templateUrl: './measurement.component.html',
  styleUrls: ['./measurement.component.scss']
})
export class MeasurementComponent implements OnInit {
  measurement: MeasurementsModel;
  tachymetries: TachymetryReport[];

  measuredTachymetryPickets: {
    startingPoint: PicketReport,
    endPoint: PicketReport,
    angle: number,
    distance: number,
    controlPointsDistance: number,
    measuredPicket: PicketReport,
    isEndPoint: boolean,
    path: LatLngLiteral[]
  } [] = [];

  geodeticObjects: GeodeticObjectDto[] = [];

  currentDisplayedLatitude: number;
  currentDisplayedLongitude: number;
  zoom: number;
  mapWidth: string;
  mapHeight: string;

  constructor(
    private route: ActivatedRoute,
    private tachymetryService: TachymetryService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private utilsService: UtilsService,
    private geodeticObjectService: GeodeticObjectService,
    private notificationService: NotificationService
  ) {
    if (window.innerWidth < 1500) {
      this.mapWidth = (window.innerWidth * 0.32).toFixed(0) + 'px';
    } else {
      this.mapWidth = (window.innerWidth * 0.42).toFixed(0) + 'px';
    }
    this.mapHeight = (window.innerHeight * 0.86).toFixed(0) + 'px';
  }

  ngOnInit() {
    this.route.data.subscribe((resolve) => {
      this.measurement = resolve.measurement;
      if (this.measurement && this.measurement.pickets && this.measurement.pickets.length) {
        this.currentDisplayedLongitude = this.measurement.pickets[0].longitude;
        this.currentDisplayedLatitude = this.measurement.pickets[0].latitude;
      }
    }, error => {
      this.notificationService.showError(this.utilsService.createErrorMessage(error.error.errors), null);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mapHeight = (window.innerHeight * 0.86).toFixed(0) + 'px';
    if (window.innerWidth < 1500) {
      this.mapWidth = (window.innerWidth * 0.32).toFixed(0) + 'px';
    } else {
      this.mapWidth = (window.innerWidth * 0.42).toFixed(0) + 'px';
    }

  }

  onPicketChanged(picket: Picket) {
    this.currentDisplayedLongitude = picket.longitude;
    this.currentDisplayedLatitude = picket.latitude;
    this.zoom = this.zoom === 20 ? 19 : 20;
  }

  onShowTachymetry(showTachymetry: boolean) {
    if (!showTachymetry) {
      this.measuredTachymetryPickets = [];
      return;
    }

    this.tachymetryService.getTachymetries(this.measurement.measurementInternalId).subscribe((tachymetries: TachymetryReport[]) => {
      this.tachymetries = tachymetries;
      this.createPathsForMap(tachymetries);
    }, (error => {
      this.notificationService.showError(this.utilsService.createErrorMessage(error.error.errors), null);
    }));
  }

  onShowGeodeticObjects(showGeodeticObjects: boolean) {
    if (!showGeodeticObjects) {
      this.geodeticObjects = [];
      return;
    }

    this.geodeticObjectService.getGeodeticObjects(this.measurement.measurementInternalId)
      .subscribe((geodeticObjects: GeodeticObjectDto[]) => {
        this.geodeticObjects = geodeticObjects;
        }, error => {
        this.notificationService.showError(this.utilsService.createErrorMessage(error.error.errors), null);
      });
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

  onGeodeticObjectLineClicked(event: GeodeticObjectDto) {
    const ngbModalOptions: NgbModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    };

    const modalRef = this.modalService.open(EditObjectModalComponent, ngbModalOptions);
    modalRef.componentInstance.geodeticObject = event;
    modalRef.componentInstance.isReadOnlyMode = true;
  }

  private createPathsForMap(tachymetries: TachymetryReport[]) {
    tachymetries.forEach((tachymetry) => {
      tachymetry.measuringStations.forEach((station) => {
        const controlPointsDistance = this.utilsService.calculateControlPointsDistance(station.startingPoint, station.endPoint);
        this.measuredTachymetryPickets.push({
          startingPoint: station.startingPoint,
          endPoint: station.endPoint,
          distance: 0,
          controlPointsDistance,
          angle: 0,
          measuredPicket: station.endPoint,
          path: this.utilsService.createPath(station.startingPoint, station.endPoint),
          isEndPoint: true
        });

        station.measuringPickets.forEach((measuredPicket) => {
          this.measuredTachymetryPickets.push({
            startingPoint: station.startingPoint,
            endPoint: station.endPoint,
            distance: measuredPicket.distance,
            controlPointsDistance,
            angle: measuredPicket.angle,
            measuredPicket: measuredPicket.calculatedPicket,
            path: this.utilsService.createPath(station.startingPoint, measuredPicket.calculatedPicket),
            isEndPoint: false
          });
        });
      });
    });
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
