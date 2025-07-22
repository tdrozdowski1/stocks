import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { StockModel } from '../http/models/stock.model';
import { DbService } from '../http/db.service';

@Injectable({ providedIn: 'root' })
export class StockStateService {
  private stocksSubject = new BehaviorSubject<StockModel[]>([]);
  stocks$: Observable<StockModel[]> = this.stocksSubject.asObservable();

  constructor(private dbService: DbService) {}

  initStocks(): void {
    this.dbService.getStocks().subscribe({
      next: (stocks) => this.updateStocks(stocks),
      error: (error) => console.error('Error initializing stocks:', error),
    });
  }

  getStockBySymbol(symbol: string): Observable<StockModel | undefined> {
    return this.stocks$.pipe(map((stocks) => stocks.find((stock) => stock.symbol === symbol)));
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
    this.dbService.removeStock(symbol).subscribe();
  }
}
