import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StockModel } from '../../../services/http/models/stock.model';
import { Router } from '@angular/router';
import { OwnershipPeriod } from '../../../services/http/models/ownershipPeriod.model';
import { StockStateService } from '../../../services/state/state.service';

@Component({
  selector: 'app-stock-panel',
  templateUrl: './stock-panel.component.html',
  styleUrls: ['./stock-panel.component.css'],
})
export class StockPanel {
  stocks$: Observable<StockModel[]> = this.stockStateService.stocks$;

  constructor(
    private stockStateService: StockStateService,
    private router: Router,
  ) {}

  onStockClick(stock: StockModel): void {
    this.router.navigate(['/stock-summary', stock.symbol]);
  }

  getLatestOwnershipPeriodQuantity(ownershipPeriods: OwnershipPeriod[]): number {
    if (ownershipPeriods.length === 0) {
      return 0;
    }
    return ownershipPeriods[ownershipPeriods.length - 1].quantity;
  }

  removeStock(stock: StockModel): void {
    //TODO: update db
    if (confirm(`Are you sure you want to remove ${stock.symbol}?`)) {
      this.stockStateService.removeStock(stock.symbol);
    }
  }
}
