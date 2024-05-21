import { Component } from '@angular/core';
import { ToastComponent } from '../toast/toast.component';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-search-advance-spent',
  standalone: true,
  templateUrl: './search-advance-spent.component.html',
  styleUrl: './search-advance-spent.component.scss',
  imports: [ToastComponent],
})
export class SearchAdvanceSpentComponent {
  isTable = false;
  spent: any[] = [];
  isToast = false;
  message = '';
  type = '';
  today = new Date().toISOString().split('T')[0];
  initDate = '';
  minDate = '2001-01-01';

  constructor(private spentService: ReportService) {}

  ngOnInit() {}

  setDate(event: any) {
    let initDate = document.querySelector('#initday') as HTMLInputElement;

    if (initDate) {
      this.initDate = initDate.value;
    }
  }

  setToday(event: any) {
    let input = document.querySelector('#initday') as HTMLInputElement;
    let input2 = document.querySelector('#finaldate') as HTMLInputElement;

    if (input && input2) {
      if (event.target.checked) {
        let today = new Date().toISOString().split('T')[0];
        input.value = today;
        input2.value = today;
        input.disabled = true;
        input2.disabled = true;
      } else {
        input.value = '';
        input2.value = '';
        input.disabled = false;
        input2.disabled = false;
      }
    } else {
      console.error('Elements with id #inputDate or #finaldate not found');
    }
  }

  searchSpent() {
    let initday = (document.querySelector('#initday') as HTMLInputElement)
      .value;
    let finaldate = (document.querySelector('#finaldate') as HTMLInputElement)
      .value;

    if (initday !== '' && finaldate !== '') {
      this.message = 'Buscando gastos...';
      this.type = 'load';
      this.isToast = true;
      setTimeout(() => {
        this.isToast = false;
      }, 3000);
      this.spentService
        .getSpentbyDate(initday, finaldate)
        .subscribe((data: any) => {
          this.spent = data;
          if (this.spent.length === 0) {
            this.message =
              'No se encontraron gastos en el rango de fechas seleccionado';
            this.type = 'warning';
            this.isToast = true;
            setTimeout(() => {
              this.isToast = false;
            }, 3000);
          } else {
            this.isTable = true;
            this.message = 'Gastos encontrados';
            this.type = 'success';
            this.isToast = true;
            setTimeout(() => {
              this.isToast = false;
            }, 3000);
          }
        });
    } else {
      this.message =
        '!Por favor, seleccione una fecha de inicio y una fecha final!';
      this.type = 'warning';
      this.isToast = true;
      setTimeout(() => {
        this.isToast = false;
      }, 3000);
    }
  }

  getPDF() {
    let initday = (document.querySelector('#initday') as HTMLInputElement)
      .value;
    let finaldate = (document.querySelector('#finaldate') as HTMLInputElement)
      .value;

    if (initday !== '' && finaldate !== '') {
      this.message = 'Generando PDF...';
      this.type = 'load';
      this.isToast = true;
      setTimeout(() => {
        this.isToast = false;
      }, 3000);
      this.spentService
        .getSpentbyDate(initday, finaldate)
        .subscribe((data: any) => {
          this.spent = data;
          if (this.spent.length === 0) {
            this.message =
              'No se encontraron gastos en el rango de fechas seleccionado';
            this.type = 'warning';
            this.isToast = true;
            setTimeout(() => {
              this.isToast = false;
            }, 3000);
          } else {
            this.spentService
              .getSpentPDFbyDate(initday, finaldate)
              .subscribe((data) => {
                const blob = new Blob([data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                window.open(url);
              });
          }
        });
    } else {
      this.message =
        '!Por favor, seleccione una fecha de inicio y una fecha final!';
      this.type = 'warning';
      this.isToast = true;
      setTimeout(() => {
        this.isToast = false;
      }, 3000);
    }
  }
}
