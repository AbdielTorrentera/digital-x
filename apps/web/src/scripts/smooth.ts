import type LenisType from 'lenis';
import { reduced } from './motion';

/** Desplazamiento suave (Lenis). Solo con puntero fino y sin reducción de movimiento (diseño §8). */
export let lenis: LenisType | null = null;

// En pantallas táctiles el desplazamiento es el nativo del sistema: ahí Lenis ni siquiera se descarga.
const punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)');

export async function initSmooth() {
  if (reduced || !punteroFino.matches) return;
  const { default: Lenis } = await import('lenis');
  lenis = new Lenis({ lerp: 0.1, autoRaf: true, anchors: { offset: 0 } });
}

export const lockScroll = (on: boolean) => {
  if (lenis) on ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = on ? 'hidden' : '';
};
