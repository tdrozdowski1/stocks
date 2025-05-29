import { Component, OnInit } from '@angular/core';
import { StockModel } from 'src/app/services/http/models/stock.model';
import { DbService } from 'src/app/services/http/db.service';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-tax-overview',
  templateUrl: './tax-overview.component.html',
  styleUrls: ['./tax-overview.component.css'],
})
export class TaxOverviewComponent implements OnInit {
  stocks: StockModel[] = [];
  expandedRowIndex: number | null = null;

  constructor(private dbService: DbService) {}

  ngOnInit() {
    this.dbService.stocks$.pipe(concatMap((stocks) => (this.stocks = stocks))).subscribe(
      () => console.log(this.stocks),
      (error) => console.error('Error:', error),
    );
  }

  toggleRow(index: number) {
    this.expandedRowIndex = this.expandedRowIndex === index ? null : index;
  }
}
