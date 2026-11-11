import { categorias } from '../content/categorias.ts';
import { paginas, slugDe, visible, type Categoria } from './paginas.ts';

export interface ServicioDeCategoria {
  titulo: string;
  url: string;
  slug: string;
  /** Solo un servicio con página construida se enlaza; si no, su nombre se muestra como texto. */
  construida: boolean;
}

/** Servicios de una categoría, desde el registro de páginas (nombre y estado), en el orden del catálogo. */
export const serviciosDe = (categoria: Categoria): ServicioDeCategoria[] =>
  paginas
    .filter((p) => p.categoria === categoria)
    .map((p) => ({ titulo: p.titulo, url: p.url, slug: slugDe(p.url), construida: visible(p) }));

/**
 * Enlace a un servicio desde el contenido: su página si ya está construida y, si no, `null`: sin página no hay enlace
 * (su nombre se muestra como texto). Así ningún enlace lleva a una página que no existe.
 */
export const enlaceDeServicio = (slug: string): string | null => {
  const servicio = paginas.find((p) => p.categoria && slugDe(p.url) === slug);
  if (!servicio) throw new Error(`"${slug}" no es un servicio del registro (src/lib/paginas.ts).`);
  return visible(servicio) ? servicio.url : null;
};

/** Un trozo de una frase con nombres de servicios: texto suelto, o el nombre de un servicio con su enlace (si lo hay). */
export type Parte = { literal: string } | { nombre: string; url: string | null };

/**
 * Une nombres en una frase ("a, b y c"). Si el nombre anterior al último ya lleva una "y" ("renta de audio y sonido"),
 * la coma antes del "y" final evita que se lea como un solo servicio: "renta de audio y sonido, y sonorización".
 */
const unir = (nombres: { nombre: string; url: string | null }[]): Parte[] =>
  nombres.flatMap((item, i): Parte[] => {
    if (i === 0) return [item];
    const ultimo = i === nombres.length - 1;
    const separador = !ultimo ? ', ' : nombres[i - 1].nombre.includes(' y ') ? ', y ' : ' y ';
    return [{ literal: separador }, item];
  });

/**
 * Los servicios de una categoría como frase, en minúscula para usarlos a mitad de oración. Cada nombre trae su URL solo
 * si la página está construida (si no, es texto). Los servicios sin página propia (hoy, la sonorización de Audio) salen de
 * los datos de la categoría (`sinPagina` en content/categorias.ts) y van como texto, sin enlace.
 */
export const partesDeServicios = (categoria: Categoria): Parte[] =>
  unir([
    ...serviciosDe(categoria).map((s) => ({ nombre: s.titulo.toLowerCase(), url: s.construida ? s.url : null })),
    ...(categorias.find((c) => c.id === categoria)?.sinPagina ?? []).map((nombre) => ({
      nombre,
      url: null,
    })),
  ]);

/** Servicios elegidos por su slug como frase, con el nombre del registro y `enlaceDeServicio` como enlace (o sin él). */
export const partesDeSlugs = (slugs: string[]): Parte[] =>
  unir(
    slugs.map((slug) => {
      const servicio = paginas.find((p) => p.categoria && slugDe(p.url) === slug);
      if (!servicio) throw new Error(`"${slug}" no es un servicio del registro (src/lib/paginas.ts).`);
      return { nombre: servicio.titulo, url: enlaceDeServicio(slug) };
    }),
  );

const capital = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

/**
 * El párrafo de la tarjeta de una categoría en el Inicio: para quién es y, en la misma frase, los nombres de sus
 * servicios (el primero con mayúscula inicial, cada uno enlazado solo si su página está construida).
 */
export const parrafoDeCategoria = (categoria: { id: Categoria; para: string }): Parte[] => [
  { literal: `${categoria.para} ` },
  ...partesDeServicios(categoria.id).map((parte, i) =>
    i === 0 && 'nombre' in parte ? { ...parte, nombre: capital(parte.nombre) } : parte,
  ),
  { literal: '.' },
];

const comoTexto = (partes: Parte[]) => partes.map((p) => ('literal' in p ? p.literal : p.nombre)).join('');

/**
 * Servicios oficiales de cada categoría (los del Perfil de Negocio de Google) como texto, en minúscula para poder
 * usarlos a mitad de frase. Salen de las mismas páginas del registro, así que no pueden diferir de las tarjetas.
 * Los leen las tarjetas y las preguntas frecuentes del Inicio y las condiciones de contratación.
 */
export const lista = {
  audio: comoTexto(partesDeServicios('audio')),
  video: comoTexto(partesDeServicios('video')),
  tecnologia: comoTexto(partesDeServicios('tecnologia')),
};
