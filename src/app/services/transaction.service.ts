import { Injectable } from '@angular/core';
import {Transaction} from "../models/transaction.model";
import {DbService} from "./db.service";
import {FinancialDataService} from "./financial-data.service";
import {OwnershipPeriod} from "../models/ownershipPeriod.model";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private dbService: DbService, private financialDataService: FinancialDataService) {}

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
        ownershipPeriods: [],
        totalDividendValue: 0
      };
      currentStocks = currentStocks.filter(stock => stock.symbol !== stock.symbol);

    } else {
      stock = {
        symbol: transaction.symbol,
        transactions: [transaction],
        moneyInvested: this.calculateMoneyInvested([transaction]),
        currentPrice: 0,
        ownershipPeriods: [],
        totalDividendValue: 0
      };
    }

    this.financialDataService.getStockPrice(stock!.symbol)
      .subscribe((response) => stock!.currentPrice = response);

    // Get dividends data for the stock
    this.financialDataService.getDividends(stock!.symbol).subscribe((data) => {
      const ownershipPeriods = this.calculateOwnershipPeriods(stock!.transactions); // Get ownership periods with quantities
      const relevantDividends = this.filterDividendsByOwnership(data.historical, ownershipPeriods); // Filter dividends

    // Calculate total dividend value based on quantity held during each period
    const totalDividendValue = relevantDividends.reduce((total, dividend) => {
      return total + (dividend.dividend * dividend.quantity); // Multiply dividend per share by quantity held
    }, 0);

    // Update the stock with relevant dividends and total dividend value
      stock!.dividends = relevantDividends;
      stock!.totalDividendValue = totalDividendValue;

    // Save or update the stock object in your database or state
      currentStocks.push(stock!);
      this.dbService.updateStocks(currentStocks);  });
    console.log(currentStocks);
  }

  private calculateMoneyInvested(transactions: Transaction[]): number {
    let totalBuy = 0;
    let totalSell = 0;
    let commission = 0;

    transactions.forEach((transaction) => {
      commission += transaction.commission
      if (transaction.type === 'buy') {
        totalBuy += transaction.amount * transaction.price;
      } else if (transaction.type === 'sell') {
        totalSell += (transaction.amount * transaction.price);
      }
    });

    return totalBuy - totalSell + commission;
  }

  calculateOwnershipPeriods(transactions: Transaction[]): OwnershipPeriod[] {
    const ownershipPeriods: OwnershipPeriod[] = [];
    let totalAmount = 0; // Number of shares currently held
    let startDate: Date | null = null;

    transactions.forEach(transaction => {
      if (transaction.type === 'buy') {
        totalAmount += transaction.amount;

        // Start a new ownership period if this is the first buy or the previous period ended
        if (!startDate) {
          startDate = new Date(transaction.date);
        }
      } else if (transaction.type === 'sell') {
        totalAmount -= transaction.amount;

        // Close the ownership period when the position is fully sold
        if (totalAmount <= 0 && startDate) {
          ownershipPeriods.push({ startDate, endDate: transaction.date, quantity: totalAmount + transaction.amount });
          startDate = null; // Reset start date for the next ownership period
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
    return dividends.filter(dividend => {
      const dividendDate = new Date(dividend.paymentDate);

      // Check if the dividend date falls within any of the ownership periods and attach the quantity information
      const relevantPeriod = ownershipPeriods.find(period => {
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate);

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
