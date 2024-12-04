import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyManagementService {
  private baseUrl = environment.baseUrl;
  private apiKey = 'fca_live_rMwakp88F0k0BVUFVWtwtgUPdd2OEsIASXs0KFna';
  private currencyApiUrl = `https://api.freecurrencyapi.com/v1`;

  constructor(private http: HttpClient) { }

  getCurrencies() {
    return this.http.get(`${this.baseUrl}/currencies`);
  }

  getCurrencies1() {
    return this.http.get(`${this.currencyApiUrl}/currencies?apikey=${this.apiKey}`);
  }

  getExchangeData(payload: any) {
    const apiUrl = 'http://stage.paydirectgo.com:5000/api/fxrate/spot-rate';
    return this.http.post(apiUrl, payload);
  }
  
}
