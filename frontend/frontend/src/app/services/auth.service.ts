import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  nombre: string;
  rol: string;
  correo: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar si hay un token almacenado al inicializar el servicio
    const token = this.getToken();
    if (token) {
      this.loadUserProfile();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login/`, credentials)
      .pipe(
        tap(response => {
          // Guardar tokens y usuario en localStorage
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          localStorage.setItem('current_user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post(`${this.baseUrl}/auth/logout/`, { refresh: refreshToken })
      .pipe(
        tap(() => {
          this.clearLocalStorage();
        })
      );
  }

  private clearLocalStorage(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post(`${this.baseUrl}/auth/refresh/`, { refresh: refreshToken })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('access_token', response.access);
        })
      );
  }

  loadUserProfile(): void {
    const token = this.getToken();
    if (!token) {
      this.clearLocalStorage();
      return;
    }

    this.http.get<any>(`${this.baseUrl}/auth/profile/`)
      .subscribe({
        next: (profile) => {
          const user: User = {
            id: profile.user?.id || profile.id,
            username: profile.user?.username || profile.username,
            nombre: profile.nombre,
            rol: profile.rol,
            correo: profile.correo
          };
          this.currentUserSubject.next(user);
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
          this.clearLocalStorage();
        }
      });
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.rol === 'admin';
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.rol === role;
  }
}
