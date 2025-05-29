import { Component, OnInit } from '@angular/core';
import { StockModel } from '../../services/http/models/stock.model';
import { DbService } from '../../services/http/db.service';
import { ActivatedRoute } from '@angular/router';
import { CompanyInfo, CompanyInfoService } from '../../services/http/company-info.service';
import { FinancialDataService } from '../../services/http/financial-data.service';

@Component({
  selector: 'app-stock-summary',
  templateUrl: './stock-summary.component.html',
  styleUrls: ['./stock-summary.component.css'],
})
export class StockSummaryComponent implements OnInit {
  stock: StockModel | undefined; // Store the selected stock data
  companyInfo: CompanyInfo[] = [];

  cashFlowData: boolean = false;
  liabilitiesData: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private dbService: DbService,
    private financialDataService: FinancialDataService,
    private companyInfoService: CompanyInfoService,
  ) {}

  ngOnInit(): void {
    const symbol = this.route.snapshot.paramMap.get('symbol');

    if (symbol) {
      this.dbService.getStockBySymbol(symbol).subscribe((stock) => {
        this.stock = stock;
      });

      this.companyInfoService.getCompanyInfo(symbol).subscribe(
        (data) => {
          this.companyInfo = data;
          console.log('Company Info:', this.companyInfo); // Debugging
        },
        (error) => console.error('Error fetching company info:', error),
      );

      // Fetch free cash flow data
      this.financialDataService.getCashFlowStatement(symbol).subscribe((cashFlowData) => {
        // Map the free cash flow to match dividend years
        const freeCashFlows = cashFlowData;

        // Attach free cash flow data to the stock object
        this.stock!.cashFlowData = freeCashFlows;
        this.cashFlowData = true;
      });

      // Fetch balance sheet data
      this.financialDataService.getBalanceSheet(symbol).subscribe((liabilitiesData) => {
        const liabilities = liabilitiesData;

        this.stock!.liabilitiesData = liabilities;
        this.liabilitiesData = true;
      });
    }
  }
}
