# Studio de Digital X

Sanity Studio en español. Aquí el dueño administra el contenido del sitio (configuración, servicios, proyectos,
reseñas y blog) sin tocar código. Las reglas completas están en `docs/` (estructura §7 y seguridad §4).

## Comandos

Desde `apps/studio`:

| Comando                                     | Qué hace                                                                    |
| ------------------------------------------- | --------------------------------------------------------------------------- |
| `pnpm dev`                                  | Studio local en <http://localhost:3333>, conectado al dataset **`pruebas`** |
| `SANITY_STUDIO_DATASET=production pnpm dev` | Lo mismo, pero contra lo publicado (con cuidado: edita el contenido real)   |
| `pnpm check`                                | Revisa los tipos (`tsc`)                                                    |
| `pnpm sanity schema validate`               | Valida los esquemas                                                         |
| `pnpm build`                                | Compila el Studio                                                           |

El acceso es con la cuenta de GitHub del dueño (2FA activa): `pnpm sanity login --provider github`.

## Cómo está organizado

- `schemaTypes/documentos/`: un archivo por tipo de documento. Los **documentos únicos** (`configuracion`, `inicio`,
  `nosotros`, `paginaProyectos`, `paginaBlog`, `paginaResenas`, `guiaDeServicios`) tienen ID fijo y no se crean,
  duplican ni borran.
- `schemaTypes/objetos/`: piezas reutilizables (foto con texto alternativo, SEO, texto con enlaces, bloques…).
- `estructura.ts`: el menú del Studio. `validaciones.ts`: validaciones que consultan otros documentos. `acciones.ts`: protege «Despublicar» y «Eliminar» de servicios y categorías que el Inicio nombra con marcadores.
- Las reglas de contenido (longitudes de SEO, vocabulario prohibido, permisos, slugs) viven en
  `packages/sanity/reglas/` y las usa también el build del sitio, para que lo que el Studio rechaza al capturar sea
  lo mismo que el build rechaza al compilar.

## Datasets

- `production`: lo que lee el sitio. Es **público**: todo lo publicado lo puede leer cualquiera, por eso no se
  guarda aquí nada privado y reseñas, clientes y proyectos reales no se pueden publicar sin permiso.
- `pruebas`: para ensayar. `pnpm dev` se conecta aquí (ver `.env.development`; son valores públicos, no secretos).
