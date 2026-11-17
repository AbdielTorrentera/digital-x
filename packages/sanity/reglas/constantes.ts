// Listas técnicas que usan el Studio y el build (estructura §2 y §7).

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
 * `/proyectos/` solo existe con proyectos publicados (si no, el sitio muestra el enlace como texto).
 * `/blog/` (pendiente de material) y `/resenas/` (aún no registrada) se agregan cuando se construyan sus etapas.
 */
export const RUTAS_FIJAS = [
  {title: 'Inicio', value: '/'},
  {title: 'Nosotros', value: '/nosotros/'},
  {title: 'Proyectos', value: '/proyectos/'},
  {title: 'Condiciones de contratación', value: '/condiciones-de-contratacion/'},
  {title: 'Política de privacidad', value: '/politica-de-privacidad/'},
]

/** "También te puede servir" solo admite estas dos páginas (estructura §7). */
export const RUTAS_TAMBIEN = RUTAS_FIJAS.filter((r) =>
  ['/proyectos/', '/condiciones-de-contratacion/'].includes(r.value),
)
