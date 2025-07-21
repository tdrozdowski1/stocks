import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StockSummaryComponent } from './components/stock-summary/stock-summary.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PortfolioPanelComponent } from './components/portfolio-panel/portfolio-panel.component';
import { TaxOverviewComponent } from './components/tax-overview/tax-overview.component';
import {AuthGuard} from "./auth/auth.guard";

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'stock-summary/:symbol', component: StockSummaryComponent, canActivate: [AuthGuard] },
  { path: 'portfolio', component: PortfolioPanelComponent, canActivate: [AuthGuard] },
  { path: 'tax', component: TaxOverviewComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
