import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { createOutline, speedometerOutline, trashOutline } from 'ionicons/icons';
import { Mantencion } from '../../models/mantencion.model';

/**
 * Componente de presentación: solo muestra una mantención y avisa al padre
 * (con outputs) cuando el usuario quiere editarla o eliminarla.
 */
@Component({
  selector: 'app-mantencion-item',
  templateUrl: './mantencion-item.component.html',
  styleUrl: './mantencion-item.component.scss',
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
  ],
})
export class MantencionItemComponent {
  readonly mantencion = input.required<Mantencion>();
  readonly editar = output<Mantencion>();
  readonly eliminar = output<Mantencion>();

  constructor() {
    addIcons({ createOutline, trashOutline, speedometerOutline });
  }
}
