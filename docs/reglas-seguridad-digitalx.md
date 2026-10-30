# Digital X — Reglas de seguridad (digitalx.mx)

Reglas de seguridad para el sitio, el Studio, las cuentas y los dominios. **Este archivo tiene la prioridad más alta:** si choca con cualquier otro, manda este.
Complementos: `estructura-sitio-digitalx.md`, `reglas-seo-digitalx.md`, `identidad-marca-digitalx.md`, `reglas-diseno-digitalx.md`.
Versión: borrador de trabajo · 2026-10-30

---

## 0. Instrucciones para el agente (leer primero)

1. La seguridad se diseña desde el inicio de cada tarea, no al final. Si una tarea toca datos, dependencias, encabezados, formularios, Sanity o configuración de despliegue, el plan debe decir **qué riesgo hay y cómo se cubre**.
2. **Nunca** muestres, copies, imprimas en la terminal ni subas a Git un secreto (tokens, URLs de *deploy hooks*, contraseñas, llaves de API). Si encuentras uno en el código, detente y avisa.
3. **No agregues dependencias** sin justificarlo en el plan y sin aprobación (ver §6).
4. **No desactives** controles para que algo funcione: nada de `--no-verify`, `--force`, `unsafe-eval`, quitar validaciones, ampliar CORS a `*` ni relajar encabezados. Si un control estorba, detente y pregunta.
5. Si algo de este archivo no se puede cumplir, o dos reglas chocan, **detente y pregunta**.
6. Nada de comandos que descarguen y ejecuten código remoto (`curl … | sh` o similares).

---

## 1. Modelo del sistema y superficie de ataque

| Pieza | Qué es | Riesgo principal |
| --- | --- | --- |
| `digitalx.mx` | Sitio **estático** (Astro) en Vercel. Sin base de datos propia, sin usuarios, sin sesiones | Contenido inyectado (XSS), dependencias comprometidas, encabezados débiles |
| `admin.digitalx.mx` | Sanity Studio. El acceso lo controla Sanity con cuentas invitadas | Cuentas robadas, permisos de más |
| Sanity (dataset `production`, **público**) | Todo el contenido publicado se puede leer por la API sin contraseña | Publicar información privada por error |
| Mux | Hosting de videos | Tokens expuestos |
| Webhook Sanity → Vercel | Dispara la reconstrucción del sitio | URL del *deploy hook* filtrada (cualquiera podría forzar builds) |
| Formulario (si se publica) | Envía a un servicio externo de formularios | Spam, abuso, datos personales |
| GitHub, Vercel, Sanity, Mux, GoDaddy, Akky, Google | Cuentas de servicio | Robo de cuenta = control del sitio o del dominio |

Como el sitio es estático, varias reglas generales (inyección SQL, contraseñas, sesiones, CSRF) **no aplican hoy**. La sección 9 dice cuándo aplicarían.

---

## 2. Principios

- **No confiar en ningún dato externo:** contenido de Sanity, parámetros de URL, respuestas de APIs y archivos subidos se tratan como no confiables al mostrarlos.
- **Mínimo privilegio:** cada persona, token y servicio tiene solo los permisos que necesita.
- **Denegar por defecto:** orígenes, encabezados, métodos y permisos se habilitan uno por uno; lo no listado queda bloqueado.
- **Fallar de forma segura:** un error nunca muestra trazas, rutas internas, nombres de variables ni tokens. Si falla la carga de contenido, el build falla; no se publica una página a medias.

---

## 3. Secretos y variables de entorno

1. Los secretos viven **solo** en las variables de entorno de Vercel y en `.env` local. `.env` nunca se sube a Git (ya está en `.gitignore`); `.env.example` lleva solo nombres, sin valores.
2. **Prefijo `PUBLIC_`:** en Astro, toda variable que empieza con `PUBLIC_` termina en el código que descarga el navegador. Solo pueden llevarlo valores públicos (ID de proyecto de Sanity, nombre del dataset). **Prohibido** `PUBLIC_` en tokens.
3. **El sitio no usa tokens de Sanity.** El dataset es público y el sitio solo lee contenido publicado. Si en el futuro hace falta un token (por ejemplo, vista previa de borradores), será de **solo lectura**, solo en el servidor y aprobado antes.
4. Ningún token de **escritura** de Sanity existe fuera de la cuenta del dueño. Si se necesita para una migración, se crea, se usa y se borra el mismo día.
5. La URL del *deploy hook* de Vercel es un secreto: solo vive en la configuración del webhook de Sanity. Si se filtra, se regenera.
6. Si un secreto se sube por error a Git: se **revoca y se regenera de inmediato**. Borrarlo del historial no basta.
7. En GitHub se activan *secret scanning* y *push protection*.

---

## 4. Contenido de Sanity

