# Digital X — Buenas prácticas de desarrollo (digitalx.mx)

Cómo se escribe, organiza, prueba y entrega el código del proyecto. Tiene la prioridad más baja: si choca con seguridad, estructura, SEO, marca o diseño, mandan ellos.
Versión: borrador de trabajo · 2026-10-30

---

## 0. Instrucciones para el agente (leer primero)

1. **La solución más simple que cumpla las reglas gana.** Antes de proponer algo, pregúntate si existe una forma más corta, con menos archivos y sin dependencias nuevas.
2. **Haz solo lo que pide la tarea.** No refactorices, renombres, reordenes ni "mejores" código fuera del alcance. Si ves algo que conviene cambiar, anótalo en el reporte como propuesta.
3. **No construyas "por si acaso".** Nada de funciones, opciones de configuración, abstracciones ni estructuras para necesidades que hoy no existen.
4. **Entiende antes de copiar.** No pegues código de tutoriales, foros o de otra versión de una librería sin entenderlo y comprobar que corresponde a la versión instalada. La referencia es la documentación oficial de la versión que usa el proyecto.
5. Cambios pequeños y revisables: una tarea, una rama, un *pull request*.

---

## 1. Contexto: qué tamaño de proyecto es este

Es un **sitio estático de unas 20 páginas**, mantenido por una persona con ayuda de agentes de IA, con un CMS (Sanity) para el contenido que cambia. Eso define qué prácticas valen la pena:

| Práctica general | En este proyecto |
| --- | --- |
| SOLID, capas, patrones de diseño | No hay clases ni lógica de negocio compleja. Se aplica la idea de fondo: **cada archivo tiene una sola responsabilidad** (ver §2) |
| Microservicios, arquitecturas complejas | **Prohibido.** Un monorepo con dos apps es todo lo que hace falta |
| Pruebas unitarias de todo | No. Se prueba lo que puede romperse de forma silenciosa (ver §5) |
| Monitoreo con Sentry, Datadog, etc. | No hace falta mientras el sitio sea estático. Alertas de build de Vercel (ver §8) |
| CI/CD | Sí, ligero: verificaciones automáticas en cada *pull request* y despliegue automático de Vercel |
| Revisiones de código | Sí: el dueño revisa cada *pull request* y su vista previa antes de fusionar |

---

## 2. Estructura y responsabilidades

Cada tipo de cosa vive en un solo lugar:

| Qué | Dónde |
| --- | --- |
| Datos del negocio (teléfono, WhatsApp, correo, redes, zonas, mensaje general) | «Configuración del sitio» en Sanity, leída por `apps/web/src/lib/negocio.ts` (en código: URL, logo y funciones de enlace) |
| Registro de páginas y su estado | `apps/web/src/lib/paginas.ts` (páginas fijas; los servicios y su estado salen de Sanity) |
| Colores, espaciados, tamaños, radios, duraciones | `apps/web/src/styles/tokens.css` |
| Consultas a Sanity (GROQ) y tipos generados | `packages/sanity/` (consultas y tipos, desde la etapa 3) |
| Esquemas de contenido | `apps/studio/schemaTypes/` |
| Reglas técnicas de contenido compartidas por el Studio y el build (slugs, enlaces, marcadores, página construida completa, validación técnica) | `packages/sanity/reglas/` (con sus pruebas: `pnpm test` en esa carpeta) |
| Secciones visuales reutilizables | `apps/web/src/components/sections/` y `ui/` |
| Comportamiento en el navegador | `apps/web/src/scripts/`, un módulo por comportamiento |
| Logos e íconos fuente | `brand/` |

Reglas:

1. **Ningún dato del negocio escrito a mano en un componente.** Teléfono, URL, correo o mensaje de WhatsApp se importan de `negocio.ts` (que los lee de Sanity). Lo mismo para URLs del sitio: salen de `paginas.ts`.
2. **Las páginas (`src/pages/`) solo arman:** obtienen datos y componen secciones. No contienen estilos grandes ni lógica.
3. **Componentes pequeños.** Si un componente pasa de unas 200 líneas o hace dos cosas distintas, se divide. Un archivo que "hace de todo" es un error.
4. **Las consultas a Sanity no se esparcen por los componentes:** se escriben una vez en su módulo y se reutilizan.
5. **Sin dependencias circulares** entre módulos.

---

## 3. Simplicidad (KISS, YAGNI, DRY)

