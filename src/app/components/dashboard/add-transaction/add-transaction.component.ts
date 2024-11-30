import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Transaction } from '../../../services/domain/models/transaction.model';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css'],
})
export class AddTransactionComponent {
  transactionForm: UntypedFormGroup;
  @Output() transactionChange = new EventEmitter<Transaction>();

  constructor(private fb: UntypedFormBuilder) {
    this.transactionForm = this.fb.group({
      symbol: ['', Validators.required],
      date: ['', Validators.required],
      type: ['buy', Validators.required],
      amount: [0, Validators.required],
      price: [0, Validators.required],
      commission: [0, Validators.required],
    });
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      this.transactionChange.emit(this.transactionForm.value);
      this.transactionForm.reset();
    }
  }
}
