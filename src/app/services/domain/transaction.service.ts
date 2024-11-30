import { Injectable } from '@angular/core';
import { Transaction } from './models/transaction.model';
import { DbService } from '../http/db.service';
import { FinancialDataService } from '../http/financial-data.service';
import { OwnershipPeriod } from '../http/models/ownershipPeriod.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(
    private dbService: DbService,
    private financialDataService: FinancialDataService,
  ) {}

  addTransaction(transaction: Transaction) {
    let currentStocks = this.dbService.getStocksValue();
    let stock = currentStocks.find((s) => s.symbol === transaction.symbol);

    if (stock) {
      const updatedTransactions = [...stock.transactions, transaction];
      stock = {
        symbol: stock.symbol,
        transactions: updatedTransactions,
        moneyInvested: this.calculateMoneyInvested(updatedTransactions),
        currentPrice: 0,
        ownershipPeriods: this.calculateOwnershipPeriods(updatedTransactions),
        totalDividendValue: 0,
      };
      currentStocks = currentStocks.filter((stock) => stock.symbol !== stock.symbol);
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

    this.financialDataService
      .getStockPrice(stock!.symbol)
      .subscribe((response) => (stock!.currentPrice = response));

    // Get dividends data for the stock
    this.financialDataService.getDividends(stock!.symbol).subscribe((data) => {
      const ownershipPeriods = this.calculateOwnershipPeriods(stock!.transactions); // Get ownership periods with quantities
      const relevantDividends = this.filterDividendsByOwnership(data.historical, ownershipPeriods); // Filter dividends

      // Calculate total dividend value based on quantity held during each period
      const totalDividendValue = relevantDividends.reduce((total, dividend) => {
        return total + dividend.dividend * dividend.quantity; // Multiply dividend per share by quantity held
      }, 0);

      // Update the stock with relevant dividends and total dividend value
      stock!.dividends = relevantDividends;
      stock!.totalDividendValue = totalDividendValue;

      // Save or update the stock object in your database or state
      currentStocks.push(stock!);
      this.dbService.updateStocks(currentStocks);
    });
    console.log(currentStocks);
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
    let totalAmount = 0; // Number of shares currently held
    let startDate: Date | null = null;

    transactions.forEach((transaction) => {
      if (transaction.type === 'buy') {
        // If we have an open ownership period, close it
        if (totalAmount > 0 && startDate) {
          ownershipPeriods.push({ startDate, endDate: transaction.date, quantity: totalAmount });
        }

        // Start a new ownership period
        totalAmount += transaction.amount;
        startDate = new Date(transaction.date);
      } else if (transaction.type === 'sell') {
        // If we have an open ownership period, close it
        if (totalAmount > 0 && startDate) {
          ownershipPeriods.push({ startDate, endDate: transaction.date, quantity: totalAmount });

          // Adjust the amount based on sell transaction
          totalAmount -= transaction.amount;

          // If the total amount goes to zero or less, we reset startDate
          if (totalAmount <= 0) {
            startDate = null; // All shares sold
          } else {
            // If shares remain, create a new ownership period for remaining shares
            startDate = new Date(transaction.date);
          }
        }
      }
    });

    // If there is still a position open (not fully sold), add it as an ownership period
    if (totalAmount > 0 && startDate) {
      ownershipPeriods.push({ startDate, endDate: new Date(), quantity: totalAmount });
    }

    return ownershipPeriods;
  }

  filterDividendsByOwnership(dividends: any[], ownershipPeriods: OwnershipPeriod[]): any[] {
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
        return true;
      }

      return false;
    });
  }
}
