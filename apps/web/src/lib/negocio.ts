/**
 * Datos del negocio. Fuente única: docs/estructura-sitio-digitalx.md sección 1
 * y docs/reglas-seo-digitalx.md secciones 4, 11 y 13.
 * Todo dato faltante va como `null` y se oculta en la interfaz.
 */
export const negocio = {
  nombre: 'Digital X',
  url: 'https://digitalx.mx',
  telefono: { pantalla: '+52 244 124 4913', tel: '+522441244913' },
  whatsapp: '522441244913',
  // [PENDIENTE: correo definitivo en digitalx.mx]
  correo: null as string | null,
  // [PENDIENTE: URL de Facebook e Instagram]
  redes: [] as { nombre: string; url: string }[],
  // Solo zonas confirmadas. [PENDIENTE: confirmar Puebla (capital), Amozoc, Tepeaca]
  zonas: ['Atlixco', 'Izúcar de Matamoros'],
  textoCobertura:
    'Servicios de audio, video y tecnología en Atlixco, Izúcar de Matamoros y alrededores, Puebla.',
  // [PENDIENTE: SEO de las páginas, ver reglas-seo sección 1]
  // Imagen genérica de marca (1200x630) para compartir enlaces; cada página puede pasar la suya.
  imagenOg: '/og-digitalx-1200x630.png' as string | null,
} as const;

export const textoBotonWhatsApp = 'Cotiza tu evento o proyecto aquí';

/**
 * Mensajes prellenados por página (reglas-seo sección 11).
 * [PENDIENTE: el dueño debe confirmar los mensajes propuestos]
 */
export const mensajesWhatsApp = {
  general: 'Hola, estoy interesado en una cotización. Servicio: __ Fecha: __ Lugar: __',
  rentaDeSonido: 'Hola, necesito audio para un evento. Fecha: __ Lugar: __ Personas: __ Tipo de evento: __',
  instalacionDeAudio:
    'Hola, quiero cotizar una instalación de audio. Tipo de lugar (iglesia, escuela, restaurante, otro): __ Ubicación: __',
  grabacionDeEventos:
    'Hola, quiero cotizar la cobertura de video de un evento. Fecha: __ Lugar: __ Tipo de evento: __ ¿Necesito pantallas o transmisión?: __',
  videoParaRedes: 'Hola, me interesa video para redes sociales. Negocio: __ Qué necesito: __',
  streaming: 'Hola, quiero transmitir un evento en vivo. Fecha: __ Lugar: __ Plataforma(s): __',
  softwareALaMedida: 'Hola, quiero cotizar un proyecto de software. Qué necesito resolver: __',
  // [PENDIENTE: mensaje de Dron]
  dron: null,
} as const;

export const waUrl = (mensaje: string = mensajesWhatsApp.general) =>
  `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(mensaje)}`;

export const telUrl = `tel:${negocio.telefono.tel}`;
