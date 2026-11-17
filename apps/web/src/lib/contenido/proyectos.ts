// Los proyectos publicados en Sanity y la «Página de proyectos», con la forma que usan las páginas y las secciones.
import { fechaLegible, metaSeoDeProyecto, tituloSeoDeProyecto } from '../proyectos.ts';
import { aFoto, aImagenCompartir } from './imagenes.ts';
import { documento, documentosDe } from './instantanea.ts';
import type { PaginaProyectosDoc, Foto, ProyectoDoc, ServicioDoc } from './tipos.ts';

export interface Proyecto {
  titulo: string;
  slug: string;
  /** Su página de detalle: /proyectos/{slug}/. */
  url: string;
  municipio: string;
  /** Nombres de los servicios usados, como están en `lib/paginas.ts`. */
  servicios: string[];
  /** Los slugs de esos mismos servicios, en el mismo orden (para enlazar a su página). */
  slugsServicios: string[];
  /** La portada (la primera foto). */
  foto: Foto;
  /** Todas las fotos, la portada incluida. */
  fotos: Foto[];
  /** El resumen de la tarjeta. */
  texto: string;
  reto?: string;
  solucion?: string;
  resultado?: string;
  /** «marzo de 2026» y su valor para `<time>` («2026-03-14»); solo si el dueño la capturó. */
  fecha?: { iso: string; texto: string };
  /** Título y descripción para Google (los del dueño o los automáticos) y la imagen para compartir. */
  title: string;
  meta: string;
  imagen: string;
}

const servicioPublicado = (id: string) => {
  const servicio = documento<ServicioDoc>(id);
  if (!servicio) throw new Error(`Un proyecto usa un servicio que no está publicado (${id}).`);
  return servicio;
};

/** Primero los que tienen `orden` (el 1 primero), luego los más recientes y, si empatan, por título. */
const comparar = (a: ProyectoDoc, b: ProyectoDoc) =>
  (a.orden ?? Infinity) - (b.orden ?? Infinity) ||
  (b.fecha ?? '').localeCompare(a.fecha ?? '') ||
  a.titulo.localeCompare(b.titulo, 'es');

export const proyectos: Proyecto[] = documentosDe<ProyectoDoc>('proyecto')
  .sort(comparar)
  .map((p) => {
    const servicios = p.servicios.map((s) => servicioPublicado(s._ref));
    return {
      titulo: p.titulo,
      slug: p.slug.current,
      url: `/proyectos/${p.slug.current}/`,
      municipio: p.municipio,
      servicios: servicios.map((s) => s.nombre),
      slugsServicios: servicios.map((s) => s.slug.current),
      foto: aFoto(p.fotos[0]),
      fotos: p.fotos.map(aFoto),
      texto: p.resumen,
      ...(p.reto ? { reto: p.reto } : {}),
      ...(p.solucion ? { solucion: p.solucion } : {}),
      ...(p.resultado ? { resultado: p.resultado } : {}),
      ...(p.fecha ? { fecha: { iso: p.fecha, texto: fechaLegible(p.fecha) } } : {}),
      title: tituloSeoDeProyecto({ titulo: p.titulo, municipio: p.municipio, seoTitle: p.seo?.title }),
      meta: metaSeoDeProyecto({ resumen: p.resumen, seoMeta: p.seo?.meta }),
      imagen: aImagenCompartir(p.seo?.imagen ?? p.fotos[0]),
    };
  });

const paginaDoc = documento<PaginaProyectosDoc>('paginaProyectos');

/** La «Página de proyectos» publicada, o `null` si todavía no se publica (entonces no hay /proyectos/ ni detalles). */
export const paginaProyectos = paginaDoc
  ? {
      etiqueta: paginaDoc.etiqueta,
      h1: paginaDoc.h1,
      intro: paginaDoc.intro,
      foto: aFoto(paginaDoc.foto),
      cierre: { titulo: paginaDoc.cierre.titulo, texto: paginaDoc.cierre.texto },
      title: paginaDoc.seo.title ?? '',
      meta: paginaDoc.seo.meta ?? '',
      ...(paginaDoc.seo.imagen ? { imagen: aImagenCompartir(paginaDoc.seo.imagen) } : {}),
    }
  : null;

/** ¿Existe la sección de proyectos? Con al menos un proyecto publicado Y la «Página de proyectos» publicada. */
export const hayProyectos = proyectos.length > 0 && paginaProyectos !== null;
