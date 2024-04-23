import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ColombiaService } from '../../services/colombia.service';
import { ColombiaData } from '../../interfaces/colombia.interface'; // Import the ColombiaData type from the appropriate file
import { ProviderService } from '../../services/provider.service';
import { Provider } from '../../interfaces/provider.interface';

@Component({
  selector: 'app-new-provider',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-provider.component.html',
  styleUrl: './new-provider.component.scss',
})
export class NewProviderComponent {
  form = new FormGroup({
    nature: new FormControl('', Validators.required),
    taxRegime: new FormControl('', Validators.required),
    documentType: new FormControl('', Validators.required),
    document: new FormControl('', Validators.required),
    verificationDigit: new FormControl(0),
    firstName: new FormControl(''),
    otherNames: new FormControl(''),
    lastName: new FormControl(''),
    secondLastName: new FormControl(''),
    businessName: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    neighborhood: new FormControl(''),
    phone: new FormControl(0, Validators.required),
    zone: new FormControl(''),
    email: new FormControl(''),
  });

  colombia: ColombiaData[] = [];
  cities: string[] = [];
  isLoaded: boolean = true;
  department: string[] = [];
  isIncomplete: boolean = false;

  getColombia() {
    this.colombiaService.getAll().subscribe((colombiaData: ColombiaData[]) => {
      this.colombia = colombiaData;
      this.getColombiaDepartment();
    });
  }

  getColombiaDepartment() {
    let count = 0;
    const total = this.colombia.length;

    const departments = new Set(
      this.colombia.map((colombia) => {
        count++;
        console.log(`Mapeando departamento ${count} de ${total}`);
        return colombia.DEPARTAMENTO;
      })
    );

    console.log(departments);
    this.isLoaded = false;
    this.department = Array.from(departments);
  }

  getCitiesByDepartment(event: any) {
    const department = event.target.value;
    this.cities = [];
    this.colombia.forEach((colombia) => {
      if (colombia.DEPARTAMENTO === department) {
        this.cities.push(colombia.MUNICIPIO);
      }
    });
    this.cities.sort((a, b) => a.localeCompare(b));
  }

  setWindow(pasare: string) {
    localStorage.setItem('window', pasare);
    window.location.reload();
  }

  submit() {
    if (this.form.valid) {
      this.providerService.create(this.form.value as Provider).subscribe({
        next: (response) => {
          console.log(response);
          this.setWindow('provider');
        },
        error: (error) => {
          console.error(error);
        },
      });
    } else {
      this.isIncomplete = true;
      setInterval(() => {
        this.isIncomplete = false;
      }, 5000);
    }
  }

  close() {
    this.isIncomplete = false;
  }

  constructor(
    private colombiaService: ColombiaService,
    private providerService: ProviderService
  ) {
    this.getColombia();
  }
}