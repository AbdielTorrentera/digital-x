# Guía del Studio de Digital X

Cómo cambiar el contenido del sitio sin tocar código. Está escrita para el dueño, en palabras sencillas.

Los consejos de redacción que aparecen en los campos del Studio son **sugerencias**: el Studio no te obliga a seguirlos. Lo único que te detiene es lo que el sitio necesita para poder armarse (por ejemplo, una dirección que no empieza con `https://`).

---

## 1. Dónde editar

**Siempre en el Studio publicado:**

> **https://admin-digitalx.sanity.studio**

Entras con tu cuenta de GitHub (con tu verificación en dos pasos). Esa dirección te lleva al panel de Sanity (`sanity.io`) y ahí se abre el Studio: es normal. En la parte de arriba verás una franja azul marino que dice **PRODUCCIÓN · dataset production**. Eso significa que lo que publiques **sí sale en el sitio**.

El Studio de tu computadora (`pnpm dev`, en `localhost:3333`) es solo para ensayar. Ahí la franja es **ámbar** y dice **PRUEBAS · dataset pruebas · Lo que publiques aquí NO sale en el sitio**. Si cambias algo ahí, el sitio no se entera.

| Franja | Qué significa | ¿Sale en el sitio? |
| --- | --- | --- |
| Azul marino · PRODUCCIÓN | Estás editando el contenido real | Sí |
| Ámbar · PRUEBAS | Estás ensayando | No |

Si ves la franja ámbar y quieres cambiar el sitio, estás en el lugar equivocado: abre el Studio publicado.

---

## 2. Publicar y cuánto tarda en verse

1. Haces tu cambio. Mientras no des **Publicar**, es un borrador: el sitio **nunca** lo muestra.
2. Das **Publicar**. Sanity avisa al sitio y el sitio se reconstruye solo.
3. La reconstrucción tarda **unos 3 minutos**. Cuenta **unos 5 minutos desde que publicas** para estar tranquilo.

Si publicas varias cosas seguidas no pasa nada: el sitio se reconstruye con todo lo último, no tienes que esperar entre una y otra.

**Dónde se ve el cambio:**

- **Hoy** (antes del lanzamiento): en la versión de prueba del sitio. Entra a Vercel, abre tu proyecto, ve a **Deployments** y abre el más reciente que diga `main` (botón **Visit**). Necesitas tu sesión de Vercel.
- **Después del lanzamiento:** en `digitalx.mx`.

---

## 3. Cómo hacer lo de todos los días

Siempre termina con **Publicar**.

### Agregar un servicio

1. En el menú: **Servicios › Todos los servicios**, y arriba el botón de **crear** (el signo `+`).
2. Elige la **Categoría**, escribe el **Nombre del servicio** y llena la descripción, el título principal, el mensaje de WhatsApp y el contenido. La dirección y el lugar en su categoría salen solos.
3. Cuando el contenido esté completo y las fotos aprobadas, marca **Página construida (publicar su página)**. Si falta algo, el Studio te dice qué. Mientras no la marques, el servicio no tiene página: su nombre se ve sin enlace.
4. **Publicar.**

### Quitar un servicio

- **Para quitar solo su página** (el nombre se queda como texto): desmarca **Página construida** y publica.
- **Para quitarlo del todo:** abre el servicio, menú `⋯` de arriba a la derecha › **Despublicar** (o **Eliminar**).
- Si el botón sale apagado, pasa el cursor encima: dice el motivo. Por ejemplo, no se puede quitar el último servicio de una categoría que el Inicio nombra.
- Si la página ya estaba en el sitio, su dirección deja de existir.

### Cambiar o agregar una foto

1. Abre el documento donde está la foto (por ejemplo, un servicio, pestaña **Fotos**, o **Configuración del sitio › Fotos generales**).
2. Haz clic en la foto y elige **Subir** (o arrastra la nueva). Puedes mover el punto de enfoque para decidir qué se ve al recortar.
3. **Texto alternativo** (qué se ve en la foto) es opcional. Con él, el sitio lo usa para las personas que no ven la imagen y para Google; sin él, la foto se muestra igual, solo sin descripción.
4. **Publicar.** Revisa que estés en la franja azul marino.

