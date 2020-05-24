import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Routes } from '@angular/router';
import { MeasurementResolverService } from '../measurements/measurement/measurement-resolver.service';
import { MeasurementsModel } from '../measurements/measurements.model';
import {MeasurementsService} from "../measurements/measurements.service";

@Component({
  selector: 'app-edit-measurement-form',
  templateUrl: './edit-measurement-form.component.html',
  styleUrls: ['./edit-measurement-form.component.scss']
})
export class EditMeasurementFormComponent implements OnInit {
  measurement: MeasurementsModel;
  measurementForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private measurementsService: MeasurementsService
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
      this.measurementForm.setValue(this.measurement);
    });
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

  onAddPicket() {
    const control = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      coordinateX: new FormControl(null, [Validators.required]),
      coordinateY: new FormControl(null, [Validators.required])
    });

    (this.measurementForm.get('pickets') as FormArray).push(control);
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
