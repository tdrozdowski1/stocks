import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../services/domain/models/transaction.model';
import { TransactionService } from '../../services/domain/transaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {}

  onTransactionChange(transaction: Transaction) {
    this.transactionService.addTransaction(transaction);
  }
}
