import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Provider } from '../interfaces/provider.interface';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private readonly _http = inject(HttpClient);
  private readonly apiUrl = environment.backend.url;

  exportProviders(providerList: Provider[]) {
      return this._http.post(this.apiUrl + '/pdf/provider', providerList, { responseType: 'blob' });
  }

  exportProducts(productList: Product[]) {
    return this._http.post(this.apiUrl + '/pdf/product', productList, { responseType: 'blob' });
  }



  constructor() { }
}
