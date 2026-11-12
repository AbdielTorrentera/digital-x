import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { categorias, guia } from './categorias.ts';
import { faltantesDePagina, servicios, slugs, textosDeBloques } from './servicios.ts';
import { mensajesWhatsApp } from '../lib/negocio.ts';
import { menu, paginas, slugDe, urlsPlaneadas } from '../lib/paginas.ts';
import { lista } from '../lib/servicios.ts';
import { comoTexto } from '../lib/texto.ts';

const registro = paginas.filter((p) => p.categoria);
const entradas = Object.entries(servicios);

// Todo el texto que se ve en las páginas de servicio, en bloques (para revisar reglas de vocabulario).
const bloquesDe = ([, c]) => [
  c.descripcion,
  c.para,
  c.incluye,
  ...(c.pagina?.ficha ?? []).map((f) => f.valor),
  ...(c.pagina?.descripcion?.parrafos ?? []),
  ...(c.pagina?.incluye ?? []),
  ...(c.pagina?.secciones ?? []).flatMap((s) => textosDeBloques(s.bloques)),
  (c.pagina?.incluyeNota ?? []).map((t) => (typeof t === 'string' ? t : t.texto)).join(''),
  ...(c.pagina?.tambien?.items ?? []).map((t) => t.texto),
  c.pagina?.tambien?.intro ?? '',
  c.pagina?.cotizacion?.texto ?? '',
  c.pagina?.cierre?.texto ?? '',
  ...(c.pagina?.faq ?? []).flatMap((f) => [f.pregunta, comoTexto(f.respuesta)]),
];
const bloques = [
  ...entradas.flatMap(bloquesDe),
  ...categorias.flatMap((c) => [
    c.para,
    c.intro,
    c.cierre.texto,
    ...c.faq.flatMap((f) => [f.pregunta, comoTexto(f.respuesta)]),
  ]),
].filter(Boolean);

test('los servicios del contenido son los del registro de páginas, en el mismo orden', () => {
  assert.deepEqual(
    slugs,
    registro.map((p) => slugDe(p.url)),
  );
  assert.deepEqual(Object.keys(servicios), [...slugs]);
});

test('los 10 titles miden ≤ 60 y las 10 metas ≤ 155, y ninguno se repite', () => {
  for (const [slug, c] of entradas) {
    assert.ok(c.title.length <= 60, `title de ${slug} mide ${c.title.length}`);
    assert.ok(c.title.endsWith(' | Digital X'), c.title);
    assert.ok(c.meta.length <= 155, `meta de ${slug} mide ${c.meta.length}`);
    assert.ok(c.h1.length > 0, `h1 de ${slug}`);
  }
  for (const campo of ['title', 'meta', 'h1', 'descripcion']) {
    const valores = entradas.map(([, c]) => c[campo]);
    assert.equal(new Set(valores).size, valores.length, `${campo} repetido`);
  }
});

test('cada meta nombra la zona (Puebla o Atlixco) e invita a cotizar por WhatsApp', () => {
  for (const [slug, c] of entradas) {
    assert.match(c.meta, /Puebla|Atlixco/, `meta de ${slug} sin zona`);
    assert.match(c.meta, /Cotiza por WhatsApp\.$/, `meta de ${slug} sin invitación a cotizar`);
  }
});

test('las descripciones confirmadas por el dueño no cambian de redacción', () => {
  assert.equal(
    servicios['renta-de-audio'].descripcion,
    'Equipo de audio y sonorización, con montaje y mezcla cuando tu evento lo necesita, y un técnico pendiente del sonido durante todo tu evento.',
  );
  assert.equal(
    servicios['circuito-cerrado-para-eventos'].descripcion,
    'Cámaras en vivo proyectadas en pantallas para que todo tu público vea el escenario.',
  );
  assert.equal(
    servicios['video-para-eventos'].descripcion,
    'Grabación profesional de conferencias, ceremonias y eventos, y videos institucionales y promocionales. Entregamos el video editado.',
  );
  assert.equal(
    servicios['desarrollo-de-software'].descripcion,
    'Software a la medida para que los procesos de tu negocio funcionen, desde el levantamiento de requerimientos hasta la implementación.',
  );
});

test('cada servicio de la guía "¿Qué servicios necesito?" (lista para activarse) existe y cada escenario recomienda al menos uno', () => {
  assert.equal(guia.items.length, 5);
  for (const { escenario, slugs: recomendados } of guia.items) {
    assert.ok(recomendados.length > 0, escenario);
    for (const slug of recomendados) assert.ok(slugs.includes(slug), `${slug} no es un servicio`);
  }
});

test('un servicio con la página construida trae todo su contenido (si no, el build se detiene)', () => {
  const construidas = registro.filter((p) => p.construida);
  assert.ok(construidas.length > 0);
  for (const p of construidas) assert.deepEqual(faltantesDePagina(slugDe(p.url)), [], p.url);
  // Y uno incompleto sí se detecta. Ya están los 10 servicios completos: a uno se le quita un campo solo durante la prueba.
  const pagina = servicios['renta-de-audio'].pagina;
  const { cierre } = pagina;
  try {
    delete pagina.cierre;
    assert.deepEqual(faltantesDePagina('renta-de-audio'), ['cierre']);
  } finally {
    pagina.cierre = cierre;
  }
});

test('renta de audio: todo el contenido migrado, la sección Sonorización y solo lo confirmado en "qué incluye"', () => {
  const pagina = servicios['renta-de-audio'].pagina;
  assert.equal(pagina.ficha.length, 3);
  assert.equal(pagina.faq.length, 4);
  assert.deepEqual(
    pagina.secciones.map((s) => s.id),
    ['sonorizacion'],
  );
  assert.deepEqual(pagina.incluye, [
    'Equipo de audio',
    'Sonorización',
    'Montaje y mezcla cuando tu evento lo necesita',
    'Técnico pendiente del sonido durante todo tu evento',
  ]);
  assert.equal(servicios['renta-de-audio'].mensaje, mensajesWhatsApp.rentaDeAudio);
  // Cumple SEO §4: enlaza a circuito cerrado, producción de videos y transmisión en vivo, a /proyectos/ y a condiciones.
  const destinos = pagina.tambien.items.map((i) => i.slug ?? i.url);
  for (const esperado of [
    'circuito-cerrado-para-eventos',
    'video-para-eventos',
    'streaming-para-eventos',
    '/proyectos/',
    '/condiciones-de-contratacion/',
  ]) {
    assert.ok(destinos.includes(esperado), `falta ${esperado}`);
  }
  for (const item of pagina.tambien.items) {
    if (item.url) assert.ok(urlsPlaneadas.includes(item.url), `${item.url} no está en lanzamiento`);
  }
});

test('circuito cerrado: página completa, sección Pantalla LED o televisor, 5 FAQ propias y sin galería ni hablar de grabar', () => {
  const c = servicios['circuito-cerrado-para-eventos'];
  const pagina = c.pagina;
  assert.equal(pagina.ficha.length, 3);
  assert.equal(pagina.descripcion.parrafos.length, 2);
  assert.equal(pagina.faq.length, 5);
  assert.deepEqual(
    pagina.secciones.map((s) => [s.id, s.etiqueta, s.titulo]),
    [['pantallas', 'Pantallas', 'Pantalla LED o televisor']],
  );
  // La explicación de LED o televisor vive solo en la sección: ninguna FAQ repite sus oraciones.
  const oracionesDe = (t) => t.split(/(?<=[.!?])\s+/).map((o) => o.trim());
  const deLaSeccion = new Set(pagina.secciones.flatMap((s) => textosDeBloques(s.bloques).flatMap(oracionesDe)));
  for (const faq of pagina.faq) {
    for (const oracion of oracionesDe(faq.respuesta)) assert.ok(!deLaSeccion.has(oracion), `FAQ repite: ${oracion}`);
  }
  assert.ok(!/LED|televisor/i.test(JSON.stringify(pagina.faq)), 'LED y televisores solo se explican en la sección');
  assert.equal(c.mensaje, mensajesWhatsApp.circuitoCerrado);
  // Cámaras en vivo en pantallas para que todos vean el escenario, a la vista (ficha) y en la descripción.
  assert.equal(
    pagina.ficha[0].valor,
    'Cámaras en vivo en pantallas durante tu evento, para que todos vean el escenario',
  );
  assert.equal(
    pagina.descripcion.parrafos[0],
    'El circuito cerrado para eventos es proyección en vivo: cámaras cuya imagen se ve en pantallas dentro del mismo lugar, para que todo tu público vea lo que pasa en el escenario.',
  );
  assert.equal(
    c.meta,
    'Circuito cerrado y pantallas LED o TV para eventos en Puebla: cámaras en vivo con operador para que todos vean el escenario. Cotiza por WhatsApp.',
  );
  assert.ok(pagina.incluye.some((i) => /las coordinamos/.test(i)));
  // Lo que incluye es lo confirmado por el dueño, ni más ni menos.
  assert.deepEqual(pagina.incluye, [
    'Personal que opera las cámaras durante tu evento',
    'Una o varias cámaras en vivo, según tu evento',
    'La imagen en vivo en las pantallas del lugar',
    'Pantallas para eventos, si las necesitas: las coordinamos y van incluidas en tu cotización',
    'Montaje e instalación del equipo',
  ]);
  // Ningún texto de la página dice si graba o no: el video va por su propio servicio.
  const texto = JSON.stringify(pagina);
  assert.ok(!/grab/i.test(texto), 'la página no habla de grabar');
  // El enlace cruzado de SEO §4: renta de audio, producción de videos y transmisión en vivo, /proyectos/ y condiciones.
  const destinos = pagina.tambien.items.map((i) => i.slug ?? i.url);
  for (const esperado of [
    'renta-de-audio',
    'video-para-eventos',
    'streaming-para-eventos',
    '/proyectos/',
    '/condiciones-de-contratacion/',
  ]) {
    assert.ok(destinos.includes(esperado), `falta ${esperado}`);
  }
});

