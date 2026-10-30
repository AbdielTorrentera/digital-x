import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file } from 'astro/loaders';

// Los proyectos y artículos vendrán de Sanity (ver CLAUDE.md), no de Markdown.
// Las colecciones de propiedades y blog de Marby se quitaron.

// Texto de referencia de la plantilla Marby; los componentes de sections/ y ui/ lo leen y hoy no se usan.
const site = defineCollection({
  loader: file('./src/content/site.json'),
  schema: z.any(),
});

export const collections = { site };
