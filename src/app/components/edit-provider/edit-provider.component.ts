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
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap, of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-edit-provider',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ToastModule,
  ],
  templateUrl: './edit-provider.component.html',
  styleUrl: './edit-provider.component.scss',
})
export class EditProviderComponent {
  id: number = 0;
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
    phone: new FormControl(this.provider.phone, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    zone: new FormControl(this.provider.zone),
    email: new FormControl(this.provider.email, Validators.email),
  });

  colombia: ColombiaData[] = [];
  cities: string[] = [];
  isLoaded: boolean = true;
  department: string[] = [];

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

  getCitiesByDepartment(depatament: string) {
    const department2 = depatament;
    this.cities = [];
    this.colombia.forEach((colombia) => {
      if (colombia.DEPARTAMENTO === department2) {
        this.cities.push(colombia.MUNICIPIO);
      }
    });

    this.cities = this.cities.sort();
  }

  setWindow(pasare: string) {
    this.router.navigate(['/dashboard', pasare]);
  }

  goBack() {
    this.location.back();
  }

  submit() {
    if (this.form.valid && this.isDifferent()) {
      const id = this.provider.id;
      this.provider = this.form.value as Provider;
      this.provider.id = id;
      this.providerService
        .update(this.provider)
        .subscribe((provider: Provider) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor actualizado correctamente' });
            this.setWindow('provider');
          
        });
    } else {
      this.messageService.add({ severity: 'warning', summary: 'Advertencia', detail: 'No hay cambios para guardar' });
    }
  }

  

  constructor(
    private colombiaService: ColombiaService,
    private providerService: ProviderService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.form.controls['department'].valueChanges.subscribe((event) => {
      this.getCitiesByDepartment(event!);
    });
  }

  getMunicipalityForDepartment(department: string): string {
    const colombia = this.colombia.find((c) => c.DEPARTAMENTO === department);
    if (colombia) {
      return colombia.MUNICIPIO;
    }
    return '';
  }

  //validations the form is differents the provider
  isDifferent() {
    return JSON.stringify(this.aux) !== JSON.stringify(this.form.value);
  }

  getProvider() {
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
            this.form.patchValue(this.provider);
          },
          error: (error) => {
            console.error(error);
          },
        });
      });
  }

  ngOnInit() {
    this.getProvider();
    this.getColombia();
    this.aux = this.form.value as Provider;
    const currentDepartment = this.form.get('department')?.value;

    if (currentDepartment) {
      this.getCitiesByDepartment(currentDepartment);
      this.form.get('department')?.setValue(currentDepartment);
    }
  }
}
