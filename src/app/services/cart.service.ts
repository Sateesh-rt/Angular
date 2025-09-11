import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8087/api/cart';

  constructor(private http: HttpClient) {}

  addToCart(userId: number, cart:any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add/${userId}`, cart);
  }

  getCart(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${userId}`);
  }

  getCartItems(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/${userId}/items`);
}


removeItem(cartItemId: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/delete/${cartItemId}`, { responseType: 'text' });
}
}
