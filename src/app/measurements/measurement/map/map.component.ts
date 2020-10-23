import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Picket } from '../../pickets/picket.model';
import {LatLngLiteral} from '@agm/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() heightMap = '600px';
  @Input() widthMap = '700px';
  @Input() zoom: number;
  @Input() pickets: Picket[];
  @Input() pathsList: {angle: number, distance: number, path: LatLngLiteral[]}[];
  @Input() disableDoubleClickZoom = false;
  @Input() currentDisplayedLatitude: number;
  @Input() currentDisplayedLongitude: number;

  @Output() picketAdded = new EventEmitter<Picket>();
  @Output() picketEdited = new EventEmitter<{picket: Picket, index: number}>();

  title = 'AGM project';

  iconUrl = '../../../../assets/images/point.png';

  constructor() { }

  ngOnInit() {
    this.setCurrentLocation();
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

  onLineClicked(event, path) {
    console.log(event);
    console.log(path);
  }

  styleFunction() {
    return 'red';
  }
}
