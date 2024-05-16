import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ToastComponent } from '../toast/toast.component';
import { isEmpty } from 'rxjs';
import { ReportService } from '../../services/report.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-spent',
  standalone: true,
  imports: [NgxCurrencyDirective, ToastComponent],
  templateUrl: './add-spent.component.html',
  styleUrl: './add-spent.component.scss',
})
export class AddSpentComponent {
  spent: any[] = [{ date: '', amount: 0, description: '' }];
  today = new Date().toISOString().split('T')[0];
  amountModel = '';
  isCompleted = false;
  isToday = false;
  message = '';
  type = '';

  formatAmount() {
    let amount = Number(this.amountModel.replace(/\D/g, ''));
    this.amountModel = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(amount);
  }

  constructor(private spentService: ReportService,private router: Router) {}

  isTodayDate(event: any, index: number) {
    let input = document.querySelector('#inputDate'+index) as HTMLInputElement;
    let input2 = document.querySelector('#movilDate'+index) as HTMLInputElement;
    const today = new Date();
    if (event.target.checked) {
      this.spent[index].date = today.toISOString().split('T')[0];
      input.disabled = true;
      input2.disabled = true;
      input.value = today.toISOString().split('T')[0];
      input2.value = today.toISOString().split('T')[0];
    } else {
      this.spent[index].date = '';
      input.disabled = false;
      input2.disabled = false;
      input.value = '';
      input2.value = '';
    }
  }

  addSpent() {
    this.spent.push({ date: '', amount: 0, description: '' });
  }

  removeSpent(index: number) {
    this.spent.splice(index, 1);
  }

  getTotalAmount() {
    let total: number = 0;
    this.spent.forEach((spent) => {
      total += Number(spent.amount);
    });

    // Formatear el total como una cantidad en pesos
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(total);
  }

  setAmount(event: any, index: number) {
    this.spent[index].amount = event.target.value;
    
  }

  setDate(event: any, index: number) {
    this.spent[index].date = event.target.value;
  }

  setDescription(event: any, index: number) {
    this.spent[index].description = event.target.value;
  }

  submit() {
    if (this.spent.length === 0) {
      this.isCompleted = false;
      this.message = 'Debe agregar al menos un gasto';
      this.type = 'error';
      return;
    } else if (
      this.spent.some(
        (spent) =>
          spent.amount === 0 || spent.date === '' || spent.description === ''
      )
    ) {
      console.log(this.spent);
      this.isCompleted = false;
      this.message = 'Debe llenar todos los campos';
      this.type = 'warning';
      this.isCompleted = true;
      setTimeout(() => {
        this.isCompleted = false;
      }, 3000);
    } else if (this.spent.length > 0) {
      this.isCompleted = true;
      this.message = 'Gastos agregados correctamente';
      this.type = 'success';
      this.spentService.createSpent(this.spent).subscribe((res) => {
        setTimeout(() => {
          this.isCompleted = false;
        }, 3000);
      });
    this.clearSpent();
    }
    setTimeout(() => {
      this.isCompleted = false;
    }, 3000);
  }

  setWindow(parsedWindow: any) {
    localStorage.setItem('window', parsedWindow);
    //this.router.navigate(['dashboard', parsedWindow]);
  }

  clearSpent() {
    this.spent = [];
    this.spent.push({ date: '', amount: 0, description: '' });
    let count = 0;
    for(let i = 0; i < this.spent.length; i++) {
      let input = document.querySelector('#inputDate'+i) as HTMLInputElement;
      input.value = '';
      input.disabled = false;
      let checkbox = document.querySelector('#checkbox'+i) as HTMLInputElement;
      checkbox.checked = false;
      let inputAmount = document.querySelector('#inputAmount'+i) as HTMLInputElement;
      inputAmount.value = '';
      let inputDescription = document.querySelector('#inputDescription'+i) as HTMLInputElement;
      inputDescription.value = '';
    }
  
  }

  getPDF() {
    this.spentService.getPDF().subscribe((data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  getDays() {
    let days = [];
    for (let i = 0; i < this.spent.length; i++) {
      if (this.spent[i].date === '' || isNaN(Date.parse(this.spent[i].date))) {
        continue;
      }
      let [year, month, day] = this.spent[i].date.split('-').map(Number);
      let date = new Date(year, month - 1, day);
      days.push(date);
    }
    if (days.length === 0) {
      return 'No hay días registrados aún';
    }
    days.sort((a, b) => a.getTime() - b.getTime());
    return (
      days[0].toLocaleDateString() +
      '-' +
      days[days.length - 1].toLocaleDateString()
    );
  }
}
