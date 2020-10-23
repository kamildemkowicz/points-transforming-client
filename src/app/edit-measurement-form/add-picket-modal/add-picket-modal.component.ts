import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Picket } from '../../measurements/pickets/picket.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-picket-modal',
  templateUrl: './add-picket-modal.component.html',
  styleUrls: ['./add-picket-modal.component.scss']
})
export class AddPicketModalComponent implements OnInit {
  @Input() picketFromMap: Picket;
  @Input() index: number;

  @Output() picketAdded = new EventEmitter<Picket>();
  @Output() picketEdited = new EventEmitter<{ picketEdited: Picket, index: number }>();

  picketForm: FormGroup;

  constructor(
    private activeModal: NgbModal
  ) { }

  ngOnInit() {
    this.picketForm = new FormGroup({
      name: new FormControl(this.picketFromMap.name, [Validators.required]),
      longitude: new FormControl(this.picketFromMap.longitude, [Validators.required]),
      latitude: new FormControl(this.picketFromMap.latitude, [Validators.required]),
      picketInternalId: new FormControl(this.picketFromMap.picketInternalId)
    });
  }

  get name() {
    return this.picketForm.get('name');
  }

  get longitude() {
    return this.picketForm.get('longitude');
  }

  get latitude() {
    return this.picketForm.get('latitude');
  }

  onSubmit() {
    this.index !== undefined ? this.picketEdited.emit({
        picketEdited: this.picketForm.value, index: this.index }) : this.picketAdded.emit(this.picketForm.value);
    this.activeModal.dismissAll();
  }
}
