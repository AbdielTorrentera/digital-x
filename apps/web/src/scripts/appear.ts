import { reduced } from './motion';

/**
 * [data-appear]            fundido y subida (--esp-4) al entrar en pantalla, una sola vez
 * [data-appear="mount"]    igual, al cargar la página
 */
export function initAppear(root: ParentNode = document) {
  const els = [...root.querySelectorAll<HTMLElement>('[data-appear]:not(.is-in)')];
  if (reduced) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const mount = els.filter((el) => el.dataset.appear === 'mount');
  requestAnimationFrame(() => requestAnimationFrame(() => mount.forEach((el) => el.classList.add('is-in'))));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries)
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
    },
    { threshold: 0 },
  );
  els.filter((el) => el.dataset.appear !== 'mount').forEach((el) => io.observe(el));
}
