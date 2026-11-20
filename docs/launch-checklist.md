# Alva · Checklist de lanzamiento y operación segura

Este documento es el gate operativo de la Fase 2. Nada se indexa y el
formulario no se publica hasta que los puntos marcados como **bloqueantes**
estén cerrados. No contiene secretos: los valores reales viven en Vercel
(Environment Variables) y en el gestor de secretos del equipo.

## Estado por defecto del repositorio

- `SITE_INDEXABLE=false`: todas las páginas emiten
  `noindex, nofollow`, `robots.txt` responde `Disallow: /` sin sitemap y cada
  respuesta lleva `X-Robots-Tag: noindex, nofollow`.
- El sitemap se genera vacío mientras el gate esté cerrado.
- Start a Conversation sigue fuera del sitemap y con `noindex` incluso cuando
  el gate se abra, hasta completar los bloqueantes del formulario.
- `CONTACT_EMAIL_MODE=console` en desarrollo; producción exige `resend`.
- Sin analítica de terceros, sin píxeles y sin cookies de marketing.

## 1. Bloqueantes de publicación del formulario

No publicar ni difundir el formulario hasta completar **todos** estos puntos:

- [ ] Privacy Notice publicada, revisada y aprobada (EN/ES), con base legal,
      finalidad, conservación, destinatarios (Resend), derechos y contacto.
- [ ] Cookie Policy publicada (EN/ES) y enlazada desde el footer y el
      formulario, describiendo `NEXT_LOCALE` (ver sección 6).
- [ ] Buzón real operativo (`CONTACT_TO_EMAIL`) y remitente verificado en
      Resend (`CONTACT_FROM_EMAIL`); probar recepción real y respuesta.
- [ ] `CONTACT_EMAIL_MODE=resend` y `RESEND_API_KEY` configurados solo en
      Vercel (nunca en el repositorio).
- [ ] Turnstile real configurado (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`,
      `TURNSTILE_SECRET_KEY`); las claves de prueba no se usan en producción.
- [ ] Prueba end-to-end del formulario en producción: éxito, error de
      validación, error de Turnstile, rate limit y fallo de entrega.
- [ ] Enlaces legales visibles antes del consentimiento del formulario.
- [ ] Solo entonces: quitar `noindex: true` de Start a Conversation y añadir
      `"/start-a-conversation"` a `indexableRoutes` en `src/app/sitemap.ts`.

## 2. Dominio, DNS y HTTPS

- [ ] Comprar `alvaexpansion.com` y decidir el dominio canónico
      (`www` vs. apex; redirigir el otro con 308).
- [ ] Añadir el dominio en Vercel (Project → Settings → Domains) y crear los
      registros DNS indicados.
- [ ] Verificar emisión y renovación automática del certificado TLS.
- [ ] Forzar HTTPS y comprobar que HTTP redirige a HTTPS.
- [ ] Configurar `NEXT_PUBLIC_SITE_URL=https://alvaexpansion.com` (sin slash
      final) **en el entorno Production** y reconstruir.
- [ ] Revisar que canonical, hreflang, Open Graph y sitemap usan el dominio
      final.
- [ ] HSTS (`Strict-Transport-Security`) solo se emite con
      `NODE_ENV=production`; verificar que aparece tras el despliegue HTTPS.
      No enviar el dominio a la lista de preload hasta validar todos los
      subdominios.

## 3. Variables de entorno en Vercel

Configurar por entorno (Production / Preview / Development). No compartir
valores entre Production y Preview.

| Variable | Production | Preview/staging | Notas |
| --- | --- | --- | --- |
| `SITE_INDEXABLE` | `true` solo al lanzar | `false` | Server-side, build-time. Rebuild obligatorio. |
| `NEXT_PUBLIC_SITE_URL` | `https://alvaexpansion.com` | URL exacta del preview | Se inlinea en build. Rebuild obligatorio. |
| `CONTACT_EMAIL_MODE` | `resend` | `console` | `console` en producción devuelve 503. |
| `RESEND_API_KEY` | secreto real | vacío | Nunca `NEXT_PUBLIC_*`. |
| `CONTACT_TO_EMAIL` | buzón real | buzón de pruebas | Sin PII en logs. |
| `CONTACT_FROM_EMAIL` | remitente verificado | remitente de pruebas | Formato `Alva <no-reply@dominio>`. |
| `TURNSTILE_SECRET_KEY` | secreto real | test/vacío | Server-side. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | site key real | test key | Público, inlineado en build. |
| `NEXT_PUBLIC_SHOW_EDGAR_PROFILE` | según aprobación | `false` | Público, inlineado en build. |

Recordatorio:

- `NEXT_PUBLIC_*` se inlinea en el bundle en **build**: cambiarla exige
  rebuild y redeploy.