- **KISS:** primero HTML y CSS; JavaScript solo cuando no hay otra forma. Astro sin frameworks de interfaz en el sitio (el Studio usa React porque Sanity así funciona).
- **YAGNI:** no se agregan opciones, variantes de componente o configuraciones que ninguna página usa hoy. Las páginas en estado "Pendiente de material" no se preparan por adelantado.
- **DRY con criterio:** algo se convierte en componente o función compartida cuando se repite **tres veces**, no antes. Dos casos parecidos con diferencias reales pueden quedarse separados; una abstracción forzada es peor que una pequeña repetición.
- **Stack cerrado:** Astro, TypeScript, CSS con tokens, Sanity y Mux. **Prohibido** agregar Tailwind, React en el sitio, otra librería de animación, otro CMS o cualquier herramienta "de moda" sin una necesidad real aprobada por el dueño.
- **Optimizar con datos:** el rendimiento se mide (Lighthouse, PageSpeed) y se corrige lo que falle según los límites de `reglas-seo-digitalx.md` §10. No se optimiza "por si acaso".

---

## 4. Estilo de código

1. **TypeScript estricto** (`strict: true`). Sin `any` salvo con un comentario que explique por qué.
2. **Formato automático con Prettier** (con `prettier-plugin-astro`) en todo el monorepo. Nadie formatea a mano.
3. **Revisión de tipos con `astro check`** en el sitio y con `tsc` en el Studio.
4. Linter: el que traiga cada herramienta (`astro check`, el de Sanity). Solo se agrega ESLint si aparece un problema que estas herramientas no detectan. `[PENDIENTE: decidir si se agrega ESLint]`.
5. **Nombres que digan lo que hacen:** `waUrl(mensaje)`, `urlsPublicadas`, no `fn1` ni `data2`.
6. **Idioma:**
   - Código nuevo de este proyecto: nombres en **español** para conceptos del negocio (`negocio`, `paginas`, `LlamarFlotante`), como ya está.
   - El código heredado de Marby **no se renombra** solo para traducirlo; se renombra únicamente si se reescribe por otra razón.
   - Comentarios, mensajes de commit y documentación en español.
7. **Comentarios:** explican **por qué** se tomó una decisión, no qué hace el código. Se borran los comentarios obsoletos y el código comentado.
8. **Nada de código muerto:** lo que no se usa se elimina (Git guarda el historial).
9. **Marcadores:** los huecos de contenido usan `[PENDIENTE: …]` (ver estructura §0). Los pendientes técnicos usan `// TODO: …` con una explicación concreta.

---

## 5. Pruebas y verificación

No se busca cobertura total, sino detectar lo que puede romperse sin que nadie lo note.

| Verificación | Herramienta | Cuándo |
| --- | --- | --- |
| Tipos y plantillas | `astro check` / `tsc` | Cada *pull request* |
| Compilación | `pnpm build` | Cada *pull request* |
| Formato | `prettier --check` | Cada *pull request* |
| Enlaces internos sin 404 | Script de revisión sobre `dist/` (acepta páginas planeadas sin construir) | Cada *pull request* |
| Sin enlaces a páginas sin construir | Protección en el build de producción (`VERCEL_ENV=production`) | Cada build de producción |
| Registro de páginas coherente con las rutas | Protección en el build (ya existe) | Cada build |
| Esquemas de Sanity válidos | Validaciones del esquema, `sanity schema validate` y las pruebas de `packages/sanity` | Al cambiar esquemas |
| Pantallas a 360 y 1440 px, sin scroll horizontal | Playwright (capturas y comprobaciones básicas) | Al cambiar componentes o páginas |
| Accesibilidad automática | axe con Playwright | Al cambiar componentes o páginas |
| Rendimiento | Lighthouse o PageSpeed | Antes de lanzar y al agregar páginas |

- **Contenido de Sanity.** Solo las reglas **técnicas** (lo que el sitio necesita para construirse) se escriben **una sola vez** en `packages/sanity/reglas` y las usan el Studio (error al capturar) y el build (falla): lo que bloquea el build es error en el Studio, salvo la guarda de solo producción (enlaces a páginas sin construir). Las reglas de redacción de `docs/` (vocabulario, longitudes, texto alternativo, `[PENDIENTE`) son guía para quien escribe: no se convierten en validaciones, pruebas ni guardas sin que el dueño lo pida. Al cambiar una regla técnica se actualizan sus pruebas en ese paquete; las pruebas de `apps/web` usan datos sintéticos y prueban lógica, no redacción.
- **Enlaces a páginas planeadas.** En desarrollo y en CI se permite enlazar a páginas en estado "Lanzamiento" que todavía no están construidas (llevan a la 404): `check:enlaces` las acepta y sigue fallando con cualquier URL que no esté en el registro `paginas.ts` o que esté "Pendiente de material". El build de producción falla si queda alguno, con la lista de páginas y enlaces; es la única protección de este tipo.
- Las funciones con lógica real (por ejemplo `waUrl`, el filtrado de páginas visibles o la validación de enlaces) llevan una **prueba unitaria pequeña**.
- Ninguna tarea se da por terminada si alguna de sus verificaciones falla o no se pudo ejecutar; se reporta.

