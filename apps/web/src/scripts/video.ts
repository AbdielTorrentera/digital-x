import { reduced } from './motion';

/**
 * Los videos de fondo con data-src muestran primero su póster y arrancan al terminar de cargar la página,
 * para que no compitan con el primer pintado. Con movimiento reducido se queda el póster (diseño §8).
 */
export function initDeferredVideos(root: ParentNode = document) {
  if (reduced) return;
  const videos = [...root.querySelectorAll<HTMLVideoElement>('video[data-src]')];
  if (!videos.length) return;
  const start = () => {
    for (const v of videos) {
      v.src = v.dataset.src!;
      v.muted = true;
      v.autoplay = true;
      v.play().catch(() => {});
    }
  };
  if (document.readyState === 'complete') start();
  else addEventListener('load', start, { once: true });
}
