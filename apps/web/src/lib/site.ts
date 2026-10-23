import { getEntry } from 'astro:content';

/** Read one block of copy from src/content/site.json by its id. */
export async function site<T = any>(id: string): Promise<T> {
  const entry = await getEntry('site', id);
  if (!entry) throw new Error(`site.json has no entry with id "${id}"`);
  return entry.data as T;
}

/** "28 abr 2026", fecha corta en español de México. */
export const formatDate = (d: Date) =>
  d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
