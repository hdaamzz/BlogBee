import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { NavComponent } from '../../../shared/nav/nav.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { DashboardStats, StatCard } from '../../../core/interfaces/home.interface';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.initializeAuthSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeAuthSubscriptions(): void {
    this.subscribeToAuthStatus();
    this.subscribeToCurrentUser();
  }

  private subscribeToAuthStatus(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => console.error('Auth status error:', error)
      });
  }

  private subscribeToCurrentUser(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => console.error('Current user error:', error)
      });
  }

  onCreateArticle(): void {
    this.router.navigate(['/articles/create']);
  }

  onExplore(): void {
    this.router.navigate(['/explore']);
  }

  logout(): void {
    this.authService.logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.handleLogoutSuccess(response),
        error: (error) => this.handleLogoutError(error)
      });
  }

  private handleLogoutSuccess(response: any): void {
    if (response.success) {
      this.navigateToLogin();
    }
  }

  private handleLogoutError(error: any): void {
    console.error('Logout error:', error);
  }

  private navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  formatNumber(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  }
}
