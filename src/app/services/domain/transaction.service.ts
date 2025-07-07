import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from './models/transaction.model';
import { catchError, map, Observable, tap, switchMap } from 'rxjs';
import { StockStateService } from '../state/state.service';
import { StockModel } from '../http/models/stock.model';
import { environment } from '../../../environments/environment';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private transactionsApi = '/transactions';
  private apiUrl = `${environment.STOCKS_API}${this.transactionsApi}`;

  constructor(
    private http: HttpClient,
    private stockStateService: StockStateService,
    private oidcSecurityService: OidcSecurityService
  ) {}

  addTransaction(transaction: Transaction): Observable<StockModel> {
    console.log('Preparing transaction:', transaction);
    return this.oidcSecurityService.userData$.pipe(
      switchMap((userData) => {
        const email = userData?.userData?.email || 'unknown@example.com';
        const transactionWithEmail = { ...transaction, email };
        console.log('Sending transaction to Lambda:', transactionWithEmail);
        return this.http
          .post<{
            body: string;
          }>(this.apiUrl, { body: JSON.stringify(transactionWithEmail) }, { observe: 'response' })
          .pipe(
            tap((response) => {
              console.log('Lambda response:', response);
              try {
                const stock: StockModel = JSON.parse(response.body?.body || '{}');
                console.log('Parsed stock:', stock);
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
            map((response) => JSON.parse(response.body?.body || '{}'))
          );
      })
    );
  }
}
