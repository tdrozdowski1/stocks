import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
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
}
