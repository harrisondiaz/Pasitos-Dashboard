import { Component, EventEmitter } from '@angular/core';
import { Provider } from '../../interfaces/provider.interface';
import { ProviderService } from '../../services/provider.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-view-provider',
  standalone: true,
  imports: [ToastModule],
  templateUrl: './view-provider.component.html',
  styleUrl: './view-provider.component.scss',
})
export class ViewProviderComponent {
  id: number = 0;
  providers: Provider[] = [];
  provider: Provider = {} as Provider;

  constructor(
    private providerService: ProviderService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          return of(parseInt(params.get('id') || '0'));
        })
      )
      .subscribe((id: number) => {
        this.id = id;
        this.providerService.searchById(this.id).subscribe({
          next: (res: any) => {
            this.provider = res[0];
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor encontrado' });
          },
          error: (error) => {
            console.error(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo encontrar el proveedor' });
          },
        });
      });
  }

  getNature() {
    return this.provider.nature !== '' &&
      this.provider.nature !== undefined &&
      this.provider.nature !== null
      ? this.provider.nature
      : 'No tiene naturaleza registrada';
  }

  gettaxregime() {
    return this.provider.taxregime !== '' &&
      this.provider.taxregime !== undefined &&
      this.provider.taxregime !== null
      ? this.provider.taxregime
      : 'No tiene régimen de impuestos registrado';
  }

  getdocumenttype() {
    return this.provider.documenttype !== '' &&
      this.provider.documenttype !== undefined &&
      this.provider.documenttype !== null
      ? this.provider.documenttype
      : 'No tiene tipo de documento registrado';
  }

  getDocument() {
    return this.provider.document !== '' &&
      this.provider.document !== undefined &&
      this.provider.document !== null
      ? this.provider.document
      : 'No tiene documento registrado';
  }

  getverificationdigit() {
    return this.provider.verificationdigit !== 0 &&
      this.provider.verificationdigit !== undefined &&
      this.provider.verificationdigit !== null
      ? this.provider.verificationdigit
      : 'No tiene dígito de verificación registrado';
  }

  getfirstname() {
    return this.provider.firstname !== '' &&
      this.provider.firstname !== undefined &&
      this.provider.firstname !== null
      ? this.provider.firstname
      : 'No tiene primer nombre registrado';
  }

  getothernames() {
    return this.provider.othernames !== '' &&
      this.provider.othernames !== undefined &&
      this.provider.othernames !== null
      ? this.provider.othernames
      : 'No tiene otros nombres registrados';
  }

  getlastname() {
    return this.provider.lastname !== '' &&
      this.provider.lastname !== undefined &&
      this.provider.lastname !== null
      ? this.provider.lastname
      : 'No tiene primer apellido registrado';
  }

  getSecondlastname() {
    return this.provider.secondlastname !== '' &&
      this.provider.secondlastname !== undefined &&
      this.provider.secondlastname !== null
      ? this.provider.secondlastname
      : 'No tiene segundo apellido registrado';
  }

  getbusinessname() {
    return this.provider.businessname !== '' &&
      this.provider.businessname !== undefined &&
      this.provider.businessname !== null
      ? this.provider.businessname
      : 'No tiene razón social registrada';
  }

  getDepartment() {
    return this.provider.department !== '' &&
      this.provider.department !== undefined &&
      this.provider.department !== null
      ? this.provider.department
      : 'No tiene departamento registrado';
  }

  getCities() {
    return this.provider.city !== '' &&
      this.provider.city !== undefined &&
      this.provider.city !== null
      ? this.provider.city
      : 'No tiene ciudad registrada';
  }

  getAddress() {
    return this.provider.address !== '' &&
      this.provider.address !== undefined &&
      this.provider.address !== null
      ? this.provider.address
      : 'No tiene dirección registrada';
  }

  getNeighborhood() {
    return this.provider.neighborhood !== '' &&
      this.provider.neighborhood !== undefined &&
      this.provider.neighborhood !== null
      ? this.provider.neighborhood
      : 'No tiene barrio registrado';
  }

  getPhone() {
    return this.provider.phone !== 0 &&
      this.provider.phone !== undefined &&
      this.provider.phone !== null
      ? this.provider.phone
      : 'No tiene teléfono registrado';
  }

  getZone() {
    return this.provider.zone !== '' &&
      this.provider.zone !== undefined &&
      this.provider.zone !== null
      ? this.provider.zone
      : 'No tiene zona registrada';
  }

  getEmail() {
    return this.provider.email !== '' &&
      this.provider.email !== undefined &&
      this.provider.email !== null
      ? this.provider.email
      : 'No tiene correo electrónico registrado';
  }

  setEdit() {
    localStorage.setItem('window', 'provider/' + this.provider.id);
    this.router.navigate(['/dashboard/edit-provider', this.provider.id]);
  }

  setWindow() {
    localStorage.setItem('window', 'provider');
    localStorage.removeItem('provider');
    this.router.navigate(['/dashboard', 'provider']);
  }

  goBack() {
    this.location.back();
  }
}
