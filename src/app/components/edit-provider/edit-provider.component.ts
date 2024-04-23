import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [ReactiveFormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule],
  templateUrl: './edit-provider.component.html',
  styleUrl: './edit-provider.component.scss'
})
export class EditProviderComponent {

  provider: Provider = localStorage.getItem('provider') ? JSON.parse(localStorage.getItem('provider') as string) : {} as Provider;

  form = new FormGroup({
    nature: new FormControl(this.provider.nature, Validators.required),
    taxRegime: new FormControl(this.provider.taxRegime, Validators.required),
    documentType: new FormControl(this.provider.documentType, Validators.required),
    document: new FormControl(this.provider.document, Validators.required),
    verificationDigit: new FormControl(this.provider.verificationDigit),
    firstName: new FormControl(this.provider.firstName),
    otherNames: new FormControl(this.provider.otherNames),
    lastName: new FormControl(this.provider.lastName),
    secondLastName: new FormControl(this.provider.secondLastName),
    businessName: new FormControl(this.provider.businessName, Validators.required),
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

  getCitiesByDepartment(event: any ) {
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
      const id = this.provider._id;
      this.provider = this.form.value as Provider;
      this.provider._id = id;
      console.log(this.provider);
      this.providerService.update(this.provider).subscribe((provider: Provider) => {
        localStorage.removeItem('provider');
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
    return JSON.stringify(this.form.value) !== JSON.stringify(this.provider);
  }

  ngOnInit() {
    
  }
}
