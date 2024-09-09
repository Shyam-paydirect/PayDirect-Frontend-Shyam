import { Component, OnInit } from '@angular/core';
import { GeneralLedgerService } from '../services/general-ledger.service';

@Component({
  selector: 'app-general-ledger',
  templateUrl: './general-ledger.component.html',
  styleUrls: ['./general-ledger.component.css'],
})
export class GeneralLedgerComponent implements OnInit {
  transactions: any;
  amount: number = 21230.3;
  debit: number = 30000.051;
  credit: number = 8769.751;

  constructor(private generalLedgerService: GeneralLedgerService) {}

  ngOnInit(): void {
    // Example values, these can be provided by the merchant through a form or other input method
    const page = 1;
    const pageSize = 10;
    const filterOn = 'merchant_id';
    const filterVal = 'fb786774-411e-4450-876b-7c51f0382c5f';
    const sortOn = 'merchant_id';
    const sortBy = 'asc';

    this.generalLedgerService
      .getCurrencyLedger(page, pageSize, filterOn, filterVal, sortOn, sortBy)
      .subscribe((data) => {
        this.transactions = data.data;
      });
    console.log(this.transactions);
  }
  getStatusClass(transactionType: string): string {
    switch (transactionType.toUpperCase()) {
      case 'SALE':
        return 'status-sale';
      case 'REFUND':
        return 'status-refund';
      case 'CASHBACK':
        return 'status-cashback';
      case 'DUES':
        return 'status-dues';
      case 'CHARGES':
        return 'status-charges';
      default:
        return 'status-default';
    }
  }  
  getTransactionIcon(transactionType: string): string {
    switch (transactionType.toUpperCase()) {
      case 'SALE':
        return 'ri-shopping-cart-fill';
      case 'REFUND':
        return 'ri-refund-fill';
      case 'CASHBACK':
        return 'ri-cash-fill';
      case 'DUES':
        return 'ri-file-paper-2-fill';
      case 'CHARGES':
        return 'ri-money-dollar-circle-fill';
      default:
        return 'ri-question-line';
    }
  }  
}
