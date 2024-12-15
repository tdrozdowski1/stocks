import { TestBed } from '@angular/core/testing';

import { DividendService } from './dividend.service';
import { OwnershipPeriod } from '../http/models/ownershipPeriod.model';

describe('DividendService', () => {
  let service: DividendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DividendService);
  });

  describe('filterDividendsByOwnership', () => {
    it('should filter dividends based on ownership periods', () => {
      const dividends = [
        { paymentDate: '2024-01-10', dividend: 1.5 },
        { paymentDate: '2024-02-10', dividend: 1.0 },
        { paymentDate: '2024-03-10', dividend: 2.0 },
      ];

      const ownershipPeriods: OwnershipPeriod[] = [
        { startDate: new Date('2024-01-01'), endDate: new Date('2024-01-15'), quantity: 10 },
        { startDate: new Date('2024-01-15'), endDate: new Date('2024-02-01'), quantity: 5 },
      ];

      const filteredDividends = service.filterDividendsByOwnership(dividends, ownershipPeriods);

      expect(filteredDividends.length).toBe(1); // Only 2024-01-10 and 2024-02-10 dividends should be included
      expect(filteredDividends[0]).toEqual(
        jasmine.objectContaining({ paymentDate: '2024-01-10', quantity: 10, dividend: 1.5 }),
      );
    });

    it('should return an empty array if there are no relevant dividends', () => {
      const dividends = [{ paymentDate: '2024-04-10', dividend: 1.5 }];

      const ownershipPeriods: OwnershipPeriod[] = [
        { startDate: new Date('2024-01-01'), endDate: new Date('2024-01-15'), quantity: 10 },
      ];

      const filteredDividends = service.filterDividendsByOwnership(dividends, ownershipPeriods);

      expect(filteredDividends.length).toBe(0); // No dividends should be returned
    });
  });

  describe('calculateTotalDividens', () => {
    it('should correctly calculate total dividends for multiple dividend entries', () => {
      const relevantDividends = [
        {
          paymentDate: new Date('2024-01-01'),
          dividend: 2,
          quantity: 100,
          totalDividend: 0,
          totalDividendInPln: 0,
          withholdingTaxPaid: 0,
          taxDueInPoland: 0,
        },
        {
          paymentDate: new Date('2024-02-01'),
          dividend: 3,
          quantity: 50,
          totalDividend: 0,
          totalDividendInPln: 0,
          withholdingTaxPaid: 0,
          taxDueInPoland: 0,
        },
      ];
      const result = service.calculateTotalDividens(relevantDividends);
      expect(result).toBe(350); // (2 * 100) + (3 * 50) = 200 + 150 = 350
    });
  });
});
