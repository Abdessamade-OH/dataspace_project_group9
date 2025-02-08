import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL = 'http://localhost:3000';
  private tokenKey = 'auth_token'; // LocalStorage key

  private authState = new BehaviorSubject<boolean>(this.isAuthenticated());
  authState$ = this.authState.asObservable();

  constructor(private http: HttpClient) {}

  registerUser(userData: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/register`, userData);
  }

  loginUser(userData: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/login`, userData).pipe(
      tap((res: any) => {
        if (res.token) {
          this.setToken(res.token); // Store token securely
          this.authState.next(true); // Notify auth state change
        }
      })
    );
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem(this.tokenKey) : null;
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }

  getHeaders(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  checkToken(): Observable<any> {
    return this.http.get(`${this.baseURL}/auth/check-token`, { headers: this.getHeaders() });
  }

  userInfo(): Observable<any> {
    return this.http.get(`${this.baseURL}/auth/user-info`, { headers: this.getHeaders() });
  }

  logout(): void {
    this.removeToken();
    this.authState.next(false); // Notify auth state change
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); // Check if token exists
  }
}
