import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