- `SITE_INDEXABLE` también se evalúa en build porque metadata, `robots.txt` y
  sitemap son estáticos, y debe seguir disponible en runtime para rutas
  dinámicas (404) y headers. Cambiarla exige rebuild y redeploy.
- Los secretos se guardan en Vercel (o en el gestor del equipo), nunca en
  `.env.example`, README, capturas ni issues.

## 4. Legal

- [ ] Privacy Notice y Cookie Policy aprobadas por asesoría legal.
- [ ] Aviso de privacidad enlazado en el formulario y en el footer.
- [ ] Revisar la retención de logs (Vercel y proveedor de correo) y reflejarla
      en la Privacy Notice.
- [ ] Confirmar que no se añaden analíticas, píxeles o cookies no esenciales
      sin consentimiento previo y sin actualizar la Cookie Policy.
- [ ] Verificar que los logs del formulario no contienen nombres, emails,
      mensajes ni IPs en claro (ver sección 8).

## 5. QA técnico

- [ ] `npm ci`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `node scripts/audit-prod.mjs` (equivale a
      `npm audit --omit=dev --audit-level=high`; solo tolera las excepciones
      documentadas en el script).
- [ ] Comprobar que no hay `c2pa:manifest` en `public/`.
- [ ] Formulario completo con teclado, lector de pantalla y zoom 200 %.
- [ ] Sin overflow horizontal a 360, 390, 768, 1024 y 1440 px.
- [ ] Enlaces internos y externos sin 404; fuentes con `rel="noopener
      noreferrer"`.
- [ ] 404 correcta y no indexable.
- [ ] Revisión manual axe/Lighthouse (gate manual, ver sección 9).

## 6. Cookies

La única cookie propia prevista es `NEXT_LOCALE`.

| Atributo | Valor |
| --- | --- |
| Nombre | `NEXT_LOCALE` |
| Finalidad | Recordar el idioma elegido (`en`/`es`) |
| Contenido | Solo el código de idioma; sin datos personales |
| Ruta | `/` |
| Duración | 1 año (`maxAge`) |
| `SameSite` | `Lax` |
| `Secure` | Sí en producción (HTTPS); no en desarrollo local por HTTP |
| `HttpOnly` | No |

`HttpOnly` no se activa porque la API `localeCookie` de next-intl no lo
expone y el selector de idioma escribe la misma cookie desde el navegador.
No contiene información sensible ni se usa para seguimiento. Debe figurar en
la Cookie Policy antes del lanzamiento.

## 7. Protección de staging en Vercel

Mientras el dominio no exista y el gate siga cerrado, el despliegue debe
estar protegido además de `noindex` (defensa en profundidad):

1. Vercel → Project → **Settings → Deployment Protection**.
2. Activar **Vercel Authentication** para Preview (y Production mientras sea
   staging), o **Password Protection** si el plan lo permite.
3. Mantener **Production** protegido hasta el lanzamiento; después, proteger
   solo Preview de forma permanente.
4. Para pruebas automatizadas, crear un **Protection Bypass for Automation**
   y guardarlo como secreto de CI (`VERCEL_AUTOMATION_BYPASS_SECRET`). No
   commitearlo ni exponerlo en URLs públicas.
5. No confiar solo en `robots.txt`: un despliegue público sin protección
   puede ser enlazado o rastreado igualmente. El gate `noindex` es la segunda
   capa, no la única.
6. Revisar que los previews usan `SITE_INDEXABLE=false` y
   `NEXT_PUBLIC_SITE_URL` con la URL del preview (no el dominio final).

Nota: Vercel sirve todos los despliegues por HTTPS; HSTS se emite en builds de
producción (`NODE_ENV=production`). Si se quiere restringir HSTS únicamente al
dominio final, valorar condicionarlo a `VERCEL_ENV === "production"` en
`next.config.ts` antes de conectar el dominio.

## 8. Monitorización y logs

- El endpoint usa logs JSON estructurados (`src/lib/contact/log.ts`) con
  `requestId`, evento, estado HTTP, duración, código de error y **longitudes**
  de campos. Nunca nombres, emails, cuerpos de mensaje, tokens ni IPs.
- Revisar en Vercel → Logs los eventos `contact_request` y los códigos
  `DELIVERY_FAILED`, `SERVICE_UNAVAILABLE`, `TURNSTILE_FAILED` y
  `RATE_LIMITED`.
- Configurar alertas (Log Drain o integración del equipo) para:
  - 5xx sostenidos o `DELIVERY_FAILED`;
  - `SERVICE_UNAVAILABLE` por configuración;
  - picos de `RATE_LIMITED` o `TURNSTILE_FAILED`.
