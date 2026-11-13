// Límites y listas que fijan los docs/ (SEO §1, estructura §2 y §7). Se usan en el Studio y en el build.

export const MAX_TITLE = 60
export const MAX_META = 155
export const SUFIJO_TITLE = ' | Digital X'
export const INVITACION_META = 'Cotiza por WhatsApp.'
export const ZONAS_EN_META = /Puebla|Atlixco/

export const MIN_ALT = 5
export const MAX_ALT = 125

export const MIN_RESENA = 40
export const MAX_RESENA = 600
export const MAX_EXTRACTO = 200

/** Primer nivel de URL que ya usan las páginas fijas: una categoría no puede llamarse así (estructura §7). */
export const SLUGS_RESERVADOS = [
  'nosotros',
  'proyectos',
  'blog',
  'resenas',
  'servicios',
  'contacto',
  'condiciones-de-contratacion',
  'politica-de-privacidad',
  'rss',
  'sitemap',
  'robots',
  'admin',
  'api',
]

/**
 * Páginas fijas a las que puede enlazar un texto: las del registro del sitio (`lib/paginas.ts`) que se pueden enlazar.
 * `/blog/` (pendiente de material) y `/resenas/` (aún no registrada) se agregan cuando se construyan sus etapas.
 */
export const RUTAS_FIJAS = [
  {title: 'Inicio', value: '/'},
  {title: 'Nosotros', value: '/nosotros/'},
  {title: 'Proyectos', value: '/proyectos/'},
  {title: 'Condiciones de contratación', value: '/condiciones-de-contratacion/'},
  {title: 'Política de privacidad', value: '/politica-de-privacidad/'},
]

/**
 * Páginas fijas planeadas que todavía no existen: un texto puede enlazarlas (llevan a la 404 en desarrollo; el Studio
 * avisa) pero el build de producción falla mientras alguno las enlace. Es la fuente única: `lib/paginas.ts` la lee.
 * Al construir una página, se quita de aquí.
 */
export const PAGINAS_FIJAS_SIN_CONSTRUIR = ['/proyectos/']

/** "También te puede servir" solo admite estas dos páginas (estructura §7). */
export const RUTAS_TAMBIEN = RUTAS_FIJAS.filter((r) =>
  ['/proyectos/', '/condiciones-de-contratacion/'].includes(r.value),
)

/** Tipos de documento con textos propios del negocio: a estos se les aplica el barrido de vocabulario. */
export const TIPOS_CON_VOCABULARIO = [
  'configuracion',
  'inicio',
  'nosotros',
  'paginaProyectos',
  'paginaBlog',
  'paginaResenas',
  'categoria',
  'servicio',
  'proyecto',
  'articulo',
  'guiaDeServicios',
]
