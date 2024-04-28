import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { FooterComponent } from "./components/footer/footer.component";
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
        RouterOutlet,
        ReactiveFormsModule,
        FooterComponent
    ]
})
export class AppComponent implements OnInit {
  title = 'Pasitos-Dashboard';
  name = '';
  ngOnInit(): void {
    initFlowbite();
    this.authService.getCurrentUser().subscribe((user) => {
      this.name = user?.email ?? '';
      if (user?.aud === 'authenticated') {
        this.router.navigate(['/']);
    } else {
        this.router.navigate(['/dashboard']);
    }
    });

  }
  constructor(private router: Router, private authService: AuthService) {}
}
