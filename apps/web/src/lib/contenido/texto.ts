// De un párrafo de Portable Text restringido (`textoConEnlaces` del Studio) al `string | TextoConEnlaces` que ya reciben
// los componentes: un texto corrido, o una lista de trozos con enlaces a servicios (`{ slug, texto }`) y a páginas.
import type { TextoConEnlaces } from '../texto.ts';
import { documento } from './instantanea.ts';
import type { BloqueDoc, ServicioDoc } from './tipos.ts';

export const aTexto = (bloques: BloqueDoc[]): string | TextoConEnlaces => {
  const trozos: TextoConEnlaces = [];
  for (const [i, bloque] of bloques.entries()) {
    if (i > 0) trozos.push(' ');
    for (const hijo of bloque.children) {
      const definicion = bloque.markDefs.find((d) => hijo.marks.includes(d._key));
      if (!definicion) trozos.push(hijo.text);
      else if (definicion._type === 'enlaceServicio') {
        const servicio = documento<ServicioDoc>(definicion.servicio._ref);
        if (!servicio)
          throw new Error(`Un texto enlaza a un servicio que no está publicado (${definicion.servicio._ref}).`);
        trozos.push({ slug: servicio.slug.current, texto: hijo.text });
      } else trozos.push({ url: definicion.ruta, texto: hijo.text });
    }
  }
  // Los trozos de texto contiguos se unen; sin enlaces, queda un texto corrido.
  const unidos: TextoConEnlaces = [];
  for (const trozo of trozos) {
    const ultimo = unidos.at(-1);
    if (typeof trozo === 'string' && typeof ultimo === 'string') unidos[unidos.length - 1] = ultimo + trozo;
    else unidos.push(trozo);
  }
  return unidos.length === 1 && typeof unidos[0] === 'string' ? unidos[0] : unidos;
};

/** Aplica `cambio` a cada trozo de texto suelto (por ejemplo, para resolver los marcadores del Inicio). */
export const enTrozos = (texto: string | TextoConEnlaces, cambio: (t: string) => string): string | TextoConEnlaces =>
  typeof texto === 'string' ? cambio(texto) : texto.map((trozo) => (typeof trozo === 'string' ? cambio(trozo) : trozo));
