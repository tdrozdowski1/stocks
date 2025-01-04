import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Transaction } from '../../../services/domain/models/transaction.model';
import { CompanyInfoService } from 'src/app/services/http/company-info.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css'],
})
export class AddTransactionComponent {
  transactionForm: UntypedFormGroup;
  @Output() transactionChange = new EventEmitter<Transaction>();
  suggestions: string[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private companyInfoService: CompanyInfoService,
  ) {
    this.transactionForm = this.fb.group({
      symbol: ['', Validators.required],
      date: ['', Validators.required],
      type: ['buy', Validators.required],
      amount: [0, Validators.required],
      price: [0, Validators.required],
      commission: [0, Validators.required],
    });

    this.setupSymbolAutocomplete();
  }

  setupSymbolAutocomplete() {
    this.transactionForm
      .get('symbol')
      ?.valueChanges.pipe(
        debounceTime(750), // Wait 0,75 seconds after the user stops typing
        distinctUntilChanged(), // Avoid duplicate API calls for the same input
        switchMap((query) => {
          if (!query) {
            return of([]); // If the input is empty, return an empty array
          }
          return this.companyInfoService.fetchNameSuggestions(query);
        }),
      )
      .subscribe((suggestions: any) => {
        this.suggestions = suggestions;
      });
  }

  selectSuggestion(suggestion: string) {
    const symbol = suggestion.split(' ')[0]; // Extract the symbol before the first space
    this.transactionForm.patchValue({ symbol: symbol });
    this.suggestions = []; // Clear suggestions to hide the list
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      this.transactionChange.emit(this.transactionForm.value);
      this.transactionForm.reset();
    }
  }
}
