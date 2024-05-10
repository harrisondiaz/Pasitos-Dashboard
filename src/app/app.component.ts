import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, Event } from '@angular/router';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';
import { HeaderComponent } from './components/header/header.component';
import { filter } from 'rxjs';
import { RouteStateService } from './services/route-state.service';
import { AuthGuard } from './guards/route.guard';

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
    
  }

  shouldShowHeader(): boolean {
    return this.router.url !== '/'; // Define las rutas en las que quieres mostrar el HeaderComponent
  }
  

  constructor(private router: Router, private authService: AuthService, private routeStateService: RouteStateService) {
    
  }
}
