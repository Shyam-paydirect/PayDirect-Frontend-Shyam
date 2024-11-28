import { Component, OnInit } from '@angular/core';
import { Popover } from 'bootstrap';
import { CurrencyManagementService } from 'src/app/services/currency-management.service';

@Component({
  selector: 'app-currency-exchanger',
  templateUrl: './currency-exchanger.component.html',
  styleUrls: ['./currency-exchanger.component.css']
})
export class CurrencyExchangerComponent implements OnInit {
  base: string = 'USD';
  target: string = 'EUR';
  baseValue: number = 1;
  targetValue: number = 0;
  exchangeRate: number = 0;
  exchangeRateText: string = '';
  currencies: any[] = [];
  filteredCurrencies: any[] = [];
  drawerOpen: boolean = false;
  openedDrawer: string = '';
  searchKeyword: string = '';
  timer: number = 0;
  intervalId: any;

  constructor(private currencyService: CurrencyManagementService) {}

  ngOnInit() {
    this.fetchCurrencies();
    this.loadExchangeRate();
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
      return new Popover(popoverTriggerEl);
    });
  }

  fetchCurrencies() {
    this.currencyService.getCurrencies().subscribe((response: any) => {
      this.currencies = Object.values(response.data);
      this.filteredCurrencies = this.currencies;
    });
  }

  loadExchangeRate() {
    this.currencyService.getExchangeRate(this.base).subscribe((response: any) => {
      this.exchangeRate = response.data[this.target];
      this.updateConversion();
    });
  }

  updateConversion() {
    this.targetValue = parseFloat((this.baseValue * this.exchangeRate).toFixed(2));
    this.exchangeRateText = `1 ${this.base} = ${this.exchangeRate.toFixed(4)} ${this.target}`;
  }

  convertCurrency() {
    this.updateConversion();
  }

  openDrawer(type: string) {
    this.openedDrawer = type;
    this.drawerOpen = true;
  }

  closeDrawer() {
    this.drawerOpen = false;
    this.searchKeyword = '';
    this.filteredCurrencies = this.currencies;
  }

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
    this.loadExchangeRate();
    this.closeDrawer();
  }

  swapCurrencies() {
    const temp = this.base;
    this.base = this.target;
    this.target = temp;
    this.baseValue = this.targetValue;
    this.loadExchangeRate();
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
    // Prepare API payload
    const payload = {
      ccyPair: `${this.base}${this.target}`,
      dealtSide: 'BUY',
      txnAmount: this.baseValue.toString(),
      txnCcy: this.target,
      tenor: 'TODAY',
      executable: 'Y',
      dealType: 'SPOT/OUTRIGHT',
      clientTxnsId: 'CLIENT-00000001',
    };

    // Fetch the exchange rate
    this.currencyService.getExchangeData(payload).subscribe(
      (response: any) => {
        if (response?.data?.rate) {
          this.exchangeRate = parseFloat(response.data.rate);
          this.updateConversion();
          this.startTimer(); // Restart the timer
        }
      },
      (error) => {
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