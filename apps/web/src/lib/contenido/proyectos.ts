// Los proyectos publicados en Sanity, con la forma que usan las secciones de proyectos. Los de ejemplo (`placeholder`)
// se ven con la etiqueta EJEMPLO y bloquean el build de producción (`validarContenido`).
import { aFoto } from './imagenes.ts';
import { documentosDe } from './instantanea.ts';
import type { Foto, ProyectoDoc, ServicioDoc } from './tipos.ts';

export interface Proyecto {
  titulo: string;
  municipio: string;
  /** Nombres de los servicios usados, como están en `lib/paginas.ts`. */
  servicios: string[];
  foto: Foto;
  texto: string;
  permiso: boolean;
  placeholder: boolean;
}

const nombreDeServicio = (id: string) => {
  const servicio = documentosDe<ServicioDoc>('servicio').find((s) => s._id === id);
  if (!servicio) throw new Error(`Un proyecto usa un servicio que no está publicado (${id}).`);
  return servicio.nombre;
};

/** Primero los que tienen `orden` (el 1 primero), luego los más recientes y, si empatan, por título. */
const comparar = (
  a: ProyectoDoc & { orden?: number; fecha?: string },
  b: ProyectoDoc & { orden?: number; fecha?: string },
) =>
  (a.orden ?? Infinity) - (b.orden ?? Infinity) ||
  (b.fecha ?? '').localeCompare(a.fecha ?? '') ||
  a.titulo.localeCompare(b.titulo, 'es');

export const proyectos: Proyecto[] = documentosDe<ProyectoDoc & { orden?: number; fecha?: string }>('proyecto')
  .sort(comparar)
  .map((p) => ({
    titulo: p.titulo,
    municipio: p.municipio,
    servicios: p.servicios.map((s) => nombreDeServicio(s._ref)),
    foto: aFoto(p.fotos[0]),
    texto: p.resumen,
    permiso: p.permiso === true,
    placeholder: p.esEjemplo === true,
  }));
