import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DividendService } from './dividend.service';
import { OwnershipPeriod } from '../http/models/ownershipPeriod.model';
import { Stock } from '../http/models/stock.model';

// Mock for FinancialDataService
class MockFinancialDataService {
  getHistoricalExchangeRate() {
    return of({
      historical: [
        { date: '2023-12-01', close: 4.5 },
        { date: '2023-11-30', close: 4.4 },
        { date: '2023-11-01', close: 4.2 },
        { date: '2023-10-31', close: 4.1 },
      ],
    });
  }
}

describe('DividendService', () => {
  let service: DividendService;
  let financialDataService: MockFinancialDataService;

  beforeEach(() => {
    financialDataService = new MockFinancialDataService();
    TestBed.configureTestingModule({});
    service = new DividendService(financialDataService as any);
  });

  describe('filterDividendsByOwnership', () => {
    it('should filter dividends based on ownership periods', () => {
      // given
      const dividends = [
        { paymentDate: '2024-01-10', dividend: 1.5 },
        { paymentDate: '2024-02-10', dividend: 1.0 },
        { paymentDate: '2024-03-10', dividend: 2.0 },
      ];

      const ownershipPeriods: OwnershipPeriod[] = [
        { startDate: new Date('2024-01-01'), endDate: new Date('2024-01-15'), quantity: 10 },
        { startDate: new Date('2024-01-15'), endDate: new Date('2024-02-01'), quantity: 5 },
      ];

      // when
      const filteredDividends = service.filterDividendsByOwnership(dividends, ownershipPeriods);

      // then
      expect(filteredDividends.length).toBe(1); // Only 2024-01-10 and 2024-02-10 dividends should be included
      expect(filteredDividends[0]).toEqual(
        jasmine.objectContaining({ paymentDate: '2024-01-10', quantity: 10, dividend: 1.5 }),
      );
    });

    it('should return an empty array if there are no relevant dividends', () => {
      // given
      const dividends = [{ paymentDate: '2024-04-10', dividend: 1.5 }];
      const ownershipPeriods: OwnershipPeriod[] = [
        { startDate: new Date('2024-01-01'), endDate: new Date('2024-01-15'), quantity: 10 },
      ];

      // when
      const filteredDividends = service.filterDividendsByOwnership(dividends, ownershipPeriods);

      // then
      expect(filteredDividends.length).toBe(0); // No dividends should be returned
    });
  });

  describe('calculateTotalDividens', () => {
    it('should correctly calculate total dividends for multiple dividend entries', () => {
      // given
      const relevantDividends = [
        {
          paymentDate: new Date('2024-01-01'),
          dividend: 2,
          quantity: 100,
          dividendInPln: 0,
          withholdingTaxPaid: 0,
          taxDueInPoland: 0,
        },
        {
          paymentDate: new Date('2024-02-01'),
          dividend: 3,
          quantity: 50,
          dividendInPln: 0,
          withholdingTaxPaid: 0,
          taxDueInPoland: 0,
        },
      ];

      // when
      const result = service.calculateTotalDividens(relevantDividends);

      // then
      expect(result).toBe(350); // (2 * 100) + (3 * 50) = 200 + 150 = 350
    });
  });

  describe('updateUsdPlnRateForDividends', () => {
    it('should update dividends with USD/PLN rate and calculated values', () => {
      // given
      const stock: Stock = {
        symbol: 'AAPL',
        moneyInvested: 1000,
        currentPrice: 150,
        ownershipPeriods: [],
        transactions: [],
        totalDividendValue: 0,
        dividends: [
          {
            paymentDate: new Date('2023-12-01'),
            dividend: 100,
            quantity: 10,
            dividendInPln: 0,
            withholdingTaxPaid: 0,
            taxDueInPoland: 0,
          },
          {
            paymentDate: new Date('2023-11-01'),
            dividend: 200,
            quantity: 5,
            dividendInPln: 0,
            withholdingTaxPaid: 0,
            taxDueInPoland: 0,
          },
        ],
      };

      const expectedStock = {
        ...stock,
        dividends: [
          {
            paymentDate: new Date('2023-12-01'),
            dividend: 100,
            quantity: 10,
            dividendInPln: 440.00000000000006, // 100 * 4.5
            withholdingTaxPaid: 15, // 100 * 0.15
            taxDueInPoland: 17.60000000000001, // (450 * 0.19) - (15 * 4.5)
            usdPlnRate: 4.4,
          },
          {
            paymentDate: new Date('2023-11-01'),
            dividend: 200,
            quantity: 5,
            dividendInPln: 819.9999999999999, // 200 * 4.5
            withholdingTaxPaid: 30, // 200 * 0.15
            taxDueInPoland: 32.8, // (900 * 0.19) - (30 * 4.5)
            usdPlnRate: 4.1,
          },
        ],
      };

      // when
      // then
      service.updateUsdPlnRateForDividends(stock).subscribe((result) => {
        expect(result).toEqual(expectedStock);
      });
    });

    it('should use a date from the day earlier if no rate is found for the first day', () => {
      const stock: Stock = {
        symbol: 'AAPL',
        moneyInvested: 1000,
        currentPrice: 150,
        ownershipPeriods: [],
        transactions: [],
        totalDividendValue: 0,
        dividends: [
          {
            paymentDate: new Date('2023-12-01'),
            dividend: 100,
            quantity: 10,
            dividendInPln: 0,
            withholdingTaxPaid: 0,
            taxDueInPoland: 0,
          },
        ],
      };

      const expectedStock = {
        ...stock,
        dividends: [
          {
            paymentDate: new Date('2023-12-01'),
            dividend: 100,
            quantity: 10,
            dividendInPln: 440.00000000000006, // 100 * 4.4
            withholdingTaxPaid: 15, // 100 * 0.15
            taxDueInPoland: 17.60000000000001, // (440 * 0.19) - (15 * 4.4)
            usdPlnRate: 4.4,
          },
        ],
      };

      // when
      // then
      service.updateUsdPlnRateForDividends(stock).subscribe((result) => {
        expect(result).toEqual(expectedStock);
      });
    });
  });

  describe('calculateTaxes', () => {
    it('calculateTaxToBePaidInPoland', () => {
      // give
      const stock: Stock = {
        symbol: 'AAPL',
        moneyInvested: 1000,
        currentPrice: 150,
        ownershipPeriods: [],
        transactions: [],
        totalDividendValue: 0,
        dividends: [
          {
            paymentDate: new Date('2023-12-01'),
            dividend: 1,
            quantity: 2,
            dividendInPln: 1,
            withholdingTaxPaid: 1,
            taxDueInPoland: 10,
            usdPlnRate: 1,
          },
          {
            paymentDate: new Date('2023-12-02'),
            dividend: 1,
            quantity: 3,
            dividendInPln: 1,
            withholdingTaxPaid: 1,
            taxDueInPoland: 5,
            usdPlnRate: 1,
          },
        ],
      };

      // when
      const updatedStock = service.calculateTaxToBePaidInPoland(stock);

      // then
      expect(updatedStock.taxToBePaidInPoland).toBe(35); // (10 * 2) + (5 * 3)
    });

    it('calculateTotalWithholdingTaxPaid', () => {
      // give
      const stock: Stock = {
        symbol: 'AAPL',
        moneyInvested: 1000,
        currentPrice: 150,
        ownershipPeriods: [],
        transactions: [],
        totalDividendValue: 0,
        dividends: [
          {
            paymentDate: new Date('2023-12-01'),
            dividend: 1,
            quantity: 2,
            dividendInPln: 1,
            withholdingTaxPaid: 1.5,
            taxDueInPoland: 1,
            usdPlnRate: 1,
          },
          {
            paymentDate: new Date('2023-12-02'),
            dividend: 1,
            quantity: 3,
            dividendInPln: 1,
            withholdingTaxPaid: 2,
            taxDueInPoland: 1,
            usdPlnRate: 1,
          },
        ],
      };

      // when
      const updatedStock = service.calculateTotalWithholdingTaxPaid(stock);

      // then
      expect(updatedStock.totalWithholdingTaxPaid).toBe(9); // (1.5 * 2) + (2 * 3)
    });
  });
});
