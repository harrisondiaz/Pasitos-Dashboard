import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, ToastModule
    
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  phrase =
    '¡Ups! Al parecer tus credenciales son incorrectas. Por favor, inténtalo de nuevo.';
  novisible = false;
  noEmail = false;
  isValid = true;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const user = this.loginForm.value;
      this.signUpWithRetry(user.email!, user.password!);
    } else {
      this.messageServce.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, ingresa tus credenciales',
        life: 4000,
      });
    }
  }

  async signUpWithRetry(email: string, password: string, retryCount = 0) {
    try {
      await this.authService.signIn(email, password).then(() => {
        this.messageServce.add({
          severity: 'success',
          detail: 'Inicio de sesión exitoso',
          life: 4000,
        });
        this.messageServce.add({ severity: 'info', detail: 'Redirigiendo...' });
        setTimeout(() => {
          localStorage.setItem('window', 'home');
          this.router.navigate(['dashboard']);
        }, 4000);
      });
    } catch (error: any) {
      if (error.message === 'Rate limit exceeded' && retryCount < 3) {
        // Wait for 2^retryCount seconds before trying again
        const waitTime = Math.pow(2, retryCount) * 1000;
        setTimeout(
          () => this.signUpWithRetry(email, password, retryCount + 1),
          waitTime
        );
      } else if (error.status === 400) {
        this.messageServce.add({
          severity: 'error',
          summary: 'Error',
          detail: this.phrase,
        });
      } else {
        this.messageServce.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ha ocurrido un error inesperado',
        });
      }
    }
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageServce: MessageService
  ) {
    this.loginForm.valueChanges.subscribe(() => {
      this.noEmail = !this.loginForm.get('email')?.valid;
    });
  }
}
