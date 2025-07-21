import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, switchMap} from 'rxjs';
import { map } from 'rxjs/operators';
import { StockModel } from './models/stock.model';
import { environment } from '../../../environments/environment';
import {OidcSecurityService} from "angular-auth-oidc-client";

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
      switchMap((idToken: string | null) => {
        if (!idToken) {
          throw new Error('ID Token is missing. User may not be logged in.');
        }

        const headers = new HttpHeaders({
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        });

        return this.http
          .get<ApiResponse>(`${environment.STOCKS_API}${this.stocksApi}`, { headers })
          .pipe(map((response) => JSON.parse(response.body) as StockModel[]));
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

        return this.http.delete<any>(`${environment.STOCKS_API}${this.stocksApi}/${symbol}`, { headers });
      })
    );
  }
}
