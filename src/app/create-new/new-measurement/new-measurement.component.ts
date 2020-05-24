import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MeasurementsService } from '../../measurements/measurements.service';
import { MeasurementsModel } from '../../measurements/measurements.model';

@Component({
  selector: 'app-new-measurement',
  templateUrl: './new-measurement.component.html',
  styleUrls: ['./new-measurement.component.scss']
})
export class NewMeasurementComponent implements OnInit {
  measurementForm: FormGroup;

  constructor(
    private measurementsService: MeasurementsService
  ) { }

  ngOnInit(): void {
    this.measurementForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      place: new FormControl(null, [Validators.required]),
      owner: new FormControl(null, [Validators.required]),
      pickets: new FormArray([])
    });

    this.measurementForm.statusChanges.subscribe((value) => {
      console.log(value);
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
    this.measurementsService.createMeasurement(this.measurementForm.value).subscribe((measurementCreated: MeasurementsModel) => {
      console.log(measurementCreated);
    });
    this.measurementForm.reset();
  }
}

export const createNewMeasurementRoutes: Routes = [
  {
    path: 'create-new',
    component: NewMeasurementComponent
  }
];
