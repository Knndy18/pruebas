import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../shared/api.service';

interface Servicio {
  id: number;
  descripcion: string;
  precio: number;
}

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css'] // opcional
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.loading = true;
    this.error = null;
    
    this.apiService.getServicios().subscribe({
      next: (data) => {
        this.servicios = data;
        this.loading = false;
        console.log('Servicios cargados:', this.servicios);
      },
      error: (err) => {
        console.error('Error al cargar servicios:', err);
        this.error = 'No se pudieron cargar los servicios. Verifique que el servidor esté ejecutándose.';
        this.loading = false;
      }
    });
  }

  reloadServicios(): void {
    this.cargarServicios();
  }

  formatCurrency(amount: number | string): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(numAmount);
  }

  getPrecioPromedio(): number {
    if (this.servicios.length === 0) return 0;
    const total = this.servicios.reduce((sum, servicio) => sum + servicio.precio, 0);
    return total / this.servicios.length;
  }
}
