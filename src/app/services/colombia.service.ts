import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';
import { ColombiaData } from '../interfaces/colombia.interface';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ColombiaService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<ColombiaData[]> {
    return this.http
      .get('assets/Departamentos_y_municipios_de_Colombia_20240420.csv', {
        responseType: 'text',
      })
      .pipe(
        map((data) => {
          let parsedData: ColombiaData[] = [];
          Papa.parse(data, {
            header: true,
            complete: (results: { data: ColombiaData[] }) => {
              parsedData = results.data;
            },
          });
          return parsedData;
        })
      );
  }
}
