import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ForexRate {
  ticker: string;
  bid: number;
  ask: number;
}

interface ForexData {
  forexList: ForexRate[];
}

interface ForexRate {
  ticker: string;
  bid: number;
  ask: number;
}

@Injectable({
  providedIn: 'root',
})
export class FinancialDataService {
  constructor(private http: HttpClient) {}

  getStockPrice(symbol: string): Observable<any> {
    return this.http.get(
      `'${environment.FINANCIAL_MODELING_API}'/quote/${symbol}?apikey='${environment.FINANCIAL_MODELING_API_KEY}'`,
    );
  }

  getDividends(symbol: string): Observable<any> {
    return this.http.get(
      `'${environment.FINANCIAL_MODELING_API}'/historical-price-full/stock_dividend/${symbol}?apikey='${environment.FINANCIAL_MODELING_API_KEY}'`,
    );
  }

  getHistoricalExchangeRate(): Observable<any> {
    return this.http
      .get(
        `'${environment.FINANCIAL_MODELING_API}'/historical-price-full/USDPLN?apikey='${environment.FINANCIAL_MODELING_API_KEY}'`,
      )
      .pipe(
        tap((response) => console.log('Historical Exchange Rate API Response:', response)),
        catchError((err) => {
          console.error('Error fetching historical exchange rates:', err);
          return throwError(err);
        }),
      );
  }

  getStockPerformance(symbol: string): Observable<any> {
    // Adjust the endpoint according to the API documentation for historical stock prices.
    return this.http
      .get(
        `'${environment.FINANCIAL_MODELING_API}'/historical-price-full/${symbol}?timeseries=90&apikey='${environment.FINANCIAL_MODELING_API_KEY}'`,
      )
      .pipe(
        tap((response) => console.log('API Response:', response)), // Log the response
        catchError((err) => {
          console.error('Error fetching stock performance:', err);
          return throwError(err);
        }),
      );
  }

  getCashFlowStatement(symbol: string): Observable<any> {
    return this.http
      .get(
        `'${environment.FINANCIAL_MODELING_API}'/cash-flow-statement/${symbol}?apikey='${environment.FINANCIAL_MODELING_API_KEY}'`,
      )
      .pipe(
        tap((response) => console.log('Cash Flow API Response:', response)), // Log the response
        catchError((err) => {
          console.error('Error fetching cash flow data:', err);
          return throwError(err);
        }),
      );
  }

  getBalanceSheet(symbol: string): Observable<any> {
    return this.http
      .get(
        `'${environment.FINANCIAL_MODELING_API}'/balance-sheet-statement/${symbol}?apikey='${environment.FINANCIAL_MODELING_API_KEY}'`,
      )
      .pipe(
        tap((response) => console.log('Balance Sheet API Response:', response)), // Log the response
        catchError((err) => {
          console.error('Error fetching balance sheet data:', err);
          return throwError(err);
        }),
      );
  }
}
