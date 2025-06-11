import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from './models/transaction.model';
import { DbService } from '../http/db.service';
import { FinancialDataService } from '../http/financial-data.service';
import { OwnershipPeriod } from '../http/models/ownershipPeriod.model';
import { DividendService } from './dividend.service';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private lambdaUrl = 'https://v7eu1cmimh.execute-api.us-east-1.amazonaws.com/prod/transactions';

  constructor(
    private http: HttpClient,
    private dbService: DbService,
    private financialDataService: FinancialDataService,
    private dividendService: DividendService,
  ) {}

  addTransaction(transaction: Transaction) {
    this.http
      .post(this.lambdaUrl, { body: JSON.stringify(transaction) })
      .pipe(
        catchError(() => of(null)), // If Lambda call fails, return null
      )
      .subscribe((response: any) => {
        console.log("Add Transaction Response:", response); // Debug response
        if (!response || response.error) {
          // If Lambda response is negative, execute fallback logic
          this.fallbackAddTransaction(transaction);
        }
      });
  }

  private fallbackAddTransaction(transaction: Transaction) {
    let currentStocks = this.dbService.getStocksValue();
    let stock = currentStocks.find((s) => s.symbol === transaction.symbol);

    if (stock) {
      const updatedTransactions = [...stock.transactions, transaction];
      stock = {
        symbol: stock.symbol,
        transactions: updatedTransactions,
        moneyInvested: this.calculateMoneyInvested(updatedTransactions),
        currentPrice: stock.currentPrice,
        ownershipPeriods: this.calculateOwnershipPeriods(updatedTransactions),
        totalDividendValue: stock.totalDividendValue,
      };
    } else {
      stock = {
        symbol: transaction.symbol,
        transactions: [transaction],
        moneyInvested: this.calculateMoneyInvested([transaction]),
        currentPrice: 0,
        ownershipPeriods: this.calculateOwnershipPeriods([transaction]),
        totalDividendValue: 0,
      };
    }

    this.financialDataService.getStockPrice(stock!.symbol).subscribe((response) => {
      stock!.currentPrice = response;
    });

    this.financialDataService.getDividends(stock!.symbol).subscribe((data) => {
      const ownershipPeriods = this.calculateOwnershipPeriods(stock!.transactions);
      stock!.dividends = this.dividendService.filterDividendsByOwnership(
        data.historical,
        ownershipPeriods,
      );
      stock!.totalDividendValue = this.dividendService.calculateTotalDividens(stock!.dividends);

      this.dividendService.updateUsdPlnRateForDividends(stock!).subscribe((stock) => {
        stock = this.dividendService.calculateTaxToBePaidInPoland(stock);
        stock = this.dividendService.calculateTotalWithholdingTaxPaid(stock);

        const filteredStocks = currentStocks.filter(
          (savedStock) => savedStock.symbol !== stock.symbol,
        );
        filteredStocks.push(stock!);
        this.dbService.updateStocks(filteredStocks);
      });
    });
  }

  calculateMoneyInvested(transactions: Transaction[]): number {
    let totalBuy = 0;
    let totalSell = 0;
    let commission = 0;

    transactions.forEach((transaction) => {
      commission += transaction.commission;
      if (transaction.type === 'buy') {
        totalBuy += transaction.amount * transaction.price;
      } else if (transaction.type === 'sell') {
        totalSell += transaction.amount * transaction.price;
      }
    });
    return totalBuy - totalSell + commission;
  }

  calculateOwnershipPeriods(transactions: Transaction[]): OwnershipPeriod[] {
    const ownershipPeriods: OwnershipPeriod[] = [];
    let totalAmount = 0;
    let startDate: Date | null = null;

    transactions.forEach((transaction) => {
      if (transaction.type === 'buy') {
        if (totalAmount > 0 && startDate) {
          ownershipPeriods.push({ startDate, endDate: transaction.date, quantity: totalAmount });
        }
        totalAmount += transaction.amount;
        startDate = new Date(transaction.date);
      } else if (transaction.type === 'sell') {
        if (totalAmount > 0 && startDate) {
          ownershipPeriods.push({ startDate, endDate: transaction.date, quantity: totalAmount });
          totalAmount -= transaction.amount;
          startDate = totalAmount > 0 ? new Date(transaction.date) : null;
        }
      }
    });

    if (totalAmount > 0 && startDate) {
      ownershipPeriods.push({ startDate, endDate: new Date(), quantity: totalAmount });
    }
    return ownershipPeriods;
  }
}
