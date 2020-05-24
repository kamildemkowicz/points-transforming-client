import { Component, Input, OnInit } from '@angular/core';
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

  title = 'AGM project';
  currentDisplayedLatitude: number;
  currentDisplayedLongitude: number;
  zoom: number;

  constructor() { }

  ngOnInit() {
    this.setCurrentLocation();
  }

  private setCurrentLocation() {
    this.zoom = 15;

    if (this.pickets && this.pickets.length) {
      this.currentDisplayedLatitude = this.pickets[0].coordinateY;
      this.currentDisplayedLongitude = this.pickets[0].coordinateY;
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentDisplayedLatitude = position.coords.latitude;
        this.currentDisplayedLongitude = position.coords.longitude;
      });
    }
  }
}
