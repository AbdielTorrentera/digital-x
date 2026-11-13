// Tipos del contenido de Sanity (lo que baja `scripts/descargar-contenido.ts`) y de las formas que reciben los
// componentes. Los documentos son los de `apps/studio/schemaTypes/`; aquí solo se declara lo que el sitio lee.

// ---------- Documentos de Sanity ----------

export interface Referencia {
  _ref: string;
}

export interface FotoDoc {
  asset: Referencia;
  alt?: string;
  decorativa?: boolean;
  temporal?: boolean;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface BloqueDoc {
  children: { text: string; marks: string[] }[];
  markDefs: (
    | { _key: string; _type: 'enlaceServicio'; servicio: Referencia }
    | { _key: string; _type: 'enlacePagina'; ruta: string }
  )[];
}

export interface PreguntaDoc {
  pregunta: string;
  respuesta: BloqueDoc[];
}

export interface SeoDoc {
  title?: string;
  meta?: string;
  imagen?: FotoDoc;
}

export interface CierreDoc {
  titulo: string;
  texto: string;
}

export interface ConfiguracionDoc {
  telefono: string;
  whatsapp: string;
  correo?: string;
  fundacion: string;
  mensajeWhatsAppGeneral: string;
  redes?: { red: string; url?: string; activa?: boolean }[];
  enlaceResena?: string;
  zonas: string[];
  fotoCierre: FotoDoc;
  imagenCompartir?: FotoDoc;
}

export interface InicioDoc {
  h1: string;
  queHacemos: { etiqueta: string; titulo: string; texto: string; boton: string };
  servicios: { etiqueta: string; titulo: string };
  proyectos: { etiqueta: string; titulo: string };
  porQue: { etiqueta: string; titulo: string; items: { titulo: string; texto: string }[] };
  cobertura: { etiqueta: string; titulo: string; texto: string };
  preguntas: { etiqueta: string; titulo: string; texto: string; items: PreguntaDoc[] };
  cierre: CierreDoc;
  fotoPortada: FotoDoc;
  fotoQueHacemos: FotoDoc;
  fotoPorQue: FotoDoc;
  seo: SeoDoc;
}

export interface NosotrosDoc {
  etiqueta: string;
  h1: string;
  historia: { etiqueta: string; texto: string; hitos: { anio: string; titulo: string; texto: string }[] };
  distingue: { titulo: string; items: { titulo: string; texto: string }[] };
  manifiesto: { titulo: string; items: { titulo: string; texto: string }[] };
  proyectos: { etiqueta: string; titulo: string; boton: string };
  preguntas: { etiqueta: string; titulo: string; texto: string; items: PreguntaDoc[] };
  cierre: CierreDoc;
  foto: FotoDoc;
  fotoDistingue: FotoDoc;
  fotoManifiesto: FotoDoc;
  fotoProyectos: FotoDoc;
  fotoCierre: FotoDoc;
  seo: SeoDoc;
}

export interface CategoriaDoc {
  _id: string;
  etiqueta: string;
  slug: { current: string };
  orden: number;
  titulo: string;
  para: string;
  sinPagina?: string[];
  h1: string;
  intro: string;
  cierre: CierreDoc;
  foto: FotoDoc;
  faq?: PreguntaDoc[];
  clientes?: Referencia[];
  seo: SeoDoc;
}

export type BloqueDeSeccionDoc =
  | { _type: 'bloqueParrafo'; texto: BloqueDoc[] }
  | { _type: 'bloqueLista'; items: string[] }
  | { _type: 'bloquePuntos'; items: { titulo: BloqueDoc[]; texto: BloqueDoc[] }[] };

export interface ServicioDoc {
  _id: string;
  nombre: string;
  slug: { current: string };
  categoria: Referencia;
  orden: number;
  paginaConstruida?: boolean;
  descripcion: string;
  h1: string;
  serviceType?: string;
  mensajeWhatsApp: string;
  seo: SeoDoc;
  foto: FotoDoc;
  galeria?: { titulo: string; fotos: FotoDoc[] }[];
  pagina?: {
    ficha?: { etiqueta: string; valor: string }[];
    descripcion?: { titulo?: string; parrafos?: string[] };
    incluye?: string[];
    incluyeNota?: BloqueDoc[];
    secciones?: { titulo: string; etiqueta: string; id: { current: string }; bloques: BloqueDeSeccionDoc[] }[];
    tambien?: {
      intro?: string;
      items?: (
        | { _type: 'relacionadoServicio'; servicio: Referencia; texto: string }
        | { _type: 'relacionadoPagina'; titulo: string; ruta: string; texto: string }
      )[];
    };
    cotizacion?: { etiqueta: string; texto: string };
    cierre?: CierreDoc;
    faq?: PreguntaDoc[];
  };
}

export interface ProyectoDoc {
  _id: string;
  titulo: string;
  resumen: string;
  municipio: string;
  servicios: Referencia[];
  fotos: FotoDoc[];
  permiso?: boolean;
  esEjemplo?: boolean;
}

export interface ClienteDoc {
  _id: string;
  nombre: string;
  logo?: FotoDoc;
  permiso?: boolean;
}

export interface GuiaDoc {
  etiqueta: string;
  titulo: string;
  items: { escenario: string; servicios: Referencia[] }[];
}

// ---------- Formas que reciben los componentes ----------

/** La imagen que pinta `<Foto>`: dirección en el CDN de Sanity y tamaño, con la misma forma de `ImageMetadata`. */
export interface Imagen {
  src: string;
  width: number;
  height: number;
}

/** Una foto de contenido. `alt` va vacío en las fotos decorativas (el sitio las pinta con `alt=""` y `aria-hidden`). */
export interface Foto {
  src: Imagen;
  alt: string;
  /** `object-position` si en el Studio se marcó el punto de interés de la foto. */
  posicion?: string;
}
