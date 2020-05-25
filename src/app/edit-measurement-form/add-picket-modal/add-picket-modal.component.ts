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

  @Output() picketAdded = new EventEmitter<Picket>();

  picketForm: FormGroup;

  constructor(
    private activeModal: NgbModal
  ) { }

  ngOnInit() {
    this.picketForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      coordinateX: new FormControl(this.picketFromMap.coordinateX, [Validators.required]),
      coordinateY: new FormControl(this.picketFromMap.coordinateY, [Validators.required])
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
    this.picketAdded.emit(this.picketForm.value);
    this.activeModal.dismissAll();
  }
}
