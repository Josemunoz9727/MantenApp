/** Tipos de mantención disponibles en el formulario. */
export const TIPOS_MANTENCION = [
  'Cambio de aceite',
  'Neumáticos',
  'Frenos',
  'Batería',
  'Revisión técnica',
  'Otro',
] as const;

export type TipoMantencion = (typeof TIPOS_MANTENCION)[number];

/** Registro de una mantención realizada a un vehículo. */
export interface Mantencion {
  id: string;
  vehiculo: string;
  tipo: TipoMantencion;
  /** Fecha en formato ISO yyyy-MM-dd */
  fecha: string;
  kilometraje: number;
  /** Costo en pesos chilenos (CLP) */
  costo: number;
  notas?: string;
}

/** Datos necesarios para crear o editar un registro (sin id). */
export type MantencionInput = Omit<Mantencion, 'id'>;
