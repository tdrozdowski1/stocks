import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StockModel } from '../http/models/stock.model';

@Injectable({ providedIn: 'root' })
export class StockStateService {
  stocksSubject = new BehaviorSubject<StockModel[]>([]);
  stocks$: Observable<StockModel[]> = this.stocksSubject.asObservable();

  constructor() {
    // Initialize state (e.g., load from DbService on startup)
  }

  updateStocks(stocks: StockModel[]): void {
    this.stocksSubject.next(stocks);
  }

  addStock(stock: StockModel): void {
    const currentStocks = this.stocksSubject.getValue();
    const updatedStocks = [...currentStocks.filter((s) => s.symbol !== stock.symbol), stock];
    this.stocksSubject.next(updatedStocks);
  }

  removeStock(symbol: string): void {
    const updatedStocks = this.stocksSubject.getValue().filter((s) => s.symbol !== symbol);
    this.stocksSubject.next(updatedStocks);
  }
}
