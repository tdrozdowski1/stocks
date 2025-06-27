import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

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
  constructor(private http: HttpClient) {}

  fetchNameSuggestions(query: string): Observable<string[]> {
    const url = `${environment.FINANCIAL_MODELING_API}/search?query=${query}&limit=5&exchange=NYSE,NASDAQ&apikey=${environment.FINANCIAL_MODELING_API_KEY}`;
    return this.http
      .get<any[]>(url)
      .pipe(switchMap((data) => of(data.map((item) => `${item.symbol} - ${item.name}`))));
  }

  getCompanyInfo(symbol: string): Observable<CompanyInfo[]> {
    return this.http.get<CompanyInfo[]>(
      `${environment.FINANCIAL_MODELING_API}/key-metrics/${symbol}?limit=5&apikey=${environment.FINANCIAL_MODELING_API_KEY}`,
    );
  }

  getCompanyInfoList(limit: number, page: number): Observable<any[]> {
    const url = `${environment.FINANCIAL_MODELING_API}/stock-screener?marketCapMoreThan=1000000000&limit=${limit}&offset=${
      (page - 1) * limit
    }&apikey=${environment.FINANCIAL_MODELING_API_KEY}`;
    return this.http.get<any[]>(url);
  }
}
