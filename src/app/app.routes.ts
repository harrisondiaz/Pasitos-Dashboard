import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProviderComponent } from './components/provider/provider.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProductComponent } from './components/product/product.component';
import { ClientComponent } from './components/client/client.component';
import { NewProviderComponent } from './components/new-provider/new-provider.component';
import { EditProviderComponent } from './components/edit-provider/edit-provider.component';
import { NewProducComponent } from './components/new-produc/new-produc.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { ViewProviderComponent } from './components/view-provider/view-provider.component';
import { ReportComponent } from './components/report/report.component';
import { AuthGuard } from './guards/route.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full', title: 'Inicio de sesión'},
  {
    path: 'dashboard',
    children: [
      { path: '', component: HomeComponent, title: 'Inicio' },
      { path: 'provider', component: ProviderComponent, title: 'Proveedores' },
      {
        path: 'new-provider',
        component: NewProviderComponent,
        title: 'Nuevo Proveedor',
      },
      {
        path: 'edit-provider/:id',
        component: EditProviderComponent,
        title: 'Editar proveedor',
      },{
        path: 'view-provider/:id', 
        component: ViewProviderComponent,
      },
      { path: 'product', component: ProductComponent, title: 'Productos' },
      { path: 'new-product', component: NewProducComponent, title: 'Nuevo Producto'},
      { path: 'edit-product', component: ProductEditComponent, title: 'Editar Producto'},
      { path: 'client', component: ClientComponent, title: 'Clientes' },
      { path: 'report', component: ReportComponent, title: 'Reportes'}
    ],
  },
  { path: '**', component: NotFoundComponent },
];
