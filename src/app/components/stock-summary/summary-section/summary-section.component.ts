import { Component, Input, OnInit } from '@angular/core';
import { StockModel } from '../../../services/http/models/stock.model';

@Component({
  selector: 'app-summary-section',
  templateUrl: './summary-section.component.html',
  styleUrls: ['./summary-section.component.css'],
})
export class SummarySectionComponent implements OnInit {
  @Input() stock: StockModel | undefined;

  constructor() {}

  ngOnInit(): void {}
}