test('video para eventos: SEO, ficha, qué incluye, secciones en orden, proyectos y 5 FAQ sin repetir lo que dicen las secciones', () => {
  const c = servicios['video-para-eventos'];
  const pagina = c.pagina;
  assert.equal(c.title, 'Video para eventos y conferencias en Puebla | Digital X');
  assert.equal(c.title.length, 55);
  assert.equal(
    c.meta,
    'Grabación de video para conferencias, eventos corporativos, talleres y ceremonias en Puebla y Atlixco. Entregamos el video editado. Cotiza por WhatsApp.',
  );
  assert.equal(c.meta.length, 152);
  assert.equal(c.h1, 'Video para eventos y conferencias en Puebla');
  assert.equal(c.serviceType, 'Producción de video para eventos, conferencias y videos institucionales');
  assert.deepEqual(
    pagina.ficha.map((f) => [f.etiqueta, f.valor]),
    [
      ['Para', 'Eventos, conferencias, empresas e instituciones'],
      ['Equipo', 'Al menos dos personas y hasta tres cámaras'],
      ['Entrega', 'Video editado; material sin editar si lo acordamos'],
    ],
  );
  assert.equal(pagina.incluye.length, 5);
  assert.deepEqual(
    pagina.secciones.map((s) => s.id),
    ['para-que-eventos', 'cobertura', 'video-institucional', 'entrega', 'precio'],
  );
  assert.equal(pagina.secciones[0].bloques[0].lista.length, 6);
  assert.equal(pagina.secciones[1].bloques[0].puntos.length, 3);
  assert.equal(pagina.secciones[4].bloques[0].lista.length, 6);
  assert.equal(pagina.faq.length, 5);
  assert.equal(c.mensaje, mensajesWhatsApp.produccionDeVideos);
  // La nota bajo "Qué incluye" enlaza a transmisión en vivo y a circuito cerrado para eventos.
  assert.deepEqual(
    pagina.incluyeNota.filter((t) => typeof t !== 'string').map((t) => t.slug),
    ['streaming-para-eventos', 'circuito-cerrado-para-eventos'],
  );
  // Ninguna FAQ repite oraciones de las secciones, de la descripción ni de lo que incluye.
  const oracionesDe = (t) => t.split(/(?<=[.!?])\s+/).map((o) => o.trim());
  const delResto = new Set(
    [
      ...pagina.descripcion.parrafos,
      ...pagina.incluye,
      ...pagina.secciones.flatMap((s) => textosDeBloques(s.bloques)),
      (pagina.incluyeNota ?? []).map((t) => (typeof t === 'string' ? t : t.texto)).join(''),
    ].flatMap(oracionesDe),
  );
  for (const faq of pagina.faq) {
    for (const oracion of oracionesDe(faq.respuesta)) assert.ok(!delResto.has(oracion), `FAQ repite: ${oracion}`);
  }
});

test('video para eventos: sin eventos sociales, plazos, precios ni marcas de equipo', () => {
  const texto = JSON.stringify(servicios['video-para-eventos']);
  assert.ok(!/boda|xv\b|quince|bautizo|fiesta|social/i.test(texto), 'eventos sociales en la página');
  assert.ok(!/\d+\s*(d[ií]as|horas|semanas|meses)/i.test(texto), 'plazo de entrega publicado');
  assert.ok(
    !/\$\s?\d|MXN|precio de|desde \d/i.test(texto.replace(/De qué depende el precio/g, '')),
    'precio publicado',
  );
  assert.ok(!/sony|canon|nikon|blackmagic|panasonic|dji|gopro|rode|sennheiser|shure/i.test(texto), 'marca de equipo');
});

test('video con drone: SEO, ficha, qué incluye, secciones en orden, enlace dentro de un punto y 5 FAQ sin repetir lo que dicen las secciones', () => {
  const c = servicios['video-con-drone'];
  const pagina = c.pagina;
  assert.equal(c.title, 'Video y fotografía aérea con drone en Puebla | Digital X');
  assert.equal(c.title.length, 56);
  assert.equal(c.h1, 'Video y fotografía aérea con drone en Puebla');
  assert.equal(
    c.meta,
    'Video y fotografía aérea con drone para eventos, empresas y espacios en Puebla y Atlixco. Entregamos video y fotos. Cotiza por WhatsApp.',
  );
  assert.ok(c.meta.length <= 155);
  assert.equal(c.serviceType, 'Video y fotografía aérea con drone');
  assert.equal(
    c.descripcion,
    'Video y fotografía aérea con drone para eventos, empresas y espacios, en exteriores e interiores.',
  );
  assert.equal(c.mensaje, mensajesWhatsApp.drone);
  assert.deepEqual(
    pagina.ficha.map((f) => f.etiqueta),
    ['Tomas', 'Entrega', 'Para'],
  );
  assert.deepEqual(pagina.incluye, [
    'Planeación de las tomas contigo',
    'Revisión del lugar y de las condiciones antes de volar',
    'Grabación con drone y piloto en el lugar, en exteriores o interiores',
    'Tomas en los momentos clave de tu evento',
    'Entrega del material: video editado, tomas sin editar o ambos, y fotografía aérea, según lo que acordemos en la cotización',
  ]);
  assert.deepEqual(
    pagina.incluyeNota.filter((t) => typeof t !== 'string').map((t) => t.slug),
    ['video-para-eventos', 'streaming-para-eventos', 'circuito-cerrado-para-eventos'],
  );
  assert.deepEqual(
    pagina.secciones.map((s) => s.id),
    ['fotografia-aerea', 'para-que-sirve', 'exteriores-e-interiores', 'precio'],
  );
  // "Para qué sirve": 3 puntos y el tercero lleva el enlace al recorrido virtual 360 (su tarjeta, mientras no esté publicado).
  const puntos = pagina.secciones[1].bloques[0].puntos;
  assert.deepEqual(
    puntos.map((p) => p.titulo),
    ['Eventos', 'Empresas y negocios', 'Espacios'],
  );
  assert.deepEqual(
    puntos[2].texto.filter((t) => typeof t !== 'string'),
    [{ slug: 'recorridos-virtuales-360', texto: 'recorrido virtual 360' }],
  );
  assert.ok(textosDeBloques(pagina.secciones[1].bloques)[2].includes('recorrido virtual 360.'));
  assert.equal(pagina.faq.length, 5);
  // Ninguna FAQ repite oraciones de la descripción, de lo que incluye, de la nota ni de las secciones.
  const oracionesDe = (t) => t.split(/(?<=[.!?])\s+/).map((o) => o.trim());
  const delResto = new Set(
    [
      ...pagina.descripcion.parrafos,
      ...pagina.incluye,
      ...pagina.secciones.flatMap((s) => textosDeBloques(s.bloques)),
      pagina.incluyeNota.map((t) => (typeof t === 'string' ? t : t.texto)).join(''),
    ].flatMap(oracionesDe),
  );
  for (const faq of pagina.faq) {
    for (const oracion of oracionesDe(faq.respuesta)) assert.ok(!delResto.has(oracion), `FAQ repite: ${oracion}`);
  }
});

