import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface CompanyInfo {
  date: string;
  peRatio: number;
  revenuePerShare: number;
  roic: number;
  currentRatio: number;
  dividendYield: number;
  payoutRatio: number;
}

@Injectable({
  providedIn: 'root',
})
export class CompanyInfoService {
  private API_KEY = 'tQr6CjESc8UVhkFN4Eugr7WXpyYCu82D';
  private BASE_URL = 'https://financialmodelingprep.com/api/v3';

  constructor(private http: HttpClient) {}

  fetchNameSuggestions(query: string): Observable<string[]> {
    const url = `https://financialmodelingprep.com/api/v3/search?query=${query}&limit=5&exchange=NYSE,NASDAQ&apikey=${this.API_KEY}`;
    return this.http.get<any[]>(url).pipe(
      switchMap((data) => of(data.map((item) => `${item.symbol} - ${item.name}`))), // Format as "symbol - name"
    );
  }

  getCompanyInfo(symbol: string): Observable<CompanyInfo[]> {
    return this.http.get<CompanyInfo[]>(
      `${this.BASE_URL}/key-metrics/${symbol}?limit=5&apikey=${this.API_KEY}`,
    );
  }

  getCompanyInfoList(limit: number, page: number): Observable<any[]> {
    const url = `${this.BASE_URL}/stock-screener?marketCapMoreThan=1000000000&limit=${limit}&offset=${
      (page - 1) * limit
    }&apikey=${this.API_KEY}`;
    return this.http.get<any[]>(url);
  }
}
