import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {  Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ConfirmDialogModule, ToastModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  name: string = '';
  username: any;

  logout() {
    this.confirmService.confirm({
      header: '¿Estás seguro de que deseas cerrar sesión?',
      message: 'Una vez cerrada la sesión, deberás iniciarla de nuevo.',
      accept: () => {
        this.authService.signOut().then(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sesión cerrada',
            detail: '¡Hasta luego!',
            life: 4000,
            });
        }).catch(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cerrar la sesión',
            life: 4000,
            });
        });
        this.router.navigate(['/']);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Información',
          detail: 'Sesión no cerrada',
          life: 4000,
        });
      },
    });
    
  }

  setHome() {
    localStorage.setItem('window', 'home');
    this.router.navigate(['dashboard', 'home']);
  }

  setWindow(parsedWindow: any) {
    localStorage.setItem('window', parsedWindow)
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.name = user?.email ?? '';
    });
    initFlowbite();
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
    private router: Router,
    private messageService: MessageService,
    private confirmService: ConfirmationService
  ) {}
}
