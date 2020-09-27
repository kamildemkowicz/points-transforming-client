import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { Router, Routes } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MeasurementsService } from '../../measurements/measurements.service';
import { MeasurementsModel } from '../../measurements/measurements.model';
import { Picket } from '../../measurements/pickets/picket.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-measurement',
  templateUrl: './new-measurement.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./new-measurement.component.scss']
})
export class NewMeasurementComponent implements OnInit {

  constructor(
    private measurementsService: MeasurementsService,
    private router: Router,
    private toastr: ToastrService
  ) { }

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

  @ViewChild('attachments', {static: true}) attachment: any;
  measurementForm: FormGroup;
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

  ngOnInit(): void {
    this.measurementForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      place: new FormControl(null, [Validators.required]),
      owner: new FormControl(null, [Validators.required]),
      pickets: new FormArray([])
    });
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
        this.toastr.error('You have set picket incorrectly in lines: ' + validationResult.toString(),
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

  onSubmit() {
    this.measurementsService.createMeasurement(this.measurementForm.value).subscribe((measurementCreated: MeasurementsModel) => {
      this.router.navigate(['measurements', measurementCreated.measurementInternalId]);
    }, (error => {
      this.toastr.error(error.error.message, null, { timeOut: 3000 });
    })
    );
  }

  private validateFile(lines: string[]): number[] {
    let index = 1;
    const validationResult = [];
    lines.forEach((line) => {
      const lineResultNegative = NewMeasurementComponent.validateSingleLine(line);

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
    newPicket.coordinateX = picket[1] as any;
    newPicket.coordinateY = picket[2] as any;
    this.onAddPicketFromTxt(newPicket);
  }

  private onAddPicketFromTxt(picket: Picket) {
    const control = new FormGroup({
      name: new FormControl(picket.name, [Validators.required]),
      coordinateX: new FormControl(picket.coordinateX, [Validators.required]),
      coordinateY: new FormControl(picket.coordinateY, [Validators.required])
    });

    (this.measurementForm.get('pickets') as FormArray).push(control);
  }
}

export const createNewMeasurementRoutes: Routes = [
  {
    path: 'create-new',
    component: NewMeasurementComponent
  }
];
