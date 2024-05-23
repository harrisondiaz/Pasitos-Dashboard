import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ReportService } from '../../services/report.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-search-advance-spent',
  standalone: true,
  templateUrl: './search-advance-spent.component.html',
  styleUrl: './search-advance-spent.component.scss',
  imports: [ToastModule],
})
export class SearchAdvanceSpentComponent {
  isTable = false;
  spent: any[] = [];
  
  today = new Date().toISOString().split('T')[0];
  initDate = '';
  minDate = '2001-01-01';

  constructor(private spentService: ReportService, private messageService: MessageService) {}

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
      this.messageService.add({ severity: 'info', summary: 'Buscando gastos', detail: 'Por favor, espere un momento' });
      this.spentService
        .getSpentbyDate(initday, finaldate)
        .subscribe((data: any) => {
          this.spent = data;
          if (this.spent.length === 0) {
            this.messageService.add({ severity: 'warning', summary: 'Advertencia', detail: 'No se encontraron gastos en el rango de fechas seleccionado' });
          } else {
            this.isTable = true;
            this.messageService.add({ severity: 'success', summary: 'Gastos encontrados', detail: 'Gastos encontrados correctamente' });
          }
        });
    } else {
      this.messageService.add({ severity: 'warning', summary: 'Advertencia', detail: 'Por favor, seleccione una fecha de inicio y una fecha final' });
    }
  }

  getPDF() {
    let initday = (document.querySelector('#initday') as HTMLInputElement)
      .value;
    let finaldate = (document.querySelector('#finaldate') as HTMLInputElement)
      .value;

    if (initday !== '' && finaldate !== '') {
      this.messageService.add({ severity: 'info', summary: 'Generando PDF', detail: 'Por favor, espere un momento' });
      this.spentService
        .getSpentbyDate(initday, finaldate)
        .subscribe((data: any) => {
          this.spent = data;
          if (this.spent.length === 0) {
            this.messageService.add({ severity: 'warning', summary: 'Advertencia', detail: 'No se encontraron gastos en el rango de fechas seleccionado' });
          } else {
            this.spentService
              .getSpentPDFbyDate(initday, finaldate)
              .subscribe((data) => {
                this.messageService.add({ severity: 'success', summary: 'PDF generado', detail: 'PDF generado correctamente' });
                const blob = new Blob([data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                window.open(url);
              });
          }
        });
    } else {
      this.messageService.add({ severity: 'warning', summary: 'Advertencia', detail: 'Por favor, seleccione una fecha de inicio y una fecha final' });
    }
  }
}
