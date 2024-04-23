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
  
  phrase = '¡Ups! Al parecer tus credenciales son incorrectas. Por favor, inténtalo de nuevo.';
  novisible = false;

  loginForm = new FormGroup({
    email: new FormControl('', /*[Validators.required, Validators.email]*/),
    password: new FormControl('', /*Validators.required*/),
  });

  onSubmit() {
    
    try{
      if (this.loginForm.valid) {
        const user = this.loginForm.value;
        this.userService.getUser(user).subscribe((data: any) => {
          if (data.message === 'Login successful!') {
            
            localStorage.setItem('access_token', data.token);  
            this.userService.getName(user.email??"").subscribe((data: any) => {
              localStorage.setItem('currentUser', data.name);
            } );
            this.router.navigate(['dashboard']);
            
          }else {
            this.novisible = true;
            setInterval(() => {
              this.novisible = false;
            }, 5000);
            this.loginForm.reset();
          }
        });
        
      }
    }catch(error){
      console.log(error);
      this.novisible = !this.novisible;
    }
  }

  constructor(private router: Router, private userService: UserService, ) {}
}
