import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent,FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  name = '';
  waitingToast = false;
  phrase = ''

  isSession() {
    if(localStorage.getItem('sessionBefore') === 'true'){
      this.waitingToast = !this.waitingToast;
      this.phrase = '¡Inicio de sesión exitoso!';
      setTimeout(() => {
        this.waitingToast = !this.waitingToast;
      }, 3000);
      window.location.reload();
    }else{
      this.waitingToast = !this.waitingToast;
      this.phrase = '¡Hola!, Bienvenido de nuevo '+this.name;
      setTimeout(() => {
        this.waitingToast = !this.waitingToast;
      }, 3000);
      
    }
  }
  


  logout() {
    localStorage.removeItem('access_token');
    localStorage.setItem('sessionBefore', 'true');
    localStorage.removeItem('currentUser');
    window.location.reload();
  }
  
  constructor(private user: UserService) {}
  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    
    console.log(currentUser);
    this.name = currentUser??'';
    this.isSession();
    
  }
}
