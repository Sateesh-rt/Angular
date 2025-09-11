import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8087/api/products';
  // private addurl='http://localhost:9090/api/products/add';

 
  constructor(private http: HttpClient) {}

   getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/${"getProducts"}`);
  }
      
 addProduct(product: any) {
  return this.http.post(`${this.baseUrl}/${"addProducts"}`, product);
}


  updateProduct(id: number, productData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/update/${id}`, productData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  getProductById(id: number): Observable<Product> {
  return this.http.get<Product>(`${this.baseUrl}/${id}`);
}
}