1. **El dataset es público:** en Sanity solo va lo que puede ver cualquier persona. **Prohibido** guardar ahí datos de clientes, teléfonos o correos personales, precios internos, contratos, notas privadas o direcciones.
2. Los borradores y documentos con punto en su ID (por ejemplo `secrets.mux`) no se leen sin autenticación. Después de configurar Mux, se comprueba con una consulta **sin token** que su documento de secretos no sea legible.
3. **Mostrar contenido sin ejecutarlo:**
   - El texto enriquecido (Portable Text) se muestra con su componente de serialización, nunca convirtiéndolo a HTML crudo.
   - **Prohibido** `set:html` (o equivalentes) con contenido que venga de Sanity o de cualquier fuente externa.
   - Los enlaces que vienen del contenido solo aceptan `https:`, `mailto:`, `tel:` y rutas internas. Cualquier otro protocolo (`javascript:`, `data:`) se descarta. Se valida en el esquema de Sanity **y** al mostrarlo.
   - Los enlaces externos llevan `rel="noopener noreferrer"`.
4. Los esquemas de Sanity validan campos obligatorios, longitudes máximas y formatos (URL, slug), para que un error de captura no rompa una página.
5. Imágenes: antes de subirlas se les quitan los **metadatos de ubicación (GPS/EXIF)**. En Sanity no se activan los metadatos `exif` ni `location`. Lo mismo para videos.

---

## 5. Encabezados HTTP y navegador

Se configuran en `vercel.json` de **cada** proyecto (sitio y Studio).

| Encabezado | Valor |
| --- | --- |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` (sin `preload` por ahora) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `DENY` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` |
| `Content-Security-Policy` | Ver abajo |

**Content-Security-Policy del sitio** (punto de partida; se ajusta solo con los orígenes que realmente se usen):

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://cdn.sanity.io https://image.mux.com;
media-src 'self' blob: https://stream.mux.com;
font-src 'self';
connect-src 'self';
form-action 'self';
frame-ancestors 'none';
base-uri 'self';
object-src 'none';
upgrade-insecure-requests
```

- Se activa primero como `Content-Security-Policy-Report-Only`, se revisa la consola en todas las páginas y después se aplica.
- Si hay scripts en línea, se permiten con *hash*, nunca con `'unsafe-inline'` en `script-src`. **Prohibido** `'unsafe-eval'`.
- Cada servicio nuevo (formulario, analítica, reproductor) agrega **solo** su origen exacto a la directiva que necesita.
- **Studio:** usa la política que Sanity documente para el Studio, con `frame-ancestors 'none'`, y siempre `noindex` (ver SEO §9).
- **CORS en Sanity:** solo `https://digitalx.mx`, `https://admin.digitalx.mx` y `http://localhost:3333` / `http://localhost:4321`. Solo el Studio y localhost llevan "Allow credentials". Prohibido `*`.
- **Métodos:** el sitio es estático (solo `GET` y `HEAD`). Si se agrega una función de servidor, acepta únicamente los métodos que usa y responde 405 al resto.
- **Mapas de código (*source maps*)** desactivados en producción.

---

## 6. Dependencias y cadena de suministro

1. **Menos es mejor.** Antes de agregar un paquete, el plan explica para qué, por qué no basta con código propio o con lo que ya está instalado, y quién lo mantiene.
2. Antes de instalar, se verifica que el nombre sea el correcto (cuidado con imitaciones con letras cambiadas), que tenga mantenimiento reciente y repositorio público.
3. `pnpm-lock.yaml` siempre en Git. En Vercel y CI se instala con `pnpm install --frozen-lockfile`.
4. **Scripts de instalación:** pnpm bloquea por defecto los scripts de instalación de las dependencias (`strictDepBuilds`). Solo se permiten para paquetes aprobados (`allowBuilds`).
5. **Edad mínima de versiones:** configurar en pnpm que no se instalen versiones publicadas hace menos de unos días (`minimumReleaseAge`), para evitar paquetes recién comprometidos. `[PENDIENTE: confirmar valor, sugerido 3 días]`.
6. `pnpm audit` antes de cada lanzamiento; vulnerabilidades altas o críticas se corrigen antes de publicar.
7. Actualizaciones automáticas con Dependabot, revisadas una por una (nada se fusiona solo). Dependabot mensual, máximo 2 PR abiertos; las versiones mayores no se fusionan sin revisarlas (si no hay soporte, se ignoran con el comando de Dependabot).
8. Se elimina código, componentes y dependencias que ya no se usen (por ejemplo, restos de la plantilla Marby que no lleguen a utilizarse).

---

## 7. Cuentas, accesos y dominios

1. **Verificación en dos pasos (2FA)** obligatoria en GitHub, Vercel, Sanity, Mux, GoDaddy, Akky, Google (Search Console, Perfil de Negocio) y el correo. De preferencia con app o llave de seguridad, no SMS.
2. **Sanity:** el dueño es *Administrator*; quien solo edita contenido es *Editor*. Cuando alguien deja de colaborar, se le quita el acceso ese día.
3. **GitHub:** repositorio público (permite proteger ramas y Actions sin costo). Por eso nunca se suben secretos, datos personales de clientes ni información privada del negocio, ni siquiera en `docs/`. Rama `main` protegida: sin *force push*, solo con pull request y con las verificaciones en verde.
4. **Vercel:** las versiones de prueba (*preview*) con protección de acceso activada, además del `noindex`.
5. **Dominios:** `digitalx.mx` y `digitalequis.com` con bloqueo de transferencia activado, renovación automática y datos de contacto vigentes en el registrador.
6. **Correo y suplantación:** cuando se configure el correo de `digitalx.mx`, publicar SPF, DKIM y DMARC. Para `digitalequis.com`, que no envía correo, publicar `v=spf1 -all` y DMARC `p=reject` para que nadie pueda enviar correos haciéndose pasar por el dominio.
7. Las contraseñas de todas estas cuentas son únicas y viven en un gestor de contraseñas.

