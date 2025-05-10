import { Component, OnInit } from '@angular/core';
import { Stock } from 'src/app/services/http/models/stock.model';
import { DbService } from 'src/app/services/http/db.service';
import { concatMap, forkJoin, of, catchError, map } from 'rxjs';
import { FinancialDataService } from './../../services/http/financial-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio-panel',
  templateUrl: './portfolio-panel.component.html',
  styleUrls: ['./portfolio-panel.component.css'],
})
export class PortfolioPanelComponent implements OnInit {
  stocks: Stock[] = [];

  constructor(
    private dbService: DbService,
    private financialDataService: FinancialDataService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.dbService.stocks$
      .pipe(
        concatMap((stocks) => {
          this.stocks = stocks;
          return forkJoin(
            stocks.map((stock) =>
              this.financialDataService.getStockPrice(stock.symbol).pipe(
                map((priceResponse) => ({
                  ...stock,
                  currentPrice: priceResponse[0].price, // Update with actual response structure
                })),
                catchError((error) => {
                  console.error(`Error fetching price for ${stock.symbol}:`, error);
                  return of(stock); // Fallback to the original stock if there's an error
                }),
              ),
            ),
          );
        }),
      )
      .subscribe(
        (updatedStocks) => ((this.stocks = updatedStocks), console.log(this.stocks, updatedStocks)),
        (error) => console.error('Error:', error),
      );
  }

  onStockClick(stock: Stock): void {
    this.router.navigate(['/stock-summary', stock.symbol]);
  }

  removeStock(stock: Stock): void {
    if (confirm(`Are you sure you want to remove ${stock.symbol}?`)) {
      this.dbService.removeStock(stock);
    }
  }
}
