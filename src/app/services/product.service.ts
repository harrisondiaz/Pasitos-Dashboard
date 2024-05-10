import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = environment.backend.url;

  getAll() {
    return this._http
      .get<Product[]>(this.apiUrl + '/products')
      .pipe((res) => res);
  }

  getById(id: number) {
    return this._http
      .get<Product>(this.apiUrl + '/products/' + id)
      .pipe((res) => res);
  }

  getProviders() {
    return this._http.get(this.apiUrl + '/provider/names').pipe((res) => res);
  }

  create(product: Product) {
    return this._http
      .post(this.apiUrl + '/products', product)
      .pipe((res) => res);
  }

  delete(id: number) {
    return this._http
      .delete(this.apiUrl + '/products/' + id)
      .pipe((res) => res);
  }

  update(product: Product) {
    return this._http
      .put(this.apiUrl + '/products/' + product.id, product)
      .pipe((res) => res);
  }

  constructor() {}
}
