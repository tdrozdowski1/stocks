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
  displayValue: string = '';
  symbolControl = this.fb.control('', Validators.required);

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
    this.symbolControl.valueChanges.pipe(
      debounceTime(750),
      distinctUntilChanged(),
      switchMap((query) => {
        if (!query || query.length < 2) {
          this.suggestions = [];
          return of([]);
        }
        return this.companyInfoService.fetchNameSuggestions(query);
      }),
    ).subscribe(
      (suggestions: string[]) => {
        console.log('Suggestions:', suggestions);
        this.suggestions = suggestions || [];
      },
      (error) => {
        console.error('Error fetching suggestions:', error);
        this.suggestions = [];
      },
    );

    this.symbolControl.valueChanges.subscribe((value: string) => {
      const symbol = value.split(' - ')[0];
      this.transactionForm.patchValue({ symbol }, { emitEvent: false });
    });
  }

  selectSuggestion(suggestion: string) {
    this.displayValue = suggestion;
    const symbol = suggestion.split(' ')[0];
    this.transactionForm.patchValue({ symbol }, { emitEvent: false });
    this.symbolControl.setValue(suggestion, { emitEvent: false });
    this.suggestions = [];
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      this.transactionChange.emit(this.transactionForm.value);
      this.transactionForm.reset();
      this.displayValue = '';
      this.symbolControl.setValue('');
    }
  }
}
