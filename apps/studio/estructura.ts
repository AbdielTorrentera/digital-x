// El menú del Studio, pensado para quien no es técnico: lo que se edita, agrupado por lo que significa en el sitio.
import type {StructureResolver} from 'sanity/structure'

/** Documentos de los que solo existe uno: no se crean, duplican ni borran (su ID es fijo). */
export const DOCUMENTOS_UNICOS = [
  'configuracion',
  'inicio',
  'nosotros',
  'paginaProyectos',
  'paginaBlog',
  'paginaResenas',
  'guiaDeServicios',
]

export const estructura: StructureResolver = (S) => {
  const unico = (id: string, titulo: string) =>
    S.listItem()
      .id(id)
      .title(titulo)
      .child(S.document().schemaType(id).documentId(id).title(titulo))

  type Orden = {field: string; direction: 'asc' | 'desc'}[]
  const lista = (tipo: string, titulo: string, orden?: Orden) =>
    S.listItem()
      .id(`lista-${tipo}`)
      .title(titulo)
      .schemaType(tipo)
      .child(
        S.documentTypeList(tipo)
          .title(titulo)
          .defaultOrdering(orden ?? [{field: '_updatedAt', direction: 'desc'}]),
      )

  const porOrden: Orden = [{field: 'orden', direction: 'asc'}]
  // Primero el orden de la categoría (Audio, Video, Tecnología) y luego el del servicio dentro de ella.
  const porCategoriaYOrden: Orden = [
    {field: 'categoria->orden', direction: 'asc'},
    {field: 'orden', direction: 'asc'},
  ]

  return S.list()
    .title('Digital X')
    .items([
      unico('configuracion', 'Configuración del sitio'),
      S.divider(),
      S.listItem()
        .id('paginas')
        .title('Páginas')
        .child(
          S.list()
            .title('Páginas')
            .items([
              unico('inicio', 'Inicio'),
              unico('nosotros', 'Nosotros'),
              unico('paginaProyectos', 'Página de proyectos'),
              unico('paginaResenas', 'Página de reseñas'),
              unico('paginaBlog', 'Página del blog'),
            ]),
        ),
      S.listItem()
        .id('servicios')
        .title('Servicios')
        .child(
          S.list()
            .title('Servicios')
            .items([
              lista('categoria', 'Categorías (Audio, Video, Tecnología)', porOrden),
              S.listItem()
                .id('servicios-por-categoria')
                .title('Servicios por categoría')
                .child(
                  S.documentTypeList('categoria')
                    .title('Elige una categoría')
                    .defaultOrdering([{field: 'orden', direction: 'asc'}])
                    .child((categoriaId) =>
                      S.documentList()
                        .title('Servicios')
                        .schemaType('servicio')
                        .filter('_type == "servicio" && categoria._ref == $categoriaId')
                        .params({categoriaId: categoriaId.replace(/^drafts\./, '')})
                        .defaultOrdering([{field: 'orden', direction: 'asc'}]),
                    ),
                ),
              lista('servicio', 'Todos los servicios', porCategoriaYOrden),
              unico('guiaDeServicios', 'Guía «¿Qué servicios necesito?» (inactiva)'),
            ]),
        ),
      S.divider(),
      lista('proyecto', 'Proyectos'),
      lista('resena', 'Reseñas de clientes'),
      lista('cliente', 'Clientes'),
      S.divider(),
      S.listItem()
        .id('blog')
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              lista('articulo', 'Artículos'),
              lista('categoriaBlog', 'Categorías del blog', porOrden),
              lista('autor', 'Autores'),
            ]),
        ),
    ])
}
