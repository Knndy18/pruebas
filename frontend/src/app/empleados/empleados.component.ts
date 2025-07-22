import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmpleadosComponent implements OnInit {
  empleados: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.loading = true;
    this.error = null;
    
    this.apiService.getEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar empleados:', err);
        this.error = 'No se pudieron cargar los empleados. Verifique que el servidor esté ejecutándose.';
        this.loading = false;
      }
    });
  }
}
