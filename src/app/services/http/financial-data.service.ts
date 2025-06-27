import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FinancialDataService {
  private baseApiUrl = environment.FINANCIAL_MODELING_API;
  private apiKey = environment.FINANCIAL_MODELING_API_KEY;
  constructor(private http: HttpClient) {}

  getStockPrice(symbol: string): Observable<any> {
    const url = `${this.baseApiUrl}/quote/${symbol}?apikey=${this.apiKey}`;
    return this.http.get(url);
  }

  getDividends(symbol: string): Observable<any> {
    const url = `${this.baseApiUrl}/historical-price-full/stock_dividend/${symbol}?apikey=${this.apiKey}`;
    return this.http.get(url);
  }

  getStockPerformance(symbol: string): Observable<any> {
    const url = `${this.baseApiUrl}/historical-price-full/${symbol}?timeseries=90&apikey=${this.apiKey}`;
    return this.http.get(url).pipe(
      tap((response) => console.log('API Response:', response)), // Log the response
      catchError((err) => {
        console.error('Error fetching stock performance:', err);
        return throwError(err);
      }),
    );
  }

  getCashFlowStatement(symbol: string): Observable<any> {
    const url = `${this.baseApiUrl}/cash-flow-statement/${symbol}?apikey=${this.apiKey}`;
    return this.http.get(url).pipe(
      tap((response) => console.log('Cash Flow API Response:', response)), // Log the response
      catchError((err) => {
        console.error('Error fetching cash flow data:', err);
        return throwError(err);
      }),
    );
  }

  getBalanceSheet(symbol: string): Observable<any> {
    const url = `${this.baseApiUrl}/balance-sheet-statement/${symbol}?apikey=${this.apiKey}`;
    return this.http.get(url).pipe(
      tap((response) => console.log('Balance Sheet API Response:', response)), // Log the response
      catchError((err) => {
        console.error('Error fetching balance sheet data:', err);
        return throwError(err);
      }),
    );
  }
}
