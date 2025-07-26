import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const credentials: LoginRequest = {
      username: this.f['username'].value,
      password: this.f['password'].value
    };

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        this.loading = false;
        // Redirigir según el rol del usuario
        if (response && response.user && response.user.rol === 'admin') {
          this.router.navigate(['/empleados']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.error = error?.error?.error || 'Error de autenticación. Verifique sus credenciales.';
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/empleados']);
  }
}
