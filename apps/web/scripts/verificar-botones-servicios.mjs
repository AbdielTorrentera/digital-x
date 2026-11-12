// Verificación en navegador de los botones "Ver servicio(s)" de las tarjetas del Inicio (sección Servicios, apilado).
// Hace scroll por toda la sección y, en cada posición, para cada botón que se ve COMPLETO bajo la barra y sin que lo tape
// otra tarjeta: (1) elementFromPoint en su centro debe ser un elemento de su propia tarjeta y su enlace debe ser el de su
// destino; (2) un clic real debe navegar a ese destino. Además exige que cada botón sea usable en un tramo de scroll
// razonable (no solo en un instante). Falla (código 1) si algo no se cumple.
//
// Necesita `playwright-core` y un Chrome (no son dependencias del repo, para no sumar descargas al CI):
//   pnpm dlx --package playwright-core node scripts/verificar-botones-servicios.mjs   (o con playwright-core instalado aparte)
//   CHROME_PATH=/ruta/a/chrome BASE_URL=http://localhost:4321 node scripts/verificar-botones-servicios.mjs
const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const CHROME = process.env.CHROME_PATH;
const TRAMO_MINIMO = 300; // px de scroll en los que cada botón debe ser usable
let chromium;
try {
  ({ chromium } = await import('playwright-core'));
} catch {
  console.error('Falta playwright-core (ver el encabezado de este archivo).');
  process.exit(2);
}
const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const tamanos = [
  [1440, 900],
  [1280, 720],
  [1024, 768],
  [360, 780],
];
let fallos = 0;
const falla = (m) => {
  fallos++;
  console.log('  FALLA:', m);
};

for (const movimientoReducido of [false, true]) {
  for (const [w, h] of tamanos) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      reducedMotion: movimientoReducido ? 'reduce' : 'no-preference',
    });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    const n = await page.locator('.svc').count();
    const inicio = await page.evaluate(
      () => document.querySelector('#servicios').getBoundingClientRect().top + scrollY,
    );
    const alto = await page.evaluate(() => document.querySelector('#servicios').offsetHeight);
    const usable = Array(n).fill(0); // px de scroll (en pasos de 10) con el botón visible completo y libre
    // Una posición de scroll recorre toda la sección; en cada una se evalúa cada botón.
    for (let y = inicio - 100; y < inicio + alto; y += 10) {
      await page.evaluate((y) => scrollTo(0, y), y);
      const filas = await page.evaluate(() => {
        const barra = document.querySelector('.nav').getBoundingClientRect().bottom;
        const tarjetas = [...document.querySelectorAll('.svc')];
        return tarjetas.map((t, i) => {
          const b = t.querySelector('.btn').getBoundingClientRect();
          const completo = b.top >= barra && b.bottom <= innerHeight && b.left >= 0 && b.right <= innerWidth;
          if (!completo) return { i, completo: false };
          // ¿Qué ve la persona en el centro del botón? Se ignoran los enlaces extendidos para saber quién está por encima.
          const cx = b.left + b.width / 2;
          const cy = b.top + b.height / 2;
          const enCentro = document.elementFromPoint(cx, cy);
          const tarjetaDelPunto = enCentro?.closest('.svc');
          const enlace = enCentro?.closest('a');
          return {
            i,
            completo: true,
            propia: tarjetaDelPunto === t,
            destinoDelClic: enlace ? enlace.pathname : null,
            destinoPropio: t.querySelector('.svc__enlace').pathname,
          };
        });
      });
      for (const f of filas) {
        if (!f.completo) continue;
        if (!f.propia) continue; // otra tarjeta lo cubre: no está disponible en esta posición (lo prevé el apilado)
        if (f.destinoDelClic !== f.destinoPropio)
          falla(
            `${w}x${h} tarjeta ${f.i + 1}: scroll ${Math.round(y)}, el clic iría a ${f.destinoDelClic} y no a ${f.destinoPropio}`,
          );
        usable[f.i] += 10;
      }
    }
    // Cada botón debe poder usarse un tramo razonable de scroll (con movimiento reducido las tarjetas van una debajo de otra).
    usable.forEach(
      (px, i) =>
        px < TRAMO_MINIMO &&
        falla(`${w}x${h} tarjeta ${i + 1}: el botón solo es usable en ${px} px de scroll (mínimo ${TRAMO_MINIMO})`),
    );
    // Clic real en cada botón, en una posición donde sea usable.
    for (let i = 0; i < n; i++) {
      await page.goto(BASE + '/', { waitUntil: 'networkidle' });
      const destino = await page.evaluate(
        (i) => document.querySelectorAll('.svc')[i].querySelector('.svc__enlace').pathname,
        i,
      );
      let hecho = false;
      for (let y = inicio - 100; y < inicio + alto && !hecho; y += 10) {
        await page.evaluate((y) => scrollTo(0, y), y);
        const centro = await page.evaluate((i) => {
          const barra = document.querySelector('.nav').getBoundingClientRect().bottom;
          const t = document.querySelectorAll('.svc')[i];
          const b = t.querySelector('.btn').getBoundingClientRect();
          if (b.top < barra || b.bottom > innerHeight) return null;
          const cx = b.left + b.width / 2;
          const cy = b.top + b.height / 2;
          return document.elementFromPoint(cx, cy)?.closest('.svc') === t ? [cx, cy] : null;
        }, i);
        if (!centro) continue;
        hecho = true;
        await page.mouse.click(centro[0], centro[1]);
        await page.waitForURL((u) => u.pathname === destino, { timeout: 5000 }).catch(() => {});
        const ruta = new URL(page.url()).pathname;
        if (ruta !== destino) falla(`${w}x${h} clic real en el botón ${i + 1}: llegó a ${ruta} y no a ${destino}`);
      }
      if (!hecho) falla(`${w}x${h} botón ${i + 1}: nunca estuvo visible y libre`);
    }
    console.log(
      `${movimientoReducido ? 'reducido' : 'normal  '} ${w}x${h}: tramo usable por botón (px) = ${usable.join(', ')}`,
    );
    await ctx.close();
  }
}
await browser.close();
console.log(
  fallos
    ? `\n${fallos} fallo(s).`
    : '\nLos 3 botones son visibles, clicables y llevan a su propio destino en todos los tamaños.',
);
process.exit(fallos ? 1 : 0);
