import { lockScroll } from './smooth';

const enfocables = 'a[href], button:not([disabled])';

/**
 * Panel del menú (el de la plantilla Marby). Se agrega lo que exigen las reglas: solo el botón abre el menú (no toda
 * la barra), el foco queda atrapado en el panel, Escape lo cierra y el foco vuelve al botón de abrir.
 */
export function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!nav || !menu) return;
  const abrirBtn = nav.querySelector<HTMLButtonElement>('[data-menu-open]')!;

  const abrir = () => {
    menu.hidden = false;
    lockScroll(true);
    abrirBtn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
    menu.querySelector<HTMLElement>('[data-menu-close]')?.focus();
  };
  const cerrar = () => {
    menu.classList.remove('is-open');
    menu.hidden = true;
    lockScroll(false);
    abrirBtn.setAttribute('aria-expanded', 'false');
    abrirBtn.focus();
  };

  abrirBtn.addEventListener('click', abrir);
  menu.querySelector('[data-menu-close]')?.addEventListener('click', cerrar);
  menu.addEventListener('click', (e) => {
    const t = e.target as Element;
    if (t === menu || t.closest('a')) cerrar();
  });
  document.addEventListener('keydown', (e) => {
    if (menu.hidden) return;
    if (e.key === 'Escape') {
      cerrar();
      return;
    }
    if (e.key === 'Tab') {
      const lista = [...menu.querySelectorAll<HTMLElement>(enfocables)].filter((el) => el.getClientRects().length > 0);
      if (!lista.length) return;
      const primero = lista[0];
      const ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }
  });
}
