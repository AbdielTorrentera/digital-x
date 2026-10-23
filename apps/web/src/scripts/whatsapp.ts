/** El botón de WhatsApp se reduce a ícono (en móvil) cuando la página deja de estar arriba. */
export function initWhatsApp() {
  const wa = document.querySelector<HTMLElement>('[data-wa]');
  if (!wa) return;
  const update = () => wa.classList.toggle('is-compact', window.scrollY > 80);
  update();
  addEventListener('scroll', update, { passive: true });
}
