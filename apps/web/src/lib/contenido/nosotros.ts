// El contenido de Nosotros, desde Sanity. Mismas formas que tenía `content/nosotros.ts`. Las etiquetas de los botones de
// contacto son del diseño y se quedan en código.
import type { PreguntaFrecuente } from '../jsonld.ts';
import { mensajesWhatsApp, negocio, telUrl, waUrl } from '../negocio.ts';
import { aFoto, aImagen, aImagenCompartir } from './imagenes.ts';
import { documentoObligatorio } from './instantanea.ts';
import { aTexto } from './texto.ts';
import type { Foto, NosotrosDoc } from './tipos.ts';

const doc = documentoObligatorio<NosotrosDoc>('nosotros');

export const pagina = {
  title: doc.seo.title ?? '',
  descripcion: doc.seo.meta ?? '',
  etiqueta: doc.etiqueta,
  h1: doc.h1,
  ...(doc.seo.imagen ? { imagen: aImagenCompartir(doc.seo.imagen) } : {}),
  foto: aFoto(doc.foto),
};

export const historia = {
  etiqueta: doc.historia.etiqueta,
  texto: doc.historia.texto,
  hitos: doc.historia.hitos.map(({ anio, titulo, texto }) => ({ anio, titulo, texto })),
};

export const distingue = {
  titulo: doc.distingue.titulo,
  foto: aFoto(doc.fotoDistingue),
  items: doc.distingue.items.map(({ titulo, texto }) => ({ titulo, texto })),
};

export const manifiesto = {
  titulo: doc.manifiesto.titulo,
  /** Fondo decorativo: solo la imagen (el componente la pinta con `alt=""`). */
  foto: aImagen(doc.fotoManifiesto),
  items: doc.manifiesto.items.map(({ titulo, texto }) => ({ titulo, texto })),
};

export const proyectosPagina = {
  etiqueta: doc.proyectos.etiqueta,
  titulo: doc.proyectos.titulo,
  foto: aImagen(doc.fotoProyectos),
  boton: { etiqueta: doc.proyectos.boton, href: '/proyectos/' },
};

export const faq = {
  etiqueta: doc.preguntas.etiqueta,
  titulo: doc.preguntas.titulo,
  texto: doc.preguntas.texto,
  items: doc.preguntas.items.map((p): PreguntaFrecuente => ({ pregunta: p.pregunta, respuesta: aTexto(p.respuesta) })),
};

export const cierre = {
  foto: aImagen(doc.fotoCierre),
  titulo: doc.cierre.titulo,
  texto: doc.cierre.texto,
  whatsapp: { etiqueta: 'Cotizar por WhatsApp', href: waUrl(mensajesWhatsApp.general) },
  llamar: { etiqueta: 'Llamar', href: telUrl, numero: negocio.telefono.pantalla },
};

export type { Foto };
