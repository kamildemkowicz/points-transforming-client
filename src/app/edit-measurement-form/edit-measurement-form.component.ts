import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-edit-measurement-form',
  templateUrl: './edit-measurement-form.component.html',
  styleUrls: ['./edit-measurement-form.component.scss']
})
export class EditMeasurementFormComponent implements OnInit {

  measurementForm: FormGroup;

  constructor() { }

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
    console.log(this.measurementForm);
    this.measurementForm.reset();
  }

}

export const editMeasurementRoutes: Routes = [
  {
    path: 'edit/:id',
    component: EditMeasurementFormComponent
  }
];
