import {Component} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Transaction} from "../../../services/domain/models/transaction.model";
import {FinancialDataService} from "../../../services/http/financial-data.service";
import {TransactionService} from "../../../services/domain/transaction.service";

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent {
  transactionForm: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, private financialDataService: FinancialDataService, private transactionService: TransactionService) {
    this.transactionForm = this.fb.group({
      symbol: ['', Validators.required],
      date: ['', Validators.required],
      type: ['buy', Validators.required],
      amount: [0, Validators.required],
      price: [0, Validators.required],
      commission: [0, Validators.required]
    });
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const transaction: Transaction = this.transactionForm.value;
      this.transactionForm.reset();
      this.transactionService.addTransaction(transaction);
    }
  }
}
