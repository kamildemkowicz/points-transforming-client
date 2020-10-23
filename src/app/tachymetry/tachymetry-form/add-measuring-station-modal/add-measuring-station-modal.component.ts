import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MeasuringStation } from '../../models/measuring-station.model';
import { GeodeticControlNetworkPoint } from '../../models/geodetic-control-network-point.model';

@Component({
  selector: 'app-add-measuring-station-modal',
  templateUrl: './add-measuring-station-modal.component.html',
  styleUrls: ['./add-measuring-station-modal.component.scss']
})
export class AddMeasuringStationModalComponent implements OnInit {

  constructor(
    private activeModal: NgbModal
  ) { }

  get stationNumber() {
    return this.measuringStationForm.get('stationNumber');
  }

  get stationName() {
    return this.measuringStationForm.get('stationName');
  }

  get startingPointName() {
    return this.measuringStationForm.get('startingPoint.name');
  }

  get startingPointCoordinateX() {
    return this.measuringStationForm.get('startingPoint.coordinateX');
  }

  get startingPointCoordinateY() {
    return this.measuringStationForm.get('startingPoint.coordinateY');
  }

  get endPointName() {
    return this.measuringStationForm.get('endPoint.name');
  }

  get endPointCoordinateX() {
    return this.measuringStationForm.get('endPoint.coordinateX');
  }

  get endPointCoordinateY() {
    return this.measuringStationForm.get('endPoint.coordinateY');
  }

  get picketsMeasurementData() {
    return (this.measuringStationForm.get('picketsMeasurementData') as FormArray).controls;
  }

  @Input() measuringStationToEdit: MeasuringStation;
  @Input() index: number;

  @Output() measuringStationAdded = new EventEmitter<MeasuringStation>();
  @Output() measuringStationEdited = new EventEmitter<{ measuringStationEdited: MeasuringStation, index: number }>();

  measuringStationForm: FormGroup;

  private static createGeodeticControlNetworkPointRequest(geodeticControlNetworkPoint?: GeodeticControlNetworkPoint) {
    if (geodeticControlNetworkPoint) {
      return new FormGroup({
        name: new FormControl(geodeticControlNetworkPoint.name, [Validators.required]),
        coordinateX: new FormControl(geodeticControlNetworkPoint.coordinateX, [Validators.required,
          Validators.pattern(/^\d+\.?\d{0,3}$/), Validators.min(0.01)]),
        coordinateY: new FormControl(geodeticControlNetworkPoint.coordinateY, [Validators.required,
          Validators.pattern(/^\d+\.?\d{0,3}$/), Validators.min(0.01)])
      });
    } else {
      return new FormGroup({
        name: new FormControl(null, [Validators.required]),
        coordinateX: new FormControl(null, [Validators.required,
          Validators.pattern(/^\d+\.?\d{0,3}$/), Validators.min(0.01)]),
        coordinateY: new FormControl(null, [Validators.required,
          Validators.pattern(/^\d+\.?\d{0,3}$/), Validators.min(0.01)])
      });
    }
  }

  ngOnInit() {
    if (this.measuringStationToEdit) {
      this.measuringStationForm = new FormGroup({
        stationNumber: new FormControl(this.measuringStationToEdit.stationNumber, [Validators.required]),
        stationName: new FormControl(this.measuringStationToEdit.stationName, [Validators.required]),
        startingPoint: AddMeasuringStationModalComponent.createGeodeticControlNetworkPointRequest(
          this.measuringStationToEdit.startingPoint
        ),
        endPoint: AddMeasuringStationModalComponent.createGeodeticControlNetworkPointRequest(
          this.measuringStationToEdit.endPoint
        ),
        picketsMeasurementData: new FormArray([])
      });

      this.measuringStationToEdit.picketsMeasurementData.forEach((picket) => {
        const picketControl = new FormGroup({
          picketName: new FormControl(picket.picketName, [Validators.required]),
          distance: new FormControl(picket.distance, [Validators.required,
            Validators.pattern(/^\d+\.?\d{0,3}$/), Validators.min(0.01)]),
          angle: new FormControl(picket.angle, [Validators.required,
            Validators.pattern(/^\d+\.?\d{0,4}$/), Validators.min(0.0001), Validators.max(400)])
        });
        (this.measuringStationForm.get('picketsMeasurementData') as FormArray).push(picketControl);
      });
    } else {
      this.measuringStationForm = new FormGroup({
        stationNumber: new FormControl(null, [Validators.required]),
        stationName: new FormControl(null, [Validators.required]),
        startingPoint: AddMeasuringStationModalComponent.createGeodeticControlNetworkPointRequest(),
        endPoint: AddMeasuringStationModalComponent.createGeodeticControlNetworkPointRequest(),
        picketsMeasurementData: new FormArray([])
      });
    }
  }

  onAddPicketMeasurementData() {
    const control = new FormGroup({
      picketName: new FormControl(null, [Validators.required]),
      distance: new FormControl(null, [Validators.required,
        Validators.pattern(/^\d+\.?\d{0,3}$/), Validators.min(0.01)]),
      angle: new FormControl(null, [Validators.required,
        Validators.pattern(/^\d+\.?\d{0,4}$/), Validators.min(0.0001), Validators.max(400)])
    });

    (this.measuringStationForm.get('picketsMeasurementData') as FormArray).push(control);
  }

  onSubmit() {
    this.index !== undefined ? this.measuringStationEdited.emit({
      measuringStationEdited: this.measuringStationForm.value, index: this.index })
      : this.measuringStationAdded.emit(this.measuringStationForm.value);
    this.activeModal.dismissAll();
  }

  onRemovePicket(index: number) {
    (this.measuringStationForm.get('picketsMeasurementData') as FormArray).removeAt(index);
  }
}