test('video con drone: sin afirmaciones legales, autoridad, cifras de peso o baterías, vuelo sobre personas ni eventos sociales', () => {
  const texto = JSON.stringify(servicios['video-con-drone']);
  assert.ok(
    !/permiso|autoriz|certific|registrad|AFAC|aeron[aá]utic|norma(tiva)?\b|cumpl/i.test(texto),
    'afirmación legal',
  );
  assert.ok(
    !/\d+\s*(g|gr|gramos|kg|kilos|min|minutos|horas|mah|km|metros|m)\b/i.test(texto),
    'peso, batería o distancia con cifra',
  );
  assert.ok(
    !/sobre (las |los )?(personas|invitados|asistentes|gente|p[uú]blico)|encima de/i.test(texto),
    'vuelo sobre personas',
  );
  assert.ok(!/dji|mavic|phantom|inspire|mini ?[234]|autel|parrot|skydio/i.test(texto), 'marca o modelo');
  assert.ok(!/boda|xv\b|quince|bautizo|fiesta|social/i.test(texto), 'eventos sociales');
  assert.ok(!/\$\s?\d|MXN|desde \d/i.test(texto), 'precio publicado');
  assert.ok(/\bdrone\b/.test(texto) && !/\bdron\b/i.test(texto), 'solo "drone"');
  // La única mención de reglas de vuelo permitida: las zonas restringidas cercanas a aeropuertos.
  assert.equal(texto.match(/restringid/gi)?.length, 1);
});

test('recorridos virtuales 360: SEO, ficha, qué incluye, secciones en orden y 5 FAQ sin repetir lo que dicen las secciones ni la nota', () => {
  const c = servicios['recorridos-virtuales-360'];
  const pagina = c.pagina;
  assert.equal(c.title, 'Recorridos virtuales 360 para negocios en Puebla | Digital X');
  assert.ok(c.title.length <= 60);
  assert.equal(c.h1, 'Recorridos virtuales 360 para negocios y espacios en Puebla');
  assert.equal(
    c.meta,
    'Recorridos virtuales 360 con drone y cámara 360 para negocios, hoteles, restaurantes y escuelas en Puebla y Atlixco. Cotiza por WhatsApp.',
  );
  assert.ok(c.meta.length <= 155);
  assert.equal(c.serviceType, 'Recorridos virtuales y fotografía 360');
  assert.equal(
    c.descripcion,
    'Recorridos virtuales con fotos 360 enlazadas para hoteles, restaurantes, escuelas, museos y negocios, con drone y cámara 360.',
  );
  assert.equal(c.incluye, 'Fotos 360 enlazadas');
  assert.equal(c.mensaje, mensajesWhatsApp.recorridos360);
  assert.deepEqual(
    pagina.ficha.map((f) => f.etiqueta),
    ['Qué es', 'Captura', 'Para'],
  );
  assert.equal(pagina.incluye.length, 5);
  assert.deepEqual(
    pagina.incluyeNota.filter((t) => typeof t !== 'string').map((t) => t.slug),
    ['video-con-drone', 'video-para-eventos'],
  );
  assert.deepEqual(
    pagina.secciones.map((s) => s.id),
    ['google-maps', 'para-que-sirve', 'como-lo-hacemos', 'precio'],
  );
  assert.equal(pagina.secciones[1].bloques[0].lista.length, 4);
  assert.equal(pagina.secciones[2].bloques[0].lista.length, 4);
  assert.equal(pagina.secciones[3].bloques[0].lista.length, 5);
  assert.equal(pagina.faq.length, 5);
  assert.deepEqual(pagina.faq[2], {
    pregunta: '¿Lo puedo poner en mi página web?',
    respuesta: 'Sí, según la plataforma que elijas.',
  });
  // Ninguna FAQ repite oraciones de la descripción, de lo que incluye, de la nota ni de las secciones.
  const oracionesDe = (t) => t.split(/(?<=[.!?])\s+/).map((o) => o.trim());
  const delResto = new Set(
    [
      ...pagina.descripcion.parrafos,
      ...pagina.incluye,
      ...pagina.secciones.flatMap((s) => textosDeBloques(s.bloques)),
      pagina.incluyeNota.map((t) => (typeof t === 'string' ? t : t.texto)).join(''),
    ].flatMap(oracionesDe),
  );
  for (const faq of pagina.faq) {
    for (const oracion of oracionesDe(faq.respuesta)) assert.ok(!delResto.has(oracion), `FAQ repite: ${oracion}`);
  }
});

test('recorridos virtuales 360: sin relación con Google, marcas ni plataformas, sin prometer Google Maps, equipo propio, plazos ni precios', () => {
  const c = servicios['recorridos-virtuales-360'];
  // "Google" solo vive en la sección "Google Maps", que no promete que el recorrido completo aparezca allí.
  const { secciones, ...resto } = c.pagina;
  const sinGoogleMaps = JSON.stringify({
    ...c,
    pagina: { ...resto, secciones: secciones.filter((s) => s.id !== 'google-maps') },
  });
  assert.ok(!/google/i.test(sinGoogleMaps), '"Google" fuera de la sección Google Maps');
  const googleMaps = JSON.stringify(secciones.find((s) => s.id === 'google-maps'));
  assert.match(googleMaps, /no aparece automáticamente/);
  assert.ok(
    !/aparece(r[aá])? (el recorrido )?(completo )?en google|se publica(r[aá])? (el recorrido )?completo/i.test(
      googleMaps,
    ),
    'promete el recorrido en Google Maps',
  );
  const texto = JSON.stringify(c);
  assert.ok(
    !/acreditad|certificad|confianza de google|socio de google|partner|agencia de google|verificad/i.test(texto),
    'relación con Google',
  );
  assert.ok(
    !/matterport|kuula|street ?view|3dvista|cloudpano|ricoh|theta|insta360|gopro|dji|my360|roundme|panoee|zillow/i.test(
      texto,
    ),
    'marca o plataforma',
  );
  assert.ok(
    !/nuestras? c[aá]maras? 360|c[aá]mara 360 propia|equipo propio|tenemos (una )?c[aá]mara/i.test(texto),
    'equipo propio',
  );
  // "Cámara 360" siempre con "cuando el proyecto lo requiere" en el cuerpo de la página (la meta y la descripción corta, aparte).
  const cuerpo = JSON.stringify(c.pagina);
  assert.equal(
    (cuerpo.match(/c[aá]mara 360/gi) ?? []).length,
    (cuerpo.match(/c[aá]mara 360 cuando el proyecto lo requiere/gi) ?? []).length,
    '"cámara 360" sin "cuando el proyecto lo requiere"',
  );
  assert.ok(!/\d+\s*(d[ií]as|horas|semanas|meses)/i.test(texto), 'plazo publicado');
  assert.ok(!/\$\s?\d|MXN|desde \d/i.test(texto), 'precio publicado');
  assert.ok(!/boda|xv\b|quince|bautizo|fiesta|social/i.test(texto), 'eventos sociales');
  assert.ok(!/\bdron\b/i.test(texto), '"dron"');
});

