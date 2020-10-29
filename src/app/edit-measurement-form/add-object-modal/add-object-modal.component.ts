import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeodeticObject } from '../../measurements/measurement/geodeticobject/geodetic-object.model';

@Component({
  selector: 'app-add-object-modal',
  templateUrl: './add-object-modal.component.html',
  styleUrls: ['./add-object-modal.component.scss']
})
export class AddObjectModalComponent implements OnInit {
  @Input() path: { picketInternalId: string, lat: number, lng: number }[] = [];

  @Output() objectAdded = new EventEmitter<GeodeticObject>();

  objectForm: FormGroup;

  constructor(
    private activeModal: NgbModal
  ) { }

  ngOnInit() {
    this.objectForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
      symbol: new FormControl(null, [Validators.required]),
      color: new FormControl(null, [Validators.required]),
      singleLines: new FormArray([])
    });

    this.createSingleLines();
  }

  private createSingleLines() {
    let previousPicketInternalId = this.path[0].picketInternalId;
    for (let i = 1; i < this.path.length; i++) {
      const control = new FormGroup({
        startPicketInternalId: new FormControl(previousPicketInternalId, [Validators.required]),
        endPicketInternalId: new FormControl(this.path[i].picketInternalId, [Validators.required])
      });

      (this.objectForm.get('singleLines') as FormArray).push(control);
      previousPicketInternalId = this.path[i].picketInternalId;
    }
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
    this.objectAdded.emit(this.objectForm.value);
    this.activeModal.dismissAll();
  }
}
