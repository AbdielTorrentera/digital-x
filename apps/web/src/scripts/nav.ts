import { lockScroll } from './smooth';

// Móvil = todo lo que no llega al corte de escritorio (1024 px), igual que los estilos de Nav.astro.
const escritorio = window.matchMedia('(min-width: 1024px)');
const esMovil = () => !escritorio.matches;
const enfocables = 'a[href], button:not([disabled])';

/**
 * Menú principal. Móvil: panel a pantalla completa (foco atrapado, Escape cierra, scroll bloqueado).
 * Escritorio: "Servicios" abre un desplegable (clic o teclado; clic fuera o Escape lo cierran).
 */
export function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const menu = nav?.querySelector<HTMLElement>('[data-menu]');
  const abrir = nav?.querySelector<HTMLButtonElement>('[data-menu-open]');
  if (!nav || !menu || !abrir) return;

  const subs = [...menu.querySelectorAll<HTMLButtonElement>('[data-sub-toggle]')];
  const setSub = (btn: HTMLButtonElement, abierto: boolean) => {
    btn.setAttribute('aria-expanded', String(abierto));
    document.getElementById(btn.getAttribute('aria-controls')!)?.classList.toggle('is-open', abierto);
  };
  const cerrarSubs = () => subs.forEach((b) => setSub(b, false));
  subs.forEach((b) =>
    b.addEventListener('click', () => {
      const abierto = b.getAttribute('aria-expanded') === 'true';
      cerrarSubs();
      setSub(b, !abierto);
    }),
  );

  const estaAbierto = () => menu.classList.contains('is-open');
  const abrirMenu = () => {
    menu.classList.add('is-open');
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-label', 'Menú principal');
    abrir.setAttribute('aria-expanded', 'true');
    lockScroll(true);
    menu.querySelector<HTMLElement>(enfocables)?.focus();
  };
  const cerrarMenu = (devolverFoco = true) => {
    if (!estaAbierto()) return;
    menu.classList.remove('is-open');
    menu.removeAttribute('role');
    menu.removeAttribute('aria-modal');
    menu.removeAttribute('aria-label');
    abrir.setAttribute('aria-expanded', 'false');
    lockScroll(false);
    cerrarSubs();
    if (devolverFoco) abrir.focus();
  };

  abrir.addEventListener('click', abrirMenu);
  menu.querySelector('[data-menu-close]')?.addEventListener('click', () => cerrarMenu());
  menu.addEventListener('click', (e) => {
    if (esMovil() && (e.target as Element).closest('a')) cerrarMenu(false);
  });

  document.addEventListener('click', (e) => {
    if (!esMovil() && !(e.target as Element).closest('.has-sub')) cerrarSubs();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (estaAbierto()) cerrarMenu();
      else {
        const abierto = subs.find((b) => b.getAttribute('aria-expanded') === 'true');
        if (abierto) {
          cerrarSubs();
          abierto.focus();
        }
      }
      return;
    }
    if (e.key === 'Tab' && estaAbierto() && esMovil()) {
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

  // Al pasar a escritorio con el panel abierto, se cierra y se libera el scroll.
  escritorio.addEventListener('change', (e) => {
    if (e.matches) cerrarMenu(false);
    cerrarSubs();
  });
}
