import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



export interface User {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
}
export interface LoginRequest {
  name: string;
  password: string;
  role: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
private baseUrl = 'http://localhost:8087/api/user';
  constructor(private http:HttpClient) { }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, user);
  }
   loginUser(loginData: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, loginData);
  }

  
}
