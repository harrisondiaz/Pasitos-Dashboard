import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private readonly _http = inject(HttpClient);
  private readonly apiUrl = environment.backend.url;

  getClient(){
    return this._http.get(this.apiUrl+"/api/client");
  }

  constructor() { }
}
