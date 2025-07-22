import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../shared/api.service';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'] // opcional
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    this.error = null;
    
    this.apiService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading = false;
        console.log('Productos cargados:', this.productos);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'No se pudieron cargar los productos. Verifique que el servidor esté ejecutándose.';
        this.loading = false;
      }
    });
  }

  reloadProductos(): void {
    this.cargarProductos();
  }

  formatCurrency(amount: number | string): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(numAmount);
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'low';
    if (stock < 10) return 'medium';
    return 'high';
  }

  getStockStatus(stock: number): string {
    if (stock === 0) return 'Agotado';
    if (stock < 10) return 'Bajo';
    if (stock < 50) return 'Medio';
    return 'Alto';
  }

  getStockLevel(stock: number): string {
    if (stock === 0) return 'Sin stock';
    if (stock < 10) return 'Stock crítico';
    if (stock < 50) return 'Stock moderado';
    return 'Stock abundante';
  }

  getStockPercentage(stock: number): number {
    // Calculamos un porcentaje basado en un máximo estimado de 100 unidades
    const maxStock = 100;
    return Math.min((stock / maxStock) * 100, 100);
  }

  getTotalStock(): number {
    return this.productos.reduce((total, producto) => total + producto.stock, 0);
  }

  getValorTotal(): number {
    return this.productos.reduce((total, producto) => total + (producto.precio * producto.stock), 0);
  }

  getProductosBajoStock(): number {
    return this.productos.filter(producto => producto.stock < 10).length;
  }
}
