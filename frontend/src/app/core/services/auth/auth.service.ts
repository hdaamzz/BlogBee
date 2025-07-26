import { Injectable } from '@angular/core';
import { env } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, BehaviorSubject, tap } from 'rxjs';
import { RegisterResponse, ErrorResponse, ILogin, IRegister, User, LoginResponse } from '../../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${env.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.getStoredAuthStatus());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.getStoredAuthStatus() && !this.getStoredUser()) {
      this.checkAuthStatus();
    }
  }

  private getStoredUser(): User | null {
    if (typeof window !== 'undefined' && localStorage) {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  private getStoredAuthStatus(): boolean {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('isAuthenticated') === 'true';
    }
    return false;
  }

  private storeUser(user: User): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
    }
  }

  private clearStoredData(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    }
  }

  userRegister(userData: IRegister): Observable<RegisterResponse | ErrorResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData).pipe(
      catchError((error) => {
        const fallback: ErrorResponse = {
          success: false,
          message: error.error?.message || 'Registration failed. Please try again.'
        };
        return of(fallback);
      })
    );
  }

  userLogin(userData: ILogin): Observable<LoginResponse | ErrorResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, userData, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setCurrentUser(response.data.user);
        }
      }),
      catchError((error) => {
        const fallback: ErrorResponse = {
          success: false,
          message: error.error?.message || 'Login failed. Please try again.'
        };
        return of(fallback);
      })
    );
  }

  getProfile(): Observable<LoginResponse | ErrorResponse> {
    return this.http.get<LoginResponse>(`${this.apiUrl}/profile`, {
      withCredentials: true
    }).pipe(
      tap((response) => {
        if (response.success && response.data.user) {
          this.setCurrentUser(response.data.user);
        }
      }),
      catchError((error) => {
        const fallback: ErrorResponse = {
          success: false,
          message: error.error?.message || 'Profile fetching failed. Please try again.'
        };
        return of(fallback);
      })
    );
  }

  logout(): Observable<LoginResponse | ErrorResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.clearCurrentUser();
      }),
      catchError((error) => {
        const fallback: ErrorResponse = {
          success: false,
          message: error.error?.message || 'Logout Failed. '
        };
        return of(fallback);
      })
    );
  }

  checkAuthStatus(): void {
    this.getProfile().subscribe({
      next: (response) => {
        if (response.success) {
          this.setCurrentUser(response.data.user);
        } else {
          this.clearCurrentUser();
        }
      },
      error: () => {
        this.clearCurrentUser();
      }
    });
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    this.storeUser(user);
  }

  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.clearStoredData();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
