import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {StockSummaryComponent} from "./components/stock-summary/stock-summary.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";

const routes: Routes = [
  { path: '', component: DashboardComponent }, // Default component
  { path: 'stock-summary/:symbol', component: StockSummaryComponent } // Stock summary page with symbol parameter
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
