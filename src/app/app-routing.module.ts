import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { measurementsRoutes } from './measurements/measurements.component';
import { createNewMeasurementRoutes } from './create-new/new-measurement/new-measurement.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  ...measurementsRoutes,
  ...createNewMeasurementRoutes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
