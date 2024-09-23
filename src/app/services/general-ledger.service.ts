import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralLedgerService {
  private baseUrl = 'http://3.110.23.50:3000/api/ledger/currencyLedger';

  private dummyData = {
    "data": [
      {
        "transaction_id": "419911f2-1be0-45b2-8c2f-f52ed4140f56",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444d4",
        "transaction_time": "2024-08-17T15:24:38.000Z",
        "transaction_value": 1000.5,
        "transaction_curr_code": "USD",
        "transaction_type": "SALE",
        "transaction_mode": "ONLINE",
        "external_id": "45363",
        "location": "New York, USA"
      },
      {
        "transaction_id": "519911f2-1be0-45b2-8c2f-f52ed4140f57",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444d5",
        "transaction_time": "2024-08-18T12:30:22.000Z",
        "transaction_value": 500.25,
        "transaction_curr_code": "USD",
        "transaction_type": "REFUND",
        "transaction_mode": "OFFLINE",
        "external_id": "45364",
        "location": "Los Angeles, USA"
      },
      {
        "transaction_id": "619911f2-1be0-45b2-8c2f-f52ed4140f58",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444d6",
        "transaction_time": "2024-08-19T09:15:10.000Z",
        "transaction_value": 250.75,
        "transaction_curr_code": "USD",
        "transaction_type": "CASHBACK",
        "transaction_mode": "ONLINE",
        "external_id": "45365",
        "location": "Chicago, USA"
      },
      {
        "transaction_id": "719911f2-1be0-45b2-8c2f-f52ed4140f59",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444d7",
        "transaction_time": "2024-08-20T18:40:55.000Z",
        "transaction_value": 1500.0,
        "transaction_curr_code": "INR",
        "transaction_type": "DUES",
        "transaction_mode": "OFFLINE",
        "external_id": "45366",
        "location": "San Francisco, USA"
      },
      {
        "transaction_id": "819911f2-1be0-45b2-8c2f-f52ed4140f60",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444d8",
        "transaction_time": "2024-08-21T14:30:45.000Z",
        "transaction_value": 800.0,
        "transaction_curr_code": "INR",
        "transaction_type": "CHARGES",
        "transaction_mode": "ONLINE",
        "external_id": "45367",
        "location": "Miami, USA"
      },
      {
        "transaction_id": "919911f2-1be0-45b2-8c2f-f52ed4140f61",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444d9",
        "transaction_time": "2024-08-22T11:20:30.000Z",
        "transaction_value": 1200.0,
        "transaction_curr_code": "USD",
        "transaction_type": "SALE",
        "transaction_mode": "OFFLINE",
        "external_id": "45368",
        "location": "Houston, USA"
      },
      {
        "transaction_id": "a19911f2-1be0-45b2-8c2f-f52ed4140f62",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444da",
        "transaction_time": "2024-08-23T16:45:12.000Z",
        "transaction_value": 600.5,
        "transaction_curr_code": "USD",
        "transaction_type": "REFUND",
        "transaction_mode": "ONLINE",
        "external_id": "45369",
        "location": "Seattle, USA"
      },
      {
        "transaction_id": "b19911f2-1be0-45b2-8c2f-f52ed4140f63",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444db",
        "transaction_time": "2024-08-24T10:30:00.000Z",
        "transaction_value": 300.0,
        "transaction_curr_code": "USD",
        "transaction_type": "SALE",
        "transaction_mode": "OFFLINE",
        "external_id": "45370",
        "location": "Boston, USA"
      },
      {
        "transaction_id": "c19911f2-1be0-45b2-8c2f-f52ed4140f64",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444dc",
        "transaction_time": "2024-08-25T13:50:22.000Z",
        "transaction_value": 900.0,
        "transaction_curr_code": "INR",
        "transaction_type": "SALE",
        "transaction_mode": "ONLINE",
        "external_id": "45371",
        "location": "Denver, USA"
      },
      {
        "transaction_id": "d19911f2-1be0-45b2-8c2f-f52ed4140f65",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444dd",
        "transaction_time": "2024-08-26T19:10:35.000Z",
        "transaction_value": 1100.75,
        "transaction_curr_code": "INR",
        "transaction_type": "REFUND",
        "transaction_mode": "OFFLINE",
        "external_id": "45372",
        "location": "Atlanta, USA"
      },
      {
        "transaction_id": "e19911f2-1be0-45b2-8c2f-f52ed4140f66",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444de",
        "transaction_time": "2024-08-27T12:25:00.000Z",
        "transaction_value": 400.0,
        "transaction_curr_code": "INR",
        "transaction_type": "SALE",
        "transaction_mode": "ONLINE",
        "external_id": "45373",
        "location": "Washington, D.C., USA"
      },
      {
        "transaction_id": "f19911f2-1be0-45b2-8c2f-f52ed4140f67",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444df",
        "transaction_time": "2024-08-28T08:40:00.000Z",
        "transaction_value": 700.25,
        "transaction_curr_code": "INR",
        "transaction_type": "SALE",
        "transaction_mode": "OFFLINE",
        "external_id": "45374",
        "location": "Philadelphia, USA"
      },
      {
        "transaction_id": "g19911f2-1be0-45b2-8c2f-f52ed4140f68",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444e0",
        "transaction_time": "2024-08-29T14:10:00.000Z",
        "transaction_value": 950.0,
        "transaction_curr_code": "INR",
        "transaction_type": "REFUND",
        "transaction_mode": "ONLINE",
        "external_id": "45375",
        "location": "Phoenix, USA"
      },
      {
        "transaction_id": "h19911f2-1be0-45b2-8c2f-f52ed4140f69",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444e1",
        "transaction_time": "2024-08-30T11:45:00.000Z",
        "transaction_value": 350.0,
        "transaction_curr_code": "INR",
        "transaction_type": "SALE",
        "transaction_mode": "OFFLINE",
        "external_id": "45376",
        "location": "Dallas, USA"
      },
      {
        "transaction_id": "i19911f2-1be0-45b2-8c2f-f52ed4140f70",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444e2",
        "transaction_time": "2024-08-31T07:30:00.000Z",
        "transaction_value": 1250.0,
        "transaction_curr_code": "INR",
        "transaction_type": "REFUND",
        "transaction_mode": "ONLINE",
        "external_id": "45377",
        "location": "San Diego, USA"
      },
      {
        "transaction_id": "j19911f2-1be0-45b2-8c2f-f52ed4140f71",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444e3",
        "transaction_time": "2024-09-01T20:00:00.000Z",
        "transaction_value": 675.0,
        "transaction_curr_code": "INR",
        "transaction_type": "SALE",
        "transaction_mode": "OFFLINE",
        "external_id": "45378",
        "location": "Austin, USA"
      },
      {
        "transaction_id": "k19911f2-1be0-45b2-8c2f-f52ed4140f72",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444e4",
        "transaction_time": "2024-09-02T15:10:00.000Z",
        "transaction_value": 540.0,
        "transaction_curr_code": "INR",
        "transaction_type": "REFUND",
        "transaction_mode": "ONLINE",
        "external_id": "45379",
        "location": "Orlando, USA"
      },
      {
        "transaction_id": "l19911f2-1be0-45b2-8c2f-f52ed4140f73",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444e5",
        "transaction_time": "2024-09-03T10:20:00.000Z",
        "transaction_value": 410.0,
        "transaction_curr_code": "INR",
        "transaction_type": "SALE",
        "transaction_mode": "OFFLINE",
        "external_id": "45380",
        "location": "San Jose, USA"
      },
      {
        "transaction_id": "m19911f2-1be0-45b2-8c2f-f52ed4140f74",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444e6",
        "transaction_time": "2024-09-04T13:15:00.000Z",
        "transaction_value": 820.0,
        "transaction_curr_code": "INR",
        "transaction_type": "REFUND",
        "transaction_mode": "ONLINE",
        "external_id": "45381",
        "location": "Las Vegas, USA"
      },
      {
        "transaction_id": "n19911f2-1be0-45b2-8c2f-f52ed4140f75",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444e7",
        "transaction_time": "2024-09-05T18:50:00.000Z",
        "transaction_value": 930.0,
        "transaction_curr_code": "INR",
        "transaction_type": "SALE",
        "transaction_mode": "OFFLINE",
        "external_id": "45382",
        "location": "Charlotte, USA"
      },
      {
        "transaction_id": "o19911f2-1be0-45b2-8c2f-f52ed4140f76",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444e8",
        "transaction_time": "2024-09-06T07:45:00.000Z",
        "transaction_value": 715.0,
        "transaction_curr_code": "INR",
        "transaction_type": "SALE",
        "transaction_mode": "ONLINE",
        "external_id": "45383",
        "location": "Portland, USA"
      },
      {
        "transaction_id": "p19911f2-1be0-45b2-8c2f-f52ed4140f77",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444e9",
        "transaction_time": "2024-09-07T08:55:00.000Z",
        "transaction_value": 860.0,
        "transaction_curr_code": "INR",
        "transaction_type": "SALE",
        "transaction_mode": "OFFLINE",
        "external_id": "45384",
        "location": "San Antonio, USA"
      },
      {
        "transaction_id": "q19911f2-1be0-45b2-8c2f-f52ed4140f78",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444ea",
        "transaction_time": "2024-09-08T09:10:00.000Z",
        "transaction_value": 980.0,
        "transaction_curr_code": "INR",
        "transaction_type": "REFUND",
        "transaction_mode": "ONLINE",
        "external_id": "45385",
        "location": "Columbus, USA"
      },
      {
        "transaction_id": "r19911f2-1be0-45b2-8c2f-f52ed4140f79",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444eb",
        "transaction_time": "2024-09-09T10:20:00.000Z",
        "transaction_value": 1150.0,
        "transaction_curr_code": "INR",
        "transaction_type": "SALE",
        "transaction_mode": "OFFLINE",
        "external_id": "45386",
        "location": "Detroit, USA"
      },
      {
        "transaction_id": "s19911f2-1be0-45b2-8c2f-f52ed4140f80",
        "merchant_id": "fb786774-411e-4450-876b-7c51f0382c5f",
        "party_id": "bc75413c-aae0-44f5-9af0-5f5cfee444ec",
        "transaction_time": "2024-09-10T11:25:00.000Z",
        "transaction_value": 940.0,
        "transaction_curr_code": "INR",
        "transaction_type": "REFUND",
        "transaction_mode": "ONLINE",
        "external_id": "45387",
        "location": "Memphis, USA"
      }
    ],
    "totalRecords": 25,
    "currentPage": 1,
    "totalPages": 3
  };  

  constructor(private http: HttpClient) {}

  getCurrencyLedger(
    page: number,
    pageSize: number,
    filterOn: string,
    filterVal: string,
    sortOn: string,
    sortBy: string
  ): Observable<any> {
    const apiUrl = `${this.baseUrl}?page=${page}&pageSize=${pageSize}&filterOn=${filterOn}&filterVal=${filterVal}&sortOn=${sortOn}&sortBy=${sortBy}`;
    return this.http.get<any>(apiUrl).pipe(
      catchError(error => {
        console.error('API error, using dummy data', error);
        return of(this.dummyData);
      })
    );
  }
}
