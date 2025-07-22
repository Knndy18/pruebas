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

  // Test de conexión
  testConnection(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/test/`)
      .pipe(catchError(this.handleError));
  }

  // Métodos para empleados
  getEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/empleados/`)
      .pipe(catchError(this.handleError));
  }

  createEmpleado(empleado: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/empleados/`, empleado)
      .pipe(catchError(this.handleError));
  }

  updateEmpleado(id: number, empleado: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/empleados/${id}/`, empleado)
      .pipe(catchError(this.handleError));
  }

  deleteEmpleado(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/empleados/${id}/`)
      .pipe(catchError(this.handleError));
  }

  // Métodos para productos
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/productos/`)
      .pipe(catchError(this.handleError));
  }

  createProducto(producto: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/productos/`, producto)
      .pipe(catchError(this.handleError));
  }

  updateProducto(id: number, producto: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/productos/${id}/`, producto)
      .pipe(catchError(this.handleError));
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/productos/${id}/`)
      .pipe(catchError(this.handleError));
  }

  // Métodos para servicios
  getServicios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/servicios/`)
      .pipe(catchError(this.handleError));
  }

  createServicio(servicio: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/servicios/`, servicio)
      .pipe(catchError(this.handleError));
  }

  updateServicio(id: number, servicio: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/servicios/${id}/`, servicio)
      .pipe(catchError(this.handleError));
  }

  deleteServicio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/servicios/${id}/`)
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
