import { Component } from '@angular/core';
import { Router, RouterOutlet, } from '@angular/router';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ReactiveFormsModule } from '@angular/forms';

import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';
import { HeaderComponent } from './components/header/header.component';

import { RouteStateService } from './services/route-state.service';
;
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    FooterComponent,
    HeaderComponent,
    
  ]
})
export class AppComponent implements OnInit {
  title = 'Pasitos-Dashboard';
  name = '';


  ngOnInit(): void {
    initFlowbite();
    this.authService.getCurrentUser().subscribe((user) => {
      this.name = user?.email ?? '';
    });
    this.primengConfig.ripple = true;
    
  }

  shouldShowHeader(): boolean {
    return this.router.url !== '/'; // Define las rutas en las que quieres mostrar el HeaderComponent
  }
  

  constructor(private router: Router, private authService: AuthService, private routeStateService: RouteStateService, private primengConfig: PrimeNGConfig) {
    
  }
}
