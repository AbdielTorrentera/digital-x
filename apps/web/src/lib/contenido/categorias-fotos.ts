// La foto de cada categoría (tarjeta del Inicio y portada de su página), desde Sanity.
import { aFoto } from './imagenes.ts';
import { documentosDe } from './instantanea.ts';
import type { CategoriaDoc, Foto } from './tipos.ts';

export const fotosDeCategoria: Record<string, Foto> = Object.fromEntries(
  documentosDe<CategoriaDoc>('categoria').map((c) => [c.slug.current, aFoto(c.foto)]),
);
