import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  phrase =
    '¡Ups! Al parecer tus credenciales son incorrectas. Por favor, inténtalo de nuevo.';
  novisible = false;
  noEmail  = false;
  isValid = true;

  loginForm = new FormGroup({
    email: new FormControl('' ,[Validators.required, Validators.email]),
    password: new FormControl('' ,Validators.required),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const user = this.loginForm.value;
      this.signUpWithRetry(user.email!, user.password!);
    }else{
      this.isValid = !this.isValid;
    }
  }

  async signUpWithRetry(email: string, password: string, retryCount = 0) {
  try {
    await this.authService.signIn(email, password).then(() => {
      localStorage.setItem('window', 'home')
      this.router.navigate(['dashboard']);
      window.location.reload();
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
      console.log("Aqui entre :D Error: ", error.message);
      this.novisible = true;
    } else {
      console.log(error);
      this.novisible = !this.novisible;
    }
  }
}

  constructor(private router: Router, private authService: AuthService) {
    this.loginForm.valueChanges.subscribe(() => {
      this.noEmail = !this.loginForm.get('email')?.valid;
    });
  }
}
