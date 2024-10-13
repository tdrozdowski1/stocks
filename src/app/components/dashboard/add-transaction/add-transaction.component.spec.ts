import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransactionComponent } from './add-transaction.component';
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {Transaction} from "../../../services/domain/models/transaction.model";
import {FinancialDataService} from "../../../services/http/financial-data.service";
import {TransactionService} from "../../../services/domain/transaction.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('AddTransactionComponent', () => {
  let component: AddTransactionComponent;
  let fixture: ComponentFixture<AddTransactionComponent>;
  let transactionService: jasmine.SpyObj<TransactionService>;
  let financialDataService: jasmine.SpyObj<FinancialDataService>;

  beforeEach(async () => {
    const transactionServiceSpy = jasmine.createSpyObj('TransactionService', ['addTransaction']);
    const financialDataServiceSpy = jasmine.createSpyObj('FinancialDataService', ['someMethod']);

    await TestBed.configureTestingModule({
      declarations: [AddTransactionComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: FinancialDataService, useValue: financialDataServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTransactionComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;
    financialDataService = TestBed.inject(FinancialDataService) as jasmine.SpyObj<FinancialDataService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form with default values', () => {
    expect(component.transactionForm).toBeTruthy();
    const form = component.transactionForm;
    expect(form.get('symbol')?.value).toBe('');
    expect(form.get('date')?.value).toBe('');
    expect(form.get('type')?.value).toBe('buy');
    expect(form.get('amount')?.value).toBe(0);
    expect(form.get('price')?.value).toBe(0);
    expect(form.get('commission')?.value).toBe(0);
  });

  it('should validate the form as invalid if required fields are missing', () => {
    component.transactionForm.patchValue({
      symbol: '',
      date: '',
      amount: null,
      price: null,
      commission: null
    });

    expect(component.transactionForm.valid).toBeFalse();
  });

  it('should validate the form as valid when all fields are correctly filled', () => {
    component.transactionForm.patchValue({
      symbol: 'AAPL',
      date: '2024-10-10',
      type: 'buy',
      amount: 10,
      price: 150.00,
      commission: 5.00
    });

    expect(component.transactionForm.valid).toBeTrue();
  });

  it('should call transactionService.addTransaction when form is submitted and valid', () => {
    const transaction: Transaction = {
      symbol: 'AAPL',
      date: new Date('2024-10-10'),
      type: 'buy',
      amount: 10,
      price: 150.00,
      commission: 5.00
    };

    component.transactionForm.patchValue(transaction);
    component.onSubmit();

    expect(transactionService.addTransaction).toHaveBeenCalledWith(transaction);
  });

  it('should reset the form after submission', () => {
    const resetSpy = spyOn(component.transactionForm, 'reset');
    component.transactionForm.patchValue({
      symbol: 'AAPL',
      date: '2024-10-10',
      type: 'buy',
      amount: 10,
      price: 150.00,
      commission: 5.00
    });

    component.onSubmit();
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should not call transactionService.addTransaction if the form is invalid', () => {
    component.transactionForm.patchValue({
      symbol: '',
      date: '',
      amount: null,
      price: null,
      commission: null
    });

    component.onSubmit();
    expect(transactionService.addTransaction).not.toHaveBeenCalled();
  });

});
