import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyManagementService {
  private apiKey = 'fca_live_rMwakp88F0k0BVUFVWtwtgUPdd2OEsIASXs0KFna';
  private currencyApiUrl = `https://api.freecurrencyapi.com/v1`;

  constructor(private http: HttpClient) { }

  getCurrencies() {
    return this.http.get(`${this.currencyApiUrl}/currencies?apikey=${this.apiKey}`);
  }

  getExchangeRate(base: string) {
    return this.http.get(`${this.currencyApiUrl}/latest?apikey=${this.apiKey}&base_currency=${base}`);
  }

  getExchangeData(payload: any) {
    const apiUrl = 'http://43.205.26.213:5000/api/fxrate/spot-rate';
    return this.http.post(apiUrl, payload);
  }
  
}
