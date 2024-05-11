import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  name: string = '';
  username: any;

  logout() {
    this.authService.signOut();
    this.router.navigate(['/']);
  }

  setHome() {
    console.log('home');
    this.router.navigate(['dashboard', 'home']);
  }

  setWindow(parsedWindow: any) {
    window.location.reload();
    localStorage.setItem('window', parsedWindow)
    this.router.navigate(['dashboard', parsedWindow]);
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.name = user?.email ?? '';
    });
  }

  getName() {
    const email = JSON.parse(
      localStorage.getItem('sb-ggbralugqoodmaklkses-auth-token') || '{}'
    );
    this.userService.getName(email.user.email).subscribe((data: any) => {
      this.username = data.name;
    });
  }

  modeDark() {
    if (
      localStorage.getItem('color-theme') === 'dark' ||
      (!('color-theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}
}
