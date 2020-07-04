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
      coordinateX: new FormControl(this.picketFromMap.coordinateX, [Validators.required]),
      coordinateY: new FormControl(this.picketFromMap.coordinateY, [Validators.required]),
      picketInternalId: new FormControl(this.picketFromMap.picketInternalId)
    });
  }

  get name() {
    return this.picketForm.get('name');
  }

  get coordinateX() {
    return this.picketForm.get('coordinateX');
  }

  get coordinateY() {
    return this.picketForm.get('coordinateY');
  }

  onSubmit() {
    this.index !== undefined ? this.picketEdited.emit({
        picketEdited: this.picketForm.value, index: this.index }) : this.picketAdded.emit(this.picketForm.value);
    this.activeModal.dismissAll();
  }
}
