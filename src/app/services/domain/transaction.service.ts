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
          .post<{ statusCode: number; headers: any; body: string }>(this.apiUrl, transaction, { headers, observe: 'response' })
          .pipe(
            tap((response) => {
              console.log('Lambda response:', response);
              if (response.status !== 200) {
                throw new Error(`Server error: ${response.body?.body || 'Unknown error'}`);
              }
              if (!response.body?.body) {
                throw new Error('Invalid response: body is missing');
              }
              try {
                const stock: StockModel = JSON.parse(response.body.body);
                console.log('Parsed stock:', stock);
                this.stockStateService.addStock(stock);
              } catch (e) {
                throw new Error(`Failed to parse stock`);
              }
            }),
            map((response) => {
              if (response.status !== 200) {
                throw new Error(`Server error: ${response.body?.body || 'Unknown error'}`);
              }
              if (!response.body?.body) {
                throw new Error('Invalid response: body is missing');
              }
              return JSON.parse(response.body.body) as StockModel;
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
