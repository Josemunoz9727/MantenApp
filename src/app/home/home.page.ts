import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, carSportOutline } from 'ionicons/icons';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { MantencionItemComponent } from '../components/mantencion-item/mantencion-item.component';
import { Mantencion } from '../models/mantencion.model';
import { MantencionService } from '../services/mantencion.service';

/**
 * Página principal: lista las mantenciones, permite buscar, editar y eliminar.
 * No toca los datos directamente; delega todo en MantencionService.
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrl: 'home.page.scss',
  imports: [
    AsyncPipe,
    CurrencyPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonFab,
    IonFabButton,
    IonIcon,
    MantencionItemComponent,
  ],
})
export class HomePage {
  private readonly servicio = inject(MantencionService);
  private readonly router = inject(Router);
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);

  private readonly termino$ = new BehaviorSubject<string>('');

  /** Lista filtrada + total gastado; la vista la consume con AsyncPipe. */
  readonly vm$ = combineLatest([this.servicio.mantenciones$, this.termino$]).pipe(
    map(([lista, termino]) => {
      const t = termino.trim().toLowerCase();
      const filtradas = t
        ? lista.filter((m) =>
            [m.vehiculo, m.tipo, m.notas ?? ''].some((campo) => campo.toLowerCase().includes(t))
          )
        : lista;
      return {
        mantenciones: filtradas,
        hayRegistros: lista.length > 0,
        totalGastado: filtradas.reduce((suma, m) => suma + m.costo, 0),
      };
    })
  );

  constructor() {
    addIcons({ add, carSportOutline });
  }

  buscar(evento: Event): void {
    const valor = (evento as CustomEvent).detail.value as string | null | undefined;
    this.termino$.next(valor ?? '');
  }

  nueva(): void {
    this.router.navigate(['/nueva']);
  }

  editar(m: Mantencion): void {
    this.router.navigate(['/editar', m.id]);
  }

  /** Pide confirmación antes de la acción destructiva. */
  async confirmarEliminar(m: Mantencion): Promise<void> {
    const alerta = await this.alertCtrl.create({
      header: 'Eliminar mantención',
      message: `¿Seguro que quieres eliminar "${m.tipo}" de ${m.vehiculo}? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.servicio.eliminar(m.id).subscribe(async () => {
              const toast = await this.toastCtrl.create({
                message: 'Mantención eliminada',
                duration: 1800,
                position: 'bottom',
              });
              await toast.present();
            });
          },
        },
      ],
    });
    await alerta.present();
  }
}
