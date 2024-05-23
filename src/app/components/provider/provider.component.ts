import { Component } from '@angular/core';
import { Provider } from '../../interfaces/provider.interface';
import { ProviderService } from '../../services/provider.service';
import { ViewProviderComponent } from '../view-provider/view-provider.component';
import { ColombiaService } from '../../services/colombia.service';
import { FormControl } from '@angular/forms';
import { PdfService } from '../../services/pdf.service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-provider',
  standalone: true,
  templateUrl: './provider.component.html',
  styleUrl: './provider.component.scss',
  imports: [ViewProviderComponent, ToastModule],
})
export class ProviderComponent {
  providerList: Provider[] = [];
  colombia: any[] = [];
  isDropdownOpen: boolean = false;
  isButtonVisible: boolean = true;
  isViewVisible: boolean = false;
  provider = {} as Provider;
  isDeleted: boolean = false;
  isLoading: boolean = true;
  shimmer = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  search1 = new FormControl('');
  search2 = new FormControl('');
  providers: Provider[] = [];

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.isButtonVisible = !this.isButtonVisible;
  }

  closeDelete() {
    this.isDeleted = false;
  }

  deleteProvider() {
    this.providerService.delete(this.provider).subscribe({
      next: () => {
        this.getProviders();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor eliminado correctamente' });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el proveedor' });
      },
    });
    this.isDeleted = false;
  }

  toggleDelete(provider: Provider) {
    this.provider = provider;
    this.isDeleted = !this.isDeleted;
  }

  toggleView(provider: Provider) {
    this.provider = provider;
    this.isViewVisible = !this.isViewVisible;
  }

  getfirstname(provider: Provider) {
    if (provider.firstname !== '') {
      return provider.firstname;
    } else {
      return 'No tiene nombre registrado';
    }
  }

  getothernames(provider: Provider) {
    if (provider.othernames !== '') {
      return provider.othernames;
    } else {
      return 'No tiene otros nombres registrados';
    }
  }

  getlastname(provider: Provider) {
    if (provider.lastname !== '') {
      return provider.lastname;
    } else {
      return 'No tiene apellido registrado';
    }
  }

  getSecondlastname(provider: Provider) {
    if (provider.secondlastname !== '') {
      return provider.secondlastname;
    } else {
      return 'No tiene segundo apellido registrado';
    }
  }

  getverificationdigit(provider: Provider) {
    if (provider.verificationdigit !== 0) {
      return provider.verificationdigit;
    } else {
      return 'No tiene dígito de verificación registrado';
    }
  }

  getEmail(provider: Provider) {
    if (provider.email !== '') {
      return provider.email;
    } else {
      return 'No tiene correo registrado';
    }
  }

  getbusinessname(provider: Provider) {
    if (provider.businessname !== '') {
      return provider.businessname;
    } else if (
      provider.firstname === '' ||
      provider.othernames === '' ||
      provider.lastname === '' ||
      provider.secondlastname
    ) {
      return (
        provider.firstname +
        ' ' +
        provider.othernames +
        ' ' +
        provider.lastname +
        ' ' +
        provider.secondlastname
      );
    } else {
      return 'No tiene nombre de empresa registrado';
    }
  }

  getCities(provider: Provider) {
    if (provider.city !== '') {
      return provider.city;
    } else {
      return 'No tiene ciudad registrada';
    }
  }

  getAddress(provider: Provider) {
    if (provider.address !== '') {
      return provider.address;
    } else {
      return 'No tiene dirección registrada';
    }
  }

  getNeighborhood(provider: Provider) {
    if (provider.neighborhood !== '') {
      return provider.neighborhood;
    } else {
      return 'No tiene barrio registrado';
    }
  }

  getPhone(provider: Provider) {
    if (provider.phone !== 0) {
      return provider.phone;
    } else {
      return 'No tiene teléfono registrado';
    }
  }

  getZone(provider: Provider) {
    if (provider.zone !== '') {
      return provider.zone;
    } else {
      return 'No tiene zona registrada';
    }
  }

  getDepartment(provider: Provider) {
    if (provider.department !== '') {
      return provider.department;
    } else {
      return 'No tiene departamento registrado';
    }
  }

  async getProviders() {
    this.providerService.getAll().subscribe({
      next: (providers) => {
        this.providerList = providers;
        this.isLoading = false;
        this.providers = this.providerList;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  setWindow(pasare: string) {
    localStorage.setItem('window', pasare);
    this.router.navigate(['/dashboard', pasare]);
  }

  setEdit(pasare: string, provider: Provider) {
    this.router.navigate(['/dashboard', pasare, provider.id]);
  }

  setView(pasare: string, provider: Provider) {
    this.router.navigate(['dashboard', pasare, provider.id]);
  }

  constructor(
    private providerService: ProviderService,
    private pdfService: PdfService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getProviders();
  }

  searchProviders(event?: any) {
    let term = '';
    if (event) {
      term = event.target.value.toLowerCase();
    }

    if (term !== '') {
      this.providers = this.providerList.filter((provider) => {
        // Si term no es una cadena vacía, comprueba si businessname, city, department, neighborhood, zone o address incluyen term
        const condition =
          term !== '' &&
          (provider.businessname.toLowerCase().includes(term) ||
            provider.city.toLowerCase().includes(term) ||
            provider.department.toLowerCase().includes(term) ||
            provider.neighborhood.toLowerCase().includes(term) ||
            provider.zone.toLowerCase().includes(term) ||
            provider.email.toLowerCase().includes(term) ||
            provider.phone.toString().includes(term) ||
            provider.address.toLowerCase().includes(term));

        // Devuelve true si se cumple la condición
        return condition;
      });
    } else {
      this.providers = this.providerList;
    }
  }

  exportProviders() {
    this.pdfService.exportProviders(this.providers).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        this.router.navigate(['/dashboard/provider']);
        window.open(url, '_blank');
      },
    });
  }
}
