import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { BodyComponent } from '../../components/body/body.component';
import { ProductComponent } from '../../components/product/product.component';
import { ClientComponent } from '../../components/client/client.component';
import { ProviderComponent } from '../../components/provider/provider.component';
import { ReportComponent } from '../../components/report/report.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    
    FooterComponent,
    BodyComponent,
    ProductComponent,
    ClientComponent,
    ProviderComponent,
    ReportComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  name = '';
  waitingToast = false;
  phrase = '';
  nav: String = '';
  window = 'home';

  isSession() {
    if (localStorage.getItem('sessionBefore') === 'true') {
      this.waitingToast = !this.waitingToast;
      this.phrase = '¡Inicio de sesión exitoso!';
      setTimeout(() => {
        this.waitingToast = !this.waitingToast;
      }, 3000);
      window.location.reload();
    } else {
      this.waitingToast = !this.waitingToast;
      this.phrase = '¡Hola!, Bienvenido de nuevo ' + this.name;
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

  setWindow(window: string) {
    this.window = window;
  }

  constructor(private user: UserService) {}
  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    console.log(currentUser);
    this.name = currentUser ?? '';
    this.isSession();
  }
}
