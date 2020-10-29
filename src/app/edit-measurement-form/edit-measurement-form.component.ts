import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-edit-measurement-form',
  templateUrl: './edit-measurement-form.component.html',
  styleUrls: ['./edit-measurement-form.component.scss']
})
export class EditMeasurementFormComponent implements OnInit, OnDestroy {
  measurement: MeasurementsModel;
  measurementForm: FormGroup;
  picketAddedSubscription: Subscription;
  objectAddedSubscription: Subscription;
  copyPicket: Picket[];
  districts: District[] = [];
  selectedDistrict: District;

  isObjectCreationMode = false;
  isGeodeticObjectsShown = false;
  areGeodeticObjectsAlreadyFetched = false;
  picketInternalIdsToHighlight: string[] = [];

  editedObject: {
    objectPath: { picketInternalId: string, lat: number, lng: number } []
  }  = { objectPath: [] };
  currentObjectIndex = 0;

  objectsCreated: {
    symbol: string,
    color: string,
    objectPath: { picketInternalId: string, lat: number, lng: number }[]
  } [] = [];

  geodeticObjectsSaved: GeodeticObjectDto[] = [];

  @ViewChild('attachments', {static: true}) attachment: any;
  fileReader = new FileReader();
  fileList: File[] = [];
  listOfFiles: any[] = [];
  fileToPicketIndexes = {};

  constructor(
    private route: ActivatedRoute,
    private measurementsService: MeasurementsService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private utilsService: UtilsService,
    private notificationService: NotificationService,
    private geodeticObjectService: GeodeticObjectService
  ) { }

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
      pickets: new FormArray([]),
      geodeticObjects: new FormArray([])
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
      }, error => this.utilsService.createErrorMessage(error.error.errors));
    }, error => this.utilsService.createErrorMessage(error.error.errors));
  }

  ngOnDestroy(): void {
    if (this.picketAddedSubscription) {
      this.picketAddedSubscription.unsubscribe();
    }

    if (this.objectAddedSubscription) {
      this.objectAddedSubscription.unsubscribe();
    }
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

  createEmptyPicketForm() {
    const control = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      longitude: new FormControl(null),
      latitude: new FormControl(null),
      coordinateX2000: new FormControl(null),
      coordinateY2000: new FormControl(null),
      picketInternalId: new FormControl(null)
    }, AtLeastOneFieldValidator);

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
    }, AtLeastOneFieldValidator);

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
    }, AtLeastOneFieldValidator);

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

    this.objectAddedSubscription = modalRef.componentInstance.objectEdited.subscribe((objectEdited: GeodeticObject) => {
      this.addGeodeticObjectToForm(objectEdited);
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

    this.objectAddedSubscription = modalRef.componentInstance.objectAdded.subscribe((objectAdded: GeodeticObject) => {
      this.objectsCreated[this.currentObjectIndex] = { symbol: objectAdded.symbol, color: objectAdded.color, objectPath: [] };
      this.objectsCreated[this.currentObjectIndex].objectPath = this.editedObject.objectPath.slice();
      this.editedObject.objectPath = [];
      this.picketInternalIdsToHighlight = [];
      this.currentObjectIndex++;
      this.addGeodeticObjectToForm(objectAdded);
    });
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

  onRemovePicket(index: number) {
    (this.measurementForm.get('pickets') as FormArray).removeAt(index);
    this.copyPicket.splice(index, 1);
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

          geodeticObjects.forEach((geodeticObject) => {
            this.addGeodeticObjectDtoToForm(geodeticObject);
          });
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

  addGeodeticObjectToForm(geodeticObject: GeodeticObject) {
    const control = new FormGroup({
      id: new FormControl(geodeticObject.id),
      name: new FormControl(geodeticObject.name, [Validators.required]),
      description: new FormControl(geodeticObject.description),
      symbol: new FormControl(geodeticObject.symbol, [Validators.required]),
      color: new FormControl(geodeticObject.color, [Validators.required]),
      singleLines: new FormArray([])
    });

    geodeticObject.singleLines.forEach((singleLine) => {
      const singleLineControl = new FormGroup({
        id: new FormControl(singleLine.id),
        startPicketInternalId: new FormControl(singleLine.startPicketInternalId, [Validators.required]),
        endPicketInternalId: new FormControl(singleLine.endPicketInternalId, [Validators.required])
      });

      (control.get('singleLines') as FormArray).push(singleLineControl);
    });

    (this.measurementForm.get('geodeticObjects') as FormArray).push(control);
  }

  addGeodeticObjectDtoToForm(geodeticObject: GeodeticObjectDto) {
    const control = new FormGroup({
      id: new FormControl(geodeticObject.id),
      name: new FormControl(geodeticObject.name, [Validators.required]),
      description: new FormControl(geodeticObject.description),
      symbol: new FormControl(geodeticObject.symbol, [Validators.required]),
      color: new FormControl(geodeticObject.color, [Validators.required]),
      singleLines: new FormArray([])
    });

    geodeticObject.singleLines.forEach((singleLine) => {
      const singleLineControl = new FormGroup({
        id: new FormControl(singleLine.id),
        startPicketInternalId: new FormControl(singleLine.startPicket.picketInternalId, [Validators.required]),
        endPicketInternalId: new FormControl(singleLine.endPicket.picketInternalId, [Validators.required])
      });

      (control.get('singleLines') as FormArray).push(singleLineControl);
    });

    (this.measurementForm.get('geodeticObjects') as FormArray).push(control);
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

// TODO
export function AtLeastOneFieldValidator(group: FormGroup): {[key: string]: any} {
  let isAtLeastOne = false;
  if (group && group.controls) {
    for (const control in group.controls) {
      if (group.controls.hasOwnProperty(control) && group.controls[control].valid && group.controls[control].value) {
        isAtLeastOne = true;
        break;
      }
    }
  }
  return isAtLeastOne ? null : { required: true };
}

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
