import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { BodyComponent } from '../../components/body/body.component';
import { ProductComponent } from '../../components/product/product.component';
import { ClientComponent } from '../../components/client/client.component';
import { ProviderComponent } from '../../components/provider/provider.component';
import { ReportComponent } from '../report/report.component';
import { NewProducComponent } from '../../components/new-produc/new-produc.component';
import { ProductEditComponent } from '../../components/product-edit/product-edit.component';
import { ViewProviderComponent } from "../../components/view-provider/view-provider.component";
import { NewProviderComponent } from "../../components/new-provider/new-provider.component";
import { EditProviderComponent } from "../../components/edit-provider/edit-provider.component";
import { AuthService } from '../../services/auth.service';

import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [
        FooterComponent,
        BodyComponent,
        ProductComponent,
        ClientComponent,
        ProviderComponent,
        ReportComponent,
        NewProducComponent,
        ProductEditComponent,
        ViewProviderComponent,
        NewProviderComponent,
        EditProviderComponent,
    ]
})
export class HomeComponent implements OnInit {
  name = '';
  waitingToast = false;
  phrase = '';
  nav: String = '';
  window = '';

  

  logout() {
    localStorage.setItem('sessionBefore', 'true');
    localStorage.removeItem('window');
    localStorage.removeItem('toast');
    this.authService.signOut();
    this.router.navigate(['/']);
   
  }

  setWindow(parse: string) {
    localStorage.setItem('window', parse);
    localStorage.setItem('toast', 'true');
    this.window = parse;
    this.router.navigate(['dashboard', parse]);
  }

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    const currentUser =  this.authService.getCurrentUser().subscribe((user) => {
      this.name = user?.email ?? '';
    });
    this.window = localStorage.getItem('window') ?? '';
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart && event.url === 'dashboard')
      )
      .subscribe(() => window.location.reload());
  }
}
