import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import { ActivatedRoute, Routes } from '@angular/router';
import { MeasurementResolverService } from '../measurements/measurement/measurement-resolver.service';
import { MeasurementsModel } from '../measurements/measurements.model';
import { MeasurementsService } from '../measurements/measurements.service';
import { Picket } from '../measurements/pickets/picket.model';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddPicketModalComponent } from './add-picket-modal/add-picket-modal.component';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from '../general/utils.service';
import { District } from '../measurements/district/district.model';
import { DistrictResolverService } from '../measurements/district/district-resolver.service';
import { NotificationService } from '../general/notification.service';
import { AddObjectModalComponent } from './add-object-modal/add-object-modal.component';
import { GeodeticObject } from '../measurements/measurement/geodeticobject/geodetic-object.model';
import { GeodeticObjectService } from '../measurements/measurement/geodeticobject/geodetic-object.service';
import { GeodeticObjectDto } from '../measurements/measurement/geodeticobject/geodetic-object-dto.model';
import { EditObjectModalComponent } from './edit-object-modal/edit-object-modal.component';
import {
  PicketsUploadingInfoHelperComponent
} from '../measurements/measurement/pickets-uploading-info-helper/pickets-uploading-info-helper.component';
import { TachymetryReport } from '../tachymetry/models/tachymetry-report/tachymetry-report.model';
import { PicketReport } from '../tachymetry/models/tachymetry-report/picket-report.model';
import { LatLngLiteral } from '@agm/core';
import { TachymetryService } from '../tachymetry/tachymetry.service';
import { TachymetryViewComponent } from '../measurements/measurement/tachymetry/tachymetry-view/tachymetry-view.component';
import { SpinnerService } from '../general/spinner/spinner.service';

