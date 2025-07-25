import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { alphabetsValidator, emailValidator, passwordMatchValidator, passwordValidator, repeateCharacterValidator, spacesValidator } from '../../../validators/form-validators';
import { Router } from '@angular/router';
import { NavComponent } from '../../../shared/nav/nav.component';
import { AuthService } from '../../../core/services/auth/auth.service';


@Component({
  selector: 'app-register',
  standalone:true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,NavComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(private _fb: FormBuilder,private readonly _router: Router) {
   this._initializeForms()
  }

  private _initializeForms(): void {
    this.registerForm = this._fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          alphabetsValidator(),
          spacesValidator(),
          repeateCharacterValidator(),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          alphabetsValidator(),
          spacesValidator(),
          repeateCharacterValidator(),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          spacesValidator(),
          emailValidator(),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          passwordValidator(),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          spacesValidator(),
        ],
      ],
    }, { validators: passwordMatchValidator });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  // createAccount(): void {
  //   if (!this.registerForm.valid) {
  //     this.registerForm.markAllAsTouched();
  //     return;
  //   }
  
  //   this.loading = true;
  //   const formData = this.registerForm.value;
  
  //   this._authService.userRegister(formData)
  //     .pipe(takeUntil(this._destroy$))
  //     .subscribe({
  //       next: (response) => {
  //         this.loading = false;
  //         if (response.success) {
  //           Notiflix.Notify.success('OTP sent successfully to your email');
  //           this.showOtpForm = true;
  //           this._startResendOtpTimer();
  //         } else {
  //           Notiflix.Notify.failure(response.message || 'Failed to send otp');
  //         }
  //       },
  //       error: (error) => {
  //         this.loading = false;
  //         Notiflix.Notify.failure(error.error.message || 'Something went wrong');
  //       }
  //     });
  // }

  onRegister() {
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    if (this.registerForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        console.log('Register attempt:', this.registerForm.value);
      }, 2000);
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  switchToLogin() {
    this._router.navigate(['login'])
  }
}
