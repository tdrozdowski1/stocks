import { Component, Input, OnInit } from '@angular/core';
import { Stock } from '../../../services/http/models/stock.model';

@Component({
  selector: 'app-additional-details',
  templateUrl: './additional-details.component.html',
  styleUrls: ['./additional-details.component.css'],
})
export class AdditionalDetailsComponent implements OnInit {
  @Input() stock: Stock | undefined;
  showTransactions: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  toggleTransactions(): void {
    this.showTransactions = !this.showTransactions;
  }
}
