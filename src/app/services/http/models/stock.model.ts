import { Transaction } from '../../domain/models/transaction.model';
import { OwnershipPeriod } from './ownershipPeriod.model';
import { DividendDetail } from './dividend.details.model';
import { CashFlowData } from './cashFlowData.model';
import { LiabilitiesData } from './liabilitiesData.model';

export interface StockModel {
  symbol: string;
  user?: string;
  moneyInvested: number;
  ownershipPeriods: OwnershipPeriod[];
  transactions: Transaction[];
  dividends?: DividendDetail[];
  totalDividendValue: number;
  cashFlowData?: CashFlowData[];
  liabilitiesData?: LiabilitiesData[];
  totalWithholdingTaxPaid?: number;
  taxToBePaidInPoland?: number;
  currentPrice?: number;
}
