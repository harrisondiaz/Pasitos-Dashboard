import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Report } from '../interfaces/report.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly _http = inject(HttpClient);
  private readonly url = environment.backend.url;

  createReport(report: Report) {
    return this._http.post(this.url + '/reports', report).pipe(res => res);
  }

  getAll() {
    return this._http.get<Report[]>(this.url + '/reports').pipe(res => res);
  }


  constructor() { }
}
