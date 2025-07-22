import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../shared/api.service';

interface Empleado {
  id: number;
  nombre: string;
  dni: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

interface Servicio {
  id: number;
  descripcion: string;
  precio: number;
}

interface VentaProducto {
  producto: string;
  cantidad: number;
}

interface VentaServicio {
  servicio: string;
  cantidad: number;
}

interface Venta {
  empleado: string;
  productos: VentaProducto[];
  servicios: VentaServicio[];
}

@Component({
  selector: 'app-crear-venta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-venta.component.html',
  styleUrls: ['./crear-venta.component.css']
})
export class CrearVentaComponent implements OnInit {
  empleados: Empleado[] = [];
  productos: Producto[] = [];
  servicios: Servicio[] = [];

  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  loadingMessage = 'Cargando datos...';

  venta: Venta = {
    empleado: '',
    productos: [],
    servicios: []
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    this.error = null;
    this.loadingMessage = 'Cargando datos del sistema...';

    // Cargar empleados
    this.apiService.getEmpleados().subscribe({
      next: (empleados) => {
        this.empleados = empleados;
        this.cargarProductos();
      },
      error: (err) => {
        console.error('Error al cargar empleados:', err);
        this.error = 'Error al cargar empleados. Verifique que el servidor esté ejecutándose.';
        this.loading = false;
      }
    });
  }

  cargarProductos(): void {
    this.apiService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cargarServicios();
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'Error al cargar productos.';
        this.loading = false;
      }
    });
  }

  cargarServicios(): void {
    this.apiService.getServicios().subscribe({
      next: (servicios) => {
        this.servicios = servicios;
        this.loading = false;
        console.log('Datos cargados exitosamente');
      },
      error: (err) => {
        console.error('Error al cargar servicios:', err);
        this.error = 'Error al cargar servicios.';
        this.loading = false;
      }
    });
  }

  agregarProducto(): void {
    this.venta.productos.push({
      producto: '',
      cantidad: 1
    });
  }

  eliminarProducto(index: number): void {
    this.venta.productos.splice(index, 1);
  }

  agregarServicio(): void {
    this.venta.servicios.push({
      servicio: '',
      cantidad: 1
    });
  }

  eliminarServicio(index: number): void {
    this.venta.servicios.splice(index, 1);
  }

  incrementQuantity(tipo: 'producto' | 'servicio', index: number): void {
    if (tipo === 'producto') {
      this.venta.productos[index].cantidad++;
    } else {
      this.venta.servicios[index].cantidad++;
    }
  }

  decrementQuantity(tipo: 'producto' | 'servicio', index: number): void {
    if (tipo === 'producto' && this.venta.productos[index].cantidad > 1) {
      this.venta.productos[index].cantidad--;
    } else if (tipo === 'servicio' && this.venta.servicios[index].cantidad > 1) {
      this.venta.servicios[index].cantidad--;
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  calcularSubtotalProducto(ventaProducto: VentaProducto): number {
    const producto = this.productos.find(p => p.id.toString() === ventaProducto.producto);
    if (!producto) return 0;
    return producto.precio * ventaProducto.cantidad;
  }

  calcularSubtotalServicio(ventaServicio: VentaServicio): number {
    const servicio = this.servicios.find(s => s.id.toString() === ventaServicio.servicio);
    if (!servicio) return 0;
    return servicio.precio * ventaServicio.cantidad;
  }

  calcularTotalProductos(): number {
    return this.venta.productos.reduce((total, producto) => {
      return total + this.calcularSubtotalProducto(producto);
    }, 0);
  }

  calcularTotalServicios(): number {
    return this.venta.servicios.reduce((total, servicio) => {
      return total + this.calcularSubtotalServicio(servicio);
    }, 0);
  }

  calcularTotal(): number {
    return this.calcularTotalProductos() + this.calcularTotalServicios();
  }

  isFormValid(): boolean {
    if (!this.venta.empleado) return false;
    if (this.venta.productos.length === 0 && this.venta.servicios.length === 0) return false;
    
    // Verificar que todos los productos tengan selección
    const productosValidos = this.venta.productos.every(p => p.producto && p.cantidad > 0);
    const serviciosValidos = this.venta.servicios.every(s => s.servicio && s.cantidad > 0);
    
    return productosValidos && serviciosValidos;
  }

  resetForm(): void {
    this.venta = {
      empleado: '',
      productos: [],
      servicios: []
    };
    this.error = null;
    this.successMessage = null;
  }

  registrarVenta(): void {
    if (!this.isFormValid()) {
      this.error = 'Por favor complete todos los campos requeridos.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.loadingMessage = 'Procesando venta...';

    // Preparar datos para el backend
    const ventaData = {
      empleado: parseInt(this.venta.empleado),
      productos: this.venta.productos.map(p => ({
        producto: parseInt(p.producto),
        cantidad: p.cantidad
      })),
      servicios: this.venta.servicios.map(s => ({
        servicio: parseInt(s.servicio),
        cantidad: s.cantidad
      }))
    };

    this.apiService.crearVenta(ventaData).subscribe({
      next: (response) => {
        console.log('Venta registrada exitosamente:', response);
        this.loading = false;
        this.successMessage = `Venta registrada exitosamente. Total: ${this.formatCurrency(this.calcularTotal())}`;
        // Opcional: resetear el formulario después de un tiempo
        setTimeout(() => {
          this.resetForm();
        }, 3000);
      },
      error: (err) => {
        console.error('Error al registrar venta:', err);
        this.error = 'Error al registrar la venta. Por favor intente de nuevo.';
        this.loading = false;
      }
    });
  }
}
