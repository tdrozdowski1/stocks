import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StockSummaryComponent } from './components/stock-summary/stock-summary.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PortfolioPanelComponent } from './components/portfolio-panel/portfolio-panel.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'stock-summary/:symbol', component: StockSummaryComponent },
  { path: 'portfolio', component: PortfolioPanelComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
