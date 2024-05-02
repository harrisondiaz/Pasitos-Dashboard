import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  name: string = '';
  username : any;

  logout() {
    this.authService.signOut();
  }

  setWindow(parsedWindow: any) {
    this.router.navigate(['/dashboard', parsedWindow]);
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.name = user?.email ?? '';
    });
  }

  getName() {
    const email = JSON.parse(localStorage.getItem('sb-ggbralugqoodmaklkses-auth-token') || '{}');
    this.userService.getName(email.user.email).subscribe((data: any) => {
      this.username = data.name;
    });
  }
  

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

}
