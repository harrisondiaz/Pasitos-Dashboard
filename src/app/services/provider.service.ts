import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Provider } from '../interfaces/provider.interface';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = environment.backend.url;
  
  getAll() {
    return this._http.get<Provider[]>(this.apiUrl + '/providers').pipe(res => res);
  }
  
  // Add the rest of the CRUD methods here
  // For example, the create method:
  create(provider: Provider) {
    return this._http.post<Provider>(this.apiUrl + '/providers', provider);
  }

  delete(provider: Provider) {
    return this._http.delete<Provider>(this.apiUrl + '/providers/' + provider._id);
  }

  constructor() { }
}
