import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = environment.backend.url;

  getUser(user: any) {
    return this._http.post(this.apiUrl+"/api/login", user);
  }

  getName(email: string) {
    return this._http.get(this.apiUrl+"/api/users/"+email);
  }

  

  constructor() { }
}
