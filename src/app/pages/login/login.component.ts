import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  phrase = 'Hello, world!';
  novisible = false;

  loginForm = new FormGroup({
    email: new FormControl('', /*[Validators.required, Validators.email]*/),
    password: new FormControl('', /*Validators.required*/),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const user = this.loginForm.value;
      this.userService.getUser(user).subscribe((data: any) => {
        if (data.message === 'Login successful!') {
          
          localStorage.setItem('access_token', data.token); 

          this.router.navigate(['dashboard']);
          alert('Login successful');
        }else {
          

        }
      });
    }
  }

  constructor(private router: Router, private userService: UserService) {}
}
