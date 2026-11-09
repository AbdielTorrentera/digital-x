import { reduced } from './motion';
import { lenis } from './smooth';

/** Segmented jump links: highlight the section currently under the sticky bar. */
export function initJumpLinks() {
  document.querySelectorAll<HTMLElement>('[data-jump]').forEach((bar) => {
    const links = [...bar.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
    const scroller = bar.closest<HTMLElement>('[data-jump-scroller]');
    const targets = links.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean) as HTMLElement[];
    const update = () => {
      const line = (scroller ? scroller.getBoundingClientRect().top : 0) + (Number(bar.dataset.jumpOffset) || 140);
      let current = 0;
      targets.forEach((t, k) => {
        if (t.getBoundingClientRect().top <= line) current = k;
      });
      links.forEach((a, k) => {
        a.classList.toggle('is-active', k === current);
        if (k === current) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    };
    links.forEach((a) =>
      a.addEventListener('click', (e) => {
        const t = document.getElementById(a.hash.slice(1));
        if (!t) return;
        e.preventDefault();
        // Diseño §8: con prefers-reduced-motion el salto es directo, sin desplazamiento suave. Con Lenis activo, el
        // salto es suyo: si el navegador desplazara por su cuenta, Lenis lo pisaría con su propia posición.
        const behavior = reduced ? 'auto' : 'smooth';
        const offset = Number(bar.dataset.jumpOffset) || 0;
        if (scroller) scroller.scrollTo({ top: t.offsetTop - offset, behavior });
        else {
          const top = t.getBoundingClientRect().top + window.scrollY - offset;
          if (lenis) lenis.scrollTo(top);
          else window.scrollTo({ top, behavior });
        }
      }),
    );
    (scroller ?? window).addEventListener('scroll', update, { passive: true });
    update();
  });
}
