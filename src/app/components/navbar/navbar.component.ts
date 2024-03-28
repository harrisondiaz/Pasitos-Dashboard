import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  inputs: ['name'],
})
export class NavbarComponent {
  name = '';
  logout() {
    localStorage.removeItem('access_token');
    localStorage.setItem('sessionBefore', 'true');
    localStorage.removeItem('currentUser');
    window.location.reload();
  }
}
