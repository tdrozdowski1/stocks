export interface DividendDetail {
  paymentDate: Date;
  dividend: number;
  quantity: number;
  dividendInPln: number;
  withholdingTaxPaid: number;
  taxDueInPoland: number;
  usdPlnRate?: number;
}
