import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StockModel } from './models/stock.model';
import { environment } from '../../../environments/environment';

export interface ApiResponse {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
}

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private stocksApi = '/stocks';

  constructor(private http: HttpClient) {}

  getStocks(): Observable<StockModel[]> {
    return this.http
      .get<ApiResponse>(`${environment.STOCKS_API}${this.stocksApi}`)
      .pipe(map((response) => JSON.parse(response.body) as StockModel[]));
  }

  addStock(stock: StockModel): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const stockResource = {
      symbol: stock.symbol,
      moneyInvested: stock.moneyInvested,
      ownershipPeriods: stock.ownershipPeriods,
      transactions: stock.transactions,
    };
    return this.http.post<any>(`${environment.STOCKS_API}${this.stocksApi}`, stockResource, {
      headers,
    });
  }

  removeStock(symbol: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(`${environment.STOCKS_API}${this.stocksApi}/${symbol}`, {
      headers,
    });
  }
}