- No registrar el cuerpo de la petición ni la respuesta del proveedor de
  correo si incluye direcciones.
- No añadir Sentry, GA, Vercel Analytics, Speed Insights ni píxeles sin
  consentimiento y sin actualizar Privacy/Cookie Policy. Si se añade un
  proveedor, revisar su CSP y su retención.
- Documentar el runbook de fallo de correo: comprobar configuración, cuota y
  estado de Resend; responder manualmente si hay solicitudes afectadas.

## 9. Gate manual de accesibilidad y rendimiento

No se ejecuta en CI para evitar dependencias de Chrome y falsos negativos.
Es un gate manual obligatorio antes del lanzamiento:

```bash
npm run build
npm start
```

En otra terminal:

```bash
# Lighthouse (Chrome instalado)
npx --yes lighthouse http://localhost:3000/ \
  --chrome-flags="--headless" \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=html --output-path=./lighthouse-home.html
```

- Repetir en `/es`, `/how-we-work`, `/why-latin-america`, `/about` y
  `/start-a-conversation`.
- Objetivo: Accessibility ≥ 95 y SEO ≥ 95; sin errores de Best Practices.
- Axe: usar la extensión axe DevTools (WCAG 2.1 AA + best practices) en las
  mismas páginas. Objetivo: 0 violaciones críticas o serias.
- Revisar también el informe `Content-Security-Policy-Report-Only` en la
  consola del navegador: no debe haber violaciones inesperadas de Next.js,
  Turnstile o estilos inline.

## 10. SEO e indexación al lanzar

- [ ] Completar secciones 1–5 y aprobar el lanzamiento.
- [ ] Cambiar `SITE_INDEXABLE=true` en Vercel Production y reconstruir.
- [ ] Verificar `https://alvaexpansion.com/robots.txt`:
      `Allow: /` y `Sitemap: https://alvaexpansion.com/sitemap.xml`.
- [ ] Verificar que el HTML ya **no** contiene `noindex` y que no aparece
      `X-Robots-Tag`.
- [ ] Verificar que `/sitemap.xml` contiene las rutas indexables en EN/ES con
      hreflang y que Start a Conversation sigue fuera hasta cerrar la
      sección 1.
- [ ] Verificar canonical y hreflang en cada página.
- [ ] Verificar OG/Twitter con LinkedIn Post Inspector, Facebook Sharing
      Debugger u opengraph.xyz.
- [ ] Dar de alta el dominio en Google Search Console y Bing Webmaster Tools.
- [ ] Enviar el sitemap y solicitar indexación de las URLs principales.
- [ ] Retirar la protección de staging de Production (mantener Preview
      protegido).
- [ ] Repetir `curl -sI` y comprobar headers de seguridad (sección 11).

## 11. Headers esperados

Comprobar en producción:

```bash
curl -sI https://alvaexpansion.com/ | grep -Ei \
  'content-security-policy-report-only|strict-transport-security|referrer-policy|x-content-type-options|permissions-policy|x-frame-options|cross-origin-opener-policy'
```

Esperado:

- `Content-Security-Policy-Report-Only` con `default-src 'self'`,
  `script-src`/`frame-src`/`connect-src` para
  `https://challenges.cloudflare.com`, `object-src 'none'`,
  `base-uri 'self'`, `form-action 'self'` y `frame-ancestors 'none'`.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  (solo producción HTTPS).
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `X-Content-Type-Options: nosniff`.
- `Permissions-Policy` restrictiva (sin cámara, micrófono, geolocalización,
  pago, USB ni sensores; browsing-topics se retiró: Chrome ya no lo reconoce).
- `X-Frame-Options: DENY`.
- `Cross-Origin-Opener-Policy: same-origin`.
- En staging, además, `X-Robots-Tag: noindex, nofollow`.

Siguiente paso de CSP: revisar durante al menos una semana los informes
Report-Only en producción, corregir orígenes y después cambiar el header a
`Content-Security-Policy`. Para eliminar `'unsafe-inline'` hace falta adoptar
nonces/hashes (normalmente con middleware y renderizado dinámico); no hacerlo
sin probar que Next.js y el widget de Turnstile siguen funcionando.

## 12. Rollback

Si tras el lanzamiento hay un incidente de indexación, privacidad o
formulario:

1. Poner `SITE_INDEXABLE=false` en Production y redesplegar (rebuild).
2. Verificar `robots.txt` con `Disallow: /` y `X-Robots-Tag`.
3. Si es necesario, volver a proteger Production en Vercel.
4. Desactivar el formulario (`CONTACT_EMAIL_MODE=console` devuelve 503) hasta
   corregir el problema.
5. Documentar el incidente sin incluir PII ni secretos.
