import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { catalogo, faltantesDePagina, servicios, slugs, textosDeBloques } from './servicios.ts';
import { mensajesWhatsApp } from '../lib/negocio.ts';
import { paginas, slugDe, urlsPlaneadas } from '../lib/paginas.ts';

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
  ...(c.pagina?.faq ?? []).flatMap((f) => [f.pregunta, f.respuesta]),
];
const bloques = [
  ...entradas.flatMap(bloquesDe),
  catalogo.intro,
  ...catalogo.secciones.map((s) => s.para),
  catalogo.cierre.texto,
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

test('title y meta del catálogo no cambian (reglas-seo sección 1)', () => {
  assert.equal(catalogo.title, 'Servicios de audio, video y tecnología en Puebla | Digital X');
  assert.ok(catalogo.title.length <= 60);
  assert.equal(
    catalogo.descripcion,
    'Servicios para tu evento o tu negocio: audio, video y tecnología en Puebla, Atlixco e Izúcar de Matamoros. Elige el tuyo y cotiza por WhatsApp.',
  );
  assert.ok(catalogo.descripcion.length <= 155);
  assert.ok(catalogo.h1.includes('Puebla'));
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
    'Sistemas hechos para los procesos propios de tu negocio.',
  );
});

test('el catálogo tiene una sección por categoría, con el id al que enlazan el Inicio y el pie', () => {
  assert.deepEqual(
    catalogo.secciones.map((s) => s.id),
    ['audio', 'video', 'tecnologia'],
  );
  assert.deepEqual(
    catalogo.secciones.map((s) => s.categoria),
    ['audio', 'video', 'tecnologia'],
  );
});

test('cada servicio de la guía "¿Qué servicios necesito?" existe y cada escenario recomienda al menos uno', () => {
  assert.equal(catalogo.guia.items.length, 5);
  for (const { escenario, slugs: recomendados } of catalogo.guia.items) {
    assert.ok(recomendados.length > 0, escenario);
    for (const slug of recomendados) assert.ok(slugs.includes(slug), `${slug} no es un servicio`);
  }
});

test('un servicio con la página construida trae todo su contenido (si no, el build se detiene)', () => {
  const construidas = registro.filter((p) => p.construida);
  assert.ok(construidas.length > 0);
  for (const p of construidas) assert.deepEqual(faltantesDePagina(slugDe(p.url)), [], p.url);
  // Y uno incompleto sí se detecta.
  assert.ok(faltantesDePagina('video-con-drone').length > 0);
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

test('las preguntas migradas de las categorías están cada una en su servicio, sin repetirse', () => {
  const preguntas = (slug) => (servicios[slug].pagina?.faq ?? []).map((f) => f.pregunta);
  assert.equal(preguntas('renta-de-audio').length, 4);
  assert.equal(preguntas('circuito-cerrado-para-eventos').length, 5);
  assert.equal(preguntas('video-para-eventos').length, 5);
  assert.deepEqual(preguntas('paginas-web'), ['¿Qué diferencia hay entre una página web y una tienda en línea?']);
  assert.equal(preguntas('desarrollo-de-software').length, 2);
  assert.deepEqual(preguntas('aplicaciones-moviles'), ['¿Las aplicaciones funcionan en Android y iPhone?']);
  const todas = entradas.flatMap(([, c]) => (c.pagina?.faq ?? []).map((f) => f.pregunta));
  assert.equal(new Set(todas).size, todas.length);
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

test('"drone" se escribe así en todo el contenido, "aplicaciones móviles" no es "apps" y el software no es "a la medida"', () => {
  const todo = JSON.stringify([servicios, catalogo]);
  assert.ok(!/\bdron(es)?\b/i.test(todo), '"dron" en el contenido');
  assert.ok(!/\bapps?\b/i.test(todo), '"apps" en el contenido');
  assert.ok(!/a la medida/i.test(JSON.stringify(servicios['desarrollo-de-software'])), 'software "a la medida"');
});

test('ningún texto lleva [PENDIENTE, precios ni dinero, y las pantallas se "coordinan"', () => {
  for (const texto of bloques) {
    assert.ok(!texto.includes('[PENDIENTE'), texto);
    assert.ok(!/\$\s?\d|MXN|tenemos las pantallas|tenemos pantallas/i.test(texto), texto);
  }
});

test('WhatsApp: cada servicio usa su propio mensaje y el catálogo, el general', () => {
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
  assert.equal(catalogo.cierre.mensaje, mensajesWhatsApp.general);
});
