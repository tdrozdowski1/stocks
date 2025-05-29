import { Component, Input, OnInit } from '@angular/core';
import { StockModel } from '../../../services/http/models/stock.model';

@Component({
  selector: 'app-dividend-summary',
  templateUrl: './dividend-summary.component.html',
  styleUrls: ['./dividend-summary.component.css'],
})
export class DividendSummaryComponent implements OnInit {
  @Input() stock: StockModel | undefined;

  constructor() {}

  ngOnInit(): void {}
}
