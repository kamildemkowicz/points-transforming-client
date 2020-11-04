import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MeasurementsModel } from '../../measurements/measurements.model';
import { GeodeticObjectDto } from '../../measurements/measurement/geodeticobject/geodetic-object-dto.model';
import { GeodeticObjectService } from '../../measurements/measurement/geodeticobject/geodetic-object.service';
import { NotificationService } from '../../general/notification.service';
import { UtilsService } from '../../general/utils.service';
import { SpinnerService } from '../../general/spinner/spinner.service';

@Component({
  selector: 'app-measurement-board',
  templateUrl: './measurement-board.component.html',
  styleUrls: ['./measurement-board.component.scss']
})
export class MeasurementBoardComponent implements OnInit {
  @Input() measurement: MeasurementsModel;

  geodeticObjectsSaved: GeodeticObjectDto[];
  mapWidth: string;
  mapHeight: string;

  constructor(
    private geodeticObjectService: GeodeticObjectService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() {
    this.mapWidth = (window.innerWidth * 0.29).toFixed(0) + 'px';
    this.mapHeight = (window.innerHeight * 0.45).toFixed(0) + 'px';

    this.geodeticObjectService.getGeodeticObjects(this.measurement.measurementInternalId)
      .subscribe((geodeticObjects: GeodeticObjectDto[]) => {
        this.geodeticObjectsSaved = geodeticObjects;
      }, error => {
        this.notificationService.showError(this.utilsService.createErrorMessage(error.error.errors), null);
      });
  }

  showSpinner() {
    this.spinnerService.show();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mapWidth = (window.innerWidth * 0.29).toFixed(0) + 'px';
    this.mapHeight = (window.innerHeight * 0.45).toFixed(0) + 'px';
  }
}
