import { Component } from '@angular/core';
import { AddSpentComponent } from "../add-spent/add-spent.component";
import { ReportService } from '../../services/report.service';

@Component({
    selector: 'app-spent',
    standalone: true,
    templateUrl: './spent.component.html',
    styleUrl: './spent.component.scss',
    imports: [AddSpentComponent]
})
export class SpentComponent {

  spent=0;

  setWindow(parsedWindow: any) {
    localStorage.setItem('window', parsedWindow)
  }

  getPDF() {
    this.spentService.getPDF().subscribe((data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  constructor(private spentService: ReportService) { }

}
