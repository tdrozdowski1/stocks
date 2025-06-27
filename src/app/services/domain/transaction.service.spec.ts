import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransactionService } from './transaction.service';
import { StockStateService } from '../state/state.service';
import { StockModel } from '../http/models/stock.model';
import { environment } from '../../../environments/environment';
import { Transaction } from './models/transaction.model';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;
  let stockStateService: jasmine.SpyObj<StockStateService>;

  const mockTransaction: Transaction = {
    symbol: 'AAPL',
    date: new Date('2025-06-27T02:00:00.000Z'),
    type: 'buy',
    amount: 10,
    price: 150,
    commission: 5,
  };

  const mockStock: StockModel = {
    symbol: 'AAPL',
    moneyInvested: 1505, // 10 * 150 + 5 commission
    ownershipPeriods: [],
    transactions: [{ ...mockTransaction, date: new Date('2025-06-27T02:00:00.000Z') }],
    totalDividendValue: 0,
    dividends: [],
    cashFlowData: [],
    liabilitiesData: [],
    totalWithholdingTaxPaid: 0,
    taxToBePaidInPoland: 0,
  };

  beforeEach(() => {
    const stockStateSpy = jasmine.createSpyObj('StockStateService', ['addStock']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionService, { provide: StockStateService, useValue: stockStateSpy }],
    });

    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
    stockStateService = TestBed.inject(StockStateService) as jasmine.SpyObj<StockStateService>;
  });

  afterEach(() => {
    httpMock.verify(); // Verify no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addTransaction', () => {
    it('should send POST request and add stock to state on success', (done) => {
      service.addTransaction(mockTransaction).subscribe({
        next: (stock) => {
          expect(stockStateService.addStock).toHaveBeenCalled();
          done();
        },
        error: () => fail('Expected successful response'),
      });

      const req = httpMock.expectOne(`${environment.STOCKS_API}/transactions`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ body: JSON.stringify(mockTransaction) });

      // Simulate the response with date as a string, as it would come from the server
      const responseStock = {
        ...mockStock,
        transactions: [{ ...mockTransaction, date: '2025-06-27T02:00:00.000Z' }],
      };
      req.flush({ body: JSON.stringify(responseStock) });
    });

    it('should handle HTTP error', (done) => {
      const errorMessage = 'Server error';

      service.addTransaction(mockTransaction).subscribe({
        next: () => fail('Expected error response'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(stockStateService.addStock).not.toHaveBeenCalled();
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.STOCKS_API}/transactions`);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });

    it('should throw error on invalid JSON response', (done) => {
      service.addTransaction(mockTransaction).subscribe({
        next: () => fail('Expected error response'),
        error: (error) => {
          expect(error.message).toBe('Invalid stock response format');
          expect(stockStateService.addStock).not.toHaveBeenCalled();
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.STOCKS_API}/transactions`);
      req.flush({ body: 'invalid json' });
    });
  });
});