test('páginas web: SEO, ficha, qué incluye, secciones en orden, enlaces dentro de los párrafos y 5 FAQ sin repetir lo que dicen las secciones ni la nota', () => {
  const c = servicios['paginas-web'];
  const pagina = c.pagina;
  assert.equal(c.title, 'Diseño de páginas web en Puebla y Atlixco | Digital X');
  assert.equal(c.h1, 'Diseño y desarrollo de páginas web en Puebla');
  assert.equal(
    c.meta,
    'Diseño y desarrollo de páginas web y landing pages para negocios en Puebla y Atlixco. Dominio y hosting aparte. Cotiza por WhatsApp.',
  );
  assert.ok(c.meta.length <= 155);
  assert.equal(c.serviceType, 'Diseño y desarrollo de páginas web y landing pages');
  assert.equal(
    c.descripcion,
    'Diseño y desarrollo de páginas web y landing pages para negocios, con dominio y hosting aparte.',
  );
  assert.equal(c.mensaje, mensajesWhatsApp.paginasWeb);
  assert.equal(
    mensajesWhatsApp.paginasWeb,
    'Hola, quiero cotizar una página web. Tipo de negocio: __ ¿Landing page o varias secciones?: __ ¿Ya tienes logo, textos y fotos?: __ ¿Tienes dominio?: __',
  );
  assert.deepEqual(pagina.ficha, [
    { etiqueta: 'Tipos', valor: 'Landing page, página informativa o sitio con funciones' },
    { etiqueta: 'Administración', valor: 'Parte administrable básica' },
    { etiqueta: 'Dominio y hosting', valor: 'Aparte y a tu nombre' },
  ]);
  assert.equal(pagina.descripcion.parrafos.length, 2);
  assert.deepEqual(pagina.incluye, [
    'Levantamiento de requerimientos e información de tu negocio',
    'Diseño de la página',
    'Desarrollo de la página, adaptada a celular',
    'Una parte administrable básica para que actualices algunos contenidos',
    'Publicación del sitio',
    'Hasta 3 ajustes pequeños al entregar',
  ]);
  assert.deepEqual(
    pagina.secciones.map((s) => [s.id, s.etiqueta, s.titulo]),
    [
      ['tipos-de-pagina', 'Tipos de página', 'Tipos de página'],
      ['posicionamiento', 'Posicionamiento', 'Posicionamiento en Google'],
      ['precio', 'Precio', 'De qué depende el precio'],
    ],
  );
  const [tipos, posicionamiento, precio] = pagina.secciones;
  assert.deepEqual(
    tipos.bloques[0].puntos.map((p) => p.titulo),
    ['Landing page', 'Página informativa', 'Sitio con funciones'],
  );
  assert.equal(precio.bloques[0].lista.length, 5);
  // Los párrafos de "Tipos de página" y de "precio" llevan enlaces: a tres servicios y a las condiciones de contratación.
  assert.deepEqual(
    tipos.bloques[1].parrafo.filter((t) => typeof t !== 'string').map((t) => t.slug),
    ['tienda-en-linea', 'aplicaciones-moviles', 'desarrollo-de-software'],
  );
  assert.equal(
    textosDeBloques(tipos.bloques)[3],
    'Si lo que quieres es vender por internet, mira nuestra página de tienda en línea. Si necesitas algo más a la medida, consulta aplicaciones móviles y desarrollo de software.',
  );
  assert.equal(
    textosDeBloques(precio.bloques)[5],
    'El pago se hace por etapas, como explican nuestras condiciones de contratación.',
  );
  const enlaceDeCondiciones = precio.bloques[1].parrafo.filter((t) => typeof t !== 'string');
  assert.deepEqual(enlaceDeCondiciones, [
    { url: '/condiciones-de-contratacion/', texto: 'condiciones de contratación' },
  ]);
  for (const { url } of enlaceDeCondiciones) assert.ok(urlsPlaneadas.includes(url), url);
  assert.deepEqual(
    pagina.tambien.items.map((i) => i.slug ?? i.url),
    [
      'tienda-en-linea',
      'aplicaciones-moviles',
      'desarrollo-de-software',
      'video-con-drone',
      'video-para-eventos',
      '/proyectos/',
      '/condiciones-de-contratacion/',
    ],
  );
  assert.deepEqual(
    pagina.faq.map((f) => f.pregunta),
    [
      '¿Cuánto tarda en hacerse?',
      '¿Pago una sola vez?',
      '¿Puedo actualizar mi página yo mismo?',
      '¿Puedo cambiarle todo después de la entrega?',
      '¿Qué diferencia hay entre una página web y una tienda en línea?',
    ],
  );
  // Ninguna FAQ repite oraciones de la descripción, de lo que incluye, de la nota ni de las secciones.
  const oracionesDe = (t) => t.split(/(?<=[.!?])\s+/).map((o) => o.trim());
  const delResto = new Set(
    [
      ...pagina.descripcion.parrafos,
      ...pagina.incluye,
      ...pagina.secciones.flatMap((s) => textosDeBloques(s.bloques)),
      pagina.incluyeNota.map((t) => (typeof t === 'string' ? t : t.texto)).join(''),
    ].flatMap(oracionesDe),
  );
  for (const faq of pagina.faq) {
    for (const oracion of oracionesDe(faq.respuesta)) assert.ok(!delResto.has(oracion), `FAQ repite: ${oracion}`);
  }
  // La sección de posicionamiento no promete nada: dice lo contrario, con las palabras aprobadas.
  assert.match(
    posicionamiento.bloques[0].parrafo,
    /^Una página nueva no aparece sola arriba en los resultados de Google\./,
  );
});

test('páginas web: sin precios, plazos, porcentajes, marcas ni promesas de posicionamiento, y "Google" solo en su sección', () => {
  const c = servicios['paginas-web'];
  const { secciones, ...resto } = c.pagina;
  const sinPosicionamiento = JSON.stringify({
    ...c,
    pagina: { ...resto, secciones: secciones.filter((s) => s.id !== 'posicionamiento') },
  });
  assert.ok(!/google/i.test(sinPosicionamiento), '"Google" fuera de la sección de posicionamiento');
  const texto = JSON.stringify(c);
  assert.ok(!/\$|MXN|\bIVA\b|desde \d/i.test(texto), 'precio publicado');
  assert.ok(!/%|por ciento|anticipo|\d+\s*pagos?/i.test(texto), 'porcentaje o cifra de pagos');
  assert.ok(
    !/primeros lugares|primer lugar|SEO|garantiz|garant[ií]a|posicionamiento garantizado/i.test(texto),
    'promesa',
  );
  // La única cifra de toda la página es "Hasta 3 ajustes pequeños".
  // (Sin la clave "h1" del JSON, que no es texto.)
  assert.ok(
    !/\d/.test(texto.replace('"h1":', '').replace('Hasta 3 ajustes pequeños al entregar', '')),
    'cifra publicada',
  );
  assert.ok(!/\d+\s*(d[ií]as|horas|semanas|meses)/i.test(texto), 'plazo publicado');
  assert.ok(
    !/wordpress|wix|shopify|woocommerce|squarespace|webflow|godaddy|hostinger|elementor|canva|figma|vercel|sanity|astro|react|cloudflare/i.test(
      texto,
    ),
    'marca o plataforma',
  );
  assert.ok(!/\bdron\b/i.test(texto), '"dron"');
});

test('tienda en línea: SEO, ficha, qué incluye, secciones en orden, enlaces dentro de los párrafos y 5 FAQ sin repetir lo que dicen las secciones ni la nota', () => {
  const c = servicios['tienda-en-linea'];
  const pagina = c.pagina;
  assert.equal(c.title, 'Tienda en línea en Puebla y Atlixco | Digital X');
  assert.ok(c.title.length <= 60);
  assert.equal(c.h1, 'Diseño y desarrollo de tiendas en línea en Puebla');
  assert.equal(
    c.meta,
    'Diseño y desarrollo de tiendas en línea para negocios en Puebla y Atlixco: catálogo, carrito y pagos en línea. Cotiza por WhatsApp.',
  );
  assert.ok(c.meta.length <= 155);
  assert.equal(c.serviceType, 'Diseño y desarrollo de tiendas en línea');
  assert.equal(
    c.descripcion,
    'Diseño y desarrollo de tiendas en línea para negocios que quieren vender por internet, con dominio y hosting aparte.',
  );
  assert.equal(c.mensaje, mensajesWhatsApp.tiendaEnLinea);
  assert.equal(
    mensajesWhatsApp.tiendaEnLinea,
    'Hola, quiero cotizar una tienda en línea. Qué vendo: __ Aprox. cuántos productos: __ ¿Ya tienes fotos y descripciones?: __ ¿Ya tienes dominio?: __',
  );
  assert.deepEqual(pagina.ficha, [
    { etiqueta: 'Funciones', valor: 'Catálogo, carrito, pagos en línea y pedidos' },
    { etiqueta: 'Administración', valor: 'Tú administras tus productos' },
    { etiqueta: 'Dominio y hosting', valor: 'Van aparte, a tu nombre' },
  ]);
  assert.equal(pagina.descripcion.parrafos.length, 2);
  assert.deepEqual(pagina.incluye, [
    'Levantamiento de requerimientos: qué vendes, a quién y cómo',
    'Diseño y desarrollo de la tienda, adaptada a celular',
    'Catálogo de productos que tú administras',
    'Carrito de compras',
    'Pagos en línea con la pasarela que elijas',
    'Panel para ver tus pedidos',
    'Opciones de envío o entrega, según lo que necesites',
    'Publicación de la tienda y hasta 3 ajustes pequeños cuando te la entregamos',
  ]);
  assert.deepEqual(
    pagina.secciones.map((s) => [s.id, s.etiqueta, s.titulo]),
    [
      ['que-necesitas', 'Qué necesitas', 'Qué necesitas para abrir una tienda en línea'],
      ['tienda-o-pagina', 'Tienda o página web', '¿Tienda en línea o página web?'],
      ['precio', 'Precio', 'De qué depende el precio'],
    ],
  );
  const [necesitas, tiendaOPagina, precio] = pagina.secciones;
  assert.equal(necesitas.bloques[0].lista.length, 4);
  assert.equal(precio.bloques[0].lista.length, 5);
  // Los párrafos de "¿Tienda en línea o página web?" y de "precio" llevan enlaces: a páginas web y a las condiciones.
  assert.deepEqual(
    tiendaOPagina.bloques[0].parrafo.filter((t) => typeof t !== 'string'),
    [{ slug: 'paginas-web', texto: 'página web' }],
  );
  const enlaceDeCondiciones = precio.bloques[1].parrafo.filter((t) => typeof t !== 'string');
  assert.deepEqual(enlaceDeCondiciones, [
    { url: '/condiciones-de-contratacion/', texto: 'condiciones de contratación' },
  ]);
  for (const { url } of enlaceDeCondiciones) assert.ok(urlsPlaneadas.includes(url), url);
  assert.deepEqual(
    pagina.tambien.items.map((i) => i.slug ?? i.url),
    [
      'paginas-web',
      'aplicaciones-moviles',
      'desarrollo-de-software',
      'video-con-drone',
      'video-para-eventos',
      '/proyectos/',
      '/condiciones-de-contratacion/',
    ],
  );
  assert.deepEqual(
    pagina.faq.map((f) => f.pregunta),
    [
      '¿Puedo administrar mis productos yo mismo?',
      '¿Con qué medio de pago cobro?',
      '¿Cómo se hacen los envíos?',
      '¿Cuál es la mejor plataforma para mi tienda?',
      '¿Cuánto tarda en estar lista?',
    ],
  );
  // Ninguna FAQ repite oraciones de la descripción, de lo que incluye, de la nota ni de las secciones.
  const oracionesDe = (t) => t.split(/(?<=[.!?])\s+/).map((o) => o.trim());
  const delResto = new Set(
    [
      ...pagina.descripcion.parrafos,
      ...pagina.incluye,
      ...pagina.secciones.flatMap((s) => textosDeBloques(s.bloques)),
      pagina.incluyeNota.map((t) => (typeof t === 'string' ? t : t.texto)).join(''),
    ].flatMap(oracionesDe),
  );
  for (const faq of pagina.faq) {
    for (const oracion of oracionesDe(faq.respuesta)) assert.ok(!delResto.has(oracion), `FAQ repite: ${oracion}`);
  }
});

