import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DetalleVenta {
  id?: number;
  producto?: number;
  servicio?: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  numero_venta: string;
  fecha: string;
  total: number;
  estado: string;
  empleado: number;
  cliente_nombre: string;
  cliente_telefono: string;
  cliente_correo: string;
  detalles: DetalleVenta[];
}

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.baseUrl}/ventas/`);
  }

  getVenta(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.baseUrl}/ventas/${id}/`);
  }

  createVenta(venta: Partial<Venta>): Observable<Venta> {
    return this.http.post<Venta>(`${this.baseUrl}/ventas/`, venta);
  }

  updateVenta(id: number, venta: Partial<Venta>): Observable<Venta> {
    return this.http.put<Venta>(`${this.baseUrl}/ventas/${id}/`, venta);
  }

  deleteVenta(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/ventas/${id}/`);
  }
}
