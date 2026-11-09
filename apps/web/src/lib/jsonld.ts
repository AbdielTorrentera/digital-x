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

export interface Miga {
  nombre: string;
  /** URL absoluta de la página. */
  url: string;
}

/** BreadcrumbList con las mismas migas que se ven en pantalla (reglas-seo sección 12). */
export const breadcrumbListJsonLd = (migas: Miga[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: migas.map(({ nombre, url }, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: nombre,
    item: url,
  })),
});

export interface DatosServicio {
  /** URL absoluta de la página del servicio. */
  url: string;
  nombre: string;
  /** Tipo de servicio: la categoría ("Servicios de audio"). */
  tipo: string;
  descripcion: string;
  /** @id del negocio ya declarado en el sitio: el proveedor se referencia, no se duplica. */
  idNegocio: string;
  /** Zonas donde se presta (las del negocio), como ciudades. */
  zonas: string[];
}

/** Service de la página de un servicio, con proveedor por @id y zonas de servicio (reglas-seo sección 12). */
export const serviceJsonLd = ({ url, nombre, tipo, descripcion, idNegocio, zonas }: DatosServicio) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${url}#servicio`,
  url,
  name: nombre,
  serviceType: tipo,
  description: descripcion,
  provider: { '@id': idNegocio },
  areaServed: zonas.map((zona) => ({ '@type': 'City', name: zona })),
});

export interface DatosCollectionPage {
  /** URL absoluta de la página. */
  url: string;
  nombre: string;
  descripcion: string;
  /** @id del negocio ya declarado en el sitio (ProfessionalService): se referencia, no se duplica. */
  idNegocio: string;
  /** Lo que lista la página: cada uno es el contenido de un ListItem (`name` y `url`). Puede estar vacío. */
  elementos: Record<string, unknown>[];
}

/**
 * CollectionPage con un ItemList de lo que la página lista; apunta por @id al negocio existente. Sin elementos no hay
 * `mainEntity`: un ItemList vacío no dice nada.
 */
export const collectionPageJsonLd = ({ url, nombre, descripcion, idNegocio, elementos }: DatosCollectionPage) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${url}#pagina`,
  url,
  name: nombre,
  description: descripcion,
  inLanguage: 'es-MX',
  about: { '@id': idNegocio },
  ...(elementos.length > 0
    ? {
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: elementos.map((elemento, i) => ({ '@type': 'ListItem', position: i + 1, ...elemento })),
        },
      }
    : {}),
});
