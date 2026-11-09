import { lockScroll } from './smooth';

/**
 * Galería de fotos de un servicio: un <dialog> modal. El navegador se encarga del foco (queda dentro del cuadro, Escape
 * lo cierra y el foco regresa al botón que lo abrió). Aquí solo se abre, se cierra con su botón o al pulsar fuera, y se
 * bloquea el scroll de la página mientras está abierto.
 */
export function initGaleria() {
  const galeria = document.querySelector<HTMLDialogElement>('dialog[data-galeria]');
  if (!galeria) return;
  document.querySelectorAll('[data-galeria-abrir]').forEach((boton) =>
    boton.addEventListener('click', () => {
      galeria.showModal();
      lockScroll(true);
    }),
  );
  galeria.querySelector('[data-galeria-cerrar]')?.addEventListener('click', () => galeria.close());
  // Un clic en el fondo (el propio <dialog>, no su contenido) cierra la galería.
  galeria.addEventListener('click', (e) => {
    if (e.target === galeria) galeria.close();
  });
  // "close" también se dispara con Escape.
  galeria.addEventListener('close', () => lockScroll(false));
}