test('tienda en línea: sin viñetas ni frases iguales a las de páginas web, aunque sean cortas', () => {
  const textos = (slug) =>
    [
      ...servicios[slug].pagina.incluye,
      ...servicios[slug].pagina.secciones.flatMap((s) => textosDeBloques(s.bloques)),
      // Solo los enlaces a servicios: el de Proyectos es el mismo texto en todas las páginas.
      ...servicios[slug].pagina.tambien.items.filter((i) => 'slug' in i).map((i) => i.texto),
    ].map((t) => t.trim());
  const deWeb = new Set(textos('paginas-web'));
  for (const texto of textos('tienda-en-linea')) assert.ok(!deWeb.has(texto), `ya está en páginas web: ${texto}`);
});

test('tienda en línea: sin precios, plazos, porcentajes, marcas ni promesas, sin decir si es a la medida o sobre una plataforma', () => {
  const c = servicios['tienda-en-linea'];
  const texto = JSON.stringify(c);
  assert.ok(!/\$|MXN|\bIVA\b|desde \d/i.test(texto), 'precio publicado');
  assert.ok(!/%|por ciento|anticipo|\d+\s*pagos?/i.test(texto), 'porcentaje o cifra de pagos');
  assert.ok(!/google|posicionamiento|SEO|garantiz|garant[ií]a/i.test(texto), 'promesa de posicionamiento');
  assert.ok(!/ventas|vender m[aá]s|aument|increment|resultados/i.test(texto), 'promesa de ventas');
  // La única cifra de toda la página es "hasta 3 ajustes pequeños".
  assert.ok(
    !/\d/.test(
      texto
        .replace('"h1":', '')
        .replace('Publicación de la tienda y hasta 3 ajustes pequeños cuando te la entregamos', ''),
    ),
    'cifra publicada',
  );
  assert.ok(!/\d+\s*(d[ií]as|horas|semanas|meses)/i.test(texto), 'plazo publicado');
  assert.ok(
    !/shopify|woocommerce|wix|squarespace|prestashop|magento|tiendanube|mercado ?(pago|libre)|paypal|stripe|conekta|openpay|clip\b|oxxo|visa|mastercard|amazon|wordpress|vercel|sanity|astro|react/i.test(
      texto,
    ),
    'marca, plataforma o pasarela',
  );
  assert.ok(!/a la medida|propia|propio|desde cero|open source/i.test(texto), 'dice cómo se construye la tienda');
  // "Plataforma" solo en la pregunta de la mejor plataforma, sin decir cuál ni si hay una propia.
  const { faq, ...resto } = c.pagina;
  const sinFaqDePlataforma = JSON.stringify({
    ...c,
    pagina: { ...resto, faq: faq.filter((f) => !/plataforma/i.test(f.pregunta)) },
  });
  assert.ok(!/plataforma/i.test(sinFaqDePlataforma), '"plataforma" fuera de su pregunta');
  assert.ok(!/\bdron\b/i.test(texto), '"dron"');
});

test('aplicaciones móviles: SEO, ficha, qué incluye, secciones en orden, enlaces dentro de los párrafos y 5 FAQ sin repetir lo que dicen las secciones ni la nota', () => {
  const c = servicios['aplicaciones-moviles'];
  const pagina = c.pagina;
  assert.equal(c.title, 'Desarrollo de aplicaciones móviles en Puebla | Digital X');
  assert.equal(c.h1, 'Desarrollo de aplicaciones móviles en Puebla');
  assert.equal(
    c.meta,
    'Desarrollo de aplicaciones móviles para iPhone y Android: registros, clientes, reservas y catálogos, en Puebla y Atlixco. Cotiza por WhatsApp.',
  );
  assert.ok(c.meta.length <= 155);
  assert.equal(c.serviceType, 'Desarrollo de aplicaciones móviles a la medida');
  assert.equal(
    c.descripcion,
    'Aplicaciones móviles a la medida para iPhone y Android: registros, clientes, reservas y catálogos.',
  );
  // La fila "Incluye" de la tarjeta va en el mismo orden que la ficha, la meta y la descripción corta: iPhone y Android.
  assert.equal(c.incluye, 'iPhone y Android');
  assert.equal(c.mensaje, mensajesWhatsApp.aplicacionesMoviles);
  assert.equal(
    mensajesWhatsApp.aplicacionesMoviles,
    'Hola, quiero cotizar una aplicación móvil. Para qué la necesito (registros, clientes, reservas, catálogo...): __ ¿Quiénes la usarían?: __ ¿Ya tienes alguna página, app o sistema?: __',
  );
  assert.deepEqual(pagina.ficha, [
    { etiqueta: 'Plataformas', valor: 'iPhone y Android' },
    { etiqueta: 'Para', valor: 'Negocios e instituciones' },
    { etiqueta: 'Entrega', valor: 'Implementación y capacitación' },
  ]);
  assert.equal(pagina.descripcion.parrafos.length, 2);
  assert.deepEqual(pagina.incluye, [
    'Levantamiento de requerimientos: qué debe hacer la app y quién la va a usar',
    'Desarrollo de una aplicación multiplataforma, que funciona en iPhone y Android',
    'Implementación',
    'Capacitación para usarla',
    'Publicación en las tiendas de aplicaciones, si lo requieres',
  ]);
  assert.deepEqual(
    pagina.secciones.map((s) => [s.id, s.etiqueta, s.titulo]),
    [
      ['tipos-de-aplicaciones', 'Tipos de aplicaciones', 'Qué tipo de aplicaciones hacemos'],
      ['app-o-pagina-web', 'App o página web', '¿App o página web?'],
      ['precio', 'Precio', 'De qué depende el precio'],
    ],
  );
  const [tipos, appOPagina, precio] = pagina.secciones;
  assert.equal(tipos.bloques[1].lista.length, 4);
  assert.equal(precio.bloques[0].lista.length, 5);
  // Los párrafos de "¿App o página web?" y de "precio" llevan enlaces: a páginas web y tienda en línea, y a las condiciones.
  assert.deepEqual(
    appOPagina.bloques[0].parrafo.filter((t) => typeof t !== 'string').map((t) => t.slug),
    ['paginas-web', 'tienda-en-linea'],
  );
  const enlaceDeCondiciones = precio.bloques[1].parrafo.filter((t) => typeof t !== 'string');
  assert.deepEqual(enlaceDeCondiciones, [
    { url: '/condiciones-de-contratacion/', texto: 'condiciones de contratación' },
  ]);
  for (const { url } of enlaceDeCondiciones) assert.ok(urlsPlaneadas.includes(url), url);
  assert.deepEqual(
    pagina.tambien.items.map((i) => i.slug ?? i.url),
    [
      'paginas-web',
      'tienda-en-linea',
      'desarrollo-de-software',
      'video-con-drone',
      'video-para-eventos',
      '/proyectos/',
      '/condiciones-de-contratacion/',
    ],
  );
  assert.deepEqual(
    pagina.faq.map((f) => f.pregunta),
    [
      '¿La gente descargará mi app cuando esté lista?',
      '¿Subirla a las tiendas es inmediato?',
      '¿Una vez hecha ya no cuesta más?',
      '¿Qué necesito para empezar?',
      '¿Cuánto tarda en estar lista mi app?',
    ],
  );
  // Ninguna FAQ repite oraciones de la descripción, de lo que incluye, de la nota ni de las secciones.
  const oracionesDe = (t) => t.split(/(?<=[.!?])\s+/).map((o) => o.trim());
  const delResto = new Set(
    [
      ...pagina.descripcion.parrafos,
      ...pagina.incluye,
      ...pagina.secciones.flatMap((s) => textosDeBloques(s.bloques)),
      pagina.incluyeNota.map((t) => (typeof t === 'string' ? t : t.texto)).join(''),
    ].flatMap(oracionesDe),
  );
  for (const faq of pagina.faq) {
    for (const oracion of oracionesDe(faq.respuesta)) assert.ok(!delResto.has(oracion), `FAQ repite: ${oracion}`);
  }
});

