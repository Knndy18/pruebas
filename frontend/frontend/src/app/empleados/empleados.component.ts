import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmpleadosComponent implements OnInit {
  empleados: any[] = [];
  loading = false;
  guardando = false;
  error: string | null = null;
  mostrarFormulario = false;
  empleadoForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.empleadoForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['empleado', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

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

  agregarEmpleado(): void {
    if (this.empleadoForm.valid) {
      this.guardando = true;
      this.error = null;

      this.apiService.createEmpleado(this.empleadoForm.value).subscribe({
        next: (response) => {
          console.log('Empleado creado:', response);
          this.cargarEmpleados();
          this.cancelarFormulario();
          this.guardando = false;
        },
        error: (err) => {
          console.error('Error al crear empleado:', err);
          this.error = 'Error al crear el empleado. Verifique los datos e intente nuevamente.';
          this.guardando = false;
        }
      });
    }
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.empleadoForm.reset({
      rol: 'empleado'
    });
  }

  editarEmpleado(empleado: any): void {
    // Implementar edición de empleado
    console.log('Editar empleado:', empleado);
  }

  eliminarEmpleado(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
      this.apiService.deleteEmpleado(id).subscribe({
        next: () => {
          this.cargarEmpleados();
        },
        error: (err) => {
          console.error('Error al eliminar empleado:', err);
          this.error = 'Error al eliminar el empleado.';
        }
      });
    }
  }
}
