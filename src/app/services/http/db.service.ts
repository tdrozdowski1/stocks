import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { StockModel } from './models/stock.model';
import { environment } from '../../../environments/environment';
import { OidcSecurityService } from 'angular-auth-oidc-client';

export interface ApiResponse {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
}

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private stocksApi = '/stocks';

  constructor(
    private http: HttpClient,
    private oidcSecurityService: OidcSecurityService
  ) {}

  getStocks(): Observable<StockModel[]> {
    return this.oidcSecurityService.getIdToken().pipe(
      tap((idToken: string | null) => {
        console.log('ID Token:', idToken);
        if (idToken) {
          const payload = JSON.parse(atob(idToken.split('.')[1]));
          console.log('ID Token Payload:', payload);
        }
      }),
      switchMap((idToken: string | null) => {
        if (!idToken) {
          throw new Error('ID Token is missing. User may not be logged in.');
        }
        const headers = new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        });
        console.log('Request Headers:', headers.get('Authorization'));
        return this.http
          .get<StockModel[]>(`${environment.STOCKS_API}${this.stocksApi}`, { headers })
          .pipe(
            tap((stocks) => console.log('Raw API Response:', JSON.stringify(stocks, null, 2))),
            map((stocks) => {
              if (!Array.isArray(stocks)) {
                throw new Error('API response is not an array of stocks');
              }
              return stocks as StockModel[];
            }),
            catchError((error) => {
              console.error('Error fetching stocks:', error);
              return throwError(() => new Error(error.message || error || 'Failed to fetch stocks'));
            })
          );
      })
    );
  }

  removeStock(symbol: string): Observable<any> {
    return this.oidcSecurityService.getIdToken().pipe(
      switchMap((idToken: string | null) => {
        if (!idToken) {
          throw new Error('ID Token is missing. User may not be logged in.');
        }
        const headers = new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        });
        return this.http
          .delete<any>(`${environment.STOCKS_API}${this.stocksApi}/${symbol}`, { headers })
          .pipe(
            catchError((error) => {
              console.error('Error removing stock:', error);
              return throwError(() => new Error(error.message || 'Failed to remove stock'));
            })
          );
      })
    );
  }
}
