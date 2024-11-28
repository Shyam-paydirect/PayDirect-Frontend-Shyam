import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Correctly import jwt-decode
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseUrl = environment.baseUrl;
  
  private readonly TOKEN_KEY = 'act';
  private token: string | null = null;
  jwtToken$ = new BehaviorSubject<string | null>(null);
  merchantDetails$ = new BehaviorSubject<any | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastrService
  ) {
    this.loadTokenFromStorage(); // Initialize token from localStorage on service load
  }

  // Load token from localStorage on app start and check validity
  private loadTokenFromStorage() {
    const storedToken = localStorage.getItem(this.TOKEN_KEY);
    if (storedToken) {
      this.token = storedToken;
      this.jwtToken$.next(this.token);

      // Check if the token is still valid before fetching details
      if (this.isAuthenticated()) {
        const decodedToken: any = this.getDecodedToken();
        if (decodedToken?.username) {
          this.fetchMerchantDetails(decodedToken.username);
        }
      } else {
        this.handleExpiredToken();
      }
    }
  }

  // Handle expired tokens by clearing them and redirecting to login
  private handleExpiredToken() {
    this.clearToken(); // Clear token and reset state
    this.toast.error('Session expired. Please log in again.', '', {
      timeOut: 2000,
    });
    this.router.navigate(['/login-signup']); // Redirect to login
  }

  // Save token to localStorage and notify subscribers
  private saveToken(token: string) {
    this.token = token;
    localStorage.setItem(this.TOKEN_KEY, token);
    this.jwtToken$.next(token);
  }

  // Clear token and merchant details on logout
  private clearToken() {
    this.token = null;
    localStorage.removeItem(this.TOKEN_KEY);
    this.jwtToken$.next(null);
    this.merchantDetails$.next(null);
  }

  signup(email: string, username: string, password: string): Observable<boolean> {
    return this.http
      .post<{ message: string }>(`${this.baseUrl}/users/signup`, {
        email,
        username,
        password,
        role: 'admin',
        status: 'active'
      })
      .pipe(
        map((res) => {
          this.toast.success(res.message || 'Signup successful! Please login using the credentials.', '', {
            timeOut: 1500
          });
          return true; // Return true for success
        }),
        catchError((err) => {
          const errorMessage =
            err.error?.message || 'Signup failed. Please try again.';
          this.toast.error(errorMessage, '', { timeOut: 2000 });
          return of(false); // Return false for failure
        })
      );
  }
  

  // Login method
  login(username: string, password: string) {
    this.http
      .post<{ token: string }>(`${this.baseUrl}/users/login`, {
        username,
        password,
      })
      .subscribe(
        (res) => {
          const token = res.token;
          if (token) {
            this.saveToken(token); // Save token
            this.fetchMerchantDetails(username); // Fetch merchant details
            this.toast
              .success('Login successful, redirecting...', '', {
                timeOut: 1500,
              })
              .onHidden.toPromise()
              .then(() => {
                this.router.navigate(['/']); // Navigate after success
              });
          }
        },
        (err) => {
          const errorMessage =
            err.error?.message || 'Login failed. Please check your credentials.';
          this.toast.error(errorMessage, '', { timeOut: 2000 });
        }
      );
  }

  // Fetch merchant details based on the username
  private fetchMerchantDetails(username: string) {
    this.http
      .get(`${this.baseUrl}/users/search?username=${username}`)
      .subscribe(
        (res: any) => {
          this.merchantDetails$.next(res.users[0]); // Store merchant details in BehaviorSubject
        },
        (err) => {
          console.error('Error fetching merchant details:', err);
        }
      );
  }

  // Logout method
  logout() {
    this.clearToken(); // Clear token and merchant details
    this.router.navigateByUrl('/login-signup').then(() => {
      this.toast.success('Logged out successfully', '', {
        timeOut: 2000,
      });
    });
  }

  // Check if the user is authenticated based on token validity
  isAuthenticated(): boolean {
    const token = this.token || localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decodedToken.exp > currentTime;
      } catch (e) {
        console.error('Error decoding token:', e);
        return false;
      }
    }
    return false;
  }

  // Get the decoded token payload
  getDecodedToken() {
    const token = this.token || localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      try {
        return jwtDecode(token); // Decode JWT directly
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }
    return null;
  }
}