@Component({
  selector: 'app-edit-measurement-form',
  templateUrl: './edit-measurement-form.component.html',
  styleUrls: ['./edit-measurement-form.component.scss']
})
export class EditMeasurementFormComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private measurementsService: MeasurementsService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private utilsService: UtilsService,
    private notificationService: NotificationService,
    private geodeticObjectService: GeodeticObjectService,
    private tachymetryService: TachymetryService,
    private spinnerService: SpinnerService
  ) {
    this.mapWidth = (window.innerWidth * 0.50).toFixed(0) + 'px';
    this.mapHeight = (window.innerHeight * 0.75).toFixed(0) + 'px';
    this.tableHeight = (window.innerHeight * 0.055).toFixed(0) + 'vh';
    this.spinnerService.show();
  }

  get name() {
    return this.measurementForm.get('name');
  }

  get owner() {
    return this.measurementForm.get('owner');
  }

  get place() {
    return this.measurementForm.get('place');
  }

  get district() {
    return this.measurementForm.get('district');
  }

  get pickets() {
    return (this.measurementForm.get('pickets') as FormArray).controls;
  }
  currentDisplayedLongitude: number;
  currentDisplayedLatitude: number;
  zoom: number;
  mapWidth: string;
  mapHeight: string;
  tableHeight: string;

  measurement: MeasurementsModel;
  measurementForm: FormGroup;
  copyPicket: Picket[];
  districts: District[] = [];
  selectedDistrict: District;
  tachymetries: TachymetryReport[];

  picketAddedSubscription: Subscription;
  objectAddedSubscription: Subscription;
  objectEditedSubscription: Subscription;
  objectRemovedSubscription: Subscription;

  isObjectCreationMode = false;
  isGeodeticObjectsShown = false;
  isTachymetryShown = false;
  areGeodeticObjectsAlreadyFetched = false;
  picketInternalIdsToHighlight: string[] = [];

  editedObject: {
    objectPath: { picketInternalId: string, lat: number, lng: number } []
  }  = { objectPath: [] };

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

  geodeticObjectsSaved: GeodeticObjectDto[] = [];

  @ViewChild('attachments', {static: true}) attachment: any;
  fileReader = new FileReader();
  fileList: File[] = [];
  listOfFiles: any[] = [];
  fileToPicketIndexes = {};

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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mapWidth = (window.innerWidth * 0.50).toFixed(0) + 'px';
    this.mapHeight = (window.innerHeight * 0.75).toFixed(0) + 'px';
    this.tableHeight = (window.innerHeight * 0.055).toFixed(0) + 'vh';
  }

  private validateFile(lines: string[]): number[] {
    let index = 1;
    const validationResult = [];
    lines.forEach((line) => {
      const lineResultNegative = EditMeasurementFormComponent.validateSingleLine(line);

      if (lineResultNegative) {
        validationResult.push(index);
      }
      index++;
    });

    return validationResult;
  }

  private addNewPicketFromTxtFile(picket: string[]): void {
    const newPicket = new Picket();
    newPicket.name = picket[0];
    newPicket.coordinateX2000 = +picket[1];
    newPicket.coordinateY2000 = +picket[2];
    this.onAddPicket(newPicket, this.copyPicket);
  }

  ngOnInit(): void {
    this.measurementForm = new FormGroup({
      id: new FormControl(null),
      creationDate: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      place: new FormControl(null, [Validators.required]),
      owner: new FormControl(null, [Validators.required]),
      districtId: new FormControl(null, [Validators.required]),
      pickets: new FormArray([])
    });

    this.route.data.subscribe((resolve) => {
      this.measurement = resolve.measurement;
      this.route.data.subscribe((districts) => {
        this.districts = districts.districts;
        if (this.measurement) {
          this.selectedDistrict = this.measurement.district;
          this.copyPicket = this.measurement.pickets.slice();
          this.measurementForm.patchValue({
            name: this.measurement.name,
            place: this.measurement.place,
            owner: this.measurement.owner,
            districtId: this.measurement.district.id
          });

          if (this.measurement.pickets && this.measurement.pickets.length) {
            this.measurement.pickets.forEach((picket) => {
              this.onAddPicket(picket);
            });
          }
        }
        this.spinnerService.hide();
      }, error => {
        this.spinnerService.hide();
        this.utilsService.createErrorMessage(error.error.errors);
      });
    }, error => {
      this.spinnerService.hide();
      this.utilsService.createErrorMessage(error.error.errors);
    });
  }

  ngOnDestroy(): void {
    if (this.picketAddedSubscription) {
      this.picketAddedSubscription.unsubscribe();
    }

    if (this.objectAddedSubscription) {
      this.objectAddedSubscription.unsubscribe();
    }

    if (this.objectEditedSubscription) {
      this.objectEditedSubscription.unsubscribe();
    }
  }

  createEmptyPicketForm() {
    const control = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      longitude: new FormControl(null),
      latitude: new FormControl(null),
      coordinateX2000: new FormControl(null),
      coordinateY2000: new FormControl(null),
      picketInternalId: new FormControl(null)
    }, [AtLeastOneCoordinatesSystemValidator, coordinates2000FieldValidator,
      coordinatesGoogleFieldValidator]);

    (this.measurementForm.get('pickets') as FormArray).push(control);
  }

  onAddPicket(picket?: Picket, copyPickets?: Picket[]) {
    const control = new FormGroup({
      name: new FormControl(picket.name, [Validators.required]),
      longitude: new FormControl(picket.longitude),
      latitude: new FormControl(picket.latitude),
      coordinateX2000: new FormControl(picket.coordinateX2000),
      coordinateY2000: new FormControl(picket.coordinateY2000),
      picketInternalId: new FormControl(picket.picketInternalId)
    }, [AtLeastOneCoordinatesSystemValidator, coordinates2000FieldValidator, coordinatesGoogleFieldValidator]);

    (this.measurementForm.get('pickets') as FormArray).push(control);

    if (copyPickets) {
      copyPickets.push(picket);
    }
  }

  onEditPicket(event: { picketEdited: Picket, index: number }) {
    const control = new FormGroup({
      name: new FormControl(event.picketEdited.name, [Validators.required]),
      longitude: new FormControl(event.picketEdited.longitude),
      latitude: new FormControl(event.picketEdited.latitude),
      coordinateX2000: new FormControl(event.picketEdited.coordinateX2000),
      coordinateY2000: new FormControl(event.picketEdited.coordinateY2000),
      picketInternalId: new FormControl(event.picketEdited.picketInternalId, [Validators.required])
    }, [AtLeastOneCoordinatesSystemValidator, coordinates2000FieldValidator,
      coordinatesGoogleFieldValidator]);

    (this.measurementForm.get('pickets') as FormArray).setControl(event.index, control);

    const copyPicketEdited = this.copyPicket.slice();
    copyPicketEdited[event.index] = event.picketEdited;
    this.copyPicket = copyPicketEdited.slice();
  }

  onPicketAddedFromMap(event: Picket) {
    this.openAddPicketModal(event);
  }

  onPicketEditedFromMap(event: { picket: Picket, index: number }) {
    if (!this.isObjectCreationMode) {
      this.openAddPicketModal(event.picket, event.index);
    } else {
      this.picketInternalIdsToHighlight.push(event.picket.picketInternalId);
      const newPath = this.editedObject.objectPath.slice();
      newPath.push({
        picketInternalId: event.picket.picketInternalId,
        lat: event.picket.latitude,
        lng: event.picket.longitude
      });
      this.editedObject.objectPath = newPath;
    }
  }

  onObjectFinished(event: { picket: Picket, index: number }) {
    if (!this.editedObject.objectPath.length) {
      this.notificationService.showError('Caanot create object with one picket only.', null);
      return;
    }

    this.picketInternalIdsToHighlight.push(event.picket.picketInternalId);
    const newPath = this.editedObject.objectPath.slice();
    newPath.push({
      picketInternalId: event.picket.picketInternalId,
      lat: event.picket.latitude,
      lng: event.picket.longitude
    });
    this.editedObject.objectPath = newPath;
    this.openAddObjectModal(this.editedObject.objectPath);
  }

  onObjectLineClicked(event: GeodeticObjectDto) {
    const ngbModalOptions: NgbModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    };

    const modalRef = this.modalService.open(EditObjectModalComponent, ngbModalOptions);
    modalRef.componentInstance.geodeticObject = event;
    modalRef.componentInstance.measurementInternalId = this.measurement.measurementInternalId;

    this.objectEditedSubscription = modalRef.componentInstance.objectEdited.subscribe((objectEdited: GeodeticObject) => {
      this.geodeticObjectService.updateGeodeticObject(objectEdited).subscribe((geodeticObjectUpdated) => {
        this.notificationService.showSuccess('Object ' + objectEdited.name + ' has been updated', null);
        this.fetchGeodeticObjects();
      }, error => {
        this.notificationService.showError(this.utilsService.createErrorMessage(error.error.errors), null);
      });
    });

    this.objectRemovedSubscription = modalRef.componentInstance.objectRemoved.subscribe((objectRemoved: GeodeticObject) => {
      this.geodeticObjectService.deleteObject(objectRemoved.id).subscribe((result) => {
        this.notificationService.showSuccess('Geodetic object has been removed', null);
        this.fetchGeodeticObjects();
      }, error => {
        this.notificationService.showError(this.utilsService.createErrorMessage(error.error.errors), null);
      });
    });
  }

  onChangeDistrict(district: District) {
    this.measurementForm.patchValue({ districtId: district.id });
    this.selectedDistrict = district;
  }

  getDistrict(): string {
    if (this.selectedDistrict) {
      return this.selectedDistrict.name;
    }

    return '';
  }

  private openAddObjectModal(path: { picketInternalId: string, lat: number, lng: number }[]) {
    const ngbModalOptions: NgbModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    };

    const modalRef = this.modalService.open(AddObjectModalComponent, ngbModalOptions);
    modalRef.componentInstance.path = path;
    modalRef.componentInstance.measurementInternalId = this.measurement.measurementInternalId;

    this.objectAddedSubscription = modalRef.componentInstance.objectAdded.subscribe((objectAdded: GeodeticObject) => {
      this.geodeticObjectService.createGeodeticObject(objectAdded).subscribe((objectSaved: GeodeticObjectDto) => {
        this.geodeticObjectsSaved.push(objectSaved);
      }, error => {
        this.notificationService.showError(this.utilsService.createErrorMessage(error.error.errors), null);
      });
    });

    this.editedObject.objectPath = [];
    this.picketInternalIdsToHighlight = [];
  }

  private openAddPicketModal(picket: Picket, index?: number) {
    const ngbModalOptions: NgbModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    };

    const modalRef = this.modalService.open(AddPicketModalComponent, ngbModalOptions);
    modalRef.componentInstance.picketFromMap = picket;
    modalRef.componentInstance.index = index;

    this.picketAddedSubscription = modalRef.componentInstance.picketAdded.subscribe((picketAdded: Picket) => {
      this.onAddPicket(picketAdded, this.copyPicket);
    });

    this.picketAddedSubscription = modalRef.componentInstance.picketEdited.subscribe((event: {picketEdited: Picket, index: number }) => {
      this.onEditPicket(event);
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

  onRemovePicket(index: number) {
    (this.measurementForm.get('pickets') as FormArray).removeAt(index);
    this.copyPicket.splice(index, 1);
  }

  onPicketTableHover(picket: AbstractControl) {
    this.currentDisplayedLongitude = picket.value.longitude;
    this.currentDisplayedLatitude = picket.value.latitude;
    this.zoom = this.zoom === 20 ? 19 : 20;
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
        this.notificationService.showError('You have set picket incorrectly in lines: ' + validationResult.toString(),
          null);
        this.removeSelectedFile(0);
        return;
      }

      const lengthBefore = (this.measurementForm.get('pickets') as FormArray).length;
      lines.forEach((line) => {
        this.addNewPicketFromTxtFile(line.split(' '));
      });
      const lengthAfter = (this.measurementForm.get('pickets') as FormArray).length;
      this.fileToPicketIndexes[this.fileList.length - 1] = {lengthBefore, lengthAfter};
    };

    this.fileReader.readAsText(file);
    this.attachment.nativeElement.value = '';
  }

  removeSelectedFile(index) {
    this.listOfFiles.splice(index, 1);
    this.fileList.splice(index, 1);

    if (this.fileToPicketIndexes[index]) {
      const picketsToDelete = this.fileToPicketIndexes[index];
      for (let i = picketsToDelete.lengthAfter - 1; i >= picketsToDelete.lengthBefore; i--) {
        (this.measurementForm.get('pickets') as FormArray).removeAt(i);
      }
    }
  }

  switchObjectCreationMode() {
    this.isObjectCreationMode = !this.isObjectCreationMode;
  }

  switchGeodeticObjectsShown() {
    if (!this.isGeodeticObjectsShown && !this.areGeodeticObjectsAlreadyFetched) {
      this.geodeticObjectService.getGeodeticObjects(this.measurement.measurementInternalId)
        .subscribe((geodeticObjects: GeodeticObjectDto[]) => {
            this.geodeticObjectsSaved = geodeticObjects;
          }, error => {
            this.notificationService.showError(this.utilsService.createErrorMessage(error.error.errors), null);
        });
      this.areGeodeticObjectsAlreadyFetched = true;
      this.isGeodeticObjectsShown = !this.isGeodeticObjectsShown;
    } else if (this.areGeodeticObjectsAlreadyFetched && !this.isGeodeticObjectsShown) {
      this.isGeodeticObjectsShown = !this.isGeodeticObjectsShown;
    } else {
      this.isGeodeticObjectsShown = !this.isGeodeticObjectsShown;
    }
  }

  openPicketsUploadingHelper() {
    const ngbModalOptions: NgbModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'xl'
    };

    this.modalService.open(PicketsUploadingInfoHelperComponent, ngbModalOptions);
  }

  showTachymetry() {
    if (this.isTachymetryShown) {
      this.measuredTachymetryPickets = [];
      this.isTachymetryShown = !this.isTachymetryShown;
      return;
    }

    this.tachymetryService.getTachymetries(this.measurement.measurementInternalId).subscribe((tachymetries: TachymetryReport[]) => {
      this.tachymetries = tachymetries;
      this.createPathsForMap(tachymetries);
      this.isTachymetryShown = !this.isTachymetryShown;
    }, (error => {
      this.notificationService.showError(this.utilsService.createErrorMessage(error.error.errors), null);
    }));
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

  private fetchGeodeticObjects() {
    this.geodeticObjectsSaved = [];
    this.geodeticObjectService.getGeodeticObjects(this.measurement.measurementInternalId)
      .subscribe((geodeticObjects: GeodeticObjectDto[]) => {
        this.geodeticObjectsSaved = geodeticObjects;
      }, error => {
        this.notificationService.showError(this.utilsService.createErrorMessage(error.error.errors), null);
      });
  }

  onSubmit() {
    const measurementFormValues = this.measurementForm.value;
    measurementFormValues.measurementInternalId = this.measurement.measurementInternalId;

    this.measurementsService.updateMeasurement(measurementFormValues).subscribe((measurementUpdated: MeasurementsModel) => {
      this.notificationService.showSuccess('Measurement has been edited', null);
    }, (error => {
      this.notificationService.showError(this.utilsService.createErrorMessage(error.error.errors), null);
    }));
  }
}

