import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { MeasurementsModel } from '../../measurements/measurements.model';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { AddMeasuringStationModalComponent } from './add-measuring-station-modal/add-measuring-station-modal.component';
import { Subscription } from 'rxjs';
import { GeodeticControlNetworkPoint } from '../models/geodetic-control-network-point.model';
import { MeasuringStation } from '../models/measuring-station.model';
import { TachymetryService } from '../tachymetry.service';
import { TachymetryReport } from '../models/tachymetry-report/tachymetry-report.model';
import { PicketMeasurementData } from '../models/picket-measurement-data.model';

@Component({
  selector: 'app-tachymetry-form',
  templateUrl: './tachymetry-form.component.html',
  styleUrls: ['./tachymetry-form.component.scss']
})
export class TachymetryFormComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private tachymetryService: TachymetryService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  get tachymetryName() {
    return this.tachymetryForm.get('tachymetryMetaData.tachymetryName');
  }

  get temperature() {
    return this.tachymetryForm.get('tachymetryMetaData.temperature');
  }

  get tachymetrType() {
    return this.tachymetryForm.get('tachymetryMetaData.tachymetrType');
  }

  get pressure() {
    return this.tachymetryForm.get('tachymetryMetaData.pressure');
  }

  get measuringStations() {
    return (this.tachymetryForm.get('measuringStations') as FormArray).controls;
  }

  @ViewChild('attachments', {static: true}) attachment: any;
  measurementId: MeasurementsModel;
  tachymetryForm: FormGroup;
  fileReader = new FileReader();
  fileList: File[] = [];
  listOfFiles: any[] = [];
  fileToMeasuringStationIndexes = {};
  measuringStationAddedSubscription: Subscription;
  measuringStationEditedSubscription: Subscription;
  tachymetryReport: TachymetryReport;

  private static validateSingleLine(line: any): boolean {
    const splittedLine = line.split(' ');

    if (splittedLine.length !== 3) {
      return true;
    }

    if (isNaN(splittedLine[1])) {
      return true;
    }
    return isNaN(splittedLine[2]);
  }

  private static validateStationNumber(line: any): boolean {
    const splittedLine = line.split(' ');

    if (splittedLine.length !== 1) {
      return true;
    }

    return isNaN(splittedLine[0]);
  }

  private static createGeodeticControlNetworkPointRequest(geodeticControlPoint: GeodeticControlNetworkPoint) {
    return new FormGroup({
      name: new FormControl(geodeticControlPoint.name, [Validators.required]),
      coordinateX: new FormControl(geodeticControlPoint.coordinateX, [Validators.required]),
      coordinateY: new FormControl(geodeticControlPoint.coordinateY, [Validators.required])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.measurementId = param.id;
    });

    this.tachymetryForm = new FormGroup({
      internalMeasurementId: new FormControl(this.measurementId, [Validators.required]),
      tachymetryMetaData: new FormGroup({
        tachymetryName: new FormControl(null, [Validators.required]),
        tachymetrType: new FormControl(null, [Validators.required]),
        temperature: new FormControl(null),
        pressure: new FormControl(null)
      }),
      measuringStations: new FormArray([], [Validators.required])
    });
  }

  onAddMeasuringStation(measuringStationAdded: MeasuringStation) {
    const control = new FormGroup({
      stationNumber: new FormControl(measuringStationAdded.stationNumber, [Validators.required]),
      stationName: new FormControl(measuringStationAdded.stationName, [Validators.required]),
      startingPoint: TachymetryFormComponent.createGeodeticControlNetworkPointRequest(measuringStationAdded.startingPoint),
      endPoint: TachymetryFormComponent.createGeodeticControlNetworkPointRequest(measuringStationAdded.endPoint),
      picketsMeasurementData: new FormArray([])
    });

    measuringStationAdded.picketsMeasurementData.forEach((picket) => {
      const picketControl = new FormGroup({
        picketName: new FormControl(picket.picketName, [Validators.required]),
        distance: new FormControl(picket.distance, [Validators.required]),
        angle: new FormControl(picket.angle, [Validators.required])
      });
      (control.get('picketsMeasurementData') as FormArray).push(picketControl);
    });

    (this.tachymetryForm.get('measuringStations') as FormArray).push(control);
  }

  onEditMeasuringStation(event: {measuringStationEdited: MeasuringStation, index: number}) {
    const control = new FormGroup({
      stationNumber: new FormControl(event.measuringStationEdited.stationNumber, [Validators.required]),
      stationName: new FormControl(event.measuringStationEdited.stationName, [Validators.required]),
      startingPoint: TachymetryFormComponent.createGeodeticControlNetworkPointRequest(event.measuringStationEdited.startingPoint),
      endPoint: TachymetryFormComponent.createGeodeticControlNetworkPointRequest(event.measuringStationEdited.endPoint),
      picketsMeasurementData: new FormArray([])
    });

    event.measuringStationEdited.picketsMeasurementData.forEach((picket) => {
      const picketControl = new FormGroup({
        picketName: new FormControl(picket.picketName, [Validators.required]),
        distance: new FormControl(picket.distance, [Validators.required]),
        angle: new FormControl(picket.angle, [Validators.required])
      });
      (control.get('picketsMeasurementData') as FormArray).push(picketControl);
    });

    (this.tachymetryForm.get('measuringStations') as FormArray).setControl(event.index, control);
  }

  onRemoveMeasuringStation(index: number) {
    (this.tachymetryForm.get('measuringStations') as FormArray).removeAt(index);
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    for (let i = 0; i <= event.target.files.length - 1; i++) {
      const selectedFile = event.target.files[i];
      this.fileList.push(selectedFile);
      this.listOfFiles.push(selectedFile.name);
    }

    this.fileReader.onloadend = (e) => {
      const lines = (this.fileReader.result as string).split(/\r\n|\r|\n/g);

      const validationResult = this.validateFile(lines);

      if (validationResult.length) {
        this.toastr.error('You have set tachymetry incorrectly in lines: ' + validationResult.toString(),
          null);
        this.removeSelectedFile(0);
        return;
      }

      const lengthBefore = (this.tachymetryForm.get('measuringStations') as FormArray).length;
      this.addNewMeasuringStationsFromTxtFile(lines);
      const lengthAfter = (this.tachymetryForm.get('measuringStations') as FormArray).length;
      this.fileToMeasuringStationIndexes[this.fileList.length - 1] = {lengthBefore, lengthAfter};
    };

    this.fileReader.readAsText(file);
    this.attachment.nativeElement.value = '';
  }

  removeSelectedFile(index) {
    this.listOfFiles.splice(index, 1);
    this.fileList.splice(index, 1);

    if (this.fileToMeasuringStationIndexes[index]) {
      const picketsToDelete = this.fileToMeasuringStationIndexes[index];
      for (let i = picketsToDelete.lengthAfter - 1; i >= picketsToDelete.lengthBefore; i--) {
        (this.tachymetryForm.get('measuringStations') as FormArray).removeAt(i);
      }
    }
  }

  onSubmit() {
    this.tachymetryService.createTachymetry(this.tachymetryForm.value).subscribe((tachymetryReport: TachymetryReport) => {
        this.tachymetryReport = tachymetryReport;
      }, (error => {
        this.toastr.error(error.error.message, null, { timeOut: 3000 });
      })
    );
  }

  openEditMeasuringStation(measuringStationToEdit?: MeasuringStation, index?: number) {
    const ngbModalOptions: NgbModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'xl'
    };

    const modalRef = this.modalService.open(AddMeasuringStationModalComponent, ngbModalOptions);
    modalRef.componentInstance.measuringStationToEdit = measuringStationToEdit;
    modalRef.componentInstance.index = index;

    this.measuringStationAddedSubscription = modalRef.componentInstance.measuringStationAdded
      .subscribe((measuringStationAdded: any) => {
      this.onAddMeasuringStation(measuringStationAdded);
    });

    this.measuringStationEditedSubscription = modalRef.componentInstance.measuringStationEdited
      .subscribe((event: {measuringStationEdited: MeasuringStation, index: number }) => {
      this.onEditMeasuringStation(event);
    });
  }

  private validateFile(lines: string[]): number[] {
    let index = 1;
    let stationDetailsIndex = 1;
    let isStationDetails = true;
    const validationResult = [];

    lines.forEach((line) => {
      // station validation
      if (isStationDetails) {
        if (line !== '') {
          if (stationDetailsIndex === 1) {
            if (TachymetryFormComponent.validateStationNumber(line)) {
              validationResult.push(index);
            }
          }

          if (stationDetailsIndex === 3 || stationDetailsIndex === 4) {
            if (TachymetryFormComponent.validateSingleLine(line)) {
              validationResult.push(index);
            }
          }
          stationDetailsIndex++;
        } else {
          if (stationDetailsIndex !== 5) {
            this.toastr.error('Station is created incorrectly', null);
            return;
          } else {
            isStationDetails = false;
            stationDetailsIndex = 1;
          }
        }
      } else {

        // picket measuring data validation
        if (line !== '') {
          if (TachymetryFormComponent.validateSingleLine(line)) {
            validationResult.push(index);
          }
        } else {
          isStationDetails = true;
        }
      }
      index++;
    });

    return validationResult;
  }

  private addNewMeasuringStationsFromTxtFile(lines: string[]): void {
    let isStationDetails = true;
    let index = 1;
    let stationDetailsIndex = 1;
    let measuringStation = new MeasuringStation();
    measuringStation.picketsMeasurementData = [];

    lines.forEach(line => {
      // station creation
      if (isStationDetails) {
        if (line !== '') {
          if (stationDetailsIndex === 1) {
            measuringStation.stationNumber = +line;
          }

          if (stationDetailsIndex === 2) {
            measuringStation.stationName = line;
          }

          if (stationDetailsIndex === 3) {
            const splittedLine = line.split(' ');
            const startingGeodeticControlPoint = new GeodeticControlNetworkPoint();
            startingGeodeticControlPoint.name = splittedLine[0];
            startingGeodeticControlPoint.coordinateX = +splittedLine[1];
            startingGeodeticControlPoint.coordinateY = +splittedLine[2];
            measuringStation.startingPoint = startingGeodeticControlPoint;
          }

          if (stationDetailsIndex === 4) {
            const splittedLine = line.split(' ');
            const endGeodeticControlPoint = new GeodeticControlNetworkPoint();
            endGeodeticControlPoint.name = splittedLine[0];
            endGeodeticControlPoint.coordinateX = +splittedLine[1];
            endGeodeticControlPoint.coordinateY = +splittedLine[2];
            measuringStation.endPoint = endGeodeticControlPoint;
          }
          stationDetailsIndex++;
        } else {
            isStationDetails = false;
            stationDetailsIndex = 1;
        }
      } else {
        // picket measuring data creation
        if (line !== '') {
          const splittedLine = line.split(' ');
          const picketMeasurementData = new PicketMeasurementData();
          picketMeasurementData.picketName = splittedLine[0];
          picketMeasurementData.distance = +splittedLine[1];
          picketMeasurementData.angle = +splittedLine[2];
          measuringStation.picketsMeasurementData.push(picketMeasurementData);

          if (index === lines.length) {
            this.onAddMeasuringStation(measuringStation);
          }
        } else {
          this.onAddMeasuringStation(measuringStation);
          measuringStation = new MeasuringStation();
          measuringStation.picketsMeasurementData = [];
          isStationDetails = true;
        }
      }
      index++;
    });
  }
}

export const tachymetryFormRoutes: Routes = [
  {
    path: ':id',
    component: TachymetryFormComponent
  }
];
