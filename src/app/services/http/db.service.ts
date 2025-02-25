import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Stock } from './models/stock.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface ApiResponse {
  statusCode: number;
  headers: {
    [key: string]: string;
  };
  body: string; // body is a string, not parsed yet
}

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private apiUrl = 'https://n0d0byuqzh.execute-api.us-east-1.amazonaws.com/prod/stocks';

  private stocksSubject: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>([]);
  stocks$: Observable<Stock[]> = this.stocksSubject.asObservable();

  constructor(private http: HttpClient) {}

  updateStocks(stocks: Stock[]): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    this.http.post<any>(this.apiUrl, stocks[stocks.length - 1], { headers }).subscribe({
      next: (response) => console.log('Stock added successfully:', response),
      error: (error) => console.error('Error adding stock:', error),
    });

    this.stocksSubject.next(stocks);
  }

  getStocks(): Observable<Stock[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http
      .get<ApiResponse>(this.apiUrl, { headers })
      .pipe(map((response) => JSON.parse(response.body) as Stock[]))
      .subscribe({
        next: (stocks) => this.stocksSubject.next(stocks),
        error: (error) => console.error('Error fetching stocks:', error),
      });

    return this.stocks$;
  }

  getStocksValue(): Stock[] {
    return this.stocksSubject.value;
  }

  clearStocks(): void {
    this.stocksSubject.next([]);
  }

  /**
   * Returns an observable that emits the stock with the given symbol, or undefined if not found.
   * @param symbol The stock symbol to search for.
   * @returns An Observable of the Stock object or undefined if not found.
   */
  getStockBySymbol(symbol: string): Observable<Stock | undefined> {
    return this.stocks$.pipe(
      // Use map to transform the list of stocks to the stock with the given symbol
      map((stocks) => stocks.find((stock) => stock.symbol === symbol)),
    );
  }
}
