import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { MantencionInput, TIPOS_MANTENCION } from '../models/mantencion.model';
import { MantencionService } from '../services/mantencion.service';

/** Validador propio: la fecha no puede ser posterior a hoy. */
function fechaNoFutura(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor) return null;
  const hoy = new Date().toISOString().slice(0, 10);
  return valor > hoy ? { fechaFutura: true } : null;
}

/** Página con Reactive Forms para crear o editar (según la ruta). */
@Component({
  selector: 'app-form',
  templateUrl: 'form.page.html',
  styleUrl: 'form.page.scss',
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonNote,
    IonButton,
  ],
})
export class FormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly servicio = inject(MantencionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastCtrl = inject(ToastController);

  readonly tipos = TIPOS_MANTENCION;
  readonly hoy = new Date().toISOString().slice(0, 10);
  private idEdicion: string | null = null;

  readonly form = this.fb.nonNullable.group({
    vehiculo: ['', [Validators.required, Validators.minLength(3)]],
    tipo: ['', [Validators.required]],
    fecha: [this.hoy, [Validators.required, fechaNoFutura]],
    kilometraje: ['', [Validators.required, Validators.min(0)]],
    costo: ['', [Validators.required, Validators.min(0)]],
    notas: ['', [Validators.maxLength(200)]],
  });

  get esEdicion(): boolean {
    return this.idEdicion !== null;
  }

  ngOnInit(): void {
    this.idEdicion = this.route.snapshot.paramMap.get('id');
    if (this.idEdicion) {
      this.servicio.obtenerPorId(this.idEdicion).subscribe((m) => {
        if (!m) {
          this.router.navigate(['/home']);
          return;
        }
        this.form.patchValue({
          vehiculo: m.vehiculo,
          tipo: m.tipo,
          fecha: m.fecha,
          kilometraje: String(m.kilometraje),
          costo: String(m.costo),
          notas: m.notas ?? '',
        });
      });
    }
  }

  /** Muestra el error de un campo solo después de que el usuario lo tocó. */
  mostrarError(campo: string, error: string): boolean {
    const c = this.form.get(campo);
    return !!c && c.touched && c.hasError(error);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const datos: MantencionInput = {
      vehiculo: v.vehiculo.trim(),
      tipo: v.tipo as MantencionInput['tipo'],
      fecha: v.fecha,
      kilometraje: Number(v.kilometraje),
      costo: Number(v.costo),
      notas: v.notas.trim() || undefined,
    };

    const operacion$ = this.idEdicion
      ? this.servicio.editar(this.idEdicion, datos)
      : this.servicio.crear(datos);

    operacion$.subscribe(async () => {
      const toast = await this.toastCtrl.create({
        message: this.esEdicion ? 'Mantención actualizada' : 'Mantención guardada',
        duration: 1800,
        color: 'success',
      });
      await toast.present();
      this.router.navigate(['/home']);
    });
  }
}