### Agregar o quitar una zona

1. **Configuración del sitio**, pestaña **Cobertura**, campo **Lugares donde damos servicio**.
2. Para agregar: **Agregar elemento** y escribe el lugar (por ejemplo, `Atlixco`). Se muestran en el orden en que los dejes; arrastra para reordenar.
3. Para quitar: menú `⋯` del lugar › **Eliminar**.
4. **Publicar.** Las zonas se actualizan en los textos, el pie y los datos para Google. «Y alrededores» se agrega solo.

Un consejo: escribe solo los lugares que de verdad atiendes.

### Agregar, ocultar o quitar una red social

1. **Configuración del sitio**, pestaña **Redes y reseñas**, campo **Redes sociales**.
2. Para agregar: **Agregar elemento**, elige la **Red**, pega la **Dirección (URL)** completa (empieza con `https://`) y activa **Mostrar en el sitio**.
3. Para ocultarla sin borrarla: apaga **Mostrar en el sitio**.
4. Para quitarla: menú `⋯` de esa red › **Eliminar**.
5. **Publicar.** Una red sin dirección nunca se muestra.

---

## 4. Si un cambio no aparece

Revisa en este orden:

1. **¿Estabas en Producción?** Mira la franja de arriba: azul marino, no ámbar.
2. **¿Le diste Publicar?** Si el botón dice **Publicar** (activo), todavía es un borrador.
3. **¿Ya pasaron 5 minutos?** Espera y recarga la página del sitio (a veces hay que refrescar sin caché: `Cmd + Shift + R`).
4. **¿Hay una reconstrucción fallida?** En Vercel › tu proyecto › **Deployments**, mira el más reciente. Si dice **Error**, ve a la sección 5.
5. **¿Sanity avisó al sitio?** Entra a sanity.io/manage › tu proyecto › **API › Webhooks** › el webhook de Digital X › **Attempts log**. Cada publicación debe aparecer ahí con respuesta `201`.
6. **Si nada de eso explica el problema:** en Vercel › **Deployments**, abre el último de `main` y usa **Redeploy**. Eso reconstruye el sitio con lo que hay publicado ahora.

---

## 5. Si te llega un correo de «build fallido»

No se cae nada: **el sitio sigue mostrando la versión anterior**. Vercel nunca pone en línea una reconstrucción que falló.

1. Abre el enlace del correo (o Vercel › **Deployments** › el que dice **Error**).
2. Busca en el registro la línea que empieza con `✖`. Dice qué documento y qué campo no pasaron (por ejemplo, una dirección sin `https://`).
3. Corrige eso en el Studio y vuelve a **Publicar**: se reconstruye solo.
4. Si el mensaje dice que **Sanity no respondió** (o `402`), no es tu contenido: espera unos minutos y usa **Redeploy** (sección 4, punto 6).

---

## 6. Límites gratuitos, en palabras simples

- Vercel (gratis) permite **100 reconstrucciones al día** y unos **60 avisos por hora** del Studio. En el uso normal ni te acercas.
- Si vas a hacer una carga grande (muchas fotos, muchos servicios), publica **en tandas** y no todo en una hora.
- Si se pasa el límite, el último cambio puede quedarse sin reconstruir: usa **Redeploy** pasada la hora.

---

## 7. Si alguien consigue la dirección secreta del webhook

La dirección que conecta Sanity con Vercel (el *deploy hook*) es un secreto: solo vive dentro de Sanity y no se comparte ni se guarda en el proyecto. Si crees que se filtró:

1. En Vercel › tu proyecto › **Settings › Git › Deploy Hooks**, borra el hook.
2. Crea uno nuevo (rama `main`).
3. Pega la dirección nueva **solo** en el webhook de Sanity (sanity.io/manage › **API › Webhooks**).
