import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  getUser(user: any) {
    return this._http.post(this.apiUrl+"/api/login", user);
  }

  constructor() { }
}
