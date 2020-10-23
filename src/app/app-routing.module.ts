import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard/dashboard.component';
import { measurementsRoutes } from './measurements/measurements.component';
import { createNewMeasurementRoutes } from './create-new/new-measurement/new-measurement.component';
import { editMeasurementRoutes } from './edit-measurement-form/edit-measurement-form.component';
import { historyRoutes } from './history/history.component';
import { tachymetryRoutes } from './tachymetry/tachymetry.component';


const routes: Routes = [
  ...dashboardRoutes,
  ...measurementsRoutes,
  ...createNewMeasurementRoutes,
  ...editMeasurementRoutes,
  ...historyRoutes,
  ...tachymetryRoutes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
