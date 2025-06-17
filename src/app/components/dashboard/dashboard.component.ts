import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../services/domain/models/transaction.model';
import { TransactionService } from '../../services/domain/transaction.service';
import {catchError, concatMap, forkJoin, map, Observable, of} from 'rxjs';
import {StockModel} from "../../services/http/models/stock.model";
import {StockStateService} from "../../services/state/state.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  stocks$: Observable<StockModel[]>;
  constructor(
    private transactionService: TransactionService,
    private stockStateService: StockStateService
  ) {
    this.stocks$ = this.stockStateService.stocks$;
  }

  ngOnInit(): void {
    this.stocks$.subscribe(
      (stocks) => console.log('Stocks from state:', stocks),
      (error) => console.error('Error fetching stocks:', error)
    );
  }

  onTransactionChange(transaction: Transaction) {
    this.transactionService.addTransaction(transaction).subscribe({
      next: (stock) => console.log('Transaction added, stock updated:', stock),
      error: (err) => console.error('Transaction error:', err),
    });
  }
}
