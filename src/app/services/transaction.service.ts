import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Transaction} from "../models/transaction.model";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject: BehaviorSubject<Transaction[]> = new BehaviorSubject<Transaction[]>([]);
  transactions$: Observable<Transaction[]> = this.transactionsSubject.asObservable();

  addTransaction(transaction: Transaction) {
    const currentTransactions = this.transactionsSubject.value;
    this.transactionsSubject.next([...currentTransactions, transaction]);
  }
}
