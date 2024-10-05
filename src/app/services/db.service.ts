import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import {Stock} from "../models/stock.model";

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private stocksSubject: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>([]);
  stocks$: Observable<Stock[]> = this.stocksSubject.asObservable();

  constructor() {}

  addStock(stock: Stock): void {
    const currentStocks = this.stocksSubject.value;
    this.stocksSubject.next([...currentStocks, stock]);
  }

  updateStocks(stocks: Stock[]): void {
    this.stocksSubject.next(stocks);
  }

  getStocks(): Observable<Stock[]> {
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
      map((stocks) => stocks.find(stock => stock.symbol === symbol))
    );
  }
}
