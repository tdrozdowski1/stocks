import {Transaction} from "./transaction.model";

export interface Stock {
  symbol: string;
  moneyInvested: number;
  transactions: Transaction[];
}
