import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeodeticObject } from '../../measurements/measurement/geodeticobject/geodetic-object.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeodeticObjectDto } from '../../measurements/measurement/geodeticobject/geodetic-object-dto.model';

@Component({
  selector: 'app-edit-object-modal',
  templateUrl: './edit-object-modal.component.html',
  styleUrls: ['./edit-object-modal.component.scss']
})
export class EditObjectModalComponent implements OnInit {
  @Input() geodeticObject: GeodeticObjectDto;
  @Input() measurementInternalId: string;
  @Input() isReadOnlyMode = false;

  @Output() objectEdited = new EventEmitter<GeodeticObject>();
  @Output() objectRemoved = new EventEmitter<GeodeticObject>();

  objectForm: FormGroup;
  currentColor: string;

  constructor(
    private activeModal: NgbModal
  ) { }

  ngOnInit() {
    this.objectForm = new FormGroup({
      id: new FormControl(this.geodeticObject.id, [Validators.required]),
      name: new FormControl(this.geodeticObject.name, [Validators.required]),
      description: new FormControl(this.geodeticObject.description),
      symbol: new FormControl(this.geodeticObject.symbol, [Validators.required]),
      color: new FormControl(this.geodeticObject.color, [Validators.required]),
      singleLines: new FormArray([]),
      measurementInternalId: new FormControl(this.measurementInternalId, [Validators.required])
    });

    this.createSingleLines();
    this.currentColor = this.geodeticObject.color;
  }

  private createSingleLines() {
    this.geodeticObject.singleLines.forEach((singleLine) => {
      const control = new FormGroup({
        startPicketInternalId: new FormControl(singleLine.startPicket.picketInternalId, [Validators.required]),
        endPicketInternalId: new FormControl(singleLine.endPicket.picketInternalId, [Validators.required])
      });

      (this.objectForm.get('singleLines') as FormArray).push(control);
    });
  }

  get name() {
    return this.objectForm.get('name');
  }

  get symbol() {
    return this.objectForm.get('symbol');
  }

  get color() {
    return this.objectForm.get('color');
  }

  onSubmit() {
    this.objectForm.controls.color.setValue(this.currentColor);
    this.objectEdited.emit(this.objectForm.value);
    this.activeModal.dismissAll();
  }

  removeObject() {
    this.objectRemoved.emit(this.objectForm.value);
    this.activeModal.dismissAll();
  }

}
