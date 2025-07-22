import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  duracion_estimada: string;
  disponible: boolean;
  fecha_creacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.baseUrl}/servicios/`);
  }

  getServicio(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.baseUrl}/servicios/${id}/`);
  }

  createServicio(servicio: Partial<Servicio>): Observable<Servicio> {
    return this.http.post<Servicio>(`${this.baseUrl}/servicios/`, servicio);
  }

  updateServicio(id: number, servicio: Partial<Servicio>): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.baseUrl}/servicios/${id}/`, servicio);
  }

  deleteServicio(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/servicios/${id}/`);
  }
}
