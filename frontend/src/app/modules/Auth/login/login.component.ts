import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavComponent } from "../../../shared/nav/nav.component";
import { emailValidator, passwordValidator, spacesValidator } from '../../../validators/form-validators';


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
    private readonly _router: Router) {
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
    if (this.loginForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        console.log('Login attempt:', this.loginForm.value);
      }, 2000);
    }
  }

  switchToRegister() {
    this._router.navigate(['register'])
  }
}
