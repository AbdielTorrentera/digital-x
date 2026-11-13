// Los servicios y el contenido de su página, desde Sanity. Mismas formas que tenía `content/servicios.ts`: los
// componentes no cambian. La URL de cada servicio se deriva de su categoría (`lib/paginas.ts`), nunca se guarda.
import { faltantesDePagina as faltantesDeReglas } from '@digitalx/sanity/reglas';
import type { TextoConEnlaces } from '../texto.ts';
import type { PreguntaFrecuente } from '../jsonld.ts';
import { idDeCategoria, categorias, preguntas } from './categorias.ts';
import { aImagenCompartir } from './imagenes.ts';
import { documentosDe } from './instantanea.ts';
import { aTexto } from './texto.ts';
import type { BloqueDeSeccionDoc, ServicioDoc } from './tipos.ts';

export type { TextoConEnlaces };
export type Slug = string;

/** Un enlace de «También te puede servir»: a un servicio (`slug`) o a otra página (`titulo` y `url`). */
export type EnlaceRelacionado = { texto: string } & ({ slug: Slug } | { titulo: string; url: string });

export type BloqueDeSeccion =
  | { parrafo: string | TextoConEnlaces }
  | { lista: string[] }
  | { puntos: { titulo: string | TextoConEnlaces; texto: string | TextoConEnlaces }[] };

export interface SeccionExtra {
  id: string;
  etiqueta: string;
  titulo: string;
  bloques: BloqueDeSeccion[];
}

export interface PaginaDeServicio {
  ficha?: { etiqueta: string; valor: string }[];
  descripcion?: { titulo?: string; parrafos: string[] };
  incluye?: string[];
  incluyeNota?: string | TextoConEnlaces;
  secciones?: SeccionExtra[];
  tambien?: { intro?: string; items: EnlaceRelacionado[] };
  cotizacion?: { etiqueta: string; texto: string };
  cierre?: { titulo: string; texto: string };
  faq?: PreguntaFrecuente[];
}

export interface ServicioContenido {
  descripcion: string;
  title: string;
  meta: string;
  h1: string;
  mensaje: string;
  serviceType?: string;
  imagen?: string;
  pagina?: PaginaDeServicio;
}

const docs = documentosDe<ServicioDoc>('servicio');
const docPorSlug = new Map(docs.map((d) => [d.slug.current, d]));

const bloque = (b: BloqueDeSeccionDoc): BloqueDeSeccion => {
  if (b._type === 'bloqueParrafo') return { parrafo: aTexto(b.texto) };
  if (b._type === 'bloqueLista') return { lista: b.items };
  return { puntos: b.items.map((p) => ({ titulo: aTexto(p.titulo), texto: aTexto(p.texto) })) };
};

const aPagina = (p: NonNullable<ServicioDoc['pagina']>): PaginaDeServicio => ({
  ...(p.ficha ? { ficha: p.ficha.map(({ etiqueta, valor }) => ({ etiqueta, valor })) } : {}),
  ...(p.descripcion
    ? {
        descripcion: {
          ...(p.descripcion.titulo ? { titulo: p.descripcion.titulo } : {}),
          parrafos: p.descripcion.parrafos ?? [],
        },
      }
    : {}),
  ...(p.incluye ? { incluye: p.incluye } : {}),
  ...(p.incluyeNota?.length ? { incluyeNota: aTexto(p.incluyeNota) } : {}),
  ...(p.secciones
    ? {
        secciones: p.secciones.map((s) => ({
          id: s.id.current,
          etiqueta: s.etiqueta,
          titulo: s.titulo,
          bloques: s.bloques.map(bloque),
        })),
      }
    : {}),
  ...(p.tambien
    ? {
        tambien: {
          ...(p.tambien.intro ? { intro: p.tambien.intro } : {}),
          items: (p.tambien.items ?? []).map((i): EnlaceRelacionado => {
            if (i._type === 'relacionadoPagina') return { titulo: i.titulo, url: i.ruta, texto: i.texto };
            const servicio = docs.find((d) => d._id === i.servicio._ref);
            if (!servicio)
              throw new Error(
                `«También te puede servir» apunta a un servicio que no está publicado (${i.servicio._ref}).`,
              );
            return { slug: servicio.slug.current, texto: i.texto };
          }),
        },
      }
    : {}),
  ...(p.cotizacion ? { cotizacion: { etiqueta: p.cotizacion.etiqueta, texto: p.cotizacion.texto } } : {}),
  ...(p.cierre ? { cierre: { titulo: p.cierre.titulo, texto: p.cierre.texto } } : {}),
  ...(p.faq ? { faq: preguntas(p.faq) } : {}),
});

export const servicios: Record<Slug, ServicioContenido> = Object.fromEntries(
  docs.map((d) => [
    d.slug.current,
    {
      descripcion: d.descripcion,
      title: d.seo.title ?? '',
      meta: d.seo.meta ?? '',
      h1: d.h1,
      mensaje: d.mensajeWhatsApp,
      ...(d.serviceType ? { serviceType: d.serviceType } : {}),
      ...(d.seo.imagen ? { imagen: aImagenCompartir(d.seo.imagen) } : {}),
      ...(d.pagina ? { pagina: aPagina(d.pagina) } : {}),
    } satisfies ServicioContenido,
  ]),
);

export const slugs: Slug[] = Object.keys(servicios);

/** Lo que le falta al contenido de un servicio para publicar su página; vacío = completo. */
export const faltantesDePagina = (slug: Slug): string[] => {
  const doc = docPorSlug.get(slug);
  if (!doc) throw new Error(`"${slug}" no es un servicio publicado en Sanity.`);
  return faltantesDeReglas(doc);
};

export interface ServicioDelRegistro {
  slug: Slug;
  /** Nombre oficial: el texto de todos los enlaces al servicio. */
  titulo: string;
  categoria: string;
  /** `Página construida` marcada en el Studio: hasta entonces el servicio no tiene página ni enlace. */
  construida: boolean;
}

/** Los servicios para el registro de páginas (`lib/paginas.ts`): por orden de categoría y luego por su orden. */
export const registroDeServicios: ServicioDelRegistro[] = categorias.flatMap((categoria) =>
  docs
    .filter((d) => idDeCategoria(d.categoria._ref) === categoria.id)
    .sort((a, b) => a.orden - b.orden)
    .map((d) => ({
      slug: d.slug.current,
      titulo: d.nombre,
      categoria: categoria.id,
      construida: d.paginaConstruida === true,
    })),
);
