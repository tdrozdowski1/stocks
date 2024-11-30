import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  getCompanyInfo(symbol: string): Observable<CompanyInfo[]> {
    return this.http.get<CompanyInfo[]>(
      `${this.BASE_URL}/key-metrics/${symbol}?limit=5&apikey=${this.API_KEY}`,
    );
  }
}
