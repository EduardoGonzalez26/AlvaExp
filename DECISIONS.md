# Alva · Decisiones de la Fase 1

Este documento registra las decisiones de implementación de la fundación del sitio y de las páginas Home y How We Work. No modifica el brief ni sus reglas editoriales.

## Alcance entregado

- Fundación Next.js 16 (App Router) + TypeScript strict + Tailwind CSS 4 + next-intl.
- Home y How We Work completas en inglés y español.
- Placeholders mínimos y `noindex` para Why Latin America, About Alva, Start a Conversation, Privacy Notice y Cookie Policy.
- Header, footer, navegación móvil, selector de idioma, sitemap, robots, metadata y placeholders de marca.
- Sin formulario, sin API de correo, sin Turnstile real, sin analytics y sin páginas legales definitivas.

## Copy y fuentes

- Todo el copy de Home y How We Work vive en `src/content/en.ts` y `src/content/es.ts` y se renderiza sin paráfrasis. La comprobación automatizada de esta fase encontró 45/45 cadenas en cada Home y 38/38 en cada How We Work.
- Los identificadores `[D1]`, `[D2]`, `[D3]` y `[D11]` no se muestran. En Home se sustituyen por superíndices `1` y `2` enlazados a las URLs de la sección 9 del brief, con `target="_blank"` y `rel="noopener noreferrer"`.
- La nota de fuente visible se publica tal como está en el brief. Los superíndices llevan etiquetas accesibles localizadas que nombran la fuente y avisan que abren una pestaña nueva.
- `Primary CTA: Talk to Alva → Start a Conversation` se interpreta como etiqueta de botón `Talk to Alva` y destino `/start-a-conversation`. La flecha es un indicador visual; el nombre del destino no forma parte de la etiqueta. La misma lógica aplica a los enlaces `Link: ... → ...`.
- No se aplica `text-transform: uppercase` a copy del brief, para que el texto visible conserve su grafía exacta. Las mayúsculas solo se usan en etiquetas de interfaz que no provienen del brief.
- Los textos de interfaz no editoriales (menú, idioma, navegación del footer, aviso temporal de placeholder, 404 y etiquetas accesibles) están en `messages/en.json` y `messages/es.json`.
- Los placeholders muestran un aviso temporal `This page is coming soon.` / `Esta página estará disponible pronto.` y un enlace de regreso. Es microcopy de interfaz, no copy de marca, y desaparecerá en Fase 2.

## Rutas e idioma

| Ruta interna | EN | ES |
| --- | --- | --- |
| Home | `/` | `/es` |
| How We Work | `/how-we-work` | `/es/como-trabajamos` |
| Why Latin America | `/why-latin-america` | `/es/por-que-america-latina` |
| About Alva | `/about` | `/es/nosotros` |
| Start a Conversation | `/start-a-conversation` | `/es/conversemos` |
| Privacy Notice | `/privacy-notice` | `/es/aviso-de-privacidad` |
| Cookie Policy | `/cookie-policy` | `/es/politicas-de-cookies` |

- `localePrefix: 'as-needed'`: EN sin prefijo, ES con `/es`.
- `x-default` apunta siempre a la versión EN.
- El middleware de next-intl detecta `Accept-Language` y la cookie `NEXT_LOCALE`; el selector usa `<Link locale>` para conservar la página equivalente y actualizar la preferencia. Se verificó el cambio ES → EN en How We Work, que conserva la página y navega a `/how-we-work`.
- Los slugs en español se localizaron por SEO y claridad. El brief no especifica slugs; esta es una decisión de implementación, no copy.

## Diseño y marca

- Paleta exclusiva: azul `#0A3161`, verde `#006847`, piedra `#CFCAC1`, papel `#F4F2EE`. No se usan otros colores ni degradados, glassmorphism, 3D, ilustraciones o fotografía de stock.
- Inter se carga con `next/font` y es la única familia tipográfica de la interfaz.
- Jerarquía editorial: titulares ligeros de gran escala, cuerpos de 17 px con medida limitada, hairlines de 1 px, índices numéricos decorativos y tarjetas sobrias sin sombras.
- Contraste comprobado: azul sobre papel 11.56:1, verde sobre papel 6.12:1, azul sobre piedra 7.92:1, papel sobre azul 11.56:1. El verde no se usa como texto sobre piedra ni sobre azul.
- Tema claro únicamente. `color-scheme: light`.
- El logo es un wordmark tipográfico `Alva` mientras no exista un archivo aprobado. `BrandLogo` detecta `public/brand/logo.svg`; al añadirlo y reconstruir, lo usa automáticamente. No se inventó un símbolo de marca.
- `public/brand/favicon.svg` y `public/brand/og-image.png` son placeholders tipográficos reemplazables. La fuente editable de la OG está en `public/brand/og-image.svg`.

