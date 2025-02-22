import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Stock } from './models/stock.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
      'Content-Type': 'application/json'
    });

    this.http.post<any>(this.apiUrl, stocks[stocks.length -1], { headers }).subscribe({
      next: (response) => console.log('Stock added successfully:', response),
      error: (error) => console.error('Error adding stock:', error)
  });



    this.stocksSubject.next(stocks);
  }

  getStocks(): Observable<Stock[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.stocks$ = this.http.get<Stock[]>(this.apiUrl, { headers });
  
    return this.stocks$
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
