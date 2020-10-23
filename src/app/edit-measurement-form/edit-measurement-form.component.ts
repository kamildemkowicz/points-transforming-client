import { Component, OnDestroy, OnInit } from '@angular/core';
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
import {District} from "../measurements/district/district.model";
import {DistrictResolverService} from "../measurements/district/district-resolver.service";

@Component({
  selector: 'app-edit-measurement-form',
  templateUrl: './edit-measurement-form.component.html',
  styleUrls: ['./edit-measurement-form.component.scss']
})
export class EditMeasurementFormComponent implements OnInit, OnDestroy {
  measurement: MeasurementsModel;
  measurementForm: FormGroup;
  picketAddedSubscription: Subscription;
  copyPicket: Picket[];
  districts: District[] = [];
  selectedDistrict: District;

  constructor(
    private route: ActivatedRoute,
    private measurementsService: MeasurementsService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private utilsService: UtilsService
  ) { }

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

          this.measurement.pickets.forEach((picket) => {
            this.onAddPicket(picket);
          });
        }
      }, error => this.utilsService.createErrorMessage(error.error.errors));
    }, error => this.utilsService.createErrorMessage(error.error.errors));
  }

  ngOnDestroy(): void {
    if (this.picketAddedSubscription) {
      this.picketAddedSubscription.unsubscribe();
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
    this.openAddPicketModal(event.picket, event.index);
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

  onSubmit() {
    const measurementFormValues = this.measurementForm.value;
    measurementFormValues.measurementInternalId = this.measurement.measurementInternalId;

    this.measurementsService.updateMeasurement(measurementFormValues).subscribe((measurementUpdated: MeasurementsModel) => {
      this.toastr.success('Measurement has been edited', null);
    }, (error => {
      this.toastr.error( this.utilsService.createErrorMessage(error.error.errors));
    })
    );
  }
}

export function AtLeastOneFieldValidator(group: FormGroup): {[key: string]: any} {
  let isAtLeastOne = false;
  if (group && group.controls) {
    console.log(group.controls);
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
