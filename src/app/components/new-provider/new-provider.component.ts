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
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastComponent } from '../toast/toast.component';


@Component({
    selector: 'app-new-provider',
    standalone: true,
    templateUrl: './new-provider.component.html',
    styleUrl: './new-provider.component.scss',
    imports: [ReactiveFormsModule, ToastComponent]
})
export class NewProviderComponent {
  form = new FormGroup({
    nature: new FormControl('', Validators.required),
    taxregime: new FormControl('', Validators.required),
    documenttype: new FormControl('', Validators.required),
    document: new FormControl('', Validators.required),
    verificationdigit: new FormControl(0),
    firstname: new FormControl(''),
    othernames: new FormControl(''),
    lastname: new FormControl(''),
    secondlastname: new FormControl(''),
    businessname: new FormControl('',),
    department: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    neighborhood: new FormControl(''),
    phone: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]*$')]),
    zone: new FormControl(''),
    email: new FormControl('', Validators.email),
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
    this.router.navigate(['/dashboard', pasare]);
  }

  goBack() {
    this.location.back();
  }

  submit() {
    console.log(this.form.valid);
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
    private providerService: ProviderService,
    private location: Location,
    private router: Router  
  ) {
    this.getColombia();
  }
}
