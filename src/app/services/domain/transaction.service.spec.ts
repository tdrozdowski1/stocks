import { TestBed } from '@angular/core/testing';

import { TransactionService } from './transaction.service';
import { Transaction } from './models/transaction.model';
import { HttpClientModule } from '@angular/common/http';
import { FinancialDataService } from '../http/financial-data.service';
import { DbService } from '../http/db.service';
import any = jasmine.any;

class MockDbService {
  getStocksValue() {
    return [];
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

  describe('calculateMoneyInvested', () => {
    it('should calculate the correct money invested for mixed transactions', () => {
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

      const result = service.calculateMoneyInvested(transactions);
      expect(result).toBe(3803); // (10*150 + 20*155) - (5*160) + (1 + 1 + 1) commissions
    });

    it('should return 0 for no transactions', () => {
      const result = service.calculateMoneyInvested([]);
      expect(result).toBe(0);
    });
  });

  describe('calculateOwnershipPeriods', () => {
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

      const ownershipPeriods = service.calculateOwnershipPeriods(transactions);

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
});
