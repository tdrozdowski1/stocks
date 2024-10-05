import { Component, OnInit } from '@angular/core';
import {Stock} from "../../models/stock.model";
import {DbService} from "../../services/db.service";
import {ActivatedRoute} from "@angular/router";
import {CompanyInfo, CompanyInfoService} from "../../services/company-info.service";

@Component({
  selector: 'app-stock-summary',
  templateUrl: './stock-summary.component.html',
  styleUrls: ['./stock-summary.component.css']
})
export class StockSummaryComponent implements OnInit {
  stock: Stock | undefined; // Store the selected stock data
  showTransactions: boolean = false; // Controls the visibility of the transactions list
  companyInfo: CompanyInfo[] = [];

  constructor(
    private route: ActivatedRoute,
    private dbService: DbService,
    private companyInfoService: CompanyInfoService
  ) {
  }

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
        (error) => console.error('Error fetching company info:', error)
      );
    }
  }

  toggleTransactions(): void {
    this.showTransactions = !this.showTransactions;
  }
}
