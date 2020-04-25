import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { measurementsRoutes } from './measurements/measurements-menu/measurements-menu.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  ...measurementsRoutes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
