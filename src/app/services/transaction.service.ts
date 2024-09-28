import { Injectable } from '@angular/core';
import {Transaction} from "../models/transaction.model";
import {DbService} from "./db.service";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private dbService: DbService) {}

  addTransaction(transaction: Transaction) {
    const currentStocks = this.dbService.getStocksValue();
    let stock = currentStocks.find((s) => s.symbol === transaction.symbol);

    if (stock) {
      stock.transactions.push(transaction);
    } else {
      stock = {
        symbol: transaction.symbol,
        transactions: [transaction],
        moneyInvested: this.calculateMoneyInvested([transaction]),
      };
      currentStocks.push(stock);
    }

    this.dbService.updateStocks(currentStocks);
  }

  private calculateMoneyInvested(transactions: Transaction[]): number {
    let totalBuy = 0;
    let totalSell = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'buy') {
        totalBuy += transaction.amount * transaction.price + transaction.commission;
      } else if (transaction.type === 'sell') {
        totalSell += transaction.amount * transaction.price - transaction.commission;
      }
    });

    return totalBuy - totalSell;
  }
}
