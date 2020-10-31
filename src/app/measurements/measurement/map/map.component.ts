import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Picket } from '../../pickets/picket.model';
import { AgmPolylinePoint, LatLngLiteral } from '@agm/core';
import { PicketReport } from '../../../tachymetry/models/tachymetry-report/picket-report.model';
import {GeodeticObjectDto} from "../geodeticobject/geodetic-object-dto.model";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() heightMap = '600px';
  @Input() widthMap = '700px';
  @Input() zoom: number;
  @Input() pickets: Picket[];
  @Input() picketsToHighlight: string[] = [];
  @Input() pathsList: {
    startingPoint: PicketReport,
    endPoint: PicketReport,
    angle: number,
    distance: number,
    measuredPicket: PicketReport,
    isEndPoint: boolean,
    path: LatLngLiteral[]
  } [] = [];
  @Input() disableDoubleClickZoom = false;
  @Input() currentDisplayedLatitude: number;
  @Input() currentDisplayedLongitude: number;

  // editing one
  @Input() editedObject: {
    objectPath: { lat: number, lng: number }[]
  } = { objectPath: [] };

  // from db
  @Input() objectsSaved: GeodeticObjectDto[];

  @Output() picketAdded = new EventEmitter<Picket>();
  @Output() picketEdited = new EventEmitter<{picket: Picket, index: number}>();
  @Output() objectFinished = new EventEmitter<{picket: Picket, index: number}>();
  @Output() lineClicked = new EventEmitter<{
    startingPoint: PicketReport,
    endPoint: PicketReport,
    angle: number,
    distance: number,
    controlPointsDistance: number,
    measuredPicket: PicketReport,
    isEndPoint: boolean,
    path: LatLngLiteral[]
  }>();

  @Output() objectLineClicked = new EventEmitter<GeodeticObjectDto>();

  title = 'AGM project';

  iconUrl = '../../../../assets/images/point.png';

  constructor() { }

  ngOnInit() {
    this.setCurrentLocation();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pathsList && changes.pathsList.currentValue) {
      this.pathsList = changes.pathsList.currentValue;
    }
  }

  private setCurrentLocation() {
    this.zoom = 15;

    if (this.pickets && this.pickets.length) {
      this.currentDisplayedLatitude = this.pickets[0].latitude;
      this.currentDisplayedLongitude = this.pickets[0].longitude;
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentDisplayedLatitude = position.coords.latitude;
        this.currentDisplayedLongitude = position.coords.longitude;
      });
    }
  }

  onMapDblClicked(event) {
    const picket = new Picket();
    picket.latitude = event.coords.lat;
    picket.longitude = event.coords.lng;
    this.picketAdded.emit(picket);
  }

  onMarkerClicked(event, index: number) {
    const picket = new Picket();
    picket.name = event.label.text;
    picket.picketInternalId = event.title;
    picket.latitude = event.latitude;
    picket.longitude = event.longitude;
    this.picketEdited.emit({ picket, index });
  }

  onMarkerRightClicked(picket: Picket, index: number) {
    this.objectFinished.emit({ picket, index });
  }

  onLineClicked(event, path) {
    if (!path.isEndPoint) {
      this.lineClicked.emit(path);
    }
  }

  onObjectLineClicked(object: GeodeticObjectDto) {
    this.objectLineClicked.emit(object);
  }

  getLabelColor(picketFromMapInternalId): string {
    if (this.picketsToHighlight.indexOf(picketFromMapInternalId) > -1) {
      return '#e27b00';
    }

    return '#ff0038';
  }
}
