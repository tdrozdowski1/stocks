import { Component, OnInit, HostListener } from '@angular/core';
import { CompanyInfoService } from '../services/http/company-info.service';

@Component({
  selector: 'app-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.css'],
})
export class StockTableComponent implements OnInit {
  stocks: any[] = [];
  page = 1;
  pageSize = 50;
  loading = false;

  constructor(private companyInfoService: CompanyInfoService) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    if (this.loading) return;

    this.loading = true;
    this.companyInfoService.getCompanyInfoList(this.pageSize, this.page).subscribe(
      (data) => {
        this.stocks = [...this.stocks, ...data];
        this.page++;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching stock data', error);
        this.loading = false;
      },
    );
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      this.loadStocks();
    }
  }
}
