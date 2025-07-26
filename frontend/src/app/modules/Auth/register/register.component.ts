import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { NavComponent } from '../../../shared/nav/nav.component';
import { 
  alphabetsValidator, 
  emailValidator, 
  passwordMatchValidator, 
  passwordValidator, 
  repeateCharacterValidator, 
  spacesValidator 
} from '../../../validators/form-validators';
import { AuthService } from '../../../core/services/auth/auth.service';
import { IRegister, RegisterFormData } from '../../../core/interfaces/auth.interface';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
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
    this.registerForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        alphabetsValidator(),
        spacesValidator(),
        repeateCharacterValidator()
      ]],
      email: ['', [
        Validators.required,
        spacesValidator(),
        emailValidator()
      ]],
      password: ['', [
        Validators.required,
        passwordValidator()
      ]],
      confirmPassword: ['', [
        Validators.required,
        spacesValidator()
      ]]
    }, { validators: passwordMatchValidator });
  }

  hasError(controlName: keyof RegisterFormData, errorName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control?.hasError(errorName) && (control.dirty || control.touched));
  }

  hasFormError(errorName: string): boolean {
    const confirmPasswordControl = this.registerForm.get('confirmPassword');
    return !!(this.registerForm.hasError(errorName) && 
             (confirmPasswordControl?.dirty || confirmPasswordControl?.touched));
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.performRegistration();
  }

  private markFormGroupTouched(): void {
    this.registerForm.markAllAsTouched();
  }

  private performRegistration(): void {
    this.isLoading = true;
    const userData = this.buildUserData();

    this.authService.userRegister(userData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => this.handleRegistrationSuccess(response),
        error: () => this.handleRegistrationError()
      });
  }

  private buildUserData(): IRegister {
    const formValue: RegisterFormData = this.registerForm.value;
    return {
      name: formValue.name,
      email: formValue.email,
      password: formValue.password
    };
  }

  private handleRegistrationSuccess(response: any): void {
    if (response.success) {
      this.toastr.success('Account created successfully');
      this.router.navigate(['/login']);
    } else {
      this.toastr.error(response.message || 'Registration Failed');
    }
  }

  private handleRegistrationError(): void {
    this.toastr.error('Something went wrong. Please try again.', 'Error');
  }

  switchToLogin(): void {
    this.router.navigate(['/login']);
  }
}
