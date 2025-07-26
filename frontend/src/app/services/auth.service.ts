import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login/`, credentials).pipe(
      map((response) => {
        if (response && response.access) {
          localStorage.setItem('access', response.access);
          localStorage.setItem('refresh', response.refresh);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
      })
    );
  }

  logout(): Observable<any> {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    return of(true);
  }

  getToken(): string | null {
    return localStorage.getItem('access');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  refreshToken(): Observable<any> {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) return of(null);
    return this.http.post<any>(`${this.apiUrl}/auth/refresh/`, { refresh }).pipe(
      map((response) => {
        if (response && response.access) {
          localStorage.setItem('access', response.access);
        }
        return response;
      })
    );
  }
}
