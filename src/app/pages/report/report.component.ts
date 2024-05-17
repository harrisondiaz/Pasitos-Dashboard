import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ToastComponent } from '../../components/toast/toast.component';
import { ReportService } from '../../services/report.service';
import { Report } from '../../interfaces/report.interface';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [NgxCurrencyDirective, ReactiveFormsModule, ToastComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent {
  
  items : any[] = [];

  product = {
    id: 1,
    name: 'Item 1',
    description: 'Description 1',
    url: 'https://ggbralugqoodmaklkses.supabase.co/storage/v1/object/sign/Products/155782-800-auto.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJQcm9kdWN0cy8xNTU3ODItODAwLWF1dG8ud2VicCIsImlhdCI6MTcxNTQ0ODAxMSwiZXhwIjoyMzQ2NjAwMDExfQ.X92MUGgvw6YTDsUiQ5j38Yl6ja7F5VXSxTIAJLXBF0Q&t=2024-05-11T17%3A20%3A10.860Z',
  };
  isSale = true;
  isCorrect = false;

  form = new FormGroup({
    dateinitial: new FormControl('', Validators.required),
    datefinal: new FormControl('', Validators.required),
    valuestore: new FormControl('', Validators.required),
    valuemary: new FormControl('', Validators.required),
    valuecars: new FormControl('', Validators.required),
  }, { validators: (group: AbstractControl<any, any>) => this.dateLessThan('dateinitial', 'datefinal')});

  isToday = false;
  message = '';
  type = '';
  minDate = '2001-01-01';
  maxDate = new Date().toISOString().split('T')[0];


  dateLessThan(from: string, to: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: "La fecha inicial no puede ser mayor que la fecha final"
        };
      }
      return {};
    }
  }

  setEdit(pasare: string, id: number) {
    localStorage.setItem('window', pasare);
    this.router.navigate(["dashboard",pasare, id]);

  }

  ngOnInit() {
    this.productService.lessStock().subscribe({
      next: (products:any) => {
        this.items = products;
      },
      error: (error) => {
        this.message = 'Error al cargar los productos';
        this.type = 'error';
        this.isCorrect = true;
        setTimeout(() => {
          this.message = '';
          this.type = '';
          this.isCorrect = false;
        }, 5000);
      },
    });
  }

  constructor(private reportService: ReportService, private router: Router, private productService: ProductService) {

  }

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

  onSubmit() {
    this.form.get('dateinitial')?.enable();
    this.form.get('datefinal')?.enable();
    if(this.form.valid) {
      const report = this.form.value as unknown as Report;
      console.log(report);
      this.reportService.createReport(report).subscribe({
        next: (response) => {
          this.message = 'Reporte creado correctamente';
          this.type = 'success';
          this.isCorrect = true;
          setTimeout(() => {
            this.message = '';
            this.type = '';
            this.isCorrect = false;
          }, 5000);
          this.form.reset();
        },
        error: (error) => {
          console.error(error);
        },
      });
    } else {
      this.message = 'Por favor, llene todos los campos';
      this.type = 'warning';
      this.isCorrect = true;
      setTimeout(() => {
        this.message = '';
        this.type = '';
        this.isCorrect = false;
      }, 5000);
      this.form.markAllAsTouched();
    }
    if(this.isToday) {
      this.form.get('dateinitial')?.disable();
      this.form.get('datefinal')?.disable();
    }
  }

  setWindow(pasare: string) {
    localStorage.setItem('window', pasare);
    this.router.navigate(["dashboard",pasare]);
  
  }
}
