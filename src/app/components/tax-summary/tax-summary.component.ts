import {Component, OnInit, SimpleChanges} from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {TransactionService} from "../../services/transaction.service";
import {FinancialDataService} from "../../services/financial-data.service";
import {Dividend} from "../../models/dividend.model";
import {concatMap} from "rxjs";

@Component({
  selector: 'app-tax-summary',
  templateUrl: './tax-summary.component.html',
  styleUrls: ['./tax-summary.component.css']
})
export class TaxSummaryComponent implements OnInit {
  transactions: Transaction[] = [];
  usdPlnRate: number = 1; // Example rate, you should update it from a service
  taxDue: number = 0;
  dividends: Dividend[] = [];

  constructor(private transactionService: TransactionService, private financialDataService: FinancialDataService) {}



  ngOnInit() {
    this.financialDataService.getExchangeRate().subscribe(data => {
      const usdRate = data.forexList.find(rate => rate.ticker === 'USD/PLN');
      this.usdPlnRate = usdRate ? usdRate.bid : 1;
    });

    // this.transactionService.transactions$.subscribe((transactions) => {
    //   this.transactions = transactions;
    // });

    this.transactionService.transactions$.pipe(
      concatMap(transactions => this.transactions = transactions),
      concatMap(async (transaction) => this.financialDataService.getDividends(transaction.symbol).subscribe(
          (data) => this.dividends = data.historical
        )
      )
    ).subscribe(
      () => console.log(this.dividends),
      (error) => console.error('Error:', error)
    );


  }

  calculateDividendIncome(): number {
    // Calculate total dividend income based on transactions
    return this.transactions.reduce((total, transaction) => total + (transaction.amount * transaction.price), 0) * this.usdPlnRate;
  }

  calculateTax() {
    const income = this.calculateDividendIncome();
    const taxRate = 0.19; // 19% tax in Poland
    this.taxDue = income * taxRate;
  }
}
