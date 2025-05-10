import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TransactionService } from './transaction.service';
import { Transaction } from './models/transaction.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FinancialDataService } from '../http/financial-data.service';
import { DbService } from '../http/db.service';
import any = jasmine.any;
import { Stock } from '../http/models/stock.model';

class MockDbService {
  getStocksValue() {
    return [
      {
        symbol: 'AAPL',
        moneyInvested: 0,
        currentPrice: 0,
        ownershipPeriods: [],
        transactions: [],
        totalDividendValue: 0,
        dividends: [],
      },
    ];
  }
  updateStocks(stocks: any[]) {}
}

class MockFinancialDataService {
  getStockPrice(symbol: string) {
    return { subscribe: (fn: any) => fn(100) }; // Mock stock price
  }
  getDividends(symbol: string) {
    return { subscribe: (fn: any) => fn({ historical: [] }) }; // Mock dividends
  }
}

class FinancialDataServiceMock {
  getStockPrice(symbol: string) {
    // Mock response for getStockPrice
    return of(150);
  }

  getDividends(symbol: string) {
    // Mock response for getDividends
    return of({
      historical: [
        { paymentDate: '2023-12-01', amount: 100 },
        { paymentDate: '2023-11-01', amount: 200 },
      ],
    });
  }
}

class DividendServiceMock {
  filterDividendsByOwnership(historical: any[], ownershipPeriods: any[]) {
    // Mock response for filtering dividends
    return [{ paymentDate: '2023-12-01', dividend: 10, quantity: 10 }];
  }

  calculateTotalDividens(dividends: any[]) {
    // Mock response for total dividends calculation
    return 100;
  }

  updateUsdPlnRateForDividends(stock: Stock) {
    // Mock response for updating USD/PLN rates for dividends
    return of(stock);
  }

  calculateTaxToBePaidInPoland(stock: Stock) {
    // Mock response for calculating tax to be paid in Poland
    return stock;
  }

  calculateTotalWithholdingTaxPaid(stock: Stock) {
    // Mock response for calculating total withholding tax paid
    return stock;
  }
}

describe('TransactionService', () => {
  let service: TransactionService;
  let dbServiceMock: any;
  let financialDataServiceMock: FinancialDataServiceMock;
  let dividendServiceMock: DividendServiceMock;
  let httpClient: HttpClient;

  beforeEach(() => {
    financialDataServiceMock = new FinancialDataServiceMock();
    dividendServiceMock = new DividendServiceMock();
    dbServiceMock = new MockDbService();

    TestBed.configureTestingModule({});

    service = new TransactionService(
      dbServiceMock as any,
      financialDataServiceMock as any,
      dividendServiceMock as any,
      httpClient as any,
    );
  });

  describe('calculateMoneyInvested', () => {
    it('should calculate the correct money invested for mixed transactions', () => {
      // given
      const transactions: Transaction[] = [
        {
          symbol: 'AAPL',
          date: new Date('2024-01-01'),
          type: 'buy',
          amount: 10,
          price: 150,
          commission: 1,
        },
        {
          symbol: 'AAPL',
          date: new Date('2024-01-15'),
          type: 'sell',
          amount: 5,
          price: 160,
          commission: 1,
        },
        {
          symbol: 'AAPL',
          date: new Date('2024-01-20'),
          type: 'buy',
          amount: 20,
          price: 155,
          commission: 1,
        },
      ];

      // when
      const result = service.calculateMoneyInvested(transactions);

      // then
      expect(result).toBe(3803); // (10*150 + 20*155) - (5*160) + (1 + 1 + 1) commissions
    });

    it('should return 0 for no transactions', () => {
      // when
      const result = service.calculateMoneyInvested([]);

      // then
      expect(result).toBe(0);
    });
  });

  describe('calculateOwnershipPeriods', () => {
    // given
    it('should calculate ownership periods correctly for buys and sells', () => {
      const transactions: Transaction[] = [
        {
          symbol: 'AAPL',
          date: new Date('2024-01-01'),
          type: 'buy',
          amount: 10,
          price: 100,
          commission: 5,
        },
        {
          symbol: 'AAPL',
          date: new Date('2024-01-15'),
          type: 'buy',
          amount: 5,
          price: 120,
          commission: 3,
        },
        {
          symbol: 'AAPL',
          date: new Date('2024-02-01'),
          type: 'sell',
          amount: 8,
          price: 130,
          commission: 2,
        },
        {
          symbol: 'AAPL',
          date: new Date('2024-03-01'),
          type: 'sell',
          amount: 3,
          price: 140,
          commission: 1,
        },
      ];

      // when
      const ownershipPeriods = service.calculateOwnershipPeriods(transactions);

      // then
      expect(ownershipPeriods.length).toBe(4); // 4 periods should be recorded
      // Check first period
      expect(ownershipPeriods[0]).toEqual(
        jasmine.objectContaining({
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-15'),
          quantity: 10,
        }),
      );
      // Check second period after first buy
      expect(ownershipPeriods[1]).toEqual(
        jasmine.objectContaining({
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-02-01'),
          quantity: 15, // 10 + 5
        }),
      );
      // Check next period after first sell
      expect(ownershipPeriods[2]).toEqual(
        jasmine.objectContaining({
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-03-01'),
          quantity: 7, // 15 - 8
        }),
      );
      expect(ownershipPeriods[3]).toEqual(
        jasmine.objectContaining({
          startDate: new Date('2024-03-01'),
          endDate: any(Date), // Current date
          quantity: 4, // 7 - 3
        }),
      );
    });
  });

  describe('TransactionService', () => {
    let service: TransactionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [
          TransactionService,
          { provide: DbService, useClass: MockDbService },
          { provide: FinancialDataService, useClass: MockFinancialDataService },
        ],
      });

      service = TestBed.inject(TransactionService);
    });

    describe('addTransaction', () => {
      it('should add transaction', () => {
        // given
        const mockTransaction: Transaction = {
          symbol: 'AAPL',
          date: new Date('2024-01-01'),
          type: 'buy',
          amount: 10,
          price: 150,
          commission: 5,
        };

        // when
        service.addTransaction(mockTransaction);

        // then
        setTimeout(() => {
          expect(dbServiceMock.updateStocks).toHaveBeenCalledWith([
            {
              symbol: 'AAPL',
              transactions: [mockTransaction],
              moneyInvested: 1505, // Example calculation
              currentPrice: 0, // Default or mock value
              ownershipPeriods: [], // Mock or calculated ownership periods
              totalDividendValue: 0, // Default value or calculated
              dividends: [], // Default or mock value
            },
          ]);
        }, 100);
      });
    });
  });
});
