import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  // Method to send user data to backend
  signupUser(userData: { username: string, password: string, email: string, role: string, status: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/signup`, userData);
  }
}
