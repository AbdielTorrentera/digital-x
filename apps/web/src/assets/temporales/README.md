# Fotos temporales

Fotos gratuitas de Unsplash y Pexels que ocupan el lugar de las fotos reales de Digital X **mientras llegan**. No se publican: si el build corre con `VERCEL_ENV=production` y alguna página usa una imagen de esta carpeta, el build falla (ver `src/lib/proteccion-produccion.ts` y `astro.config.mjs`).

Todos los archivos empiezan con `temporal-`. Ese prefijo es lo que detecta la protección: no se quita ni se cambia.

## Cómo reemplazar una

1. Procesa la foto real **sin metadatos EXIF ni GPS** y guárdala en `src/assets/inicio/` con nombre según `docs/reglas-seo-digitalx.md` §6 (`{servicio}-{detalle}-{lugar}.webp`; el lugar solo si de verdad se tomó ahí).
2. En cada archivo que la importa (`src/content/inicio.ts`, `nosotros.ts`, `proyectos.ts` o `servicios-fotos.ts`), cambia el `import` de esa foto y su `alt`.
3. Borra el archivo temporal de esta carpeta y su fila de la tabla.

## Origen

Licencias: [Unsplash License](https://unsplash.com/license) y [Pexels License](https://www.pexels.com/license/). Ninguna exige atribución y permiten uso comercial; no se usó nada de Unsplash+. Cada archivo se recortó o redujo a un máximo de 2000 px de ancho y se volvió a guardar sin ningún metadato.

| Archivo                                         | Sección donde se usa                                                                  | Fuente                                                                                                                                     | Autor              | Licencia         |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | ---------------- |
| `temporal-salon-escenario-pantalla-bocinas.jpg` | Portada; Servicios (portada, recorridos 360 y cierre); Nosotros (cierre)              | <https://www.pexels.com/photo/event-hall-with-large-projection-screen-and-professional-sound-and-stage-light-equipment-17056964/>          | Matheus Bertelli   | Pexels License   |
| `temporal-bocinas-colgadas-techo.jpg`           | Inicio: Audio; Nosotros (fondo de proyectos)                                          | <https://unsplash.com/photos/large-speaker-arrays-hanging-from-ceiling-structure-QZUHZCoNFJw> (recorte 4:3)                                | Jonathan Phillips  | Unsplash License |
| `temporal-camara-tripode-transmision.jpg`       | Inicio: Video; Servicios (video para eventos); Nosotros (qué nos distingue)           | <https://unsplash.com/photos/black-dslr-camera-on-tripod-LYUXl1NNXHM> (recorte 4:3)                                                        | Jesus Loves Austin | Unsplash License |
| `temporal-laptop-escritorio-software.jpg`       | Inicio: Tecnología; Servicios (los 4 de tecnología); Nosotros (proyecto de sitio web) | <https://www.pexels.com/photo/modern-laptop-on-wooden-desk-with-code-displayed-34803994/>                                                  | Daniil Komov       | Pexels License   |
| `temporal-consola-mezcla-manos.jpg`             | Por qué Digital X; Servicios (streaming); Nosotros (manifiesto)                       | <https://www.pexels.com/photo/close-up-of-a-person-s-hands-on-audio-mixer-3042644/>                                                        | Caleb Oquendo      | Pexels License   |
| `temporal-rack-audio-evento.jpg`                | Servicios (renta de audio); Nosotros: portada                                         | <https://www.pexels.com/photo/professional-audio-equipment-setup-at-live-event-34594386/> (recorte 3:2; se le quitó el copyright del EXIF) | German Suarez      | Pexels License   |
| `temporal-conferencia-escenario-pantalla.jpg`   | Servicios (circuito cerrado); Nosotros: proyecto de conferencia                       | <https://www.pexels.com/photo/modern-conference-presentation-with-speaker-on-stage-29708258/> (recorte 4:3)                                | Matheus Bertelli   | Pexels License   |
| `temporal-drone-campo.jpg`                      | Servicios (video con drone); Nosotros: proyecto de drone                              | <https://www.pexels.com/photo/dji-mavic-air-2-drone-hovering-over-a-field-17744258/> (recorte 4:3)                                         | Lukáš Vaňátko      | Pexels License   |
