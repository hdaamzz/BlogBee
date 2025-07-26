import { Injectable } from '@angular/core';
import { env } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, BehaviorSubject, tap } from 'rxjs';
import { ILogin, IRegister } from '../../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${env.apiUrl}/auth`;
  
  // Initialize subjects with persisted data
  private currentUserSubject = new BehaviorSubject<any>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.getStoredAuthStatus());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verify stored authentication status on service initialization
    if (this.getStoredAuthStatus() && !this.getStoredUser()) {
      this.checkAuthStatus();
    }
  }

  // localStorage helper methods
  private getStoredUser(): any {
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

  private storeUser(user: any): void {
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

  userRegister(userData: IRegister): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      catchError((error) => {
        return of({ success: false, message: error.error.message || 'Registration failed. Please try again.' });
      })
    );
  }

  userLogin(userData: ILogin): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, userData, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setCurrentUser(response.data.user);
        }
      }),
      catchError((error) => {
        return of({ success: false, message: error.error.message || 'Login failed. Please try again.' });
      })
    );
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`, {
      withCredentials: true
    }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setCurrentUser(response.data);
        }
      }),
      catchError((error) => {
        this.clearCurrentUser();
        return of({ success: false, message: error.error.message || 'Profile fetching failed. Please try again.' });
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.clearCurrentUser();
      }),
      catchError((error) => {
        this.clearCurrentUser();
        return of({ success: false, message: error.error.message || 'Logout failed.' });
      })
    );
  }

  checkAuthStatus(): void {
    this.getProfile().subscribe({
      next: (response) => {
        if (response.success) {
          this.setCurrentUser(response.data);
        } else {
          this.clearCurrentUser();
        }
      },
      error: () => {
        this.clearCurrentUser();
      }
    });
  }

  setCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    this.storeUser(user);
  }

  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.clearStoredData();
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
