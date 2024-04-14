import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { BodyComponent } from '../../components/body/body.component';
import { ProductComponent } from '../../components/product/product.component';
import { ClientComponent } from '../../components/client/client.component';
import { ProviderComponent } from '../../components/provider/provider.component';
import { ReportComponent } from '../../components/report/report.component';
import { NewProducComponent } from '../../components/new-produc/new-produc.component';

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
    NewProducComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  name = '';
  waitingToast = false;
  phrase = '';
  nav: String = '';
  window = '';

  isSession() {
    if (
      localStorage.getItem('sessionBefore') === 'true' &&
      localStorage.getItem('toast') === 'true'
    ) {
      this.waitingToast = !this.waitingToast;
      this.phrase = '¡Inicio de sesión exitoso!';
      setTimeout(() => {
        this.waitingToast = !this.waitingToast;
      }, 3000);
      localStorage.setItem('toast', 'false');
      window.location.reload();
    } else {
      if (localStorage.getItem('toast') === 'false') {
        
      } else {
        this.waitingToast = !this.waitingToast;
        this.phrase = '¡Hola!, Bienvenido de nuevo ' + this.name;
        setTimeout(() => {
          this.waitingToast = !this.waitingToast;
        }, 3000);
        localStorage.setItem('toast', 'true');
      }
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.setItem('sessionBefore', 'true');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('window');
    localStorage.removeItem('toast');
    window.location.reload();
  }

  setWindow(window: string) {
    localStorage.setItem('window', window);
    localStorage.setItem('toast', 'true');
    this.window = window;
  }

  constructor(private user: UserService) {}
  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    localStorage.setItem('toast', 'false');
    this.window = localStorage.getItem('window') ?? 'home';
    console.log(currentUser);
    this.name = currentUser ?? '';
    this.isSession();
  }
}
