/**
 * Datos del negocio. Fuente: «Configuración del sitio» en Sanity (teléfono, WhatsApp, correo, redes, zonas, fundación y
 * mensaje general); en código quedan solo la URL, el logo y las funciones de enlace. Reglas: docs/estructura-sitio-digitalx.md
 * sección 1 y docs/reglas-seo-digitalx.md secciones 4, 11 y 13.
 * Todo dato faltante va como `null` y se oculta en la interfaz.
 */
import { configuracion as config } from './contenido/configuracion.ts';
import { aImagenCompartir } from './contenido/imagenes.ts';

const enEspanol = (items: readonly string[]) =>
  new Intl.ListFormat('es', { style: 'long', type: 'conjunction' }).format(items);

/**
 * Zonas de servicio (docs/estructura-sitio-digitalx.md sección 1), de «Configuración del sitio» en Sanity. "Puebla" sola
 * es la ciudad. Lo único público es la lista de lugares: los grupos de traslado incluido y con cargo adicional son
 * DATO INTERNO y viven solo en docs/estructura-sitio-digitalx.md (no en el código ni en Sanity).
 */
export const zonas = {
  /** Las zonas confirmadas, para los datos estructurados (areaServed). */
  todas: [...config.zonas],
  /** "Puebla, Atlixco, Izúcar de Matamoros, Tepeaca, San Martín Texmelucan, Amozoc y alrededores". */
  texto: enEspanol([...config.zonas, 'alrededores']),
};

const NOMBRES_DE_RED: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  google: 'Perfil de Google',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
};

/**
 * Redes del negocio capturadas en el Studio. [PENDIENTE: URLs de Facebook, Instagram, TikTok y del perfil de Google.]
 * Mientras una red no esté activa y con dirección no se muestra ni entra a sameAs: no se pintan enlaces vacíos ni con "#".
 */
const redesDelNegocio: { nombre: string; url: string | null }[] = (config.redes ?? []).map((red) => ({
  nombre: NOMBRES_DE_RED[red.red] ?? red.red,
  url: red.activa && red.url ? red.url : null,
}));

/** Solo las redes que ya tienen URL real. */
export const redesConUrl = <T extends { url: string | null }>(redes: T[]) =>
  redes.filter((red): red is T & { url: string } => red.url !== null);

/** El teléfono para leer en pantalla: "+522441244913" → "+52 244 124 4913". */
const telefonoEnPantalla = (tel: string) => `${tel.slice(0, 3)} ${tel.slice(3, 6)} ${tel.slice(6, 9)} ${tel.slice(9)}`;

export const negocio = {
  nombre: 'Digital X',
  url: 'https://digitalx.mx',
  // La idea nació en 2018 y el negocio se formalizó en 2021 (dato del dueño). foundingDate usa el año de la idea.
  fundacion: config.fundacion,
  telefono: { pantalla: telefonoEnPantalla(config.telefono), tel: config.telefono },
  whatsapp: config.whatsapp,
  // [PENDIENTE: correo definitivo en digitalx.mx] Vacío en Sanity = no se muestra en ningún lado.
  correo: (config.correo || null) as string | null,
  // Solo las redes con URL: el pie, el menú y sameAs leen esta lista y no pintan nada si está vacía.
  redes: redesConUrl(redesDelNegocio),
  // Pie de página: texto fijo, igual en todo el sitio, sin enlaces por ciudad (reglas-seo sección 4).
  textoCobertura: `Servicios de audio, video y tecnología en ${zonas.texto}.`,
  // Imagen de marca (1200x630) para compartir enlaces; cada página puede pasar la suya. Una imagen para compartir
  // capturada en «Configuración del sitio» tiene prioridad.
  imagenOg: (config.imagenCompartir ? aImagenCompartir(config.imagenCompartir) : '/og-digitalx-1200x630.png') as
    string | null,
  // Logo para los datos estructurados: copia de brand/png/digitalx-logo-negro-1200.png (brand/ es la fuente).
  logo: '/logo-digitalx-negro-1200.png',
} as const;

/** @id del ProfessionalService: las demás páginas (por ejemplo, AboutPage) lo referencian en vez de duplicarlo. */
export const idNegocio = `${negocio.url}/#negocio`;

/**
 * Mensaje prellenado de WhatsApp. El general sale de «Configuración del sitio»; el de cada servicio, del propio servicio
 * (`servicios[slug].mensaje`). [PENDIENTE: el dueño debe confirmar los mensajes propuestos, reglas-seo sección 11]
 */
export const mensajesWhatsApp = { general: config.mensajeWhatsAppGeneral } as const;

export const waUrl = (mensaje: string = mensajesWhatsApp.general) =>
  `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(mensaje)}`;

export const telUrl = `tel:${negocio.telefono.tel}`;
