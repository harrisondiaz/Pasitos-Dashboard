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

  createSpent(spent: any[]) {
    return this._http.post(this.url + '/spent', spent).pipe(res => res);
  }

  getPDF() {
    return this._http.get(this.url + '/pdf/spents', { responseType: 'blob' }).pipe(res => res);
  }

  getLastYear() { 
    return this._http.get(this.url + '/pdf/spents/lastyear', { responseType: 'blob'}).pipe(res => res);
  }

  getLastMonth() {
    return this._http.get(this.url + '/pdf/spents/lastmonth', { responseType: 'blob'}).pipe(res => res);
  }

  getLasWeek() {
    return this._http.get(this.url + '/pdf/spents/lastweek', { responseType: 'blob'}).pipe(res => res);
  }

  getSpentbyDate(date: string, date2: string) {
    return this._http.get(this.url+"/spent/"+date+"/"+date2).pipe(res => res);
  }

  getSpentPDFbyDate(date: string, date2: string) {
    return this._http.get(this.url+"/pdf/spents/filters/"+date+"/"+date2, { responseType: 'blob'}).pipe(res => res);
  }


  constructor() { }
}
