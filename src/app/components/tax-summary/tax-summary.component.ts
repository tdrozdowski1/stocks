import {Component, OnInit} from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {TransactionService} from "../../services/transaction.service";
import {FinancialDataService} from "../../services/financial-data.service";
import {Dividend} from "../../models/dividend.model";
import {concatMap} from "rxjs";
import {DbService} from "../../services/db.service";
import {Stock} from "../../models/stock.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tax-summary',
  templateUrl: './tax-summary.component.html',
  styleUrls: ['./tax-summary.component.css']
})
export class TaxSummaryComponent implements OnInit {
  stocks: Stock[] = [];
  usdPlnRate: number = 1; // Example rate, you should update it from a service
  taxDue: number = 0;
  dividends: Dividend[] = [];

  constructor(private dbService: DbService, private financialDataService: FinancialDataService, private router: Router) {}

  ngOnInit() {
    // this.financialDataService.getExchangeRate().subscribe(data => {
    //   const usdRate = data.forexList.find(rate => rate.ticker === 'USD/PLN');
    //   this.usdPlnRate = usdRate ? usdRate.bid : 1;
    // });

    // this.transactionService.transactions$.subscribe((transactions) => {
    //   this.transactions = transactions;
    // });

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

  calculateDividendIncome() {
    // Calculate total dividend income based on transactions
  //   return this.stocks.reduce((total, transaction) => total + (st.amount * transaction.price), 0) * this.usdPlnRate;
   }

  calculateTax() {
    // const income = this.calculateDividendIncome();
    // const taxRate = 0.19; // 19% tax in Poland
    // this.taxDue = income * taxRate;
    this.taxDue = 0
  }

  onStockClick(stock: Stock): void {
    // Navigate to the stock summary page with the selected stock's symbol
    this.router.navigate(['/stock-summary', stock.symbol]);
  }
}
