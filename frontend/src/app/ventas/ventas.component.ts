import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../shared/api.service';
import { RouterModule } from '@angular/router';

interface DetalleProducto {
  id: number;
  producto_nombre: string;
  producto_precio: string;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
}

interface DetalleServicio {
  id: number;
  servicio_nombre: string;
  servicio_descripcion: string;
  servicio_precio: string;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
  detalle?: string;
}

interface Venta {
  id: number;
  fecha: string;
  empleado_nombre?: string;
  total: string;
  detalles_productos?: DetalleProducto[];
  detalles_servicios?: DetalleServicio[];
}

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  ventas: Venta[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.loading = true;
    this.error = null;
    
    this.apiService.getVentas().subscribe({
      next: (data) => {
        this.ventas = data;
        this.loading = false;
        console.log('Ventas cargadas:', this.ventas);
      },
      error: (err) => {
        console.error('Error al cargar ventas:', err);
        this.error = 'No se pudieron cargar las ventas. Verifique que el servidor esté ejecutándose.';
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: string | number): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(numAmount);
  }

  getEmpleadoInitials(nombre: string): string {
    if (!nombre) return '?';
    const words = nombre.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return nombre[0].toUpperCase();
  }

  getTotalItems(venta: Venta): number {
    const productosCount = venta.detalles_productos?.length || 0;
    const serviciosCount = venta.detalles_servicios?.length || 0;
    return productosCount + serviciosCount;
  }

  reloadVentas(): void {
    this.cargarVentas();
  }
}
