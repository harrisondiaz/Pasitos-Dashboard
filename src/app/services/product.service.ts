import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  getAll() {
    return this._http.get<Product[]>(this.apiUrl + '/products').pipe(res => res);
  }

  constructor() {}
}
