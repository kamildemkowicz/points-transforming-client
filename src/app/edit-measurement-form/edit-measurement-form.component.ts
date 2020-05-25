import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Routes } from '@angular/router';
import { MeasurementResolverService } from '../measurements/measurement/measurement-resolver.service';
import { MeasurementsModel } from '../measurements/measurements.model';
import { MeasurementsService } from '../measurements/measurements.service';
import { Picket } from '../measurements/pickets/picket.model';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddPicketModalComponent } from './add-picket-modal/add-picket-modal.component';
import { Subscription } from 'rxjs';

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

  constructor(
    private route: ActivatedRoute,
    private measurementsService: MeasurementsService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.measurementForm = new FormGroup({
      id: new FormControl(null),
      creationDate: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      place: new FormControl(null, [Validators.required]),
      owner: new FormControl(null, [Validators.required]),
      pickets: new FormArray([])
    });

    this.route.data.subscribe((resolve) => {
      this.measurement = resolve.measurement;

      if (this.measurement) {
        this.copyPicket = this.measurement.pickets.slice();
        this.measurementForm.patchValue({
          name: this.measurement.name,
          place: this.measurement.place,
          owner: this.measurement.owner
        });

        this.measurement.pickets.forEach((picket) => {
          this.onAddPicket(picket);
        });
      }
    });
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

  get pickets() {
    return (this.measurementForm.get('pickets') as FormArray).controls;
  }

  createEmptyPicketForm() {
    const control = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      coordinateX: new FormControl(null, [Validators.required]),
      coordinateY: new FormControl(null, [Validators.required])
    });

    (this.measurementForm.get('pickets') as FormArray).push(control);
  }

  onAddPicket(picket?: Picket, copyPickets?: Picket[]) {
    const control = new FormGroup({
      name: new FormControl(picket.name, [Validators.required]),
      coordinateX: new FormControl(picket.coordinateX, [Validators.required]),
      coordinateY: new FormControl(picket.coordinateY, [Validators.required])
    });

    (this.measurementForm.get('pickets') as FormArray).push(control);

    if (copyPickets) {
      copyPickets.push(picket);
    }
  }

  onPicketAddedFromMap(event: Picket) {
    this.openAddPicketModal(event);
  }

  private openAddPicketModal(picket: Picket) {
    const ngbModalOptions: NgbModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    };

    const modalRef = this.modalService.open(AddPicketModalComponent, ngbModalOptions);
    modalRef.componentInstance.picketFromMap = picket;

    this.picketAddedSubscription = modalRef.componentInstance.picketAdded.subscribe((picketAdded: Picket) => {
      this.onAddPicket(picketAdded, this.copyPicket);
    });
  }

  onRemovePicket(index: number) {
    (this.measurementForm.get('pickets') as FormArray).removeAt(index);
  }

  onSubmit() {
    this.measurementsService.updateMeasurement(this.measurementForm.value).subscribe((measurementUpdated: MeasurementsModel) => {
      console.log(measurementUpdated);
    });
    this.measurementForm.reset();
  }

}

export const editMeasurementRoutes: Routes = [
  {
    path: 'edit/:id',
    component: EditMeasurementFormComponent,
    resolve: {
      measurement: MeasurementResolverService
    }
  }
];

export const editMeasurementProviders = [
  MeasurementResolverService
];
