import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Manejo de errores centralizado
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Métodos para empleados
  getEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/empleados/`)
      .pipe(catchError(this.handleError));
  }

  // Métodos para productos
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/productos/`)
      .pipe(catchError(this.handleError));
  }

  // Métodos para servicios
  getServicios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/servicios/`)
      .pipe(catchError(this.handleError));
  }

  // Métodos para ventas
  getVentas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ventas/`)
      .pipe(catchError(this.handleError));
  }

  crearVenta(venta: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ventas/`, venta)
      .pipe(catchError(this.handleError));
  }
}
