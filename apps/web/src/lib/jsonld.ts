/**
 * Datos estructurados (JSON-LD, reglas-seo sección 12).
 * Se escapan `<`, `>` y `&` para que ningún texto pueda cerrar el `<script>` ni inyectar HTML, aunque algún día
 * el contenido venga de Sanity (seguridad sección 4).
 */
// Los separadores de línea de Unicode se escriben con su código, para no dejar caracteres invisibles en el archivo.
const SEPARADORES = new RegExp(`[${String.fromCharCode(0x2028)}${String.fromCharCode(0x2029)}]`, 'g');

export const serializarJsonLd = (datos: unknown): string =>
  JSON.stringify(datos)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(SEPARADORES, (c) => `\\u${c.charCodeAt(0).toString(16)}`);

/** `sameAs` del negocio: las URLs de sus redes; sin ninguna, no hay propiedad (devuelve undefined). */
export const sameAsDeRedes = (redes: { url: string }[]): string[] | undefined =>
  redes.length > 0 ? redes.map((red) => red.url) : undefined;

export interface DatosAboutPage {
  /** URL absoluta de la página. */
  url: string;
  nombre: string;
  descripcion: string;
  /** @id del negocio ya declarado en el sitio (ProfessionalService): se referencia, no se duplica. */
  idNegocio: string;
}

/** AboutPage cuyo `about` y `mainEntity` apuntan por @id al negocio existente (reglas-seo sección 12). */
export const aboutPageJsonLd = ({ url, nombre, descripcion, idNegocio }: DatosAboutPage) => ({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url,
  name: nombre,
  description: descripcion,
  inLanguage: 'es-MX',
  about: { '@id': idNegocio },
  mainEntity: { '@id': idNegocio },
});

export interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

/** FAQPage con las mismas preguntas y respuestas que se muestran en pantalla (reglas-seo sección 12). */
export const faqPageJsonLd = (preguntas: PreguntaFrecuente[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: preguntas.map(({ pregunta, respuesta }) => ({
    '@type': 'Question',
    name: pregunta,
    acceptedAnswer: { '@type': 'Answer', text: respuesta },
  })),
});
