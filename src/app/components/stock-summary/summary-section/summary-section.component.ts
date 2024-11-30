import { Component, Input, OnInit } from '@angular/core';
import { Stock } from '../../../services/http/models/stock.model';

@Component({
  selector: 'app-summary-section',
  templateUrl: './summary-section.component.html',
  styleUrls: ['./summary-section.component.css'],
})
export class SummarySectionComponent implements OnInit {
  @Input() stock: Stock | undefined;

  constructor() {}

  ngOnInit(): void {}
}
