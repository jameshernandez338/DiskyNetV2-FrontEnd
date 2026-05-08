import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ArrowRight, Eye, EyeOff, LockKeyhole, LucideAngularModule, UserRound } from 'lucide-angular';

import { AuthService } from '@core/services/auth.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { SnackbarService } from '@shared/services/snackbar.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  loading = signal(false);
  showPassword = false;

  icons = {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    UserRound
  };

  loginForm: FormGroup = this.formBuilder.group({
    userName: ['', [Validators.required]],
    password: ['', Validators.required]
  });

  constructor(
    private authService: AuthService,
    private snackbar: SnackbarService,
    private router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.loading()) {
      return;
    }

    if (this.loginForm.invalid) {
      const controls = this.loginForm.controls;

      if (controls['userName'].invalid) {
        if (controls['userName'].hasError('required')) {
          this.snackbar.show('Debe ingresar un usuario', 'warning');
        }
        return;
      }

      if (controls['password'].invalid) {
        if (controls['password'].hasError('required')) {
          this.snackbar.show('Debe ingresar una contrasena', 'warning');
        }
        return;
      }
    }

    this.loading.set(true);
    const { userName, password } = this.loginForm.value;

    this.authService
      .login({ userName, password })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.authService.setSession(res.token, res.fullName, res.permissions ?? []);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.snackbar.show(err?.error?.message || 'Ocurrio un error', 'error');
        }
      });
  }
}
