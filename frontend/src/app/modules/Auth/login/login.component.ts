import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavComponent } from "../../../shared/nav/nav.component";
import { emailValidator, passwordValidator, spacesValidator } from '../../../validators/form-validators';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private _fb: FormBuilder,
    private readonly _router: Router,
    private _authService: AuthService,
    private toastr:ToastrService
  ) {
    this._initializeForms();
  }

  private _initializeForms(): void {
    this.loginForm = this._fb.group({
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
          passwordValidator()
        ]
      ]
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

    onLogin() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this._authService.userLogin(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Welcome back!', 'Login Successful');
          this._router.navigate(['/']); 
        } else {
          this.toastr.error(res.message || 'Invalid credentials', 'Login Failed');
        }
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Something went wrong. Please try again.', 'Error');
        this.isLoading = false;
      }
    });
  }


  switchToRegister() {
    this._router.navigate(['register'])
  }
}
