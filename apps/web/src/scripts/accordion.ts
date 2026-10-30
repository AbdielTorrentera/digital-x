/**
 * Acordeones de preguntas frecuentes. Uno abierto a la vez por grupo.
 * [data-accordion] envuelve [data-acc-item] > [data-acc-trigger] + [data-acc-panel].
 * Solo alterna .is-open: el panel se muestra u oculta por CSS (sin animar su altura, diseño §8).
 */
export function initAccordions() {
  document.querySelectorAll<HTMLElement>('[data-accordion]').forEach((group) => {
    const items = [...group.querySelectorAll<HTMLElement>('[data-acc-item]')];
    const set = (item: HTMLElement, open: boolean) => {
      item.classList.toggle('is-open', open);
      item.querySelector('button')?.setAttribute('aria-expanded', String(open));
    };
    items.forEach((item) => {
      const trigger = item.matches('[data-acc-trigger]') ? item : item.querySelector('[data-acc-trigger]');
      trigger?.addEventListener('click', () => {
        const willOpen = !item.classList.contains('is-open');
        items.forEach((i) => set(i, false));
        set(item, willOpen);
      });
    });
  });
}
