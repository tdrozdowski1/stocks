import {Transaction} from "./transaction.model";
import {OwnershipPeriod} from "./ownershipPeriod.model";
import {DividendDetail} from "./dividend.details.model";

export interface Stock {
  symbol: string;
  moneyInvested: number;
  currentPrice: number;
  ownershipPeriods: OwnershipPeriod[];
  transactions: Transaction[];
  dividends?: DividendDetail[];
  totalDividendValue: number;
}
