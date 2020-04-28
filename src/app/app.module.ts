import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MeasurementsComponent, measurementsProviders } from './measurements/measurements.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MeasurementsMenuComponent } from './measurements/measurements-menu/measurements-menu.component';
import { MeasurementsService } from './measurements/measurements.service';
import { MeasurementComponent, measurementProviders } from './measurements/measurement/measurement.component';
import { DetailsComponent } from './measurements/measurement/details/details.component';
import { MapComponent } from './measurements/measurement/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MeasurementsComponent,
    NavigationBarComponent,
    MeasurementsMenuComponent,
    MeasurementComponent,
    DetailsComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAVotiHjf1n6CuiRMrBDj1CYolLkWq9WAg',
      libraries: ['places']
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [
    MeasurementsService,
    measurementsProviders,
    measurementProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
