import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from '../../services/domain/models/transaction.model';
import { TransactionService } from '../../services/domain/transaction.service';
import { Observable, Subscription } from 'rxjs';
import { StockModel } from '../../services/http/models/stock.model';
import { StockStateService } from '../../services/state/state.service';
import { AuthenticationStateService } from '../../auth/authentication-state.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  stocks$: Observable<StockModel[]>;
  private authSubscription?: Subscription;

  constructor(
    private transactionService: TransactionService,
    private stockStateService: StockStateService,
    private authStateService: AuthenticationStateService
  ) {
    this.stocks$ = this.stockStateService.stocks$;
  }

  ngOnInit(): void {
    this.authSubscription = this.authStateService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.stockStateService.initStocks(); // Fetch stocks after authentication
      }
    });

    this.stocks$.subscribe(
      (stocks) => console.log('Stocks from state:', stocks),
      (error) => console.error('Error fetching stocks:', error),
    );
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe(); // Cleanup subscription
  }

  onTransactionChange(transaction: Transaction) {
    this.transactionService.addTransaction(transaction).subscribe({
      next: (stock) => console.log('Transaction added, stock updated:', stock),
      error: (err) => console.error('Transaction error:', err),
    });
  }
}