test('aplicaciones móviles: sin viñetas ni frases iguales a las de páginas web ni de tienda en línea, aunque sean cortas', () => {
  const textos = (slug) =>
    [
      ...servicios[slug].pagina.incluye,
      ...servicios[slug].pagina.secciones.flatMap((s) => textosDeBloques(s.bloques)),
      // Solo los enlaces a servicios: el de Proyectos es el mismo texto en todas las páginas.
      ...servicios[slug].pagina.tambien.items.filter((i) => 'slug' in i).map((i) => i.texto),
    ].map((t) => t.trim());
  const deOtras = new Set([...textos('paginas-web'), ...textos('tienda-en-linea')]);
  for (const texto of textos('aplicaciones-moviles'))
    assert.ok(!deOtras.has(texto), `ya está en otra página: ${texto}`);
});

test('aplicaciones móviles: sin precios, plazos, marcas, demos ni promesas, y las tiendas son "tiendas de aplicaciones"', () => {
  const c = servicios['aplicaciones-moviles'];
  const texto = JSON.stringify(c);
  // "Desde" solo se prohíbe como precio ("desde $…"), igual que en software.
  assert.ok(!/\$|MXN|\bIVA\b|desde\s+(\$|\d|un precio|el precio|el costo|un costo)/i.test(texto), 'precio publicado');
  assert.ok(!/%|por ciento|anticipo|\d+\s*pagos?/i.test(texto), 'porcentaje o cifra de pagos');
  assert.ok(!/\d/.test(texto.replace('"h1":', '')), 'cifra publicada');
  assert.ok(!/\d+\s*(d[ií]as|horas|semanas|meses)/i.test(texto), 'plazo publicado');
  assert.ok(
    !/uber|instagram|apple|google|facebook|tiktok|whatsapp web/i.test(texto.replace(/Cotiza por WhatsApp/g, '')),
    'app o marca conocida',
  );
  assert.ok(
    !/swift|kotlin|flutter|react|ionic|xamarin|java\b|javascript|xcode|android studio|firebase|app store|play store|google play|testflight/i.test(
      texto,
    ),
    'lenguaje, herramienta o tienda con nombre',
  );
  assert.ok(!/pedidos?\b/i.test(texto), '"pedidos" como ejemplo');
  assert.ok(!/\bdemos?\b|demostraci|te mostramos|antes de pagar/i.test(texto), 'demo previa');
  assert.ok(
    !/garantiz|garant[ií]a|aseguramos|conseguir[aá]s|ingresos|ventas|aumenta|resultados/i.test(texto),
    'promesa',
  );
  // "Descargas" solo en la nota (promoción no incluida) y en la FAQ que aclara que no llegan solas.
  assert.ok(!/\bapps\b/i.test(texto), '"apps"');
  assert.ok(!/\bdron\b/i.test(texto), '"dron"');
});

test('desarrollo de software: SEO, ficha, qué incluye, secciones en orden, enlaces en títulos, párrafos y FAQ, y 5 FAQ sin repetir lo que dicen las secciones ni la nota', () => {
  const c = servicios['desarrollo-de-software'];
  const pagina = c.pagina;
  assert.equal(c.title, 'Desarrollo de software a la medida en Puebla | Digital X');
  assert.ok(c.title.length <= 60);
  assert.equal(c.h1, 'Desarrollo de software a la medida en Puebla');
  assert.equal(
    c.meta,
    'Desarrollo de software a la medida para negocios en Puebla y Atlixco: sistemas para registros, clientes, reservas y catálogos. Cotiza por WhatsApp.',
  );
  assert.ok(c.meta.length <= 155);
  assert.equal(c.serviceType, 'Desarrollo de software a la medida para negocios');
  assert.equal(c.incluye, 'Sistemas web');
  assert.equal(c.para, 'Negocios con procesos propios');
  assert.equal(c.mensaje, mensajesWhatsApp.desarrolloDeSoftware);
  assert.equal(
    mensajesWhatsApp.desarrolloDeSoftware,
    'Hola, quiero cotizar un software a la medida. Qué proceso quiero resolver: __ ¿Cuántas personas lo usarían?: __ ¿Hoy lo llevo en papel, hojas de cálculo u otro sistema?: __',
  );
  assert.deepEqual(pagina.ficha, [
    { etiqueta: 'Tipo', valor: 'Sistemas web, desde el navegador' },
    { etiqueta: 'Para', valor: 'Negocios con procesos propios' },
    { etiqueta: 'Entrega', valor: 'Sistema implementado y equipo capacitado' },
  ]);
  assert.equal(pagina.descripcion.parrafos.length, 2);
  assert.deepEqual(pagina.incluye, [
    'Levantamiento de requerimientos: entender el proceso que quieres resolver',
    'Desarrollo del sistema, de preferencia web, para usarlo desde el navegador',
    'Implementación en tu negocio',
    'Capacitación para tu equipo',
  ]);
  assert.deepEqual(
    pagina.secciones.map((s) => [s.id, s.etiqueta, s.titulo]),
    [
      ['que-es', 'Qué es', 'Qué es un software a la medida'],
      ['que-puede-hacer', 'Qué puede hacer', 'Qué puede hacer'],
      ['software-app-o-pagina-web', 'Cuál te conviene', '¿Software, app o página web?'],
      ['precio', 'Precio', 'De qué depende el precio'],
    ],
  );
  const [, puede, cual, precio] = pagina.secciones;
  assert.equal(puede.bloques[0].lista.length, 5);
  assert.equal(precio.bloques[0].lista.length, 6);
  // Los títulos de los puntos de "¿Software, app o página web?" llevan los enlaces a las otras páginas de tecnología.
  const [web, app, software] = cual.bloques[0].puntos;
  assert.deepEqual(
    web.titulo.filter((t) => typeof t !== 'string').map((t) => t.slug),
    ['paginas-web', 'tienda-en-linea'],
  );
  assert.deepEqual(
    app.titulo.filter((t) => typeof t !== 'string').map((t) => t.slug),
    ['aplicaciones-moviles'],
  );
  assert.equal(software.titulo, 'Software a la medida');
  assert.equal(
    software.texto,
    'Organiza lo que pasa dentro de tu negocio, como los registros, los clientes, las reservas o el catálogo.',
  );
  assert.deepEqual(
    textosDeBloques(cual.bloques)[0],
    'Página web o tienda en línea: Presentan tu negocio o venden tus productos en internet.',
  );
  // El pago y las condiciones: un enlace en el párrafo de "precio" y otro en la respuesta de la FAQ 3.
  const condiciones = { url: '/condiciones-de-contratacion/', texto: 'condiciones de contratación' };
  assert.deepEqual(
    precio.bloques[1].parrafo.filter((t) => typeof t !== 'string'),
    [condiciones],
  );
  assert.deepEqual(
    pagina.faq[2].respuesta.filter((t) => typeof t !== 'string'),
    [condiciones],
  );
  assert.ok(urlsPlaneadas.includes(condiciones.url));
  assert.equal(
    comoTexto(pagina.faq[2].respuesta),
    'Tu información siempre es tuya. El sistema se entrega en los términos de tu contrato, como explican nuestras condiciones de contratación.',
  );
  assert.deepEqual(
    pagina.tambien.items.map((i) => i.slug ?? i.url),
    [
      'aplicaciones-moviles',
      'paginas-web',
      'tienda-en-linea',
      'video-con-drone',
      'video-para-eventos',
      '/proyectos/',
      '/condiciones-de-contratacion/',
    ],
  );
  assert.deepEqual(
    pagina.faq.map((f) => f.pregunta),
    [
      '¿Mi negocio necesita un software a la medida?',
      '¿Pueden pasar al sistema lo que ya tengo en hojas de cálculo?',
      '¿Quién es dueño del sistema y de mi información?',
      '¿Cuánto tarda en estar listo el sistema?',
      '¿Qué necesito para empezar mi sistema?',
    ],
  );
  // Ninguna FAQ repite oraciones de la descripción, de lo que incluye, de la nota ni de las secciones.
  const oracionesDe = (t) => t.split(/(?<=[.!?])\s+/).map((o) => o.trim());
  const delResto = new Set(
    [
      ...pagina.descripcion.parrafos,
      ...pagina.incluye,
      ...pagina.secciones.flatMap((s) => textosDeBloques(s.bloques)),
      comoTexto(pagina.incluyeNota),
    ].flatMap(oracionesDe),
  );
  for (const faq of pagina.faq) {
    for (const oracion of oracionesDe(comoTexto(faq.respuesta)))
      assert.ok(!delResto.has(oracion), `FAQ repite: ${oracion}`);
  }
});

