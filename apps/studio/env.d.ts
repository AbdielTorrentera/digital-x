// Variables públicas del Studio (prefijo SANITY_STUDIO_). Vite las sustituye al compilar y en desarrollo.
interface ImportMetaEnv {
  readonly SANITY_STUDIO_ESPACIOS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
