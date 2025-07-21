import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
          .post<StockModel>(this.apiUrl, transaction, { headers })
          .pipe(
            tap((stock: StockModel) => {
              console.log('Lambda response:', stock);
              this.stockStateService.addStock(stock);
            }),
            catchError((error: HttpErrorResponse | Error) => {
              console.error('Error in addTransaction:', error);
              throw new Error(`Transaction failed: ${error.message}`);
            }),
          );
      }),
    );
  }
}