---

## 6. Git y flujo de trabajo

1. **GitHub Flow:** `main` siempre publicable. Cada tarea en su rama (`tarea/inicio`, `fix/menu-movil`), un *pull request* y fusión a `main` después de revisar.
2. Vercel crea una **vista previa** por *pull request*: el dueño la revisa en el celular antes de aprobar.
3. **Mensajes de commit** con Conventional Commits, tipo en inglés y descripción en español:
   - `feat: agrega sección de servicios al Inicio`
   - `fix: corrige el tamaño del botón de llamar en móvil`
   - `docs: actualiza reglas de diseño`
   - `chore: actualiza dependencias`
   - Otros tipos: `style`, `refactor`, `test`.
4. Commits pequeños y con un solo propósito. No se mezclan cambios de contenido, estilo y configuración en el mismo commit.
5. Prohibido `git push --force` a `main` y fusionar con verificaciones en rojo.
6. El agente **no hace commit ni push** sin que el dueño lo pida.

---

## 7. Integración y despliegue continuo

- **GitHub Actions** en cada *pull request*: `pnpm install --frozen-lockfile`, `prettier --check`, `astro check`, `pnpm build` y revisión de enlaces. Debe pasar para fusionar.
- **Vercel** despliega automáticamente: vista previa por *pull request* y por cada fusión a `main`. La **producción** sale de `main` desde el lanzamiento (18 de noviembre de 2026); ver "Proyecto de Vercel del sitio" abajo.
- Hay **un solo proyecto de Vercel** (el sitio, `apps/web`); se reconstruye solo cuando cambia su carpeta o `packages/`. El Studio vive solo en `*.sanity.studio` (no hay proyecto de Vercel del Studio): se publica en `admin-digitalx.sanity.studio` con `pnpm sanity deploy` (desde `apps/studio`; escribe en `production` un documento de sistema `_.schemas.*` con el esquema, que el sitio no lee).
- **El build lee Sanity.** `pnpm build` baja antes el contenido publicado (sin token) y lo valida con `packages/sanity/reglas`; si Sanity no responde o algo no pasa, falla y Vercel conserva la versión anterior. El CI también lo baja de `production` (necesita red). Las pruebas y `astro check` usan una instantánea sintética (`apps/web/src/lib/contenido/pruebas/contenido.json`) para no depender de lo publicado.
- Sin herramientas adicionales de orquestación (Turborepo, Nx) mientras haya dos apps.

### Proyecto de Vercel del sitio (`apps/web`)

Configuración del panel (consultada en la documentación oficial de Vercel, no de memoria):

| Ajuste | Valor |
| --- | --- |
| Root Directory | `apps/web` (con "Include source files outside of the Root Directory in the Build Step" activo, si el panel lo muestra, para que la instalación vea `pnpm-workspace.yaml` y el lockfile de la raíz) |
| Framework Preset | Astro (se detecta solo) |
| Build Command, Output Directory e Install Command | automáticos, **sin Override**. Un Override "pnpm install" usaría el pnpm más viejo (6) |
| Node.js Version | 24.x (el CI y el equipo usan Node 24; `engines.node` de `apps/web/package.json` dice lo mismo y anula al panel) |
| Variable de entorno | `ENABLE_EXPERIMENTAL_COREPACK` = `1`, en Production y Preview |
| System Environment Variables | "Enable access to System Environment Variables" **activado**. Si se apaga, `VERCEL_ENV` no existe en el build: el sitio saldría con `noindex` y sin las protecciones, también en producción |
| Production Branch | `main` (desde el 18 de noviembre de 2026; antes `lanzamiento`, rama ya borrada) |
| Dominios | En Production: `digitalx.mx` (principal) y `www.digitalx.mx` (redirige a `digitalx.mx` con 308, desde el panel de dominios; Vercel no ofrece 301 ahí). También `digitalequis.com` y `www.digitalequis.com`, **sin** redirección en el panel: sus 301 las hace `apps/web/vercel.json` por host (estructura §6) |
| DNS | Los dos dominios usan los servidores de nombres de Vercel (`ns1.vercel-dns.com` y `ns2.vercel-dns.com`), puestos en Akky (`digitalx.mx`) y en GoDaddy (`digitalequis.com`). Con ellos Vercel crea solo los registros A de la raíz y de `www` y los CAA; **no se escriben a mano** los A ni CNAME que muestra el panel. A mano solo hay TXT: SPF nulo `v=spf1 -all` en la raíz y DMARC `v=DMARC1; p=reject;` en `_dmarc` (los dos dominios no envían correo; se reemplazan el día que se configure uno) y los de verificación de Search Console. Akky no ofrece editor de registros gratuito (solo escribir los servidores DNS), por eso se usa Vercel DNS |

