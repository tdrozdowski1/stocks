import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
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
  symbolControl = this.fb.control('', [Validators.required, this.symbolSelectedValidator()]);

  constructor(
    private fb: UntypedFormBuilder,
    private companyInfoService: CompanyInfoService,
  ) {
    this.transactionForm = this.fb.group({
      symbol: ['', Validators.required],
      date: ['', Validators.required],
      type: ['buy', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      commission: [0, [Validators.required, Validators.min(0)]],
    });

    this.setupSymbolAutocomplete();
  }

  // Custom validator to ensure symbol is selected from suggestions
  symbolSelectedValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) {
        return { required: true };
      }
      // Check if the value is in the suggestions or was previously valid
      const isValid = this.suggestions.length === 0 || this.suggestions.includes(value);
      return isValid ? null : { invalidSymbol: true };
    };
  }

  setupSymbolAutocomplete() {
    this.symbolControl.valueChanges.pipe(
      debounceTime(750),
      distinctUntilChanged(),
      switchMap((query) => {
        if (!query || query.length < 2) {
          this.suggestions = [];
          this.symbolControl.setErrors({ noSuggestions: true });
          return of([]);
        }
        return this.companyInfoService.fetchNameSuggestions(query);
      }),
    ).subscribe(
      (suggestions: string[]) => {
        this.suggestions = suggestions || [];
        if (this.suggestions.length === 0) {
          this.symbolControl.setErrors({ noSuggestions: true });
        } else {
          // Only validate if the current value is not a selected suggestion
          if (!this.suggestions.includes(this.symbolControl.value)) {
            this.symbolControl.setErrors({ invalidSymbol: true });
          } else {
            this.symbolControl.setErrors(null);
          }
        }
        this.symbolControl.updateValueAndValidity({ emitEvent: false });
      },
      (error) => {
        console.error('Error fetching suggestions:', error);
        this.suggestions = [];
        this.symbolControl.setErrors({ noSuggestions: true });
      },
    );

    this.symbolControl.valueChanges.subscribe((value: string) => {
      const symbol = value.split(' - ')[0];
      this.transactionForm.patchValue({ symbol }, { emitEvent: false });
      this.displayValue = value;
    });
  }

  selectSuggestion(suggestion: string) {
    this.displayValue = suggestion;
    const symbol = suggestion.split(' - ')[0];
    this.transactionForm.patchValue({ symbol }, { emitEvent: false });
    this.symbolControl.setValue(suggestion, { emitEvent: false });
    this.suggestions = []; // Clear suggestions after selection
    this.symbolControl.setErrors(null); // Clear errors on valid selection
    this.symbolControl.updateValueAndValidity({ emitEvent: false });
  }

  onSubmit() {
    if (this.transactionForm.valid && this.symbolControl.valid) {
      this.transactionChange.emit(this.transactionForm.value);
      this.transactionForm.reset();
      this.displayValue = '';
      this.symbolControl.setValue('');
      this.suggestions = [];
      this.symbolControl.setErrors(null);
    }
  }
}
