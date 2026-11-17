import { categorias, type CategoriaContenido } from './contenido/categorias.ts';
import { destinoDeCategoria, serviciosConstruidos, type Pagina } from './paginas.ts';

/** Una categoría con su destino en el menú, el Inicio y el pie: su página, o su único servicio construido. */
export interface CategoriaConDestino {
  categoria: CategoriaContenido;
  /** A dónde lleva (`destinoDeCategoria`). */
  href: string;
  /** true si lleva directo a un servicio porque es el único construido (la categoría no tiene página). */
  directo: boolean;
  /** El servicio al que lleva, cuando `directo`. */
  servicioUnico?: Pagina;
}

/** Las categorías que se muestran (con al menos un servicio construido), en el orden del menú. */
export const categoriasConDestino = (): CategoriaConDestino[] =>
  categorias.flatMap((categoria) => {
    const href = destinoDeCategoria(categoria.id);
    if (!href) return [];
    const construidos = serviciosConstruidos(categoria.id);
    return [
      construidos.length === 1
        ? { categoria, href, directo: true, servicioUnico: construidos[0] }
        : { categoria, href, directo: false },
    ];
  });