- **pnpm 11 y Corepack.** La documentación de Vercel lista pnpm 6 a 12, pero su detección por lockfile solo mapea `lockfileVersion: 9.0` a pnpm 9 o 10, y el issue [vercel/vercel#17434](https://github.com/vercel/vercel/issues/17434) reporta que con pnpm 11 cae a `npm install` y falla (correcciones en los PR [#17450](https://github.com/vercel/vercel/pull/17450) y #17573, abiertos al 6 de noviembre de 2026). Por eso el repo declara `packageManager: "pnpm@11.28.9"` en el `package.json` de la raíz y el proyecto usa `ENABLE_EXPERIMENTAL_COREPACK=1`: así Vercel usa esa versión y no adivina por el lockfile. `devEngines.packageManager` queda igual (lo lee el CI); **las dos versiones se cambian juntas** al actualizar pnpm.
- **Plan B si el log dice que usa npm** o una versión de pnpm distinta de la 11.28.9: Install Command con Override `corepack enable && pnpm install --frozen-lockfile` (no está documentado por Vercel; se prueba en una vista previa).
- **Producción y vistas previas.** Cada fusión a `main` y cada disparo del *deploy hook* producen un deployment de **Production** (`VERCEL_ENV=production`): `index`, `robots.txt` con `Allow`, canonical `https://digitalx.mx/`, CSP obligatoria y las protecciones de §5 (el build falla si queda un enlace a una página sin construir). Los *pull requests* salen como *preview* (`VERCEL_ENV=preview`): compilan con enlaces a páginas planeadas y llevan `noindex` (etiqueta, `robots.txt` en `Disallow` y el encabezado `X-Robots-Tag` que Vercel añade), protegidos por el inicio de sesión de Vercel (Standard Protection; la URL `*.vercel.app` de producción y los dominios propios son públicos). Las previews no sirven los hosts de `digitalequis.com`: **las 301 de ese dominio solo se pueden probar en producción**.
- **Lanzamiento (hecho el 18 de noviembre de 2026).** Condiciones que se cumplieron antes de cambiar la Production Branch a `main`: páginas construidas, sin `[PENDIENTE` visibles, variables del sistema activadas, sin `PUBLIC_VERCEL_ANALYTICS` y la CSP obligatoria sin avisos en la consola. **Las fotos provisionales (`temporal-*`, de bancos gratuitos) no bloquearon el lanzamiento** (decisión del dueño, 17 de noviembre de 2026): se lanzó con ellas y se reemplazan después desde el Studio, sin tocar código. Orden que se siguió, para repetirlo si hace falta: (1) cambiar la Production Branch a `main` (el ajuste no despliega por sí solo); (2) un deployment de `main` como Production (se disparó publicando en el Studio, que activa el *deploy hook*); (3) agregar los dominios y el DNS; (4) borrar la rama `lanzamiento`. El deployment fallido del 6 de noviembre (el primero del proyecto, que se compiló como producción y falló a propósito) queda en el historial y no hay que arreglarlo.

### Actualización automática (Sanity → Vercel)

Publicar o borrar contenido en `production` reconstruye el sitio sin tocar código. La guía para el dueño está en `docs/guia-studio-digitalx.md`.

- **Pieza de Vercel:** un *Deploy Hook* (Settings › Git) llamado `Sanity production → main`, atado a la rama **`main`**, que es la Production Branch: desde el lanzamiento, cada publicación en el Studio produce un deployment de **Production** (confirmado el 18 de noviembre de 2026) y el cambio se ve en `digitalx.mx` en unos minutos. Para revisar un cambio antes de publicarlo no hay vista previa de contenido: se trabaja en el espacio «Pruebas» del Studio (dataset `pruebas`).
- **Pieza de Sanity:** un *webhook* (sanity.io/manage › API › Webhooks) con dataset `production`, disparado en **Create, Update y Delete**, método `POST`, sin secreto ni *projection*, y con el filtro `!(_type in ["sanity.imageAsset", "sanity.fileAsset"]) && !(_id in path("_.**"))`. Con los borradores y las versiones **apagados** (*trigger when drafts/versions are modified*), solo lo publicado dispara. El filtro evita builds por una foto subida sin publicar o por un documento de sistema, y no hay que cambiarlo al agregar tipos nuevos (proyectos, reseñas, blog). Ocupa 1 de los 2 webhooks del plan Free.
- **La URL del hook es un secreto** (seguridad §3.5): solo vive en el webhook de Sanity; nunca en el repo, el chat ni un `.env`. Si se filtra, se borra el hook y se crea otro.
- **Agrupación.** Según la documentación de Vercel, si llegan varios disparos de la misma versión, los deployments anteriores del mismo hook se cancelan; publicar varias cosas seguidas termina en un solo build.
- **Límites (Hobby y Sanity Free, según sus documentaciones oficiales):** 100 deployments al día (los *pull requests* también cuentan), 1 build a la vez, 5 hooks por proyecto y 60 disparos de hook por hora. Sanity Free: 2 webhooks y 250 mil peticiones a la API al mes (el build baja el contenido con una sola consulta).
- **Posible fallo a vigilar:** «Skip unaffected projects» puede saltar un deployment cuyo último commit no tocó `apps/web`. Si un disparo sale «Skipped», desactivar *Skip deployment* en Settings › Build and Deployment › Root Directory.
- **Build roto:** si el contenido no pasa la validación o Sanity no responde, el build falla y Vercel conserva la versión anterior (nunca asigna la URL a un deployment fallido). Vercel avisa por correo (§8).
- **Prueba del aviso.** Se hizo el 17 de noviembre de 2026 con un hook temporal en la rama `lanzamiento` (ya borrada), que falló a propósito por las protecciones de producción; el correo llegó y el hook se borró. Para repetirla hace falta un hook temporal atado a una rama que falle; después se **borra el hook**.
- **Plan Hobby (decisión del dueño).** Se usa el plan Hobby de Vercel. Su [política de uso justo](https://vercel.com/docs/limits/fair-use-guidelines) lo limita a uso personal no comercial y define como comercial anunciar la venta de un servicio o recibir pago por crear o alojar el sitio, así que digitalx.mx cae en esa definición. **Riesgo:** Vercel puede pedir pasar a Pro o pausar el proyecto. **Alternativa gratuita:** Cloudflare Pages, que según el dueño permite uso comercial y sirve sitios estáticos de Astro (al evaluarla se revisan sus términos vigentes). No se cambia nada por ahora.

---

## 8. Monitoreo

- Alertas de Vercel por correo cuando falla un build (incluidos los que dispara el webhook de Sanity): Settings › My Notifications › Deployment Failures, con *Email* activado. El correo trae el enlace al log, donde la línea `✖` dice qué documento y qué campo fallaron. Confirmado el 17 de noviembre de 2026: el correo llega también cuando el build lo dispara un *deploy hook*.
- Revisión mensual de Search Console (errores de rastreo, páginas excluidas) y de PageSpeed en las páginas principales.
- Sentry u otra herramienta de errores **no se agrega** mientras el sitio sea estático. Se reconsidera si se agregan funciones de servidor.

---

## 9. Documentación

- `CLAUDE.md` es el índice; las reglas viven en `docs/`. Cuando una tarea cambia una decisión, se actualiza el archivo de reglas correspondiente en el mismo *pull request*.
- Cada app tiene un `README.md` corto con comandos para correrla y variables de entorno necesarias.
- No se crea documentación que nadie vaya a leer: nada de documentos por componente.

---

## 10. Definición de "terminado"

Una tarea está terminada cuando:

- [ ] Cumple las reglas de todos los archivos de `docs/` que aplican.
- [ ] Pasan las verificaciones de §5 que le corresponden, y se ejecutaron (no solo "deberían pasar").
- [ ] Se revisó a 360 px y en escritorio.
- [ ] No quedó código muerto, comentarios obsoletos ni dependencias sin usar.
- [ ] El reporte incluye qué se hizo, cómo se verificó y los `[PENDIENTE: …]` que quedan.
- [ ] El dueño revisó la vista previa.

---

## 11. Pendientes

- [x] Configurar Prettier con `prettier-plugin-astro` en el monorepo.
- [x] Crear el flujo de GitHub Actions de §7.
- [x] Proteger la rama `main` en GitHub.
- [x] `tsc` del Studio en las verificaciones.
- [ ] Decidir si se agrega ESLint.
