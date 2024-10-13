import {Component, OnInit} from '@angular/core';
import {FinancialDataService} from "../../../services/http/financial-data.service";
import {Dividend} from "../../../services/http/models/dividend.model";
import {concatMap} from "rxjs";
import {DbService} from "../../../services/http/db.service";
import {Stock} from "../../../services/http/models/stock.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-stock-panel',
  templateUrl: './stock-panel.component.html',
  styleUrls: ['./stock-panel.component.css']
})
export class StockPanel implements OnInit {
  stocks: Stock[] = [];
  dividends: Dividend[] = [];

  constructor(private dbService: DbService, private financialDataService: FinancialDataService, private router: Router) {}

  ngOnInit() {
    this.dbService.stocks$.pipe(
      concatMap(stocks => this.stocks = stocks),
      concatMap(async (transaction) => this.financialDataService.getDividends(transaction.symbol).subscribe(
          (data) => this.dividends = data.historical
        )
      )
    ).subscribe(
      () => console.log(this.dividends),
      (error) => console.error('Error:', error)
    );


  }

  onStockClick(stock: Stock): void {
    this.router.navigate(['/stock-summary', stock.symbol]);
  }
}
