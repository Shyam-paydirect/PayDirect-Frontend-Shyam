import { Component, OnInit } from '@angular/core';
import { Popover } from 'bootstrap';
import { CurrencyManagementService } from 'src/app/services/currency-management.service';

@Component({
  selector: 'app-currency-exchanger',
  templateUrl: './currency-exchanger.component.html',
  styleUrls: ['./currency-exchanger.component.css']
})
export class CurrencyExchangerComponent implements OnInit {
  base: string = 'INR';
  target: string = 'USD';
  baseValue: number = 0;
  targetValue: number = 0;
  exchangeRate: number = 0;
  exchangeRateText: string = '';
  totalPayment: number = 0;
  currencies: any[] = [];
  filteredCurrencies: any[] = [];
  drawerOpen: boolean = false;
  openedDrawer: string = '';
  searchKeyword: string = '';
  timer: number = 0;
  intervalId: any;
  isLoading: boolean = true;
  errorMsg: string = "";

  constructor(private currencyService: CurrencyManagementService) {}

  ngOnInit() {
    // this.fetchCurrencies();
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
      return new Popover(popoverTriggerEl);
    });
  }

  fetchCurrencies() {
    this.currencyService.getCurrencies1().subscribe((response: any) => {
      this.currencies = Object.values(response.data);
      this.filteredCurrencies = this.currencies;
    });
  }

  openDrawer(type: string) {
    // this.openedDrawer = type;
    // this.drawerOpen = true;
  }

  closeDrawer() {
    this.drawerOpen = false;
    this.searchKeyword = '';
    this.filteredCurrencies = this.currencies;
  }

  // To search from the available currency list 
  filterCurrencies() {
    this.filteredCurrencies = this.currencies.filter(currency =>
      currency.code.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
      currency.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );
  }

  selectCurrency(code: string) {
    if (this.openedDrawer === 'base') {
      this.base = code;
    } else {
      this.target = code;
    }
    this.closeDrawer();
  }

  swapCurrencies() {
    const temp = this.base;
    this.base = this.target;
    this.target = temp;
    this.baseValue = this.targetValue;
  }

  getFlagUrl(code: string): string {
    return `https://wise.com/public-resources/assets/flags/rectangle/${code.toLowerCase()}.png`;
  }

  onBaseValueChange() {
    this.targetValue = 0;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.timer = 0;
  }

  refreshExchangeRate() {
    this.errorMsg = "";
    // Prepare API payload
    const payload = {
      ccyPair: `${this.target}${this.base}`,
      dealtSide: 'BUY',
      txnAmount: this.baseValue.toString(),
      txnCcy: this.base,
      tenor: 'TODAY',
      executable: 'Y',
      dealType: 'SPOT/OUTRIGHT',
      clientTxnsId: 'CLIENT-00000001',
    };

    // Fetch the exchange rate
    this.currencyService.getExchangeData(payload).subscribe(
      (response: any) => {
        if (response?.data?.rate) {
          this.targetValue = parseFloat(response.data.contraAmount);
          this.exchangeRateText = `1 ${this.base} = ${this.exchangeRate.toFixed(4)} ${this.target}`;
          this.exchangeRate = parseFloat(response.data.rate);
          this.totalPayment = this.baseValue + 2000;
          this.startTimer(); // Restart the timer
        }
      },
      (error) => {
        this.errorMsg = error.error.error;
        console.error('Error fetching exchange rate:', error);
      }
    );
  }

  startTimer() {
    this.timer = 30;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  submitForm() {}
}