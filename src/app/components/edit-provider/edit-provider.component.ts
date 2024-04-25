import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ColombiaData } from '../../interfaces/colombia.interface';
import { ColombiaService } from '../../services/colombia.service';
import { ProviderService } from '../../services/provider.service';
import { Provider } from '../../interfaces/provider.interface';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-provider',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './edit-provider.component.html',
  styleUrl: './edit-provider.component.scss',
})
export class EditProviderComponent {
  id: number = localStorage.getItem('provider')
    ? JSON.parse(localStorage.getItem('provider') as string)
    : 0;
  provider: Provider = {} as Provider;
  aux: Provider = {} as Provider;

  form = new FormGroup({
    nature: new FormControl(this.provider.nature, Validators.required),
    taxregime: new FormControl(this.provider.taxregime, Validators.required),
    documenttype: new FormControl(
      this.provider.documenttype,
      Validators.required
    ),
    document: new FormControl(this.provider.document, Validators.required),
    verificationdigit: new FormControl(this.provider.verificationdigit),
    firstname: new FormControl(this.provider.firstname),
    othernames: new FormControl(this.provider.othernames),
    lastname: new FormControl(this.provider.lastname),
    secondlastname: new FormControl(this.provider.secondlastname),
    businessname: new FormControl(
      this.provider.businessname,
      Validators.required
    ),
    department: new FormControl(this.provider.department, Validators.required),
    city: new FormControl(this.provider.city, Validators.required),
    address: new FormControl(this.provider.address, Validators.required),
    neighborhood: new FormControl(this.provider.neighborhood),
    phone: new FormControl(this.provider.phone, Validators.required),
    zone: new FormControl(this.provider.zone),
    email: new FormControl(this.provider.email),
  });

  colombia: ColombiaData[] = [];
  cities: string[] = [];
  isLoaded: boolean = true;
  department: string[] = [];
  isIncomplete: boolean = false;
  isUpdated: boolean = false;

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
        return colombia.DEPARTAMENTO;
      })
    );
    this.isLoaded = false;
    this.department = Array.from(departments).sort();
  }

  getCitiesByDepartment(event: any) {
    const department = event.target.value;
    this.cities = [];
    this.colombia.forEach((colombia) => {
      if (colombia.DEPARTAMENTO === department) {
        this.cities.push(colombia.MUNICIPIO);
      }
    });

    this.cities = this.cities.sort();
  }

  setWindow(pasare: string) {
    localStorage.setItem('window', pasare);
    window.location.reload();
  }

  submit() {
    if (this.form.valid && this.isDifferent()) {
      const id = this.provider.id;
      this.provider = this.form.value as Provider;
      this.provider.id = id;
      console.log(this.provider);
      this.providerService
        .update(this.provider)
        .subscribe((provider: Provider) => {
          this.isUpdated = true;
          setInterval(() => {
            this.isUpdated = false;
            this.setWindow('provider');
          }, 5000);
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

  //validations the form is differents the provider
  isDifferent() {
    console.log(JSON.stringify(this.aux) !== JSON.stringify(this.form.value));
    return  JSON.stringify(this.aux) !== JSON.stringify(this.form.value);
  }

  getProvider() {
    this.providerService.searchById(this.id).subscribe({
      next: (res: any) => {
        this.provider = res[0];
        this.aux = this.provider;
        this.form.patchValue(this.provider);
        console.log(this.form.value);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ngOnInit() {
    this.getProvider();
  }
}
