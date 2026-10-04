import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { Mantencion, MantencionInput } from '../models/mantencion.model';

const STORAGE_KEY = 'mantenapp.mantenciones';

const DATOS_INICIALES: Mantencion[] = [
  {
    id: 'seed-1',
    vehiculo: 'Toyota Yaris',
    tipo: 'Cambio de aceite',
    fecha: '2026-08-12',
    kilometraje: 48500,
    costo: 45000,
    notas: 'Aceite 5W-30 sintético y filtro nuevo.',
  },
  {
    id: 'seed-2',
    vehiculo: 'Toyota Yaris',
    tipo: 'Neumáticos',
    fecha: '2026-05-03',
    kilometraje: 45200,
    costo: 120000,
  },
];

/**
 * Fuente de datos de la app. Simula un backend en memoria y persiste en
 * localStorage (funciona igual en el navegador y en el WebView de Android).
 * Los componentes se suscriben a `mantenciones$` y se actualizan solos.
 */
@Injectable({ providedIn: 'root' })
export class MantencionService {
  private readonly estado$ = new BehaviorSubject<Mantencion[]>(this.cargar());

  /** Flujo reactivo con la lista, de la más reciente a la más antigua. */
  readonly mantenciones$: Observable<Mantencion[]> = this.estado$.pipe(
    map((lista) => [...lista].sort((a, b) => b.fecha.localeCompare(a.fecha)))
  );

  obtenerPorId(id: string): Observable<Mantencion | undefined> {
    return of(this.estado$.value.find((m) => m.id === id));
  }

  crear(datos: MantencionInput): Observable<Mantencion> {
    const nueva: Mantencion = { ...datos, id: crypto.randomUUID() };
    this.actualizar([...this.estado$.value, nueva]);
    return of(nueva);
  }

  editar(id: string, datos: MantencionInput): Observable<Mantencion | undefined> {
    const actual = this.estado$.value.find((m) => m.id === id);
    if (!actual) return of(undefined);
    const editada: Mantencion = { ...datos, id };
    this.actualizar(this.estado$.value.map((m) => (m.id === id ? editada : m)));
    return of(editada);
  }

  eliminar(id: string): Observable<boolean> {
    this.actualizar(this.estado$.value.filter((m) => m.id !== id));
    return of(true);
  }

  private actualizar(lista: Mantencion[]): void {
    this.estado$.next(lista);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch {
      /* si el almacenamiento falla, la app sigue funcionando en memoria */
    }
  }

  private cargar(): Mantencion[] {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      return guardado ? (JSON.parse(guardado) as Mantencion[]) : DATOS_INICIALES;
    } catch {
      return DATOS_INICIALES;
    }
  }
}
