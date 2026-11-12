import { reduced } from './motion';
import { lenis } from './smooth';

/**
 * Enlaces internos con ancla (`#servicios`, `/#servicios`) a un elemento de la MISMA página: el salto es un desplazamiento
 * suave (Lenis; sin él, el suave nativo) que descuenta la barra fija, para que el título no quede debajo de ella. Con
 * prefers-reduced-motion el salto es directo (diseño §8). Los enlaces que ya atiende otro script (el menú interno de los
 * servicios, que llama a preventDefault) y el de saltar al contenido se dejan en paz. Entre páginas distintas el navegador
 * navega y respeta el `scroll-margin-top` del destino.
 */
export function initAnclas() {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const enlace = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
    if (!enlace || enlace.classList.contains('skip-link') || (enlace.target && enlace.target !== '_self')) return;
    const url = new URL(enlace.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    const destino = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!destino) return;

    e.preventDefault();
    // El descuento es el `scroll-margin-top` del destino (CSS) y, si no lo tiene, el alto de la barra.
    const margen = parseFloat(getComputedStyle(destino).scrollMarginTop) || 0;
    const barra = document.querySelector('.nav')?.getBoundingClientRect().height ?? 0;
    const top = Math.max(0, destino.getBoundingClientRect().top + window.scrollY - (margen || barra));
    if (reduced) window.scrollTo({ top, behavior: 'auto' });
    else if (lenis) lenis.scrollTo(top);
    else window.scrollTo({ top, behavior: 'smooth' });

    // Como el salto nativo: la dirección lleva el ancla y el foco pasa al destino (sin volver a desplazar).
    history.pushState(null, '', url.hash);
    if (!destino.hasAttribute('tabindex')) destino.setAttribute('tabindex', '-1');
    destino.focus({ preventScroll: true });
  });
}