test('desarrollo de software: sin viñetas, frases ni preguntas iguales a las de aplicaciones, páginas web ni tienda en línea, aunque sean cortas', () => {
  const textos = (slug) => {
    const p = servicios[slug].pagina;
    return [
      ...p.incluye,
      ...p.secciones.flatMap((s) => textosDeBloques(s.bloques)),
      // Solo los enlaces a servicios: el de Proyectos es el mismo texto en todas las páginas.
      ...p.tambien.items.filter((i) => 'slug' in i).map((i) => i.texto),
      ...p.faq.flatMap((f) => [f.pregunta, comoTexto(f.respuesta)]),
      p.cotizacion.texto,
      p.cierre.texto,
    ].map((t) => t.trim());
  };
  const deOtras = new Set(['paginas-web', 'tienda-en-linea', 'aplicaciones-moviles'].flatMap(textos));
  for (const texto of textos('desarrollo-de-software'))
    assert.ok(!deOtras.has(texto), `ya está en otra página: ${texto}`);
});

test('desarrollo de software: sin precios, plazos, ERP, IA, CRM, demos, marcas ni promesas de ahorros, ventas o resultados', () => {
  const c = servicios['desarrollo-de-software'];
  const texto = JSON.stringify(c);
  // "Desde" solo se prohíbe como precio ("desde $…"): "desde el navegador" o "desde el levantamiento…" son texto normal.
  assert.ok(!/\$|MXN|\bIVA\b|desde\s+(\$|\d|un precio|el precio|el costo|un costo)/i.test(texto), 'precio publicado');
  assert.ok(!/%|por ciento|anticipo|\d+\s*pagos?/i.test(texto), 'porcentaje o cifra de pagos');
  assert.ok(!/\d/.test(texto.replace('"h1":', '')), 'cifra publicada');
  assert.ok(!/\d+\s*(d[ií]as|horas|semanas|meses)/i.test(texto), 'plazo publicado');
  assert.ok(!/\bERP\b|inteligencia artificial|\bIA\b|\bCRM\b/.test(texto), 'ERP, inteligencia artificial o CRM');
  assert.ok(!/\bdemos?\b|demostraci|te mostramos|antes de pagar/i.test(texto), 'demo previa');
  assert.ok(
    !/ahorr|garantiz|garant[ií]a|aseguramos|ventas|ingresos|resultados|aumenta|increment|rentabilidad/i.test(texto),
    'promesa',
  );
  assert.ok(
    !/\b(sap|odoo|salesforce|excel|microsoft|google|apple|python|php|laravel|django|postgres|mysql|firebase|aws|azure|oracle|java|javascript|react|angular|vue|node|wordpress)\b/i.test(
      texto,
    ),
    'lenguaje, herramienta, plataforma o marca',
  );
  assert.ok(!/\bapps\b/i.test(texto), '"apps"');
  assert.ok(!/\bdron\b/i.test(texto), '"dron"');
});

test('las preguntas migradas de las categorías están cada una en su servicio, sin repetirse', () => {
  const preguntas = (slug) => (servicios[slug].pagina?.faq ?? []).map((f) => f.pregunta);
  assert.equal(preguntas('renta-de-audio').length, 4);
  assert.equal(preguntas('circuito-cerrado-para-eventos').length, 5);
  assert.equal(preguntas('video-para-eventos').length, 5);
  assert.equal(preguntas('paginas-web').length, 5);
  assert.equal(preguntas('tienda-en-linea').length, 5);
  assert.ok(preguntas('paginas-web').includes('¿Qué diferencia hay entre una página web y una tienda en línea?'));
  assert.equal(preguntas('desarrollo-de-software').length, 5);
  assert.equal(preguntas('aplicaciones-moviles').length, 5);
  const todas = entradas.flatMap(([, c]) => (c.pagina?.faq ?? []).map((f) => f.pregunta));
  assert.equal(new Set(todas).size, todas.length);
});

test('ninguna oración de los servicios o del catálogo está tal cual en el Inicio, Nosotros, condiciones ni privacidad', () => {
  const otras = ['inicio.ts', 'nosotros.ts', 'condiciones.ts', 'privacidad.ts'].map((archivo) => [
    archivo,
    readFileSync(new URL(archivo, import.meta.url), 'utf8'),
  ]);
  const oraciones = bloques
    .flatMap((b) => b.split(/(?<=[.!?])\s+/))
    .map((o) => o.trim())
    .filter((o) => o.split(/\s+/).length >= 7);
  for (const oracion of oraciones) {
    for (const [archivo, texto] of otras) assert.ok(!texto.includes(oracion), `"${oracion}" ya está en ${archivo}`);
  }
});

test('ninguna oración se repite entre servicios ni con el catálogo (sin contenido duplicado)', () => {
  const oraciones = bloques
    .flatMap((b) => b.split(/(?<=[.!?])\s+/))
    .map((o) => o.trim())
    .filter((o) => o.split(/\s+/).length >= 7);
  const vistas = new Map();
  for (const oracion of oraciones) vistas.set(oracion, (vistas.get(oracion) ?? 0) + 1);
  const repetidas = [...vistas].filter(([, veces]) => veces > 1).map(([o]) => o);
  assert.deepEqual(repetidas, []);
});

test('el circuito cerrado se explica con pantallas, sin "graba", seguridad ni vigilancia', () => {
  for (const texto of bloques) {
    assert.ok(!/no graba|ni graba/i.test(texto), `"graba" en: ${texto}`);
    assert.ok(!/seguridad|vigilancia/i.test(texto), `seguridad o vigilancia en: ${texto}`);
    if (texto.startsWith('¿')) continue; // la pregunta solo nombra el servicio; su respuesta lo explica
    if (/circuito cerrado/i.test(texto)) {
      assert.match(texto, /para eventos|en vivo|pantallas/i, `circuito cerrado suelto: ${texto}`);
    }
  }
});

// Los textos del sitio viven en content/*.ts (y los mensajes de WhatsApp en lib/negocio.ts): se leen como texto, sin
// comentarios, porque algunos importan imágenes y no se pueden cargar con node:test.
const sinComentarios = (texto) => texto.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const textosDelSitio = [
  ...readdirSync(new URL('.', import.meta.url))
    .filter((archivo) => archivo.endsWith('.ts'))
    .map((archivo) => [`content/${archivo}`, new URL(archivo, import.meta.url)]),
  ['lib/negocio.ts', new URL('../lib/negocio.ts', import.meta.url)],
].map(([nombre, url]) => [nombre, sinComentarios(readFileSync(url, 'utf8'))]);

