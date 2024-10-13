import {Component, Input, OnInit} from '@angular/core';
import {Stock} from "../../../services/http/models/stock.model";

@Component({
  selector: 'app-dividend-summary',
  templateUrl: './dividend-summary.component.html',
  styleUrls: ['./dividend-summary.component.css']
})
export class DividendSummaryComponent implements OnInit {
  @Input() stock: Stock | undefined;
  @Input() totalDividendIncome: number | undefined;
  @Input() totalTaxToBePaid: number | undefined;
  @Input() totalWithholdingTaxPaid: number | undefined;
  @Input() taxToBePaidInPoland: number | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
