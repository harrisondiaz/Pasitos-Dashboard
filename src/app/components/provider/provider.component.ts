import { Component } from '@angular/core';
import { Provider } from '../../interfaces/provider.interface';
import { ProviderService } from '../../services/provider.service';
import { ViewProviderComponent } from "../view-provider/view-provider.component";
import { ColombiaService } from '../../services/colombia.service';

@Component({
    selector: 'app-provider',
    standalone: true,
    templateUrl: './provider.component.html',
    styleUrl: './provider.component.scss',
    imports: [ViewProviderComponent]
})
export class ProviderComponent {
  providerList: Provider[] = [];
  colombia: any[] = [];
  isDropdownOpen: boolean = false;
  isButtonVisible: boolean = true;
  isViewVisible: boolean = false;
  provider = {} as Provider;
  isDeleted: boolean = false;
  isDeletedCorrectly: boolean = false;
  isDeletedIncorrectly: boolean = false;
  isLoading: boolean = true;
  shimmer = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
        this.isDeletedCorrectly = true;
        setTimeout(() => {
          this.isDeletedCorrectly = false;
        }, 2000);
      },
      error: (error) => {
        this.isDeletedIncorrectly = true;
        setTimeout(() => {
          this.isDeletedIncorrectly = false;
        }, 2000);
        console.error(error);
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

  getFirstName(provider: Provider) {
    if (provider.firstName !== '') {
      return provider.firstName;
    } else {
      return 'No tiene nombre registrado';
    }
  }

  getOtherNames(provider: Provider) {
    if (provider.otherNames !== '') {
      return provider.otherNames;
    } else {
      return 'No tiene otros nombres registrados';
    }
  }

  getLastName(provider: Provider) {
    if (provider.lastName !== '') {
      return provider.lastName;
    } else {
      return 'No tiene apellido registrado';
    }
  }

  getSecondLastName(provider: Provider) {
    if (provider.secondLastName !== '') {
      return provider.secondLastName;
    } else {
      return 'No tiene segundo apellido registrado';
    }
  }

  getVerificationDigit(provider: Provider) {
    if (provider.verificationDigit !== 0) {
      return provider.verificationDigit;
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

  getBusinessName(provider: Provider) {
    if (provider.businessName !== '') {
      return provider.businessName;
    } else {
      return (
        provider.firstName +
        ' ' +
        provider.otherNames +
        ' ' +
        provider.lastName +
        ' ' +
        provider.secondLastName
      );
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



  getProviders() {
    this.providerService.getAll().subscribe({
      next: (providers) => {
        this.providerList = providers;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  setWindow(pasare: string) {
    localStorage.setItem('window', pasare);
    window.location.reload();
  }

  setEdit(pasare: string, provider: Provider) {
    localStorage.setItem('window', pasare);
    localStorage.setItem('provider', JSON.stringify(provider));
    window.location.reload();
  }

  setView(pasare: string, provider: Provider) {
    localStorage.setItem('window', pasare);
    localStorage.setItem('provider', JSON.stringify(provider));
    window.location.reload();
  }

  
  constructor(private providerService: ProviderService) {}

  ngOnInit() {
    this.getProviders();
  }
}
