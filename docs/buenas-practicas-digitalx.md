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
| Datos del negocio (teléfono, WhatsApp, zonas, mensajes) | `apps/web/src/lib/negocio.ts` |
| Registro de páginas y su estado | `apps/web/src/lib/paginas.ts` |
| Colores, espaciados, tamaños, radios, duraciones | `apps/web/src/styles/tokens.css` |
| Consultas a Sanity (GROQ) y tipos generados | `packages/sanity/` (cuando exista) |
| Esquemas de contenido | `apps/studio/schemaTypes/` |
| Secciones visuales reutilizables | `apps/web/src/components/sections/` y `ui/` |
| Comportamiento en el navegador | `apps/web/src/scripts/`, un módulo por comportamiento |
| Logos e íconos fuente | `brand/` |

Reglas:

1. **Ningún dato del negocio escrito a mano en un componente.** Teléfono, URL, correo o mensaje de WhatsApp se importan de `negocio.ts` (o de Sanity cuando se migre). Lo mismo para URLs del sitio: salen de `paginas.ts`.
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
   - Código nuevo de este proyecto: nombres en **español** para conceptos del negocio (`negocio`, `paginas`, `BotonLlamar`), como ya está.
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
| Enlaces internos sin 404 | Script de revisión sobre `dist/` | Cada *pull request* |
| Registro de páginas coherente con las rutas | Protección en el build (ya existe) | Cada build |
| Esquemas de Sanity válidos | Validaciones del esquema y `sanity schema validate` | Al cambiar esquemas |
| Pantallas a 360 y 1440 px, sin scroll horizontal | Playwright (capturas y comprobaciones básicas) | Al cambiar componentes o páginas |
| Accesibilidad automática | axe con Playwright | Al cambiar componentes o páginas |
| Rendimiento | Lighthouse o PageSpeed | Antes de lanzar y al agregar páginas |

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
- **Vercel** despliega automáticamente: vista previa por *pull request* y producción al fusionar a `main`.
- Cada proyecto de Vercel se reconstruye solo cuando cambia su carpeta (`apps/web` o `apps/studio`) o `packages/`.
- Sin herramientas adicionales de orquestación (Turborepo, Nx) mientras haya dos apps.

---

## 8. Monitoreo

- Alertas de Vercel por correo cuando falla un build (incluidos los que dispara el webhook de Sanity).
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
