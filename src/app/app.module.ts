import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DashboardComponent, dashboardProviders } from './dashboard/dashboard.component';
import { MeasurementsComponent, measurementsProviders } from './measurements/measurements.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MeasurementsMenuComponent } from './measurements/measurements-menu/measurements-menu.component';
import { MeasurementsService } from './measurements/measurements.service';
import { MeasurementComponent, measurementProviders } from './measurements/measurement/measurement.component';
import { DetailsComponent } from './measurements/measurement/details/details.component';
import { MapComponent } from './measurements/measurement/map/map.component';
import { PicketsTableComponent } from './measurements/pickets/pickets-table/pickets-table.component';
import { PicketsComponent } from './measurements/pickets/pickets.component';
import { districtsProvider, NewMeasurementComponent } from './create-new/new-measurement/new-measurement.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MeasurementBoardComponent } from './dashboard/measurement-board/measurement-board.component';
import {
  EditMeasurementFormComponent,
  editMeasurementProviders
} from './edit-measurement-form/edit-measurement-form.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HistoryComponent } from './history/history.component';
import { AddPicketModalComponent } from './edit-measurement-form/add-picket-modal/add-picket-modal.component';
import { HistorySearchComponent } from './history/history-search/history-search.component';
import {
  historyResultProviders,
  HistorySearchResultsComponent
} from './history/history-search/history-search-results/history-search-results.component';
import { HistoryService } from './history/history.service';
import { ToastrModule } from 'ngx-toastr';
import { TachymetryComponent } from './tachymetry/tachymetry.component';
import { TachymetryFormComponent } from './tachymetry/tachymetry-form/tachymetry-form.component';
import {
  AddMeasuringStationModalComponent
} from './tachymetry/tachymetry-form/add-measuring-station-modal/add-measuring-station-modal.component';
import { TachymetryService } from './tachymetry/tachymetry.service';
import { DistrictService } from './measurements/district/district.service';
import { TachymetryReportComponent } from './tachymetry/tachymetry-form/tachymetry-report/tachymetry-report.component';
import { UtilsService } from './general/utils.service';
import { TachymetryViewComponent } from './measurements/measurement/tachymetry/tachymetry-view/tachymetry-view.component';
import { NotificationService } from './general/notification.service';
import { AddObjectModalComponent } from './edit-measurement-form/add-object-modal/add-object-modal.component';
import { GeodeticObjectService } from './measurements/measurement/geodeticobject/geodetic-object.service';
import { EditObjectModalComponent } from './edit-measurement-form/edit-object-modal/edit-object-modal.component';
import {
  TachymetryInformationHelperComponent
} from './tachymetry/tachymetry-form/tachymetry-information-helper/tachymetry-information-helper.component';
import {
  PicketsUploadingInfoHelperComponent
} from './measurements/measurement/pickets-uploading-info-helper/pickets-uploading-info-helper.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { SpinnerComponent } from './general/spinner/spinner.component';
import { SpinnerDirective } from './general/spinner/spinner.directive';
import { SpinnerService } from './general/spinner/spinner.service';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { TokenStorageService } from './user/auth/token-storage.service';
import { httpInterceptorProviders } from './user/auth/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MeasurementsComponent,
    NavigationBarComponent,
    MeasurementsMenuComponent,
    MeasurementComponent,
    DetailsComponent,
    MapComponent,
    PicketsTableComponent,
    PicketsComponent,
    NewMeasurementComponent,
    MeasurementBoardComponent,
    EditMeasurementFormComponent,
    HistoryComponent,
    AddPicketModalComponent,
    HistorySearchComponent,
    HistorySearchResultsComponent,
    TachymetryComponent,
    TachymetryFormComponent,
    AddMeasuringStationModalComponent,
    TachymetryReportComponent,
    TachymetryViewComponent,
    AddObjectModalComponent,
    EditObjectModalComponent,
    TachymetryInformationHelperComponent,
    PicketsUploadingInfoHelperComponent,
    SpinnerComponent,
    SpinnerDirective,
    RegisterComponent,
    LoginComponent
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
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FormsModule,
    ColorPickerModule,
    ToastrModule.forRoot({
      progressBar: true,
      progressAnimation: 'increasing',
      preventDuplicates: true,
      iconClasses: {
        error: 'toast-error',
        success: 'toast-success'
      },
      closeButton: true
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    MeasurementsService,
    measurementsProviders,
    measurementProviders,
    dashboardProviders,
    editMeasurementProviders,
    HistoryService,
    historyResultProviders,
    TachymetryService,
    DistrictService,
    districtsProvider,
    UtilsService,
    NotificationService,
    GeodeticObjectService,
    SpinnerService,
    TokenStorageService,
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddPicketModalComponent,
    AddMeasuringStationModalComponent,
    TachymetryViewComponent,
    AddObjectModalComponent,
    EditObjectModalComponent,
    TachymetryInformationHelperComponent,
    PicketsUploadingInfoHelperComponent
  ]
})
export class AppModule { }
