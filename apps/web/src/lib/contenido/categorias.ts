// Las categorías de servicios (Audio, Video, Tecnología) y la guía «¿Qué servicios necesito?», desde Sanity.
import type { PreguntaFrecuente } from '../jsonld.ts';
import { aImagenCompartir, aFoto } from './imagenes.ts';
import { documento, documentoObligatorio, documentosDe } from './instantanea.ts';
import { aTexto } from './texto.ts';
import type { CategoriaDoc, ClienteDoc, Foto, GuiaDoc, ServicioDoc } from './tipos.ts';

export interface Cliente {
  nombre: string;
  logo?: Foto;
  permiso: boolean;
}

export interface CategoriaContenido {
  /** El identificador de la categoría es su slug (`audio`, `video`, `tecnologia`). */
  id: string;
  slug: string;
  etiqueta: string;
  titulo: string;
  para: string;
  sinPagina?: string[];
  title: string;
  meta: string;
  h1: string;
  intro: string;
  imagen?: string;
  cierre: { titulo: string; texto: string };
  faq: PreguntaFrecuente[];
  clientes: Cliente[];
}

export const preguntas = (
  items: { pregunta: string; respuesta: Parameters<typeof aTexto>[0] }[] = [],
): PreguntaFrecuente[] => items.map((p) => ({ pregunta: p.pregunta, respuesta: aTexto(p.respuesta) }));

const docs = documentosDe<CategoriaDoc>('categoria').sort((a, b) => a.orden - b.orden);

export const categorias: CategoriaContenido[] = docs.map((c) => ({
  id: c.slug.current,
  slug: c.slug.current,
  etiqueta: c.etiqueta,
  titulo: c.titulo,
  para: c.para,
  ...(c.sinPagina?.length ? { sinPagina: c.sinPagina } : {}),
  title: c.seo.title ?? '',
  meta: c.seo.meta ?? '',
  h1: c.h1,
  intro: c.intro,
  ...(c.seo.imagen ? { imagen: aImagenCompartir(c.seo.imagen) } : {}),
  cierre: { titulo: c.cierre.titulo, texto: c.cierre.texto },
  faq: preguntas(c.faq),
  // Solo clientes publicados (un cliente sin permiso se queda en borrador y su referencia débil no se resuelve).
  clientes: (c.clientes ?? []).flatMap((ref) => {
    const cliente = documento<ClienteDoc>(ref._ref);
    return cliente
      ? [
          {
            nombre: cliente.nombre,
            ...(cliente.logo ? { logo: aFoto(cliente.logo) } : {}),
            permiso: cliente.permiso === true,
          },
        ]
      : [];
  }),
}));

/** El id de una categoría (su slug) a partir de la referencia de un servicio. */
export const idDeCategoria = (referencia: string): string => {
  const categoria = docs.find((c) => c._id === referencia);
  if (!categoria) throw new Error(`Un servicio apunta a una categoría que no está publicada (${referencia}).`);
  return categoria.slug.current;
};

/** Hoy ninguna página dibuja la guía (decisión del dueño); queda lista para activarse. */
const guiaDoc = documento<GuiaDoc>('guiaDeServicios');
export const guia = {
  etiqueta: guiaDoc?.etiqueta ?? '',
  titulo: guiaDoc?.titulo ?? '',
  items: (guiaDoc?.items ?? []).map((i) => ({
    escenario: i.escenario,
    slugs: i.servicios.map((r) => documentoObligatorio<ServicioDoc>(r._ref).slug.current),
  })),
};
