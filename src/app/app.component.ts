import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Pasitos-Dashboard';
  ngOnInit(): void {
    initFlowbite();
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['/']);
    }
    localStorage.setItem('sessionBefore', 'false');
  }
  constructor(private router: Router) {}
}
