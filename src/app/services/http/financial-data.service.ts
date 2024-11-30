import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';

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
  providedIn: 'root'
})
export class FinancialDataService {
  private API_KEY = 'tQr6CjESc8UVhkFN4Eugr7WXpyYCu82D';
  private BASE_URL = 'https://financialmodelingprep.com/api/v3';

  constructor(private http: HttpClient) { }

  getStockPrice(symbol: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/quote/${symbol}?apikey=${this.API_KEY}`);
  }

  getDividends(symbol: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/historical-price-full/stock_dividend/${symbol}?apikey=${this.API_KEY}`);
  }

  getExchangeRate(date: string): Observable<ForexData> {
    return this.http.get<ForexData>(`${this.BASE_URL}/forex?date=${date}&apikey=${this.API_KEY}`);
  }

  getStockPerformance(symbol: string): Observable<any> {
    // Adjust the endpoint according to the API documentation for historical stock prices.
    return this.http.get(`${this.BASE_URL}/historical-price-full/${symbol}?timeseries=90&apikey=${this.API_KEY}`)
      .pipe(
        tap(response => console.log('API Response:', response)), // Log the response
        catchError(err => {
          console.error('Error fetching stock performance:', err);
          return throwError(err);
        })
      );
  };

  getCashFlowStatement(symbol: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/cash-flow-statement/${symbol}?apikey=${this.API_KEY}`)
      .pipe(
        tap(response => console.log('Cash Flow API Response:', response)), // Log the response
        catchError(err => {
          console.error('Error fetching cash flow data:', err);
          return throwError(err);
        })
      );
  }

  getBalanceSheet(symbol: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/balance-sheet-statement/${symbol}?apikey=${this.API_KEY}`)
      .pipe(
        tap(response => console.log('Balance Sheet API Response:', response)), // Log the response
        catchError(err => {
          console.error('Error fetching balance sheet data:', err);
          return throwError(err);
        })
      );
  }
}
