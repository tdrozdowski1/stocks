import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AddTransactionComponent } from './components/dashboard/add-transaction/add-transaction.component';
import { StockPanel } from './components/dashboard/stock-panel/stock-panel.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { StockSummaryComponent } from './components/stock-summary/stock-summary.component';
import { AppRoutingModule } from './app-routing.module';
import {RouterModule} from "@angular/router";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {StockChartComponent} from "./components/stock-summary/stock-chart/stock-chart.component";
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { SummarySectionComponent } from './components/stock-summary/summary-section/summary-section.component';
import { DividendSummaryComponent } from './components/stock-summary/dividend-summary/dividend-summary.component';
import { AdditionalDetailsComponent } from './components/stock-summary/additional-details/additional-details.component';
import { CompanyInfoComponent } from './components/stock-summary/company-info/company-info.component';

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
    CompanyInfoComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