---

## 8. Formulario y datos personales (si se publica el formulario)

- Solo los campos necesarios para cotizar. **Prohibido** pedir datos sensibles (identificaciones, datos bancarios, salud).
- Protección contra spam: campo trampa (*honeypot*) y Cloudflare Turnstile u otro captcha del proveedor. Límite de envíos por parte del proveedor.
- Validación de tipo y longitud en el navegador **y** en el servicio que recibe (el navegador se puede manipular).
- Mensajes de error genéricos: nunca muestran detalles técnicos.
- El sitio no guarda los datos: los recibe el proveedor y se reenvían al correo del negocio. El proveedor y su ubicación se mencionan en el aviso de privacidad.
- **Aviso de privacidad** conforme a la LFPDPPP (responsable, finalidades, derechos ARCO, transferencias) antes de publicar el formulario o la analítica. `[PENDIENTE: revisión del aviso de privacidad por alguien con conocimiento legal]`.

---

## 9. Reglas que hoy no aplican y cuándo aplicarían

| Regla general | Hoy | Aplica cuando… | Qué se exige entonces |
| --- | --- | --- | --- |
| Consultas parametrizadas (inyección SQL/NoSQL) | Sin base de datos propia | Haya funciones de servidor que consulten datos | Parámetros siempre; en GROQ, `$parametros`, nunca concatenar texto |
| Contraseñas con `bcrypt`/`Argon2` | Sin usuarios propios | Haya registro de clientes | Usar un proveedor de autenticación; no programar el login desde cero |
| Sesiones y cookies `HttpOnly`, `Secure`, `SameSite` | Sin sesiones | Haya login o carrito | Esos tres atributos obligatorios; sesiones con expiración |
| Tokens CSRF | Sin formularios propios que cambien datos | Haya endpoints propios que reciban `POST` | Token CSRF o verificación de origen, más `SameSite` |
| Control de acceso por petición | Sin recursos privados | Haya áreas privadas o API propia | Verificar permisos en el servidor en cada petición |
| Cifrado en reposo | Sin datos propios guardados | Se guarden datos de clientes | Cifrado del proveedor y acceso mínimo |
| Pagos | Sin pagos | Se publique la tienda en línea | Pasarela certificada (PCI DSS); el sitio nunca toca datos de tarjeta |

Cualquier cambio que pase una fila de "Hoy" a "Aplica" requiere un plan de seguridad aprobado antes de programarlo.

---

## 10. Errores, registros y monitoreo

- Página 404 propia, sin detalles técnicos (ya existe).
- Los registros (*logs*) no contienen datos personales ni secretos.
- Alertas de Vercel por builds fallidos activadas, para enterarse si el webhook o el contenido rompen el sitio.
- La plataforma de Vercel incluye mitigación de ataques de denegación de servicio y firewall; no se desactivan.

---

## 11. Pendientes

- [ ] Valor de `minimumReleaseAge` en pnpm.
- [ ] Proveedor del formulario y su configuración antispam (si se publica).
- [ ] Aviso de privacidad revisado.
- [ ] Registros SPF, DKIM y DMARC de ambos dominios.
- [ ] Activar 2FA en todas las cuentas de §7 y confirmarlo.

---

## 12. Criterios de aceptación (antes de lanzar)

- [ ] Ningún secreto en Git ni en el código que descarga el navegador (búsqueda de tokens en `dist/` vacía).
- [ ] Encabezados de §5 presentes en el sitio y en el Studio (verificado con una herramienta de análisis de encabezados).
- [ ] CSP aplicada (no solo en modo *Report-Only*) y sin errores en consola en ninguna página.
- [ ] CORS de Sanity limitado a los orígenes de §5.
- [ ] Ningún `set:html` con contenido externo; enlaces del contenido con protocolos permitidos.
- [ ] Documento de secretos de Mux no legible sin autenticación.
- [ ] `pnpm audit` sin vulnerabilidades altas ni críticas.
- [ ] 2FA activa en todas las cuentas y bloqueo de transferencia en ambos dominios.
- [ ] Studio y versiones de prueba con `noindex` y protección de acceso.

---

## Referencias

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- MDN, seguridad de sitios web: https://developer.mozilla.org/es/docs/Learn_web_development/Extensions/Server-side/First_steps/Website_security
- Fortinet, seguridad de aplicaciones web: https://www.fortinet.com/lat/resources/cyberglossary/web-application-security
