import { Component } from '@angular/core';

@Component({
  selector: 'app-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.css'],
})
export class StockTableComponent {
  stocks = [
    {
      name: 'Apple',
      symbol: 'AAPL',
      marketCap: 2.5,
      sector: 'Technology',
      dividendYield: 0.6,
      payoutRatio: 15,
      roic: 25,
    },
    {
      name: 'Microsoft',
      symbol: 'MSFT',
      marketCap: 2.3,
      sector: 'Technology',
      dividendYield: 0.8,
      payoutRatio: 28,
      roic: 30,
    },
    // More data...
  ];
  filter = '';
  page = 1;
  pageSize = 20;
  columns = ['Name', 'Symbol', 'Market Cap', 'Sector', 'Dividend Yield', 'Payout Ratio', 'ROIC'];

  constructor() {}

  ngOnInit(): void {}

  filteredStocks() {
    return this.stocks.filter((stock) =>
      Object.values(stock).some((value) =>
        value.toString().toLowerCase().includes(this.filter.toLowerCase()),
      ),
    );
  }

  paginatedStocks() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredStocks().slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.page * this.pageSize < this.filteredStocks().length) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  sortBy(column: string) {
    const key = column.toLowerCase().replace(' ', '') as keyof (typeof this.stocks)[0];

    this.stocks.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      // Compare string values or numbers depending on the key
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      }

      return 0;
    });
  }
}
