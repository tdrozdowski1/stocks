import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from './models/transaction.model';
import { catchError, map, Observable, switchMap, tap } from 'rxjs';
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
    private oidcSecurityService: OidcSecurityService,
  ) {}

  addTransaction(transaction: Transaction): Observable<StockModel> {
    console.log('Preparing transaction:', transaction);
    return this.oidcSecurityService.getIdToken().pipe(
      switchMap((idToken: string | null) => {
        if (!idToken) {
          throw new Error('ID Token is missing. User may not be logged in.');
        }

        const headers = {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        };

        return this.http
          .post<{ body: string }>(this.apiUrl, transaction, { headers, observe: 'response' })
          .pipe(
            tap((response) => {
              console.log('Lambda response:', response);
              if (!response.body?.body) {
                throw new Error('Invalid response: body is missing');
              }
              const stock: StockModel = JSON.parse(response.body.body);
              console.log('Parsed stock:', stock);
              this.stockStateService.addStock(stock);
            }),
            map((response) => {
              if (!response.body?.body) {
                throw new Error('Invalid response: body is missing');
              }
              return JSON.parse(response.body.body) as StockModel;
            }),
            catchError((error) => {
              console.error('HTTP error in addTransaction:', error);
              throw error;
            }),
          );
      }),
    );
  }
}
