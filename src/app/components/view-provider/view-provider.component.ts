import { Component, EventEmitter } from '@angular/core';
import { Provider } from '../../interfaces/provider.interface';

@Component({
  selector: 'app-view-provider',
  standalone: true,
  imports: [],
  templateUrl: './view-provider.component.html',
  styleUrl: './view-provider.component.scss',
})
export class ViewProviderComponent {
  provider: Provider = {} as Provider;

  constructor() {}

  ngOnInit() {
    this.provider = localStorage.getItem('provider')
      ? JSON.parse(localStorage.getItem('provider') as string)
      : ({} as Provider);
  }

  getNature() {
    return this.provider.nature !== '' &&
      this.provider.nature !== undefined &&
      this.provider.nature !== null
      ? this.provider.nature
      : 'No tiene naturaleza registrada';
  }

  getTaxRegime() {
    return this.provider.taxRegime !== '' &&
      this.provider.taxRegime !== undefined &&
      this.provider.taxRegime !== null
      ? this.provider.taxRegime
      : 'No tiene régimen de impuestos registrado';
  }

  getDocumentType() {
    return this.provider.documentType !== '' &&
      this.provider.documentType !== undefined &&
      this.provider.documentType !== null
      ? this.provider.documentType
      : 'No tiene tipo de documento registrado';
  }

  getDocument() {
    return this.provider.document !== '' &&
      this.provider.document !== undefined &&
      this.provider.document !== null
      ? this.provider.document
      : 'No tiene documento registrado';
  }

  getVerificationDigit() {
    return this.provider.verificationDigit !== 0 &&
      this.provider.verificationDigit !== undefined &&
      this.provider.verificationDigit !== null
      ? this.provider.verificationDigit
      : 'No tiene dígito de verificación registrado';
  }

  getFirstName() {
    return this.provider.firstName !== '' &&
      this.provider.firstName !== undefined &&
      this.provider.firstName !== null
      ? this.provider.firstName
      : 'No tiene primer nombre registrado';
  }

  getOtherNames() {
    return this.provider.otherNames !== '' &&
      this.provider.otherNames !== undefined &&
      this.provider.otherNames !== null
      ? this.provider.otherNames
      : 'No tiene otros nombres registrados';
  }

  getLastName() {
    return this.provider.lastName !== '' &&
      this.provider.lastName !== undefined &&
      this.provider.lastName !== null
      ? this.provider.lastName
      : 'No tiene primer apellido registrado';
  }

  getSecondLastName() {
    return this.provider.secondLastName !== '' &&
      this.provider.secondLastName !== undefined &&
      this.provider.secondLastName !== null
      ? this.provider.secondLastName
      : 'No tiene segundo apellido registrado';
  }

  getBusinessName() {
    return this.provider.businessName !== '' &&
      this.provider.businessName !== undefined &&
      this.provider.businessName !== null
      ? this.provider.businessName
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
    localStorage.setItem('window', 'edit-provider');
    localStorage.setItem('provider', JSON.stringify(this.provider));
    window.location.reload();
  }

  setWindow() {
    localStorage.setItem('window', 'provider');
    localStorage.removeItem('provider');
    window.location.reload();
  }
}
