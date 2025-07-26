import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { alphabetsValidator, emailValidator, passwordMatchValidator, passwordValidator, repeateCharacterValidator, spacesValidator } from '../../../validators/form-validators';
import { Router } from '@angular/router';
import { NavComponent } from '../../../shared/nav/nav.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { IRegister } from '../../../core/interfaces/auth.interface';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(private _fb: FormBuilder,
      private readonly _router: Router,
      private authService: AuthService,
      private toastr: ToastrService,
    ) {
    this._initializeForms()
  }

  private _initializeForms(): void {
    this.registerForm = this._fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
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

  onRegister() {
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const userData:IRegister ={
      name:this.registerForm.value.name,
      email:this.registerForm.value.email,
      password:this.registerForm.value.password
    }
    
    this.authService.userRegister(userData).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success("Account created successfully")
          this._router.navigate(['login']);
        } else {
          this.toastr.error(res.message || 'Registration Failed');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Something went wrong. Please try again.', 'Error');
        this.isLoading = false;
      }
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  switchToLogin() {
    this._router.navigate(['login'])
  }
}
