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
- `estructura.ts`: el menú del Studio. `validaciones.ts`: validaciones que consultan otros documentos.
- Las reglas de contenido (longitudes de SEO, vocabulario prohibido, permisos, slugs) viven en
  `packages/sanity/reglas/` y las usa también el build del sitio, para que lo que el Studio rechaza al capturar sea
  lo mismo que el build rechaza al compilar.

## Datasets

- `production`: lo que lee el sitio. Es **público**: todo lo publicado lo puede leer cualquiera, por eso no se
  guarda aquí nada privado y reseñas, clientes y proyectos reales no se pueden publicar sin permiso.
- `pruebas`: para ensayar. `pnpm dev` se conecta aquí (ver `.env.development`; son valores públicos, no secretos).

## Migración del contenido actual (etapa 2 de la fase 3)

Convierte `apps/web/src/content/*.ts` y `lib/negocio.ts` en documentos de Sanity. Se borra en la etapa 3, junto con
esos archivos. **Nada de esto escribe en un dataset por sí solo**: la importación se hace a mano, después de revisar.

| Comando                                     | Qué hace                                                                                     |
| ------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `pnpm migracion:exportar`                   | Genera `migraciones/salida/contenido.ndjson` y `ids.txt` (no se suben a Git). Sin red        |
| `pnpm migracion:verificar --seco`           | Comprueba lo que se importaría: conversión inversa idéntica, vocabulario, reglas del Studio… |
| `pnpm migracion:verificar --dataset NOMBRE` | Solo lee (sin token) y compara el dataset con lo esperado                                    |

Importar (con la sesión de GitHub, sin tokens), **primero a `pruebas`**:

```sh
pnpm sanity dataset import migraciones/salida/contenido.ndjson --dataset pruebas --replace
```

Antes de importar a `production` se hace un respaldo fuera del repo
(`pnpm sanity dataset export production ../../../digital-x-respaldos/production-AAAA-MM-DD.tar.gz`).
Los mismos IDs se reemplazan, así que repetir la importación no duplica nada, pero **después de publicar el Studio no se
vuelve a importar a `production`**: `--replace` borraría lo que el dueño haya editado.
