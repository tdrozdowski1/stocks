import { Transaction } from '../../domain/models/transaction.model';
import { OwnershipPeriod } from './ownershipPeriod.model';
import { DividendDetail } from './dividend.details.model';
import { CashFlowData } from './cashFlowData.model';
import { LiabilitiesData } from './liabilitiesData.model';

export interface StockModel {
  symbol: string;
  email: string; // Make required if always present in API response
  moneyInvested: number | null; // Allow null if API might omit or return null
  ownershipPeriods: OwnershipPeriod[] | null; // Allow null to handle missing data
  transactions: Transaction[] | null; // Allow null to handle missing data
  dividends?: DividendDetail[] | null; // Explicitly allow null
  totalDividendValue: number | null; // Allow null if no dividends
  cashFlowData?: CashFlowData[] | null; // Explicitly allow null
  liabilitiesData?: LiabilitiesData[] | null; // Explicitly allow null
  totalWithholdingTaxPaid?: number | null; // Explicitly allow null
  taxToBePaidInPoland?: number | null; // Explicitly allow null, fix typo
  currentPrice?: number | null; // Explicitly allow null
}
