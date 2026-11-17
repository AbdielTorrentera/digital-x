/**
 * Un texto corrido con enlaces: trozos de texto, `{ slug, texto }` (la página de un servicio si está publicada, o su
 * tarjeta del catálogo) y `{ url, texto }` (otra página del registro, como las condiciones de contratación). Lo usan los
 * párrafos, los puntos con título y las respuestas de las preguntas frecuentes de los servicios.
 */
export type TextoConEnlaces = (string | { slug: string; texto: string } | { url: string; texto: string })[];

/** El texto plano de un texto con enlaces (sin los enlaces): lo que ve quien lee y lo que va a los datos estructurados. */
export const comoTexto = (texto: string | TextoConEnlaces): string =>
  typeof texto === 'string' ? texto : texto.map((trozo) => (typeof trozo === 'string' ? trozo : trozo.texto)).join('');
