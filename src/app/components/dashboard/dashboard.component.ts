import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../services/domain/models/transaction.model';
import { TransactionService } from '../../services/domain/transaction.service';
import { catchError, concatMap, forkJoin, map, of } from 'rxjs';
import { DbService } from '../../services/http/db.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private transactionService: TransactionService,
    private dbService: DbService,
  ) {}

  ngOnInit(): void {
    this.dbService.getStocks().subscribe(
      (stock) => console.log(stock),
      (error) => console.error('Error:', error),
    );
  }

  onTransactionChange(transaction: Transaction) {
    this.transactionService.addTransaction(transaction).subscribe({
      next: (stock) => console.log('Transaction added, stock updated:', stock),
      error: (err) => console.error('Transaction error:', err),
    });
  }
}