export function AtLeastOneCoordinatesSystemValidator(group: FormGroup): {[key: string]: any} {
  let isAtLeastOne = false;
  const coordinates2000 = [];
  const coordinatesGoogle = [];
  if (group && group.controls) {
    for (const control in group.controls) {
      if (control === 'coordinateX2000' || control === 'coordinateY2000') {
        coordinates2000.push(control);
      }

      if (control === 'longitude' || control === 'latitude') {
        coordinatesGoogle.push(control);
      }
    }

    if ((coordinates2000.length === 2 && group.controls[coordinates2000[0]].value && group.controls[coordinates2000[1]].value) ||
      (coordinatesGoogle.length === 2 && group.controls[coordinatesGoogle[0]].value && group.controls[coordinatesGoogle[1]].value)) {
      isAtLeastOne = true;
    } else {
      isAtLeastOne = false;
    }
  }
  return isAtLeastOne ? null : { required: true };
}

export const coordinates2000FieldValidator = (formGroup: FormGroup): ValidationErrors | null => {
  const [coordinateX2000ControlValue, coordinateY2000ControlValue] = [
    formGroup.get('coordinateX2000')!.value,
    formGroup.get('coordinateY2000')!.value
  ];

  return coordinateX2000ControlValue && !coordinateY2000ControlValue
    ? { linkedField: { value: coordinateY2000ControlValue } }
    : null;
};

export const coordinatesGoogleFieldValidator = (formGroup: FormGroup): ValidationErrors | null => {
  const [latitudeControlValue, longitudeControlValue] = [
    formGroup.get('latitude')!.value,
    formGroup.get('longitude')!.value
  ];

  return latitudeControlValue && !longitudeControlValue
    ? { linkedField: { value: longitudeControlValue } }
    : null;
};

export const editMeasurementRoutes: Routes = [
  {
    path: 'edit/:id',
    component: EditMeasurementFormComponent,
    resolve: {
      measurement: MeasurementResolverService,
      districts: DistrictResolverService
    }
  }
];

export const editMeasurementProviders = [
  MeasurementResolverService, DistrictResolverService
];
