import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from './models/transaction.model';
import { catchError, map, Observable, tap } from 'rxjs';
import { StockStateService } from '../state/state.service';
import { StockModel } from '../http/models/stock.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private transactionsApi = '/transactions';
  private apiUrl = `${environment.STOCKS_API}${this.transactionsApi}`;

  constructor(
    private http: HttpClient,
    private stockStateService: StockStateService,
  ) {}

  addTransaction(transaction: Transaction): Observable<StockModel> {
    console.log('Sending transaction to Lambda:', transaction);
    return this.http
      .post<{
        body: string;
      }>(this.apiUrl, { body: JSON.stringify(transaction) }, { observe: 'response' })
      .pipe(
        tap((response) => {
          console.log('Lambda response:', response);
          try {
            const stock: StockModel = JSON.parse(response.body?.body || '{}');
            console.log('Parsed stock:', stock); // Debug log
            this.stockStateService.addStock(stock);
          } catch (e) {
            console.error('Failed to parse stock response:', e);
            throw new Error('Invalid stock response format');
          }
        }),
        catchError((error) => {
          console.error('HTTP error in addTransaction:', error);
          throw error;
        }),
        map((response) => JSON.parse(response.body?.body || '{}')),
      );
  }
}
