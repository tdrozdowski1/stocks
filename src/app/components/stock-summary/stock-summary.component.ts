import { Component, OnInit } from '@angular/core';
import {Stock} from "../../services/http/models/stock.model";
import {DbService} from "../../services/http/db.service";
import {ActivatedRoute} from "@angular/router";
import {CompanyInfo, CompanyInfoService} from "../../services/http/company-info.service";
import {FinancialDataService} from "../../services/http/financial-data.service";
import {catchError, forkJoin, map, of} from "rxjs";

@Component({
  selector: 'app-stock-summary',
  templateUrl: './stock-summary.component.html',
  styleUrls: ['./stock-summary.component.css']
})
export class StockSummaryComponent implements OnInit {
  stock: Stock | undefined; // Store the selected stock data
  companyInfo: CompanyInfo[] = [];
  usdPlnRate: number = 1; // Default rate
  totalDividendIncome: number = 0; // Total dividend income in PLN
  totalTaxToBePaid: number = 0; // Total Polish tax due (in PLN)
  totalWithholdingTaxPaid: number = 0; // Total withholding tax paid (in USD)
  taxToBePaidInPoland: number = 0; // Final tax to be paid in PLN

  constructor(
    private route: ActivatedRoute,
    private dbService: DbService,
    private financialDataService: FinancialDataService,
    private companyInfoService: CompanyInfoService
  ) {
  }

  ngOnInit(): void {
    const symbol = this.route.snapshot.paramMap.get('symbol');

    if (symbol) {
      this.dbService.getStockBySymbol(symbol).subscribe((stock) => {
        this.stock = stock;
        this.calculateDividendsSummary();
      });

      this.companyInfoService.getCompanyInfo(symbol).subscribe(
        (data) => {
          this.companyInfo = data;
          console.log('Company Info:', this.companyInfo); // Debugging
        },
        (error) => console.error('Error fetching company info:', error)
      );
    }
  }

  calculateDividendsSummary(): void {
    if (this.stock?.dividends) {
      const dividendCalculations$ = this.stock.dividends.map((dividend) => {
        const paymentDate = new Date(dividend.paymentDate);
        const dayBeforePayment = new Date(paymentDate);
        dayBeforePayment.setDate(paymentDate.getDate() - 1);

        // Fetch USD/PLN rate for the day before the payment date
        return this.financialDataService.getExchangeRate(dayBeforePayment.toISOString().split('T')[0]).pipe(
          map((exchangeData) => {
            const usdPlnRate = exchangeData.forexList.find(rate => rate.ticker === 'USD/PLN')?.bid ?? 1;

            // Calculate withholding tax (15% of the dividend in USD)
            const withholdingTaxPaid = dividend.dividend * 0.15;

            // Convert dividend to PLN using USD/PLN rate
            const totalDividendInPln = dividend.dividend * usdPlnRate;

            // Calculate Polish tax due: 19% of dividend in PLN - converted withholding tax
            const taxDueInPoland = (totalDividendInPln * 0.19) - (withholdingTaxPaid * usdPlnRate);

            return {
              ...dividend,
              totalDividendInPln,
              withholdingTaxPaid,
              taxDueInPoland: taxDueInPoland < 0 ? 0 : taxDueInPoland // Ensure non-negative value
            };
          }),
          catchError(() => of({
            ...dividend,
            withholdingTaxPaid: dividend.dividend * 0.15, // Default withholding tax calculation if error occurs
            convertedDividend: 0,
            taxDueInPoland: 0
          })) // Handle error and continue with zero values
        );
      });

      forkJoin(dividendCalculations$).subscribe((calculatedDividends) => {
        this.stock!.dividends = calculatedDividends;

        // Calculate total dividend income in PLN after updating all dividend values
        this.totalDividendIncome = this.stock!.dividends.reduce((total, dividend) => total + dividend.totalDividendInPln, 0);

        this.calculateTotalTaxToBePaid(); // Call tax calculation after setting total dividend income
      });
    }
  }

  // Method to calculate total Polish tax due in PLN
  calculateTotalTaxToBePaid(): void {
    this.totalTaxToBePaid = this.stock!.dividends!.reduce((total, dividend) => total + dividend.totalDividendInPln * 0.19, 0) ?? 0;
    this.totalWithholdingTaxPaid = this.stock!.dividends!.reduce((total, dividend) => total + (dividend.withholdingTaxPaid ?? 0), 0) ?? 0;

    this.taxToBePaidInPoland = this.totalTaxToBePaid - this.totalWithholdingTaxPaid * this.usdPlnRate;
  }
}
