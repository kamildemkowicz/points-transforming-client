import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard/dashboard.component';
import { measurementsRoutes } from './measurements/measurements.component';
import { createNewMeasurementRoutes } from './create-new/new-measurement/new-measurement.component';
import { editMeasurementRoutes } from './edit-measurement-form/edit-measurement-form.component';
import { historyRoutes } from './history/history.component';


const routes: Routes = [
  ...dashboardRoutes,
  ...measurementsRoutes,
  ...createNewMeasurementRoutes,
  ...editMeasurementRoutes,
  ...historyRoutes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
