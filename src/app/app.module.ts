import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AddTransactionComponent } from './components/add-transaction/add-transaction.component';
import { TaxSummaryComponent } from './components/tax-summary/tax-summary.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { StockSummaryComponent } from './components/stock-summary/stock-summary.component';
import { AppRoutingModule } from './app-routing.module';
import {RouterModule} from "@angular/router";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {StockChartComponent} from "./components/stock-chart/stock-chart.component";

@NgModule({
  declarations: [
    AppComponent,
    AddTransactionComponent,
    TaxSummaryComponent,
    StockSummaryComponent,
    DashboardComponent,
    StockChartComponent
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
