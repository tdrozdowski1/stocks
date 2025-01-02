import { Injectable } from '@angular/core';
import { OwnershipPeriod } from '../http/models/ownershipPeriod.model';
import { DividendDetail } from '../http/models/dividend.details.model';
import { Observable, forkJoin, map, of } from 'rxjs';
import { Stock } from '../http/models/stock.model';
import { FinancialDataService } from '../http/financial-data.service';

@Injectable({
  providedIn: 'root',
})
export class DividendService {
  constructor(private financialDataService: FinancialDataService) {}

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

  updateUsdPlnRateForDividends(stock: Stock): Observable<Stock> {
    if (!stock.dividends || stock.dividends.length === 0) {
      // If there are no dividends, return the stock as is
      return of(stock);
    }

    // Create an array of observables for fetching exchange rates for each dividend
    const exchangeRateRequests = stock.dividends.map((dividend) => {
      const dayBeforePayment = new Date(dividend.paymentDate);
      dayBeforePayment.setDate(dayBeforePayment.getDate() - 1);

      const requestedDay = dayBeforePayment.toISOString().split('T')[0];
      return this.financialDataService
        .getHistoricalExchangeRate()
        .pipe(
          map((exchangeData) => {
            const usdPlnRate =
              exchangeData.historical.find((rate: any) => rate.date === requestedDay)?.close ?? 1;
            return { dividend, usdPlnRate };
          }),
        );
    });

    // Execute all requests in parallel and update the dividends
    return forkJoin(exchangeRateRequests).pipe(
      map((results) => {
        results.forEach(({ dividend, usdPlnRate }) => {
          dividend.usdPlnRate = usdPlnRate;
          dividend.withholdingTaxPaid = dividend.dividend * 0.15;
          dividend.dividendInPln = dividend.dividend * usdPlnRate;
          dividend.taxDueInPoland =
            dividend.dividendInPln * 0.19 - dividend.withholdingTaxPaid * usdPlnRate;
        });

        return stock; // Return the updated stock
      }),
    );
  }

  calculateTaxToBePaidInPoland(stock: Stock) {
    stock.taxToBePaidInPoland =
      stock.dividends!.reduce(
        (total, dividend) => total + dividend.taxDueInPoland * dividend.quantity,
        0,
      ) ?? 0;
    return stock;
  }

  calculateTotalWithholdingTaxPaid(stock: Stock) {
    stock.totalWithholdingTaxPaid =
      stock.dividends!.reduce(
        (total, dividend) => total + dividend.withholdingTaxPaid * dividend.quantity,
        0,
      ) ?? 0;
    return stock;
  }
}
