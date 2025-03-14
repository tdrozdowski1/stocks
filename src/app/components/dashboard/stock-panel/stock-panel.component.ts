import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DbService } from '../../../services/http/db.service';
import { Stock } from '../../../services/http/models/stock.model';
import { Router } from '@angular/router';
import { OwnershipPeriod } from '../../../services/http/models/ownershipPeriod.model';

@Component({
  selector: 'app-stock-panel',
  templateUrl: './stock-panel.component.html',
  styleUrls: ['./stock-panel.component.css'],
})
export class StockPanel implements OnInit {
  stocks$: Observable<Stock[]> = this.dbService.stocks$;

  constructor(
    private dbService: DbService,
    private router: Router,
  ) {}

  ngOnInit() {}

  onStockClick(stock: Stock): void {
    this.router.navigate(['/stock-summary', stock.symbol]);
  }

  getLatestOwnershipPeriodQuantity(ownershipPeriods: OwnershipPeriod[]): number {
    if (ownershipPeriods.length === 0) {
      return 0;
    }
    return ownershipPeriods[ownershipPeriods.length - 1].quantity;
  }

  removeStock(stock: Stock): void {
    if (confirm(`Are you sure you want to remove ${stock.symbol}?`)) {
      this.dbService.removeStock(stock);
    }
  }
}
