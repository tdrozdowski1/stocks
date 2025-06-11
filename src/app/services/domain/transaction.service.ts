import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from './models/transaction.model';
import { DbService } from '../http/db.service';
import { FinancialDataService } from '../http/financial-data.service';
import { DividendService } from './dividend.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { StockStateService } from '../state/state.service';
import { StockModel } from '../http/models/stock.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private lambdaUrl = 'https://v7eu1cmimh.execute-api.us-east-1.amazonaws.com/prod/transactions';

  constructor(
    private http: HttpClient,
    private dbService: DbService,
    private financialDataService: FinancialDataService,
    private dividendService: DividendService,
    private stockStateService: StockStateService,
  ) {}

  addTransaction(transaction: Transaction): Observable<StockModel> {
    return this.http.post<StockModel>(this.lambdaUrl, { body: JSON.stringify(transaction) }).pipe(
      tap((stock) => {
        this.stockStateService.addStock(stock);
        // this.dbService.updateStocks(this.stockStateService.stocksSubject.getValue());
      }),
      catchError((error) => {
        console.error('Failed to add transaction:', error);
        throw error; // Let the caller handle the error
      }),
    );
  }
}
