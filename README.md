# AlvaExpansion

Sitio corporativo de Alva (Next.js 16 App Router, TypeScript strict,
next-intl y Tailwind CSS 4). Despliegue previsto en Vercel.

## Desarrollo local

```bash
cp .env.example .env.local
npm ci
npm run dev
```

`NEXT_PUBLIC_*` se inlinea en el bundle en build: tras cambiarla hay que
reconstruir. `SITE_INDEXABLE` se evalúa en build (metadata, robots y sitemap)
y debe estar disponible en runtime para rutas dinámicas y headers; cambiarla
exige rebuild y redeploy.

## Verificación

```bash
npm run lint
npm run typecheck
npm run test
npm run build
node scripts/audit-prod.mjs
```

CI ejecuta lo mismo en Node 20 y 22, rechaza `c2pa:manifest` en `public/` y
audita dependencias de producción con umbral high.

## Seguridad y lanzamiento

- Staging no indexable por defecto (`SITE_INDEXABLE=false`): `noindex,
  nofollow`, `robots.txt` con `Disallow: /`, sitemap vacío y `X-Robots-Tag`.
- Formulario bloqueado para publicación hasta publicar Privacy Notice y
  configurar correo real.
- Headers de seguridad en `next.config.ts` (CSP Report-Only, HSTS en
  producción, etc.).
- Checklist completo, protección de Vercel y runbook de monitorización:
  [docs/launch-checklist.md](docs/launch-checklist.md).
- Decisiones técnicas: [DECISIONS.md](DECISIONS.md).
