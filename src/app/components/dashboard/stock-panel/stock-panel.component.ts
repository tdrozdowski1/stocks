import { Component, OnInit } from '@angular/core';
import { concatMap } from 'rxjs';
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
  stocks: Stock[] = [];

  constructor(
    private dbService: DbService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.dbService.stocks$.pipe(concatMap((stocks) => (this.stocks = stocks))).subscribe(
      () => console.log(this.stocks),
      (error) => console.error('Error:', error),
    );
  }

  onStockClick(stock: Stock): void {
    this.router.navigate(['/stock-summary', stock.symbol]);
  }

  getLatestOwnershipPeriodQuantity(ownershipPeriods: OwnershipPeriod[]): number {
    if (ownershipPeriods.length === 0) {
      return 0; // Return 0 if there are no ownership periods
    }
    return ownershipPeriods[ownershipPeriods.length - 1].quantity;
  }
}
