import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-nav',
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  currentUser: any = null;
  isMobileMenuOpen = false;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly _router: Router,
    private readonly _authService: AuthService
  ) {}

  ngOnInit() {
    this._authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        this.isAuthenticated = isAuth;
      });

    this._authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  switchToLogin() {
    this._router.navigate(['login']);
    this.closeMobileMenu();
  }

  switchToRegister() {
    this._router.navigate(['register']);
    this.closeMobileMenu();
  }

  switchToHome() {
    this._router.navigate(['']);
    this.closeMobileMenu();
  }

  switchToExplore() {
    this._router.navigate(['explore']);
    this.closeMobileMenu();
  }

  switchToMyBlogs() {
    this._router.navigate(['articles']);
    this.closeMobileMenu();
  }

  onLogout() {
    this._authService.logout().subscribe({
      next: (response) => {        
        if (response.success) {
          this._router.navigate(['/login']);
        }
      }
    });
    this.closeMobileMenu();
  }

  getUserDisplayName(): string {
    if (this.currentUser) {
      return this.currentUser.name || this.currentUser.username || this.currentUser.email || 'User';
    }
    return 'User';
  }

  getUserInitials(): string {
    const displayName = this.getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  }
}
