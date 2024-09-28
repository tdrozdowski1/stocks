import { Injectable } from '@angular/core';
import {Transaction} from "../models/transaction.model";
import {DbService} from "./db.service";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private dbService: DbService) {}

  addTransaction(transaction: Transaction) {
    let currentStocks = this.dbService.getStocksValue();
    let stock = currentStocks.find((s) => s.symbol === transaction.symbol);

    if (stock) {
      const updatedTransactions = [...stock.transactions, transaction];
      stock = {
        symbol: stock.symbol,
        transactions: updatedTransactions,
        moneyInvested: this.calculateMoneyInvested(updatedTransactions),
      };
      currentStocks = currentStocks.filter(stock => stock.symbol !== stock.symbol);

    } else {
      stock = {
        symbol: transaction.symbol,
        transactions: [transaction],
        moneyInvested: this.calculateMoneyInvested([transaction]),
      };
    }
    currentStocks.push(stock);

    this.dbService.updateStocks(currentStocks);
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
}
