// De una foto de Sanity (archivo, texto alternativo, recorte y punto de interés) a lo que pinta `<Foto>`.
// Astro baja la imagen del CDN al compilar y la sirve optimizada desde el propio sitio: no se usa Image Optimization de
// Vercel y la CSP no cambia (`img-src 'self'`).
import { slugificar } from '@digitalx/sanity/reglas';
import { asset } from './instantanea.ts';
import type { Foto, FotoDoc, Imagen } from './tipos.ts';

/** Más ancho que esto no hace falta: la mayor versión que sirve el sitio es de 1920 px. */
const ANCHO_MAXIMO = 2400;
/** Largo máximo del nombre del archivo, sin la extensión. */
const LARGO_NOMBRE = 60;
/** Palabras que no pueden quedar al final de un nombre de archivo cortado. */
const PALABRAS_VACIAS = new Set([
  'de',
  'del',
  'la',
  'el',
  'los',
  'las',
  'un',
  'una',
  'en',
  'con',
  'y',
  'a',
  'para',
  'por',
  'sobre',
]);

/**
 * El nombre con el que se publica el archivo (reglas-seo §6): descriptivo, sacado del texto alternativo. Una foto
 * decorativa no tiene alt y conserva el nombre del archivo subido. Va al final de la URL del CDN (*vanity filename*).
 */
export const nombreDeArchivo = (foto: FotoDoc, nombreOriginal?: string): string => {
  const base = foto.decorativa || !foto.alt?.trim() ? (nombreOriginal ?? '').replace(/\.[^.]+$/, '') : foto.alt;
  // Se corta en una palabra completa (en el último guion antes del límite), no a media palabra, y no queda terminando
  // en una palabra vacía ("…-de-un", "…-con-codigo-en").
  const completo = slugificar(base, 200);
  let corte = completo;
  if (completo.length > LARGO_NOMBRE) {
    const palabras = completo
      .slice(0, LARGO_NOMBRE)
      .replace(/-[^-]*$/, '')
      .split('-');
    while (palabras.length > 1 && PALABRAS_VACIAS.has(palabras[palabras.length - 1])) palabras.pop();
    corte = palabras.join('-');
  }
  return corte || 'foto';
};

/** La imagen de una foto con su dirección en el CDN, ya recortada si en el Studio se recortó, y su tamaño final. */
export const aImagen = (foto: FotoDoc): Imagen => {
  const archivo = asset(foto.asset._ref);
  let { width, height } = archivo;
  const parametros: string[] = [];
  const recorte = foto.crop;
  if (recorte && (recorte.top || recorte.bottom || recorte.left || recorte.right)) {
    const ancho = Math.round((1 - recorte.left - recorte.right) * width);
    const alto = Math.round((1 - recorte.top - recorte.bottom) * height);
    parametros.push(`rect=${Math.round(recorte.left * width)},${Math.round(recorte.top * height)},${ancho},${alto}`);
    width = ancho;
    height = alto;
  }
  if (width > ANCHO_MAXIMO) {
    height = Math.round((height * ANCHO_MAXIMO) / width);
    width = ANCHO_MAXIMO;
    parametros.push(`w=${ANCHO_MAXIMO}`, 'fit=max');
  }
  const nombre = nombreDeArchivo(foto, archivo.originalFilename);
  const consulta = parametros.length > 0 ? `?${parametros.join('&')}` : '';
  return { src: `${archivo.url}/${nombre}.${archivo.extension}${consulta}`, width, height };
};

/** Una foto de contenido: la imagen, su texto alternativo (vacío si es decorativa) y su punto de interés. */
export const aFoto = (foto: FotoDoc): Foto => ({
  src: aImagen(foto),
  alt: foto.decorativa ? '' : (foto.alt ?? ''),
  ...(foto.hotspot ? { posicion: `${Math.round(foto.hotspot.x * 100)}% ${Math.round(foto.hotspot.y * 100)}%` } : {}),
});

/** La imagen para compartir (1200 × 630) de una foto de Sanity. */
export const aImagenCompartir = (foto: FotoDoc): string => {
  const archivo = asset(foto.asset._ref);
  return `${archivo.url}/${nombreDeArchivo(foto, archivo.originalFilename)}.${archivo.extension}?w=1200&h=630&fit=crop`;
};
