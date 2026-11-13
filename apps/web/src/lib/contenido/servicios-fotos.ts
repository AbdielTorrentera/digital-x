// La foto del encabezado de cada servicio (y su galería) y la foto de fondo del cierre, desde Sanity.
import { aFoto, aImagen } from './imagenes.ts';
import { configuracion } from './configuracion.ts';
import { documentosDe } from './instantanea.ts';
import type { Slug } from './servicios.ts';
import type { Foto, Imagen, ServicioDoc } from './tipos.ts';

export interface SeccionGaleria {
  titulo: string;
  fotos: Foto[];
}

export interface FotoDeServicio extends Foto {
  galeria?: SeccionGaleria[];
}

export const fotos: Record<Slug, FotoDeServicio> = Object.fromEntries(
  documentosDe<ServicioDoc>('servicio').map((d) => [
    d.slug.current,
    {
      ...aFoto(d.foto),
      ...(d.galeria?.length
        ? { galeria: d.galeria.map((g) => ({ titulo: g.titulo, fotos: g.fotos.map(aFoto) })) }
        : {}),
    },
  ]),
);

/** Foto de fondo del cierre de contacto (decorativa: va con `alt=""`). */
export const fotoCierre: Imagen = aImagen(configuracion.fotoCierre);
