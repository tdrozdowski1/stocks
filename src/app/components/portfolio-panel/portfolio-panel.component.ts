import { Component } from '@angular/core';
import { Stock } from 'src/app/services/http/models/stock.model';

@Component({
  selector: 'app-portfolio-panel',
  templateUrl: './portfolio-panel.component.html',
  styleUrls: ['./portfolio-panel.component.css'],
})
export class PortfolioPanelComponent {
  stocks: Stock[] = [
    {
      symbol: 'AAPL',
      moneyInvested: 1000,
      currentPrice: 150,
      totalDividendValue: 50,
      ownershipPeriods: [],
      transactions: [],
    },
    {
      symbol: 'GOOG',
      moneyInvested: 2000,
      currentPrice: 2500,
      totalDividendValue: 30,
      ownershipPeriods: [],
      transactions: [],
    },
    {
      symbol: 'MSFT',
      moneyInvested: 1500,
      currentPrice: 280,
      totalDividendValue: 45,
      ownershipPeriods: [],
      transactions: [],
    },
  ];
}
