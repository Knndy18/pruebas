
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent), canActivate: [AuthGuard] },
  { path: 'empleados', loadComponent: () => import('./empleados/empleados.component').then(m => m.EmpleadosComponent), canActivate: [AuthGuard] },
  { path: 'productos', loadComponent: () => import('./productos/productos.component').then(m => m.ProductosComponent), canActivate: [AuthGuard] },
  { path: 'servicios', loadComponent: () => import('./servicios/servicios.component').then(m => m.ServiciosComponent), canActivate: [AuthGuard] },
  { path: 'ventas', loadComponent: () => import('./ventas/ventas.component').then(m => m.VentasComponent), canActivate: [AuthGuard] },
  { path: 'crear-venta', loadComponent: () => import('./crear-venta/crear-venta.component').then(m => m.CrearVentaComponent), canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
