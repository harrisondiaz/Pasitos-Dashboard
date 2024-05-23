import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ReportService } from '../../services/report.service';
import { Report } from '../../interfaces/report.interface';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    NgxCurrencyDirective,
    ReactiveFormsModule,
    ToastModule,
    ChartModule,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent {
  items: any[] = [];

  product = {
    id: 1,
    name: 'Item 1',
    description: 'Description 1',
    url: 'https://ggbralugqoodmaklkses.supabase.co/storage/v1/object/sign/Products/155782-800-auto.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJQcm9kdWN0cy8xNTU3ODItODAwLWF1dG8ud2VicCIsImlhdCI6MTcxNTQ0ODAxMSwiZXhwIjoyMzQ2NjAwMDExfQ.X92MUGgvw6YTDsUiQ5j38Yl6ja7F5VXSxTIAJLXBF0Q&t=2024-05-11T17%3A20%3A10.860Z',
  };
  isSale = true;
  report: any[] = [];

  form = new FormGroup(
    {
      dateinitial: new FormControl('', Validators.required),
      datefinal: new FormControl('', Validators.required),
      valuestore: new FormControl('', Validators.required),
      valuemary: new FormControl('', Validators.required),
      valuecars: new FormControl('', Validators.required),
    },
    {
      validators: (group: AbstractControl<any, any>) =>
        this.dateLessThan('dateinitial', 'datefinal'),
    }
  );

  isToday = false;
  data = {};
  options = {};
  count = 0;

  minDate = '2001-01-01';
  maxDate = new Date().toISOString().split('T')[0];

  loadChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const all: { [key: string]: number } = {};
    this.productService.getAll().subscribe({
      next: (products: any) => {
        products.forEach((product: any) => {
          if (all[product.classification]) {
            all[product.classification] += 1;
          } else {
            all[product.classification] = 1;
          }
        });
        this.data = {
          datasets: [
            {
              data: Object.values(all),
              backgroundColor: [
                documentStyle.getPropertyValue('--red-500'),
                documentStyle.getPropertyValue('--green-500'),
                documentStyle.getPropertyValue('--yellow-500'),
                documentStyle.getPropertyValue('--bluegray-500'),
                documentStyle.getPropertyValue('--blue-500'),
                documentStyle.getPropertyValue('--purple-500'),
                documentStyle.getPropertyValue('--orange-500'),
                documentStyle.getPropertyValue('--cyan-500'),
                documentStyle.getPropertyValue('--pink-500'),
                documentStyle.getPropertyValue('--lime-500'),
              ],
              label: 'Número de productos por categoria',
            },
          ],
          labels: Object.keys(all),
        };
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar los productos',
        });
      },
    });

    this.options = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        r: {
          grid: {
            color: surfaceBorder,
          },
        },
      },
      width: '50%',
      height: '50%',
    };
  }

  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: 'La fecha inicial no puede ser mayor que la fecha final',
        };
      }
      return {};
    };
  }

  setEdit(pasare: string, id: number) {
    //localStorage.setItem('window', pasare);
    this.router.navigate(['dashboard', pasare, id]);
  }

  ngOnInit() {
    this.productService.lessStock().subscribe({
      next: (products: any) => {
        this.items = products;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar los productos',
        });
      },
    });
    this.loadChart();
  }

  constructor(
    private reportService: ReportService,
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  isTodayDate(event: any) {
    const today = new Date();
    if (event.target.checked) {
      this.form.get('dateinitial')?.disable();
      this.form.get('datefinal')?.disable();
      this.form
        .get('dateinitial')
        ?.setValue(new Date().toISOString().split('T')[0]);
      this.form
        .get('datefinal')
        ?.setValue(new Date().toISOString().split('T')[0]);
    } else {
      this.form.get('dateinitial')?.enable();
      this.form.get('datefinal')?.enable();
      this.form.get('dateinitial')?.setValue('');
      this.form.get('datefinal')?.setValue('');
    }
  }

  setMinDate() {
    let initial = document.querySelector('#initaldate') as HTMLInputElement;
    let final = document.querySelector('#finaldate') as HTMLInputElement;
    if (initial && final) {
      final.min = initial.value;
    }
  }

  getPDF() {
    let dateinitial = document.querySelector('#initaldate') as HTMLInputElement;
    let datefinal = document.querySelector('#finaldate') as HTMLInputElement;

    if (dateinitial && datefinal) {
      if (dateinitial.value === '' || datefinal.value === '') {
        this.messageService.add({
          severity: 'warning',
          summary: 'Advertencia',
          detail: 'Por favor, llene todos los campos',
        });
      } else {
        this.messageService.add({
          severity: 'info',
          summary: 'Generando PDF',
          detail: 'Por favor, espere un momento',
        });
        this.reportService
          .getSalesBtwDates(dateinitial.value, datefinal.value)
          .subscribe({
            next: (response: any) => {
              this.report = response;
              if (this.report.length > 0) {
                this.reportService
                  .exportSalesBtwDates(dateinitial.value, datefinal.value)
                  .subscribe({
                    next: (response) => {
                      this.messageService.add({
                        severity: 'success',
                        summary: 'PDF generado',
                        detail: 'PDF generado correctamente',
                      });
                      dateinitial.value = '';
                      datefinal.value = '';

                      const blob = new Blob([response], {
                        type: 'application/pdf',
                      });
                      const url = window.URL.createObjectURL(blob);
                      window.open(url);
                    },
                    error: (error) => {
                      console.error(error);
                    },
                  });
              } else {
                this.messageService.add({
                  severity: 'warning',
                  summary: 'Advertencia',
                  detail:
                    'No se encontraron ventas en el rango de fechas seleccionado',
                });
              }
            },
            error: (error) => {
              console.error(error);
            },
          });
      }
    } else {
      console.error('Elements with id #initaldate or #finaldate not found');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo generar el PDF',
      });
    }
  }

  onSubmit() {
    this.form.get('dateinitial')?.enable();
    this.form.get('datefinal')?.enable();
    if (this.form.valid) {
      const report = this.form.value as unknown as Report;
      this.reportService.createReport(report).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Reporte creado',
            detail: 'Reporte creado correctamente',
          });
          this.form.reset();
        },
        error: (error) => {
          console.error(error);
        },
      });
    } else {
      this.messageService.add({
        severity: 'warning',
        summary: 'Advertencia',
        detail: 'Por favor, llene todos los campos',
      });
      this.form.markAllAsTouched();
    }
    if (this.isToday) {
      this.form.get('dateinitial')?.disable();
      this.form.get('datefinal')?.disable();
    }
  }

  setWindow(pasare: string) {
    localStorage.setItem('window', pasare);
    this.router.navigate(['dashboard', pasare]);
  }
}
