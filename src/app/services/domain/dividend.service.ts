import { Injectable } from '@angular/core';
import { OwnershipPeriod } from '../http/models/ownershipPeriod.model';
import { DividendDetail } from '../http/models/dividend.details.model';
import { Observable, catchError, forkJoin, from, map, mergeMap, of } from 'rxjs';
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
      return of(stock);
    }

    const exchangeRateRequests = stock.dividends.map((dividend) => {
      const dayBeforePayment = new Date(dividend.paymentDate);
      dayBeforePayment.setDate(dayBeforePayment.getDate() - 1);

      const fetchRate = (
        date: Date,
      ): Observable<{ dividend: DividendDetail; usdPlnRate: number }> => {
        const requestedDay = date.toISOString().split('T')[0];

        return this.financialDataService.getHistoricalExchangeRate().pipe(
          map((exchangeData) => {
            const usdPlnRate = exchangeData.historical.find(
              (rate: any) => rate.date === requestedDay,
            )?.close;

            if (usdPlnRate !== undefined) {
              return { dividend, usdPlnRate };
            } else {
              // If no rate is found, retry with the previous day
              const previousDay = new Date(date);
              previousDay.setDate(date.getDate() - 1);
              // Recursive call: Ensures that we handle undefined properly
              return fetchRate(previousDay).toPromise(); // Convert to a Promise
            }
          }),
          mergeMap((result) => {
            // If the recursive call resolved with a Promise, wrap it back into an observable
            if (result instanceof Promise) {
              return from(result).pipe(
                map((promiseResult) => promiseResult ?? { dividend, usdPlnRate: 1 }), // Default fallback
              );
            }
            return of(result); // Return the result directly
          }),
          catchError(() => {
            // Final fallback in case of unexpected errors
            return of({ dividend, usdPlnRate: 1 });
          }),
        );
      };

      return fetchRate(dayBeforePayment);
    });

    return forkJoin(exchangeRateRequests).pipe(
      map((results: { dividend: DividendDetail; usdPlnRate: number }[]) => {
        results.forEach(({ dividend, usdPlnRate }) => {
          if (dividend) {
            dividend.usdPlnRate = usdPlnRate;
            dividend.withholdingTaxPaid = dividend.dividend * 0.15;
            dividend.dividendInPln = dividend.dividend * usdPlnRate;
            dividend.taxDueInPoland =
              dividend.dividendInPln * 0.19 - dividend.withholdingTaxPaid * usdPlnRate;
          }
        });

        return stock;
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
