import { Component } from '@angular/core';
import {Transaction} from "./models/transaction.model";
import {TransactionService} from "./services/transaction.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'stock-tax-calculator';

  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) {
    this.transactionService.transactions$.subscribe(transactions => {
      this.transactions = transactions;
    });
  }
}
