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
    return this.oidcSecurityService.getAccessToken().pipe(
      tap((accessToken: string | null) => {
        console.log('Access Token:', accessToken);
        if (accessToken) {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          console.log('Access Token Payload:', payload);
        }
      }),
      switchMap((accessToken: string | null) => {
        if (!accessToken) {
          throw new Error('Access Token is missing. User may not be logged in.');
        }
        const headers = new HttpHeaders({
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        });
        return this.http
          .get<ApiResponse>(`${environment.STOCKS_API}${this.stocksApi}`, { headers })
          .pipe(
            map((response) => {
              if (response.statusCode !== 200) {
                const errorBody = JSON.parse(response.body);
                throw new Error(`API error: ${errorBody.message || response.body}`);
              }
              return JSON.parse(response.body) as StockModel[];
            }),
            catchError((error) => {
              console.error('Error fetching stocks:', error);
              return throwError(() => new Error(error.message || 'Failed to fetch stocks'));
            })
          );
      })
    );
  }

  removeStock(symbol: string): Observable<any> {
    return this.oidcSecurityService.getAccessToken().pipe(
      switchMap((accessToken: string | null) => {
        if (!accessToken) {
          throw new Error('Access Token is missing. User may not be logged in.');
        }
        const headers = new HttpHeaders({
          Authorization: `Bearer ${accessToken}`,
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
