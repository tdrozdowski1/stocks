import { Injectable } from '@angular/core';
import { OwnershipPeriod } from '../http/models/ownershipPeriod.model';
import { DividendDetail } from '../http/models/dividend.details.model';

@Injectable({
  providedIn: 'root',
})
export class DividendService {
  constructor() {}

  filterDividendsByOwnership(
    dividends: any[],
    ownershipPeriods: OwnershipPeriod[],
  ): DividendDetail[] {
    return dividends.filter((dividend) => {
      const dividendDate = new Date(dividend.paymentDate);

      // Check if the dividend date falls within any of the ownership periods and attach the quantity information
      const relevantPeriod = ownershipPeriods.find((period) => {
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate ? period.endDate : new Date());

        return dividendDate >= startDate && dividendDate <= endDate;
      });

      if (relevantPeriod) {
        // Attach quantity information to the dividend for further calculations
        dividend.quantity = relevantPeriod.quantity;
        dividend.totalDividend = dividend.dividend * dividend.quantity;

        return true;
      }

      return false;
    });
  }

  calculateTotalDividens(relevantDividends: DividendDetail[]) {
    return relevantDividends.reduce((total, dividend) => {
      return total + dividend.dividend * dividend.quantity; // Multiply dividend per share by quantity held
    }, 0);
  }
}
