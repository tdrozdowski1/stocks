import { Component } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { StockModel } from '../../../services/http/models/stock.model';
import { Router } from '@angular/router';
import { OwnershipPeriod } from '../../../services/http/models/ownershipPeriod.model';
import { StockStateService } from '../../../services/state/state.service';
import { AuthenticationStateService } from '../../../auth/authentication-state.service';

@Component({
  selector: 'app-stock-panel',
  templateUrl: './stock-panel.component.html',
  styleUrls: ['./stock-panel.component.css'],
})
export class StockPanel {
  stocks$: Observable<(StockModel & { latestQuantity: number })[]>;
  isAuthenticated$ = of(false);

  constructor(
    private stockStateService: StockStateService,
    private router: Router,
    private authStateService: AuthenticationStateService,
  ) {
    this.isAuthenticated$ = this.authStateService.isAuthenticated$;

    this.isAuthenticated$.subscribe((isAuthenticated) => {
      console.log('isAuthenticated$:', isAuthenticated);
    });
    this.stocks$ = this.authStateService.isAuthenticated$.pipe(
      switchMap((isAuthenticated) =>
        isAuthenticated
          ? this.stockStateService.stocks$.pipe(
              tap((stocks) => console.log('StockStateService emitted:', stocks)),
              map((stocks) =>
                stocks.map((stock) => ({
                  ...stock,
                  latestQuantity: this.getLatestOwnershipPeriodQuantity(stock.ownershipPeriods),
                })),
              ),
            )
          : of([]),
      ),
    );
  }

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
    if (confirm(`Are you sure you want to remove ${stock.symbol}?`)) {
      this.stockStateService.removeStock(stock.symbol);
    }
  }
}
