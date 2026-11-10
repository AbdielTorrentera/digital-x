/**
 * Datos del negocio. Fuente única: docs/estructura-sitio-digitalx.md sección 1
 * y docs/reglas-seo-digitalx.md secciones 4, 11 y 13.
 * Todo dato faltante va como `null` y se oculta en la interfaz.
 */
const enEspanol = (items: readonly string[]) =>
  new Intl.ListFormat('es', { style: 'long', type: 'conjunction' }).format(items);

/**
 * Zonas de servicio (docs/estructura-sitio-digitalx.md sección 1). "Puebla" sola es la ciudad.
 * Los dos grupos son DATO INTERNO: no se muestran en el sitio. Lo único público es la lista de lugares (`texto`).
 */
const trasladoIncluido = ['Puebla', 'Atlixco', 'Izúcar de Matamoros'] as const;
const cargoAdicional = ['Tepeaca', 'San Martín Texmelucan', 'Amozoc'] as const;
const todas = [...trasladoIncluido, ...cargoAdicional];

export const zonas = {
  trasladoIncluido,
  cargoAdicional,
  /** Las 6 zonas, para los datos estructurados (areaServed). */
  todas,
  /** "Puebla, Atlixco, Izúcar de Matamoros, Tepeaca, San Martín Texmelucan, Amozoc y alrededores". */
  texto: enEspanol([...todas, 'alrededores']),
};

/**
 * Redes del negocio. [PENDIENTE: URLs de Facebook, Instagram, TikTok y del perfil de Google.] Mientras la URL sea
 * null la red no se muestra ni entra a sameAs: no se pintan enlaces vacíos ni con "#".
 */
const redesDelNegocio: { nombre: string; url: string | null }[] = [
  { nombre: 'Facebook', url: null },
  { nombre: 'Instagram', url: null },
  { nombre: 'TikTok', url: null },
  { nombre: 'Perfil de Google', url: null },
];

/** Solo las redes que ya tienen URL real. */
export const redesConUrl = <T extends { url: string | null }>(redes: T[]) =>
  redes.filter((red): red is T & { url: string } => red.url !== null);

export const negocio = {
  nombre: 'Digital X',
  url: 'https://digitalx.mx',
  // La idea nació en 2018 y el negocio se formalizó en 2021 (dato del dueño). foundingDate usa el año de la idea.
  fundacion: '2018',
  telefono: { pantalla: '+52 244 124 4913', tel: '+522441244913' },
  whatsapp: '522441244913',
  // [PENDIENTE: correo definitivo en digitalx.mx]
  correo: null as string | null,
  // Solo las redes con URL: el pie, el menú y sameAs leen esta lista y no pintan nada si está vacía.
  redes: redesConUrl(redesDelNegocio),
  // Pie de página: texto fijo, igual en todo el sitio, sin enlaces por ciudad (reglas-seo sección 4).
  textoCobertura: `Servicios de audio, video y tecnología en ${zonas.texto}.`,
  // [PENDIENTE: SEO de las páginas, ver reglas-seo sección 1]
  // Imagen genérica de marca (1200x630) para compartir enlaces; cada página puede pasar la suya.
  imagenOg: '/og-digitalx-1200x630.png' as string | null,
  // Logo para los datos estructurados: copia de brand/png/digitalx-logo-negro-1200.png (brand/ es la fuente).
  logo: '/logo-digitalx-negro-1200.png',
} as const;

/** @id del ProfessionalService: las demás páginas (por ejemplo, AboutPage) lo referencian en vez de duplicarlo. */
export const idNegocio = `${negocio.url}/#negocio`;

/**
 * Mensajes prellenados por página (reglas-seo sección 11).
 * [PENDIENTE: el dueño debe confirmar los mensajes propuestos]
 */
export const mensajesWhatsApp = {
  general: 'Hola, estoy interesado en una cotización. Servicio: __ Fecha: __ Lugar: __',
  rentaDeAudio:
    'Hola, necesito renta de audio y sonido para un evento. Fecha: __ Lugar: __ Personas: __ Tipo de evento: __',
  circuitoCerrado:
    'Hola, quiero cotizar circuito cerrado (cámaras en vivo en pantallas) para un evento. Fecha: __ Lugar: __ Tipo de evento: __',
  produccionDeVideos:
    'Hola, quiero cotizar video para un evento o un video promocional. Fecha: __ Lugar: __ Tipo de evento o de video: __ Duración aprox.: __',
  streaming:
    'Hola, quiero cotizar una transmisión en vivo. Fecha: __ Lugar: __ Tipo de evento: __ Plataforma (Facebook, YouTube...): __ Duración aprox.: __',
  drone:
    'Hola, quiero cotizar video o fotografía aérea con drone. Fecha: __ Lugar: __ Tipo de evento o proyecto: __ Interior o exterior: __ Qué quiero mostrar: __',
  recorridos360:
    'Hola, quiero cotizar un recorrido virtual 360. Fecha: __ Lugar: __ Tipo de espacio (hotel, restaurante, escuela, negocio...): __ Tamaño aprox.: __ Interior, exterior o aéreo: __',
  paginasWeb: 'Hola, quiero cotizar una página web. Negocio: __ Qué necesito: __',
  aplicacionesMoviles: 'Hola, quiero cotizar una aplicación móvil. Qué necesito resolver: __',
  desarrolloDeSoftware: 'Hola, quiero cotizar un proyecto de software. Qué necesito resolver: __',
  tiendaEnLinea: 'Hola, quiero cotizar una tienda en línea. Negocio: __ Qué voy a vender: __',
} as const;

export const waUrl = (mensaje: string = mensajesWhatsApp.general) =>
  `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(mensaje)}`;

export const telUrl = `tel:${negocio.telefono.tel}`;
