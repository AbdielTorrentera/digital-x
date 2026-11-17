# Studio de Digital X

Sanity Studio en español. Aquí el dueño administra el contenido del sitio (configuración, servicios, proyectos,
reseñas y blog) sin tocar código. Las reglas completas están en `docs/` (estructura §7 y seguridad §4). La guía para
quien lo usa está en `docs/guia-studio-digitalx.md`.

## Comandos

Desde `apps/studio`:

| Comando                       | Qué hace                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `pnpm dev`                    | Studio local en <http://localhost:3333> con dos espacios (ver abajo)         |
| `pnpm check`                  | Revisa los tipos (`tsc`)                                                     |
| `pnpm sanity schema validate` | Valida los esquemas (de `produccion`, el único espacio que ven los comandos) |
| `pnpm build`                  | Compila el Studio (solo con `production`, como el publicado)                 |
| `pnpm sanity deploy`          | Publica el Studio en <https://admin-digitalx.sanity.studio>                  |

El acceso es con la cuenta de GitHub del dueño (2FA activa): `pnpm sanity login --provider github`.

## Cómo está organizado

- `schemaTypes/documentos/`: un archivo por tipo de documento. Los **documentos únicos** (`configuracion`, `inicio`,
  `nosotros`, `paginaProyectos`, `paginaBlog`, `paginaResenas`, `guiaDeServicios`) tienen ID fijo y no se crean,
  duplican ni borran.
- `schemaTypes/objetos/`: piezas reutilizables (foto con texto alternativo, SEO, texto con enlaces, bloques…).
- `estructura.ts`: el menú del Studio. `validaciones.ts`: validaciones que consultan otros documentos. `acciones.ts`: protege «Despublicar» y «Eliminar» de servicios y categorías que el Inicio nombra con marcadores.
- `componentes/AvisoDeDataset.tsx`: la franja fija sobre la barra que dice en qué dataset se está editando.
- Las reglas técnicas de contenido (slugs, enlaces, marcadores, página construida completa, formatos) viven en
  `packages/sanity/reglas/` y las usa también el build del sitio. Las reglas de redacción de `docs/` son guía para
  quien escribe: el Studio no las valida.

## Datasets y espacios de trabajo

- `production`: lo que lee el sitio. Es **público**: todo lo publicado lo puede leer cualquiera, por eso no se
  guarda aquí nada privado, y todo lo publicado se muestra en el sitio.
- `pruebas`: para ensayar. Lo publicado aquí **no** sale en el sitio.
- **Studio local (`pnpm dev`):** dos espacios, «Pruebas» (`/pruebas`, el que abre) y «Producción» (`/produccion`). Los
  activa `SANITY_STUDIO_ESPACIOS=local`, que solo fija el script `dev` de `package.json` (valor público, no secreto).
  Una franja fija arriba dice «PRUEBAS» (ámbar) o «PRODUCCIÓN» (azul marino) con el nombre real del dataset.
- **Todo lo demás ve un solo espacio, `produccion`:** `sanity build`, `sanity deploy`, `sanity schema …` y `sanity cors …`
  no llevan la variable, así que el Studio publicado no tiene ninguna ruta a `pruebas`. **No guardes
  `SANITY_STUDIO_ESPACIOS` en ningún `.env`:** la CLI los lee, registraría «Pruebas» en el Dashboard y el Studio
  publicado abriría en `/pruebas/` («Tool not found»); pasó en la primera publicación y se corrigió republicando.
  Se comprueba que `dist/` no traiga el dataset ni el espacio `pruebas` (el texto «PRUEBAS» de la franja sí viene en
  el código, pero nunca se muestra en Producción) y que el deploy diga `Deployed 1/1 schemas`.
- `pnpm sanity deploy` (no `pnpm deploy`, que es un comando de pnpm distinto) también guarda el esquema como un
  documento de sistema (`_.schemas.produccion`) en `production`; no es contenido, el sitio no lo lee y la API pública
  no lo devuelve.
- **Dónde queda publicado:** `https://admin-digitalx.sanity.studio` redirige al Dashboard de Sanity
  (`www.sanity.io/@…/studio/<appId>`), que pide iniciar sesión. El manifiesto de espacios del Studio
  (`/static/create-manifest.json`) se sirve con caché de hasta 24 horas.