test('en ningún texto del sitio aparece "vigilancia", ni "seguridad" junto a "circuito cerrado"', () => {
  for (const [nombre, texto] of textosDelSitio) {
    assert.ok(!/vigilancia/i.test(texto), `vigilancia en ${nombre}`);
    assert.ok(!/sistema de seguridad|cámaras de seguridad/i.test(texto), `sistema de seguridad en ${nombre}`);
    assert.ok(
      !/circuito cerrado[\s\S]{0,200}seguridad|seguridad[\s\S]{0,200}circuito cerrado/i.test(texto),
      `seguridad junto a circuito cerrado en ${nombre}`,
    );
  }
});

test('las pantallas y la planta son de proveedores: sin "proyector", "nuestras pantallas", "tenemos" ni "equipo propio"', () => {
  for (const [nombre, texto] of textosDelSitio) {
    assert.ok(!/proyector/i.test(texto), `proyector en ${nombre}`);
    assert.ok(
      !/nuestras? pantallas?|tenemos (las |tus )?pantallas|equipo propio|nuestra planta|nuestro internet|tenemos (el |tu |nuestro )?internet/i.test(
        texto,
      ),
      `pantallas, planta o internet propios en ${nombre}`,
    );
    assert.ok(!/multic[aá]mara|alta definici[oó]n/i.test(texto), `multicámara o alta definición en ${nombre}`);
  }
});

test('transmisión en vivo: SEO, ficha, qué incluye, secciones, proyectos y 5 FAQ sin repetir lo que dicen las secciones ni la nota', () => {
  const c = servicios['streaming-para-eventos'];
  const pagina = c.pagina;
  assert.equal(c.title, 'Streaming para eventos en Puebla y Atlixco | Digital X');
  assert.equal(c.title.length, 54);
  assert.equal(c.h1, 'Streaming y transmisión en vivo para eventos en Puebla');
  assert.equal(
    c.meta,
    'Streaming y transmisión en vivo de conferencias y eventos culturales y deportivos en Puebla y Atlixco, con una o varias cámaras. Cotiza por WhatsApp.',
  );
  assert.ok(c.meta.length <= 155);
  assert.equal(c.serviceType, 'Transmisión en vivo y streaming de eventos');
  assert.equal(c.mensaje, mensajesWhatsApp.streaming);
  assert.deepEqual(
    pagina.ficha.map((f) => [f.etiqueta, f.valor]),
    [
      ['Plataformas', 'Facebook, YouTube y más'],
      ['Cámaras', 'Una o varias, según tu evento'],
      ['Para', 'Eventos, conferencias, escuelas e instituciones'],
    ],
  );
  assert.deepEqual(pagina.incluye, [
    'La transmisión en vivo de tu evento a una o varias páginas o plataformas',
    'Una o varias cámaras, según tu evento, con personal que las opera',
    'Audio de preferencia directo de la consola del evento, para una señal limpia',
    'Revisión del lugar y pruebas antes del evento',
    'Rótulos, logos o diseños en pantalla, según el paquete que contrates',
  ]);
  assert.deepEqual(
    pagina.secciones.map((s) => s.id),
    ['para-que-eventos', 'precio'],
  );
  assert.equal(pagina.secciones[0].bloques[0].lista.length, 7);
  assert.equal(pagina.secciones[1].bloques[0].lista.length, 7);
  assert.equal(pagina.faq.length, 5);
  assert.deepEqual(
    pagina.incluyeNota.filter((t) => typeof t !== 'string').map((t) => t.slug),
    ['video-para-eventos', 'circuito-cerrado-para-eventos'],
  );
  // Ninguna FAQ repite oraciones de la descripción, de lo que incluye, de la nota ni de las secciones.
  const oracionesDe = (t) => t.split(/(?<=[.!?])\s+/).map((o) => o.trim());
  const delResto = new Set(
    [
      ...pagina.descripcion.parrafos,
      ...pagina.incluye,
      ...pagina.secciones.flatMap((s) => textosDeBloques(s.bloques)),
      (pagina.incluyeNota ?? []).map((t) => (typeof t === 'string' ? t : t.texto)).join(''),
    ].flatMap(oracionesDe),
  );
  for (const faq of pagina.faq) {
    for (const oracion of oracionesDe(faq.respuesta)) assert.ok(!delResto.has(oracion), `FAQ repite: ${oracion}`);
  }
});

test('transmisión en vivo: las cámaras son "una o varias", sin multicámara, alta definición, cifras, plazos, precios ni marcas', () => {
  const texto = JSON.stringify(servicios['streaming-para-eventos']);
  assert.ok(
    !/multic[aá]mara|alta definici[oó]n|mezcla|\bHD\b|4k|full hd/i.test(texto),
    'multicámara o alta definición',
  );
  assert.ok(!/\b(dos|tres|cuatro|cinco|\d+)\s+c[aá]maras/i.test(texto), 'número de cámaras');
  assert.ok(!/\d+\s*(d[ií]as|horas|semanas|meses|personas|asistentes|mbps|megas)/i.test(texto), 'cifra publicada');
  assert.ok(!/\$\s?\d|MXN|desde \d/i.test(texto), 'precio publicado');
  assert.ok(!/sony|canon|blackmagic|panasonic|obs studio|vmix|restream|streamyard|zoom/i.test(texto), 'marca');
  // "Cámara(s)" solo en las frases permitidas: la ficha, "una o varias cámaras, según tu evento" y "el número de cámaras"
  // como factor del precio.
  const sinPermitidas = texto
    .replace(/una o varias c[aá]maras/gi, '')
    .replace(/n[uú]mero de c[aá]maras/gi, '')
    .replace(/"etiqueta":"Cámaras"/g, '')
    .replace(/"valor":"Una o varias, según tu evento"/g, '');
  assert.ok(
    !/\bc[aá]maras?\b/i.test(sinPermitidas.replace(/circuito cerrado/gi, '')),
    `cámaras fuera de las frases permitidas: ${sinPermitidas.match(/.{30}c[aá]maras?.{20}/i)}`,
  );
});

test('"a la medida" se usa en los textos de la página de software, pero nunca como nombre de un servicio', () => {
  const nombres = [
    ...registro.map((p) => p.titulo),
    ...menu.map((i) => i.titulo),
    ...categorias.flatMap((c) => [c.titulo, c.etiqueta, ...(c.sinPagina ?? [])]),
    ...Object.values(lista),
  ];
  assert.ok(nombres.length > 0);
  for (const nombre of nombres)
    assert.ok(!/a la medida/i.test(nombre), `"a la medida" en un nombre de servicio: ${nombre}`);
  assert.equal(paginas.find((p) => p.url === '/tecnologia/desarrollo-de-software/').titulo, 'Desarrollo de software');
  // Es la búsqueda principal: la página lo dice en su title, su H1, su meta y su descripción corta.
  const c = servicios['desarrollo-de-software'];
  for (const texto of [c.title, c.h1, c.meta, c.descripcion]) assert.match(texto, /a la medida/i);
});

test('"drone" se escribe así en todo el contenido y "aplicaciones móviles" no es "apps"', () => {
  const todo = JSON.stringify([servicios, categorias, guia]);
  // "drones" es el plural de "drone" (FAQ de espectáculos con luces): solo se prohíbe la forma suelta "dron".
  assert.ok(!/\bdron\b/i.test(todo), '"dron" en el contenido');
  // El singular "app" sí se usa en texto corrido (aplicaciones móviles); solo se prohíbe el plural "apps".
  assert.ok(!/\bapps\b/i.test(todo), '"apps" en el contenido');
});

test('ningún texto lleva [PENDIENTE, precios ni dinero, y las pantallas se "coordinan"', () => {
  for (const texto of bloques) {
    assert.ok(!texto.includes('[PENDIENTE'), texto);
    assert.ok(!/\$\s?\d|MXN|tenemos las pantallas|tenemos pantallas/i.test(texto), texto);
  }
});

test('WhatsApp: cada servicio usa su propio mensaje', () => {
  const esperado = {
    'renta-de-audio': 'rentaDeAudio',
    'circuito-cerrado-para-eventos': 'circuitoCerrado',
    'video-para-eventos': 'produccionDeVideos',
    'streaming-para-eventos': 'streaming',
    'video-con-drone': 'drone',
    'recorridos-virtuales-360': 'recorridos360',
    'paginas-web': 'paginasWeb',
    'tienda-en-linea': 'tiendaEnLinea',
    'aplicaciones-moviles': 'aplicacionesMoviles',
    'desarrollo-de-software': 'desarrolloDeSoftware',
  };
  for (const [slug, clave] of Object.entries(esperado))
    assert.equal(servicios[slug].mensaje, mensajesWhatsApp[clave], slug);
});
