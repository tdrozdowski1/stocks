export interface Transaction {
  symbol: string;
  date: Date;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  commission: number;
}
