import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  stock: number;
  codigo_barras: string;
  fecha_creacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos/`);
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/productos/${id}/`);
  }

  createProducto(producto: Partial<Producto>): Observable<Producto> {
    return this.http.post<Producto>(`${this.baseUrl}/productos/`, producto);
  }

  updateProducto(id: number, producto: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/productos/${id}/`, producto);
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/productos/${id}/`);
  }
}
