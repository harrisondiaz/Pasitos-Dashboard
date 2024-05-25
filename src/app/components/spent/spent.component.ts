import { Component } from '@angular/core';
import { AddSpentComponent } from '../add-spent/add-spent.component';
import { ReportService } from '../../services/report.service';
import { SearchAdvanceSpentComponent } from '../search-advance-spent/search-advance-spent.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-spent',
  standalone: true,
  templateUrl: './spent.component.html',
  styleUrl: './spent.component.scss',
  imports: [AddSpentComponent, SearchAdvanceSpentComponent, ToastModule],
})
export class SpentComponent {
  spent = 0;

  spentArray: any[] = [];

  setWindow(parsedWindow: any) {
    localStorage.setItem('window', parsedWindow);
  }

  getPDF() {
    this.messageService.add({
      severity: 'info',
      summary: 'Descargando PDF...',
    });
    this.spentService.getAll().subscribe(
      (data: any) => {
        this.spentArray = data;
        if (this.spentArray.length === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No hay gastos registrados',
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'PDF generado correctamente',
          });
          this.spentService.getPDF().subscribe((data) => {
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url);
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo generar el PDF',
        });
      }
    );
  }

  getLastYear() {
    this.messageService.add({
      severity: 'info',
      summary: 'Descargando PDF...',
    });

    let today = new Date();
    let lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    // Asegúrate de formatear las fechas al formato que tu servicio espera
    let formattedToday = today.toISOString().split('T')[0];
    let formattedLastYear = lastYear.toISOString().split('T')[0];

    this.spentService
      .getSpentbyDate(formattedLastYear, formattedToday)
      .subscribe(
        (data: any) => {
          this.spentArray = data;
          if (this.spentArray.length === 0) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No hay gastos registrados',
            });
          } else {
            this.messageService.add({
              severity: 'success',
              summary: 'PDF generado correctamente',
            });
            this.spentService.getLastYear().subscribe((data) => {
              const blob = new Blob([data], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              window.open(url);
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo generar el PDF',
          });
        }
      );
  }

  getLastMonth() {
    this.messageService.add({
      severity: 'info',
      summary: 'Descargando PDF...',
    });
    let today = new Date();
    let lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Asegúrate de formatear las fechas al formato que tu servicio espera
    let formattedToday = today.toISOString().split('T')[0];
    let formattedLastMonth = lastMonth.toISOString().split('T')[0];

    this.spentService
      .getSpentbyDate(formattedLastMonth, formattedToday)
      .subscribe(
        (data: any) => {
          this.spentArray = data;
          if (this.spentArray.length === 0) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No hay gastos registrados',
            });
          } else {
            this.messageService.add({
              severity: 'success',
              summary: 'PDF generado correctamente',
            });
            this.spentService.getLastMonth().subscribe((data) => {
              const blob = new Blob([data], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              window.open(url);
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo generar el PDF',
          });
        }
      );
  }

  getLastWeek() {
    this.messageService.add({
      severity: 'info',
      summary: 'Descargando PDF...',
    });

    let today = new Date();
    let lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Asegúrate de formatear las fechas al formato que tu servicio espera
    let formattedToday = today.toISOString().split('T')[0];
    let formattedLastWeek = lastWeek.toISOString().split('T')[0];

    this.spentService
      .getSpentbyDate(formattedLastWeek, formattedToday)
      .subscribe((data: any) => {
        this.spentArray = data;
        if (this.spentArray.length === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No hay gastos registrados',
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'PDF generado correctamente',
          });
          this.spentService.getLasWeek().subscribe(
            (data) => {
              const blob = new Blob([data], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              window.open(url);
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo generar el PDF',
              });
            }
          );
        }
      });
  }

  constructor(
    private spentService: ReportService,
    private messageService: MessageService
  ) {}
}
