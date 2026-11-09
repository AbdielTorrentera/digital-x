import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogo, faltantesDePagina, servicios, slugs } from './servicios.ts';
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
  ...(c.pagina?.secciones ?? []).flatMap((s) => s.parrafos),
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
    'Cámaras en vivo proyectadas en pantallas para que todos vean el escenario. No es un sistema de seguridad.',
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

test('circuito cerrado: página completa, 5 FAQ propias, sin secciones extra ni galería y sin hablar de grabar', () => {
  const c = servicios['circuito-cerrado-para-eventos'];
  const pagina = c.pagina;
  assert.equal(pagina.ficha.length, 3);
  assert.equal(pagina.descripcion.parrafos.length, 2);
  assert.equal(pagina.faq.length, 5);
  assert.ok(!pagina.secciones, 'no lleva secciones extra: serían las FAQ repetidas');
  assert.equal(c.mensaje, mensajesWhatsApp.circuitoCerrado);
  // La aclaración va a la vista (ficha) y en la descripción; las pantallas se "coordinan".
  assert.match(pagina.ficha[0].valor, /no es un sistema de seguridad/);
  assert.match(pagina.descripcion.parrafos[0], /No es un sistema de seguridad\./);
  assert.ok(pagina.incluye.some((i) => /las coordinamos/.test(i)));
  // Lo que incluye es lo confirmado por el dueño, ni más ni menos.
  assert.deepEqual(pagina.incluye, [
    'Personal que opera las cámaras durante tu evento',
    'Una o varias cámaras en vivo, según tu evento',
    'Proyección de la imagen en pantallas del lugar',
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

test('las preguntas migradas de las categorías están cada una en su servicio, sin repetirse', () => {
  const preguntas = (slug) => (servicios[slug].pagina?.faq ?? []).map((f) => f.pregunta);
  assert.equal(preguntas('renta-de-audio').length, 4);
  assert.equal(preguntas('circuito-cerrado-para-eventos').length, 5);
  assert.deepEqual(preguntas('video-para-eventos'), ['¿Cómo obtengo un video de mi evento?']);
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
    // Las oraciones cortas (como "No es un sistema de seguridad.") se repiten a propósito junto a "circuito cerrado".
    .filter((o) => o.split(/\s+/).length >= 7);
  const vistas = new Map();
  for (const oracion of oraciones) vistas.set(oracion, (vistas.get(oracion) ?? 0) + 1);
  const repetidas = [...vistas].filter(([, veces]) => veces > 1).map(([o]) => o);
  assert.deepEqual(repetidas, []);
});

test('el circuito cerrado se explica con pantallas y nunca con "ni graba" ni como cámaras de seguridad', () => {
  for (const texto of bloques) {
    assert.ok(!/no graba|ni graba/i.test(texto), `"graba" en: ${texto}`);
    if (texto.startsWith('¿')) continue; // la pregunta solo nombra el servicio; su respuesta lo explica
    assert.ok(!/cámaras de seguridad/i.test(texto), `cámaras de seguridad en: ${texto}`);
    if (/circuito cerrado/i.test(texto)) assert.match(texto, /pantallas/i, `circuito cerrado sin pantallas: ${texto}`);
  }
  assert.match(servicios['circuito-cerrado-para-eventos'].descripcion, /No es un sistema de seguridad\.$/);
});

test('transmisión en vivo no menciona número de cámaras ni mezcla de cámaras', () => {
  const texto = JSON.stringify(servicios['streaming-para-eventos']);
  assert.ok(!/multic[aá]mara|mezcla|\bcámaras\b/i.test(texto), texto);
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