## Feature flags y perfiles

- `NEXT_PUBLIC_SHOW_EDGAR_PROFILE === 'true'` muestra las dos tarjetas de equipo. Cualquier otro valor muestra solo la tarjeta de Emilio, centrada.
- No hay enlaces, botones ni iconos hacia el perfil personal de Emilio. Edgar tampoco tiene enlace hasta recibir aprobación.
- El flag se evaluó en build (variable pública) y se probó en ambos estados y en ambos idiomas. `.env.example` documenta el valor; `.env.local` local lo deja en `false`.

## SEO

- `NEXT_PUBLIC_SITE_URL` alimenta metadata, canonical, hreflang, OG y sitemap. Fallback: `https://alvaexpansion.com`.
- Títulos y descripciones de Home y How We Work se toman literalmente de la sección 8 del brief en ambos idiomas.
- Canonical por página y alternates `en`, `es`, `x-default` (`x-default` = EN).
- Sitemap con Home y How We Work en ambos idiomas, con `xhtml:link` alternates. Los placeholders noindex se excluyen del sitemap.
- Robots permite el sitio y declara el sitemap.
- Placeholders de las páginas pendientes: `index: false, follow: false`.
- OG image placeholder tipográfica 1200 × 630. Favicon SVG placeholder.

## Accesibilidad

- Skip link visible al recibir foco, landmarks `header`, `nav`, `main`, `footer` y un solo `h1` por página.
- Foco visible con outline de 3 px; en fondos azules el outline cambia a papel.
- Navegación completa por teclado. El menú móvil usa `aria-expanded`, `aria-controls`, cierre con Escape y devolución del foco al botón.
- FAQ con `<details>`/`<summary>` nativos, sin JavaScript, con icono decorativo y foco visible.
- Selector de idioma con enlaces `hreflang` y `lang`, estado actual anunciado con `aria-current`.
- Enlaces de fuentes con área de objetivo de 24 × 24 px y etiquetas accesibles.
- `prefers-reduced-motion` desactiva transiciones y scroll suave.
- Revisión axe (WCAG 2.0/2.1 AA, 2.2 AA y best practices) sin violaciones en Home y How We Work, EN y ES, a 1440 px.
- Sin scroll horizontal a 360, 390, 768, 1024 y 1440 px.

## Administración de contenido y activos

- El copy no se edita desde un CMS en esta fase. Para cambios editoriales, editar los archivos de `src/content` y reconstruir.
- Para el logo definitivo: añadir `public/brand/logo.svg` y reconstruir.
- Para la OG definitiva: reemplazar `public/brand/og-image.png` (1200 × 630). Para el favicon: reemplazar `public/brand/favicon.svg`.
- Los campos de contacto del footer viven en `src/lib/site.ts` y se ocultan mientras estén vacíos.

## Pendientes y ambigüedades

- No se publica la etiqueta de ejemplos ilustrativos de Why Latin America: pertenece a Fase 2.
- El enlace del perfil de Edgar queda pendiente de su preferencia y aprobación escrita; por eso no se incluye ningún enlace.
- La forma exacta de enlazar la nota de fuente (además de los superíndices) queda a revisión editorial. En esta fase la nota es visible y los dos datos enlazan por separado.
- Los títulos y descripciones de Privacy Notice y Cookie Policy no están definidos en el brief. Se usaron títulos localizados neutros y las páginas son placeholders noindex.
- El brief de la Fase 2 debe definir el copy de las páginas legales, el formulario, el destino de correo, Turnstile y el consentimiento de analytics.
- `npm audit` reporta 7 vulnerabilidades moderadas en dependencias de desarrollo de `typescript-eslint`; las dependencias de producción reportan 0 vulnerabilidades. No se forzó un override porque la corrección aún no está disponible en la versión que usa `eslint-config-next`.

## Verificación

- `npm run build`: correcto, 18 páginas estáticas + sitemap y robots.
- `npm run lint`: sin errores.
- `npx tsc --noEmit`: sin errores.
- Comprobación de copy verbatim: 45/45 y 38/38 cadenas por idioma.
- Comprobación de overflow horizontal: 360, 390, 768, 1024 y 1440 px sin desbordamiento.
- Axe: 0 violaciones en Home y How We Work, EN y ES.
- Capturas de gate en `preview/` a 1440 y 390 px.
