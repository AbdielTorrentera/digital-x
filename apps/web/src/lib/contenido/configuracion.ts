// Los datos del negocio capturados en «Configuración del sitio» del Studio. `lib/negocio.ts` los usa para armar teléfono,
// WhatsApp, redes, zonas y mensaje general; nada más los lee directamente.
import { documentoObligatorio } from './instantanea.ts';
import type { ConfiguracionDoc } from './tipos.ts';

export const configuracion = documentoObligatorio<ConfiguracionDoc>('configuracion');
