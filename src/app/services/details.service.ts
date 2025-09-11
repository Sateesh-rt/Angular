import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  constructor(private http:HttpClient) { }
 private baseUrl = 'http://localhost:8087/api/Bank';
 private baseurll = 'http://localhost:8087/api/user';


  addBankDetails(bankDetails: any, userId: number) {
    return this.http.post(`${this.baseUrl}/add/${userId}`, bankDetails);
  }
  getBankDetails(userId: number) : Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }
  getUserDetails(userId: number): Observable<any> {
    return this.http.get(`${this.baseurll}/${userId}`);
  }
  updateUserDetails(userId: number, userDetails: any): Observable<any> {
    return this.http.put(`${this.baseurll}/update/${userId}`, userDetails);
  }
  updateBankDetails(bankId: number, bankDetails: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${bankId}`, bankDetails);
  }
   deleteUserDetails(userId: number): Observable<any> {
    return this.http.delete(`${this.baseurll}/delete/${userId}`);
  } 
  deleteBankDetails(bankId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${bankId}`);
  } 

}
