import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  getAll() {
    return this._http.get(this.apiUrl+"/product");
  }

  

  constructor() { }
}
