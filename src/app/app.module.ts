import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AddTransactionComponent } from './components/dashboard/add-transaction/add-transaction.component';
import { StockPanel } from './components/dashboard/stock-panel/stock-panel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StockSummaryComponent } from './components/stock-summary/stock-summary.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StockChartComponent } from './components/stock-summary/stock-chart/stock-chart.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { SummarySectionComponent } from './components/stock-summary/summary-section/summary-section.component';
import { DividendSummaryComponent } from './components/stock-summary/dividend-summary/dividend-summary.component';
import { AdditionalDetailsComponent } from './components/stock-summary/additional-details/additional-details.component';
import { CompanyInfoComponent } from './components/stock-summary/company-info/company-info.component';
import { ValuationComponent } from './components/stock-summary/valuation/valuation.component';
import { DiscountedComponent } from './components/stock-summary/valuation/discounted/discounted.component';
import { GrahamComponent } from './components/stock-summary/valuation/graham/graham.component';
import { DividendComponent } from './components/stock-summary/valuation/dividend/dividend.component';
import { MultiplesComponent } from './components/stock-summary/valuation/multiples/multiples.component';
import { FreeCashChartComponent } from './components/stock-summary/free-cash-chart/free-cash-chart.component';
import { LiabilitiesChartComponent } from './components/stock-summary/liabilities-chart/liabilities-chart.component';
import { StockTableComponent } from './stock-table/stock-table.component';

@NgModule({
  declarations: [
    AppComponent,
    AddTransactionComponent,
    StockPanel,
    StockSummaryComponent,
    DashboardComponent,
    StockChartComponent,
    TopMenuComponent,
    SummarySectionComponent,
    DividendSummaryComponent,
    AdditionalDetailsComponent,
    CompanyInfoComponent,
    ValuationComponent,
    DiscountedComponent,
    GrahamComponent,
    DividendComponent,
    MultiplesComponent,
    FreeCashChartComponent,
    LiabilitiesChartComponent,
    StockTableComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
