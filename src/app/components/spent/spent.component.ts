import { Component } from '@angular/core';
import { AddSpentComponent } from "../add-spent/add-spent.component";
import { ReportService } from '../../services/report.service';
import { SearchAdvanceSpentComponent } from "../search-advance-spent/search-advance-spent.component";
import { ToastComponent } from "../toast/toast.component";

@Component({
    selector: 'app-spent',
    standalone: true,
    templateUrl: './spent.component.html',
    styleUrl: './spent.component.scss',
    imports: [AddSpentComponent, SearchAdvanceSpentComponent, ToastComponent]
})
export class SpentComponent {

  spent=0;
  message = '';
  type = '';
  isToast = false;
  spentArray: any[] = [];

  setWindow(parsedWindow: any) {
    localStorage.setItem('window', parsedWindow)
  }

  getPDF() {
    this.message = 'Descargando PDF...';
    this.type = 'load';
    this.isToast = true;
    setTimeout(() => {
      this.isToast = false;
    }, 3000);
    this.spentService.getAll().subscribe((data:any) => {
      this.spentArray = data;
      if(this.spentArray.length === 0) {
        this.message = 'No hay gastos registrados';
        this.type = 'error';
        this.isToast = true;
        setTimeout(() => {
          this.isToast = false;
        }, 3000);
      } else {
        this.message = "PDF generado correctamente";
        this.type = 'success';
        this.isToast = true;
        setTimeout(() => {
          this.isToast = false;
        }, 3000);
        this.spentService.getPDF().subscribe((data) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        });
      }
    });
  }

  getLastYear() {
  this.message = 'Descargando PDF...';
  this.type = 'load';
  this.isToast = true;
  setTimeout(() => {
    this.isToast = false;
  }, 3000);

  let today = new Date();
  let lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1);

  // Asegúrate de formatear las fechas al formato que tu servicio espera
  let formattedToday = today.toISOString().split('T')[0];
  let formattedLastYear = lastYear.toISOString().split('T')[0];

  this.spentService.getSpentbyDate(formattedLastYear, formattedToday).subscribe((data:any) => {
     this.spentArray = data;
    if(this.spentArray.length === 0) {
      this.message = 'No hay gastos registrados';
      this.type = 'error';
      this.isToast = true;
      setTimeout(() => {
        this.isToast = false;
      }, 3000);
    } else {
      this.message = "PDF generado correctamente";
      this.type = 'success';
      this.isToast = true;
      setTimeout(() => {
        this.isToast = false;
      }, 3000);
      this.spentService.getLastYear().subscribe((data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      });
    }
  });
}

  getLastMonth() {
    this.message = 'Descargando PDF...';
    this.type = 'load';
    this.isToast = true;
    setTimeout(() => {
      this.isToast = false;
    }, 3000);

    let today = new Date();
    let lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Asegúrate de formatear las fechas al formato que tu servicio espera
    let formattedToday = today.toISOString().split('T')[0];
    let formattedLastMonth = lastMonth.toISOString().split('T')[0];

    this.spentService.getSpentbyDate(formattedLastMonth, formattedToday).subscribe((data:any) => {
      this.spentArray = data;
      if(this.spentArray.length === 0) {
        this.message = 'No hay gastos registrados';
        this.type = 'error';
        this.isToast = true;
        setTimeout(() => {
          this.isToast = false;
        }, 3000);
      } else {
        this.message = "PDF generado correctamente";
        this.type = 'success';
        this.isToast = true;
        setTimeout(() => {
          this.isToast = false;
        }, 3000);
        this.spentService.getLastMonth().subscribe((data) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        });
      }
    });
  }

  getLastWeek() {
    this.message = 'Descargando PDF...';
    this.type = 'load';
    this.isToast = true;
    setTimeout(() => {
      this.isToast = false;
    }, 3000);

    let today = new Date();
    let lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Asegúrate de formatear las fechas al formato que tu servicio espera
    let formattedToday = today.toISOString().split('T')[0];
    let formattedLastWeek = lastWeek.toISOString().split('T')[0];

    this.spentService.getSpentbyDate(formattedLastWeek, formattedToday).subscribe((data:any) => {
      this.spentArray = data;
      if(this.spentArray.length === 0) {
        this.message = 'No hay gastos registrados';
        this.type = 'error';
        this.isToast = true;
        setTimeout(() => {
          this.isToast = false;
        }, 3000);
      } else {
        this.message = "PDF generado correctamente";
        this.type = 'success';
        this.isToast = true;
        setTimeout(() => {
          this.isToast = false;
        }, 3000);
        this.spentService.getLasWeek().subscribe((data) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        });
      }
    });
  }

  constructor(private spentService: ReportService) { }

}
