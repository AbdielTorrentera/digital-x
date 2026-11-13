// El contenido del Inicio, desde Sanity. Mismas formas que tenía `content/inicio.ts`. Las partes que se arman con datos
// (la lista de lugares y los nombres de los servicios) llegan como marcadores ({zonas}, {servicios-audio}…) y se
// reemplazan aquí, así que siempre siguen a la configuración y a los servicios publicados.
import { MARCADORES, resolverMarcadores, type Marcador } from '@digitalx/sanity/reglas';
import type { PreguntaFrecuente } from '../jsonld.ts';
import { mensajesWhatsApp, waUrl, zonas } from '../negocio.ts';
import { urlVerServicios } from '../paginas.ts';
import { lista } from '../servicios.ts';
import { aFoto, aImagenCompartir } from './imagenes.ts';
import { documentoObligatorio } from './instantanea.ts';
import { proyectos as proyectosDelSitio } from './proyectos.ts';
import { aTexto, enTrozos } from './texto.ts';
import type { Foto, InicioDoc } from './tipos.ts';

export type { Foto };

const doc = documentoObligatorio<InicioDoc>('inicio');

const valores: Record<Marcador, string> = {
  zonas: zonas.texto,
  'servicios-audio': lista.audio ?? '',
  'servicios-video': lista.video ?? '',
  'servicios-tecnologia': lista.tecnologia ?? '',
};

/** Reemplaza los marcadores; si uno no tiene dato, el build se detiene en vez de publicar una frase rota. */
const conDatos = (texto: string): string => {
  for (const marcador of MARCADORES)
    if (texto.includes(`{${marcador}}`) && !valores[marcador])
      throw new Error(
        `El Inicio usa {${marcador}} pero no hay datos para ese marcador (¿no hay servicios publicados en esa categoría?).`,
      );
  return resolverMarcadores(texto, valores);
};

export const portada = {
  title: doc.seo.title ?? '',
  descripcion: doc.seo.meta ?? '',
  h1: doc.h1,
  ...(doc.seo.imagen ? { imagen: aImagenCompartir(doc.seo.imagen) } : {}),
  foto: aFoto(doc.fotoPortada),
};

export const queHacemos = {
  etiqueta: doc.queHacemos.etiqueta,
  titulo: doc.queHacemos.titulo,
  texto: doc.queHacemos.texto,
  boton: { etiqueta: doc.queHacemos.boton, href: urlVerServicios },
  foto: aFoto(doc.fotoQueHacemos),
};

export const servicios = {
  etiqueta: doc.servicios.etiqueta,
  titulo: doc.servicios.titulo,
  /** Etiqueta pequeña de cada tarjeta. */
  etiquetaTarjeta: 'Servicios',
};

export const proyectos = {
  etiqueta: doc.proyectos.etiqueta,
  titulo: doc.proyectos.titulo,
  items: proyectosDelSitio,
};

export const porQue = {
  etiqueta: doc.porQue.etiqueta,
  titulo: doc.porQue.titulo,
  foto: aFoto(doc.fotoPorQue),
  items: doc.porQue.items.map(({ titulo, texto }) => ({ titulo, texto })),
};

export const cobertura = {
  etiqueta: doc.cobertura.etiqueta,
  titulo: doc.cobertura.titulo,
  texto: conDatos(doc.cobertura.texto),
};

export const faq = {
  etiqueta: doc.preguntas.etiqueta,
  titulo: doc.preguntas.titulo,
  texto: doc.preguntas.texto,
  items: doc.preguntas.items.map((p): PreguntaFrecuente => ({
    pregunta: p.pregunta,
    respuesta: enTrozos(aTexto(p.respuesta), conDatos),
  })),
};

export const cierre = {
  titulo: doc.cierre.titulo,
  texto: doc.cierre.texto,
  boton: { etiqueta: 'Cotizar por WhatsApp', href: waUrl(mensajesWhatsApp.general) },
};
