import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Picket } from '../../pickets/picket.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() heightMap = '600px';
  @Input() widthMap = '700px';
  @Input() pickets: Picket[];
  @Input() disableDoubleClickZoom = false;
  @Input() currentDisplayedLatitude: number;
  @Input() currentDisplayedLongitude: number;

  @Output() picketAdded = new EventEmitter<Picket>();
  @Output() picketEdited = new EventEmitter<{picket: Picket, index: number}>();

  title = 'AGM project';

  zoom: number;
  iconUrl = '../../../../assets/images/point.png';

  constructor() { }

  ngOnInit() {
    this.setCurrentLocation();
  }

  private setCurrentLocation() {
    this.zoom = 15;

    if (this.pickets && this.pickets.length) {
      this.currentDisplayedLatitude = this.pickets[0].coordinateY;
      this.currentDisplayedLongitude = this.pickets[0].coordinateX;
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentDisplayedLatitude = position.coords.latitude;
        this.currentDisplayedLongitude = position.coords.longitude;
      });
    }
  }

  onMapDblClicked(event) {
    const picket = new Picket();
    picket.coordinateY = event.coords.lat;
    picket.coordinateX = event.coords.lng;
    this.picketAdded.emit(picket);
  }

  onMarkerClicked(event, index: number) {
    const picket = new Picket();
    picket.name = event.label.text;
    picket.picketInternalId = event.title;
    picket.coordinateY = event.latitude;
    picket.coordinateX = event.longitude;
    this.picketEdited.emit({ picket, index });
  }
}
