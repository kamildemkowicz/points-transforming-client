import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MeasurementsComponent} from './measurements/measurements.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'measurements', component: MeasurementsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
