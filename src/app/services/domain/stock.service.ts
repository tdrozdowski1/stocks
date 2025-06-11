import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StockModel } from '../http/models/stock.model';

@Injectable({ providedIn: 'root' })
export class StockService {
  constructor(

  ) {}

  updateStock(stock: StockModel): Observable<StockModel> | null {
    return null;
  }
}
