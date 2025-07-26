import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { NavComponent } from '../../../shared/nav/nav.component';
import { emailValidator, passwordValidator, spacesValidator } from '../../../validators/form-validators';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoginFormData } from '../../../core/interfaces/auth.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        spacesValidator(),
        emailValidator()
      ]],
      password: ['', [
        Validators.required,
        passwordValidator()
      ]]
    });
  }

  hasError(controlName: keyof LoginFormData, errorName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control?.hasError(errorName) && (control.dirty || control.touched));
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.performLogin();
  }

  private markFormGroupTouched(): void {
    this.loginForm.markAllAsTouched();
  }

  private performLogin(): void {
    this.isLoading = true;
    const formData: LoginFormData = this.loginForm.value;

    this.authService.userLogin(formData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => this.handleLoginSuccess(response),
        error: () => this.handleLoginError()
      });
  }

  private handleLoginSuccess(response: any): void {
    if (response.success) {
      this.toastr.success('Welcome back!', 'Login Successful');
      this.router.navigate(['/']);
    } else {
      this.toastr.error(response.message || 'Invalid credentials', 'Login Failed');
    }
  }

  private handleLoginError(): void {
    this.toastr.error('Something went wrong. Please try again.', 'Error');
  }

  switchToRegister(): void {
    this.router.navigate(['/register']);
  }
}
