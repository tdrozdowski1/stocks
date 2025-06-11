import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { StockModel } from './models/stock.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StockStateService } from '../state/state.service';

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
  private stocksApi = '/stocks';

  private stocksSubject: BehaviorSubject<StockModel[]> = new BehaviorSubject<StockModel[]>([]);
  stocks$: Observable<StockModel[]> = this.stocksSubject.asObservable();

  constructor(
    private http: HttpClient,
    private stockStateService: StockStateService,
  ) {
    this.loadInitialStocks();
  }

  private loadInitialStocks(): void {
    this.getStocks();
  }

  //TODO: probably not needed

  // updateStocks(stocks: StockModel[]): void {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Accept: 'application/json',
  //   });
  //
  //   const stocksResource = stocks.map((stock) => ({
  //     symbol: stock.symbol,
  //     moneyInvested: stock.moneyInvested,
  //     ownershipPeriods: stock.ownershipPeriods,
  //     transactions: stock.transactions
  //     // ,
  //     // totalWithholdingTaxPaid: stock.totalWithholdingTaxPaid,
  //     // taxToBePaidInPoland: stock.taxToBePaidInPoland,
  //   }));
  //
  //   this.http.post<any>(this.apiUrl, stocksResource[stocksResource.length - 1], { headers }).subscribe({
  //     next: (response) => console.log('Stock added successfully:', response),
  //     error: (error) => console.error('Error adding stock:', error),
  //   });
  //
  //   this.stocksSubject.next(stocks);
  // }

  getStocks(): Observable<StockModel[]> {
    this.http
      .get<ApiResponse>('${environment.STOCKS_API}' + this.stocksApi)
      .pipe(map((response) => JSON.parse(response.body) as StockModel[]))
      .subscribe({
        next: (stocks) => this.stockStateService.updateStocks(stocks),
        error: (error) => console.error('Error fetching stocks:', error),
      });

    return this.stocks$;
  }

  getStocksValue(): StockModel[] {
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
  getStockBySymbol(symbol: string): Observable<StockModel | undefined> {
    return this.stocks$.pipe(map((stocks) => stocks.find((stock) => stock.symbol === symbol)));
  }

  removeStock(stock: StockModel): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.delete<any>(`${this.stocksApi}/${stock.symbol}`, { headers }).subscribe({
      next: (response) => console.log('Stock removed successfully:', response),
      error: (error) => console.error('Error removing stock:', error),
    });

    this.stocksSubject.next(this.stocksSubject.value.filter((s) => s.symbol !== stock.symbol));
  }
}
