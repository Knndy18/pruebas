import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'empleados', loadComponent: () => import('./empleados/empleados.component').then(m => m.EmpleadosComponent) },
  { path: 'productos', loadComponent: () => import('./productos/productos.component').then(m => m.ProductosComponent) },
  { path: 'servicios', loadComponent: () => import('./servicios/servicios.component').then(m => m.ServiciosComponent) },
  { path: 'ventas', loadComponent: () => import('./ventas/ventas.component').then(m => m.VentasComponent) },
  { path: 'crear-venta', loadComponent: () => import('./crear-venta/crear-venta.component').then(m => m.CrearVentaComponent) },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
