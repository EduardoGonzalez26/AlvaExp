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
- Diseño de fuentes: cada marcador es una insignia numerada (círculo con número en mono). En Home va una por cifra (`1` tras habitantes, `2` tras PIB). Al pasar el cursor o con foco muestra el nombre de la fuente (solo desde 640 px). Bajo cada módulo de datos, `SourceList` muestra «Fuentes / Sources» con cada número, el nombre de la fuente (de `messages/*.json › Sources`), el dominio y el enlace, seguido de la nota del brief literal. Los textos «Fuentes» y «se abre en una pestaña nueva» son microcopy de interfaz.
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

Rediseño basado en `ALVA lookandfeel` (Paleta A: membrete, master deck, template editorial y tarjeta de contacto).

- Colores base: azul `#0A3161`, verde `#006847`, piedra `#CFCAC1`, papel `#F4F2EE`. Son los únicos colores de texto. Tonos de apoyo tomados del arte de marca, solo para superficies y decoración: bruma `#E6E9E2`, verde azulado `#054C55` y salvia `#86B0A0`.
- Concepto de transición: el azul pasa al verde **de arriba hacia abajo** (azul arriba, verde abajo). Define las superficies con degradado (`bg-brand-gradient`: sección Region y Why Latin America › Region scale; el footer usa la mitad inferior, `bg-brand-gradient-footer`, verde azulado→verde), y los estados hover y foco (`.fill-down`): un degradado azul→verde barre el elemento de arriba abajo mientras el texto pasa a papel. Lo usan botones, navegación, selector de idioma, tarjetas, tarjetas de perfil, iconos del FAQ y el botón de envío. El degradado horizontal (`bg-brand-gradient-x`) solo se usa en líneas finas que cruzan la página (cinta superior, franjas inferiores de los héroes, subrayados), como en el membrete. Las paradas intermedias salen del degradado del logo.
- Tipografía: Source Serif 4 para titulares (con cursiva en la frase final, como en los decks), Inter para cuerpo y DM Mono para etiquetas con tracking amplio. La cursiva la aplica `Emphasis` sin alterar el texto: separa la última cláusula (tras `:` o el último punto) o, si no hay, el último tercio de las palabras.
- Se mantiene la regla de no aplicar `text-transform: uppercase` a copy del brief. Las mayúsculas solo aparecen en etiquetas de interfaz (menú, títulos de columnas del footer).
- Superficies: héroes en azul sólido con retícula triangular y fragmentos de la “A” (`Lattice`, `BrandShapes`), franja de degradado en el borde inferior; secciones en papel con ola suave (`BrandWave`); tarjetas de piedra con radio 12 px y rombo; cinta superior tipo membrete (`TopRibbon`); header fijo.
- Cierre de página: el panel CTA es azul sólido; el footer arranca en verde azulado y termina en verde, separado del panel por la franja de degradado horizontal (como el borde inferior de los héroes) y sin retícula, para que no se lean como una sola superficie. Todo el texto del footer es papel (≥ 6:1 sobre todo el degradado; papel sobre verde azulado ≈ 8.7:1). La piedra no se usa como texto sobre verde (4.06:1).
- Índice numérico decorativo por sección (`Section index`), generado con contadores CSS, oculto a lectores de pantalla. En How We Work solo aparece la numeración del brief.
- Se relajan dos reglas de la Fase 1: ya se usan degradados (solo de marca) y transparencias de papel en hairlines y formas decorativas sobre fondos oscuros. No hay glassmorphism, sombras ni 3D. La única fotografía es la del panel de cierre (ver más abajo).
- Movimiento: 520 ms con `cubic-bezier(0.22, 1, 0.36, 1)`. Los efectos hover solo actúan en dispositivos con hover; el foco por teclado dispara el mismo efecto. `prefers-reduced-motion` los reduce a un cambio instantáneo.
- Contraste de referencia: azul sobre papel 11.56:1, verde sobre papel 6.12:1, azul sobre piedra 7.92:1, papel sobre azul 11.56:1, papel sobre verde 6.12:1. El verde no se usa como texto sobre piedra ni sobre azul.
- Tema claro únicamente. `color-scheme: light`.
- El logo usa los archivos aprobados (`logo.svg` para fondos claros, `logo-dark.svg` para azul y degradado). No se redibuja ni se recolorea.
- `public/brand/favicon.svg` y `public/brand/og-image.png` son placeholders reemplazables. La fuente editable de la OG está en `public/brand/og-image.svg`.

## Movimiento

Capa de animación sobre el rediseño. El concepto no cambia: el azul pasa al verde **de arriba hacia abajo**, y cada animación lo refuerza (secuencias de arriba abajo, líneas que se dibujan desde arriba o desde la izquierda, degradados que se descubren desde arriba).

**Librerías (versiones exactas)**
- `gsap` 3.15.1 (incluye ScrollTrigger y SplitText, gratuitos desde 3.13), `@gsap/react` 2.1.2 y `lenis` 1.3.27. Nada de pago.
- Los plugins se registran una sola vez en `src/lib/motion/gsap.ts`, que también define los tokens de movimiento (`power3.out` para contenido, `power2.inOut` para líneas que se dibujan, duraciones 0,4/0,6/0,9 s y un desplazamiento vertical `RISE` de 16 px) y las media queries. Movimiento sobrio y corporativo: distancias cortas, sin rebotes ni efectos lúdicos.

**Arquitectura**
- Las páginas y secciones siguen siendo Server Components. Solo colocan atributos `data-m*` (`data-m="reveal|stagger|hero|rail-group|..."`, `data-m-i` para los elementos del héroe y `data-m-pre` para lo que se ve en el primer pintado).
- Dos islas cliente que no pintan nada: `SmoothScroll` (Lenis) y `PageMotion` (todas las animaciones GSAP). Las animaciones viven en `src/lib/motion/animations.ts`.
- `PageMotion` usa `useGSAP` + `gsap.matchMedia()`: un contexto para el layout (cinta y footer, una vez) y otro para la página, que se reconstruye en cada cambio de ruta y revierte el anterior.
- Solo se animan `transform` y `opacity`. Los efectos hover (`fill-down`) siguen en CSS.

**Lenis**
- Una sola instancia (`lerp: 0.18`, `wheelMultiplier: 1.15`: más ágil que el valor por defecto; anclas en 0,8 s), creada en `SmoothScroll` (dentro de `src/app/[locale]/layout.tsx`) y sincronizada con GSAP: `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(lenis.raf)` y `gsap.ticker.lagSmoothing(0)`. Se destruye y restaura el ticker al desmontar.
- Solo arranca con `(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)`. Con reduce y en táctil no hay instancia, ni listeners, ni clases en `<html>`; el query se observa y la instancia se crea o destruye si cambia.
- Se quitó `scroll-behavior: smooth` de `globals.css`: Lenis aporta el suavizado y, sin Lenis, el scroll es nativo (`auto`).
- Anclas (`#main-content`, `#validate`, `#build`, `#scale`): `SmoothScroll` intercepta los enlaces del mismo documento, llama a `lenis.scrollTo` (que respeta `scroll-margin-top`, así que `scroll-mt-28` sigue valiendo), actualiza el hash y mueve el foco al destino como haría el navegador. Los enlaces gestionados por el router de Next no se tocan.
- `allowNestedScroll` y `data-lenis-prevent` en los `textarea` y `select` del formulario. `stopInertiaOnNavigate` corta la inercia al cambiar de página. Header sticky y `lg:sticky` no cambian (scroll nativo, sin pin ni transform en el documento).
- Los `<details>` del FAQ siguen siendo nativos; al abrirlos o cerrarlos se llama a `ScrollTrigger.refresh()`.

**Qué se anima**
- Cinta superior (`TopRibbon`): se dibuja de izquierda a derecha al cargar (una vez por visita).
- Hero y PageHero: la franja de degradado inferior y las líneas se dibujan; eyebrow, título (SplitText por líneas con máscara), lead, párrafos, fórmula y botones entran escalonados. Las formas de marca (`BrandShapes`) quedan fijas (se retiró el parallax).
- Titulares de sección (todo `h1`/`h2` de `main` que no sea héroe): líneas enmascaradas que suben al entrar. Al terminar se revierte SplitText y el marcado original queda intacto (`<em>` final incluido). Durante la animación SplitText añade `aria-label` con el texto completo. No se divide ningún titular con hijos `[lang]`; el de las fases de How We Work (con bloque y `EnglishTerm`) usa el reveal genérico.
- Bloques de texto (`SplitLayout`, FAQ, formulario): suben una vez, en orden de entrada.
- Párrafos largos (lead de Shared Vision y Relationships, cierre editorial y cuerpo del CTA): suben y aparecen completos con el reveal genérico. Se retiró el revelado palabra por palabra porque dejaba el texto en gris, como deshabilitado.
- Índice de sección (`01 ——`): la línea se dibuja desde la izquierda al entrar.
- Barra de lectura: línea azul→verde de 2 px bajo el header que crece con el scroll (CSS `animation-timeline: scroll()`, sin JS; sin soporte no se muestra).
- Region (gradiente): una capa azul (`GradientCover`) se encoge hacia el borde inferior y descubre el degradado de arriba abajo. Las dos cifras entran con su línea superior dibujándose. **Las cifras no se cuentan ni se animan numéricamente: el texto es literal.** El mismo descubrimiento se usa en Why Latin America › Region scale y en el footer.
- Approach: la línea azul→verde se dibuja con el scroll (`scaleX` en desktop, `scaleY` en móvil) y los puntos se activan en orden cuando la línea llega a ellos. El texto de cada etapa entra por separado, sin depender del scrub.
- Phases (How We Work): el riel se dibuja de arriba abajo con scrub sobre una pista neutra; cada paso entra al cruzar su punto, y el paso que se está leyendo (`data-active`) marca su punto con un anillo verde. No se añade numeración: los números son los del brief.
- Tarjetas (`ItemGrid`, `TeamGrid`/`ProfileCard`): entrada escalonada por filas, de arriba abajo. Las de `ItemGrid` (lista `ul`) llevan índice mono decorativo (`aria-hidden`) y una línea azul→verde en el borde superior que se dibuja al entrar.
- Approach: pista neutra bajo la línea, puntos con anillo del color de la superficie e índice mono `01–03` decorativo.
- Footer: el degradado se descubre y el logo y las columnas entran.
- Sin pin ni scroll-jacking. Las duraciones van de 0,4 a 0,9 s; los scrubs usan `clamp()` en `start`/`end` para completarse aunque la página no pueda seguir bajando.

**Sin JavaScript, antes de hidratar y reduced motion**
- Todo el contenido es visible sin JS. El estado inicial lo fija GSAP dentro de `useGSAP` (layout effect), antes del primer pintado de la hidratación.
- Lo que se ve en el primer pintado (cinta, héroes) lleva `data-m-pre`. Con `prefers-reduced-motion: no-preference` y `scripting: enabled` (media queries CSS, sin script inline: React 19 avisa de `<script>` en componentes), `[data-m-pre]` oculta esos elementos hasta que GSAP los toma (y quita el atributo). Si GSAP no llega en 300 ms, una animación CSS de seguridad los muestra: el H1 nunca queda invisible más de ~300 ms. Un `finally` en `PageMotion` libera cualquier atributo restante. `<html>` lleva `suppressHydrationWarning` por atributos que añaden extensiones.
- Con `prefers-reduced-motion: reduce`: no se crea ninguna animación GSAP (la rama reduce de `matchMedia` no hace nada) y no hay Lenis: todo está en su estado final. La barra de lectura sigue el scroll (no es una animación temporal).

**Componentes de React Bits**
- Obtenidos del registro oficial (`https://reactbits.dev/r/<Nombre>-TS-TW.json`, el mismo contenido que entrega `npx shadcn@latest add @react-bits/<Nombre>-TS-TW`) y copiados a `src/components/react-bits/`. Se evitó el CLI porque el proyecto no tiene `components.json` y el CLI puede modificar `globals.css` y `package.json`; `globals.css` (`@theme`, paleta) y las dependencias no se tocaron.
- **Magnet** (retirado: el efecto magnético no encaja con el tono corporativo; antes): inerte salvo con puntero fino y sin reduce; la configuración se sincroniza en un efecto (no durante el render) por las reglas de React 19; solo escribe `transform`.
- **ScrollReveal** (retirado: el texto atenuado parecía deshabilitado; antes): plugins desde `@/lib/motion/gsap`; renderiza `p` (configurable con `as`) en lugar de `h2`; se quitaron `aria-label` y `aria-hidden` (en un párrafo no son válidos: las palabras siguen siendo texto real); valores por defecto sin blur ni rotación (solo transform y opacity); se eliminó el estado `mounted` (React 19 lint).
- **SplitText y BlurText** (descartados): solo aceptan un `string`, así que no conservan el `<em>` final de `Emphasis` ni los `lang="en"`, y ocultan el texto con `visibility: hidden` hasta hidratar. Los titulares usan `SplitText` de GSAP directamente, que respeta los nodos anidados y se revierte al terminar.
- **SpotlightCard** (descartado): trae superficie, borde y sombra propios fuera de la paleta (`#111`, blanco, sombras) y compite con el `fill-down`, que ya es el gesto de las tarjetas.
- Descartados por WebGL/three/ogl (pesan y rompen la paleta): Aurora, Waves, LightRays y similares.

## Feature flags y perfiles

- `NEXT_PUBLIC_SHOW_EDGAR_PROFILE === 'true'` muestra las dos tarjetas de equipo. Cualquier otro valor muestra solo la tarjeta de Emilio, centrada.
- No hay enlaces, botones ni iconos hacia el perfil personal de Emilio. Edgar tampoco tiene enlace hasta recibir aprobación.
- El flag se evaluó en build (variable pública) y se probó en ambos estados y en ambos idiomas. `.env.example` documenta el valor; `.env.local` local lo deja en `false`.

## SEO

- `NEXT_PUBLIC_SITE_URL` alimenta metadata, canonical, hreflang, OG y sitemap. Fallback: `https://alvaexpansion.com`.
- Títulos y descripciones de Home y How We Work se toman literalmente de la sección 8 del brief en ambos idiomas.
- Canonical por página y alternates `en`, `es`, `x-default` (`x-default` = EN).
- Sitemap con Home y How We Work en ambos idiomas, con `xhtml:link` alternates. Los placeholders noindex se excluyen del sitemap.
- En Fase 1 robots permitía el sitio y declaraba el sitemap; desde Fase 2 el gate `SITE_INDEXABLE` condiciona ambos comportamientos (ver sección de seguridad).
- Placeholders de las páginas pendientes: `index: false, follow: true` (noindex, pero los enlaces se siguen).
- OG image placeholder tipográfica 1200 × 630. Favicon SVG placeholder.

## Accesibilidad

- Skip link visible al recibir foco, landmarks `header`, `nav`, `main`, `footer` y un solo `h1` por página.
- Foco visible con outline de 3 px; en fondos azules el outline cambia a papel.
- Navegación completa por teclado. El menú móvil usa `aria-expanded`, `aria-controls`, cierre con Escape y devolución del foco al botón.
- FAQ con `<details>`/`<summary>` nativos, sin JavaScript, con icono decorativo y foco visible.
- Selector de idioma con enlaces `hreflang` y `lang`, estado actual anunciado con `aria-current`.
- Enlaces de fuentes con área de objetivo de 24 × 24 px y etiquetas accesibles.
- `prefers-reduced-motion` desactiva transiciones, Lenis y todas las animaciones (ver «Movimiento»).
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

## Fase 2 · Seguridad, indexación y lanzamiento

- `SITE_INDEXABLE=false` por defecto. Es una variable server-side evaluada en build: solo el valor exacto `"true"` abre la indexación. Con el gate cerrado, todas las páginas emiten `noindex, nofollow`, `robots.txt` responde `Disallow: /` sin sitemap, el sitemap se genera vacío y todas las respuestas llevan `X-Robots-Tag: noindex, nofollow`. Requiere rebuild al cambiarla.
- Start a Conversation y los placeholders conservan su `noindex` propio aunque el gate se abra; Start a Conversation sigue fuera del sitemap hasta publicar Privacy Notice y configurar correo real.
- Headers en `next.config.ts`: CSP en `Content-Security-Policy-Report-Only` para no bloquear Next.js ni Turnstile, HSTS solo con `NODE_ENV=production`, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`, `X-Frame-Options` y `Cross-Origin-Opener-Policy`. El siguiente paso es revisar los informes y migrar a CSP enforce con nonces.
- Cookie `NEXT_LOCALE`: `Path=/`, `SameSite=Lax`, `Secure` en producción y un año de duración. `HttpOnly` no se activa porque `localeCookie` de next-intl no lo expone y el selector escribe la cookie desde el cliente. Solo contiene `en`/`es`.
- CI en `.github/workflows/ci.yml` (Node 20/22): instalación reproducible, lint, typecheck, test, build, rechazo de `c2pa:manifest` en `public/` y auditoría de producción con umbral high. `scripts/audit-prod.mjs` solo tolera el aviso de picomatch sin parche disponible que llega vía `next-intl > @parcel/watcher`; el resto de vulnerabilidades high/critical bloquean.
- Dependabot semanal para npm y GitHub Actions, agrupando minor/patch.
- Protección de staging, checklist de lanzamiento, monitorización sin PII y rollback documentados en `docs/launch-checklist.md`.

## Verificación

- `npm run build`: correcto, 18 páginas estáticas + sitemap y robots.
- `npm run lint`: sin errores.
- `npx tsc --noEmit`: sin errores.
- Comprobación de copy verbatim: 45/45 y 38/38 cadenas por idioma.
- Comprobación de overflow horizontal: 360, 390, 768, 1024 y 1440 px sin desbordamiento.
- Axe: 0 violaciones en Home y How We Work, EN y ES.
- Capturas de gate en `preview/` a 1440 y 390 px.

## Ajustes visuales (header cápsula, footer, mapa y diagramas)

- Header: arriba del todo es una barra cuadrada a ancho completo y se transforma en cápsula flotante siguiendo el scroll (no por umbral). `HeaderScrollState` escribe `--hp` en `<html>` (0 arriba, 1 tras 120 px, con suavizado smoothstep) y el CSS interpola ancho, radio, bordes, padding y altura con ese valor; al subir se deshace igual de gradual. La altura total nunca cambia, así que el contenido no salta. `data-scrolled` (≥ 0,5) solo ajusta el panel del menú móvil. Sin JS queda la barra cuadrada.
- Footer: banda superior (logo, descriptor, `Validate · Build · Scale` y CTA), columna del método con enlaces a `#validate`, `#build` y `#scale` (nombre de etapa + título de fase tomados del copy), navegación, legal, idioma y marca de agua del logo. Sin copy nuevo: todo sale del contenido y microcopy existentes.
- Mapa de expansión (`ExpansionMap`, Home › Region y Why Latin America › Region scale): matriz de puntos de las Américas de EE. UU. a la Patagonia, calculada en el servidor (`src/lib/map/americas.ts`), con arcos de EE. UU. hacia ciudades de América Latina. Decorativo (`aria-hidden`); los rótulos `USA` y `LATAM` son marcas visuales. Interacción: foco de luz que sigue al ratón y hover por ruta. Los arcos se dibujan de norte a sur con el scroll.
- Diagramas decorativos bajo los titulares (`components/visuals/Diagrams.tsx`): círculos que convergen (Shared Vision, Partnership), red (Relationships, Connected Team), flujos (Investment) y cuadrícula de 100 puntos con la cifra que el copy declara (Connectivity, 84 %). Ocultos en móvil (<640 px) para no alargar la lectura.
- Scroll por contenedor: las superficies de color (piedra, azul, degradado) entran como panel redondeado con margen y se abren a ancho completo con el scroll (`surfaces()`, clip-path con scrub). Sin pin ni scroll-jacking; con movimiento reducido todo queda en su estado final.
- Navbar: los enlaces, el selector de idioma y el CTA del header ya no usan el barrido `fill-down`. Enlaces e idioma cambian el texto a verde Alva al pasar el cursor (la página o idioma actual va en verde con subrayado verde sólido). El CTA (`ButtonLink solidHover`) pasa a fondo verde sólido. En el footer el idioma usa `tone="dark"` (subrayado al pasar el cursor).
- Hover de la navbar: además del verde, el texto pasa a negrita con una transición de peso (Inter variable; DM Mono 400→500 en el selector de idioma). `BoldOnHover` reserva el ancho con una copia invisible en negrita, así que nada se desplaza. Sin relleno del contenedor.
- Selector de idioma: al pasar el cursor, la píldora se rellena de verde Alva sólido, el texto pasa a papel y se engruesa (`BoldOnHover`). En el footer (fondo verde) se rellena de papel con texto verde.
- Tarjetas tipo carpeta (`.folder`, en `ItemGrid` y `ProfileCard`): se retiró el relleno con degradado. Al pasar el cursor (o con foco dentro) la tarjeta sube 4 px, una pestaña verde asoma por detrás del borde superior, la esquina superior derecha se dobla (máscara a 45° + solapa con degradado o salvia, animada con `@property --fold`) y el rombo se convierte en un cuadrado verde relleno. El texto no cambia de color. Aplica a Why partner, What we bring, Market meaning, Examples y las tarjetas de perfil.
- Navbar: los tres títulos muestran además un subrayado verde que se dibuja de izquierda a derecha al pasar el cursor.
- Cambio de idioma animado: `LocaleSwitcher` usa la View Transitions API. La página en el otro idioma se descubre de arriba abajo sobre la anterior (que se atenúa) y se conserva la posición de scroll (`router.replace(..., {locale, scroll: false})`); la cookie `NEXT_LOCALE` se sigue actualizando. Sin soporte, con movimiento reducido o con clic modificado (nueva pestaña) funciona como enlace normal.
- Loader entre pantallas (`RouteLoader`): panel papel con el logo al centro y una línea azul→verde indeterminada. Cubre la página de arriba abajo al seguir un enlace interno y descubre la nueva de arriba abajo cuando ya se renderizó (mínimo 650 ms visible). También abre la primera visita (espera a las fuentes, ~450 ms). No se usa en el cambio de idioma (tiene su View Transition), anclas de la misma página, pestañas nuevas ni descargas. Decorativo (`aria-hidden`); sin JS o con movimiento reducido no aparece; un fail-safe CSS lo oculta a los 4 s si el script no toma el control.
- Footer en azul marino profundo (`--color-alva-navy: #061a33`, papel ≈ 16:1), separado del panel de cierre por la franja de degradado horizontal; ya no usa el degradado verde azulado→verde ni la capa `GradientCover`.
- Panel de cierre (`CtaPanel`, la sección azul antes del footer en todas las páginas): fondo fotográfico de equipos de desarrollo (`TeamPhotos`): tres fotos de Pexels (licencia libre, sin atribución obligatoria) guardadas en `public/images/teams/`, optimizadas con `next/image` (`sizes=100vw`, blur placeholder), en fundido cruzado lento con zoom suave. Velo azul→marino (82–90 %) para que el texto papel quede por encima de 6:1 en cualquier zona. Decorativas (`alt=""`, `aria-hidden`). Con movimiento reducido solo se muestra la primera, fija. Se quitaron las formas de marca de este panel; se mantiene la retícula.
- Crédito «Powered by Webi» en la barra inferior del footer: enlace a https://webi.mx (pestaña nueva, `rel="noopener noreferrer"`) con el logo blanco de Webi. El logo se exportó de `assets/webi-logos/logo-light.svg` (SVG de 400 KB con PNG incrustado) a `public/brand/webi-logo-light.png` (474×169, 15 KB). «Powered by» se marca `lang="en"`; nombre accesible: «Powered by Webi» + aviso de pestaña nueva.
- Formulario conversacional en modal (`ConversationLauncher` + `ConversationDialog`, montados en el layout): todos los enlaces a Start a Conversation / Conversemos abren un `<dialog>` nativo en lugar de navegar; la página sigue publicada (noindex) y es el fallback sin JS o con clic modificado. Una pregunta por pantalla (tipo, nombre, correo, empresa, rol/sitio/país/etapa condicionales, mercados, descripción, referencia), opcionales omitibles, opciones A–D elegibles con teclado, revisión editable, consentimiento y Turnstile al final. Reutiliza `validateContactForm`, `buildContactPayload` y el nuevo `submitContact` (`src/lib/contact/submit.ts`), así que el mensaje enviado es idéntico al del formulario de la página. Diálogo modal nativo: foco atrapado, Escape y clic fuera cierran, `html[data-dialog-open]` bloquea el scroll de fondo; a pantalla completa en móvil. Animación de entrada y de paso (adelante desde abajo, atrás desde arriba). El diálogo y Turnstile se cargan solo al primer clic (`dynamic`). Los textos de interfaz nuevos viven en `ContactForm.conversation` (es/en).
- Modal conversacional, ajustes: las preguntas de opción múltiple ya no avanzan solas; la selección se mantiene y se confirma con «Siguiente» (o Enter). El script de Turnstile se precarga al abrir el diálogo y, si se pulsa «Enviar» antes de que llegue el token, se muestra «Esperando la verificación…» y el envío continúa solo en cuanto el token está listo (con guarda contra doble envío); si la verificación falla, el bloque se lleva al centro de la vista y recibe el foco. El widget acepta un `id` para no duplicar ids cuando convive con el formulario de la página.
- Corrección del modal: la columna interna hereda el `max-height` del diálogo (`.conv-dialog > div { max-height: inherit }`). Sin eso, con `height: fit-content` los hijos crecían con el contenido, el área de scroll nunca desbordaba y la revisión quedaba recortada: no se podía bajar al consentimiento ni al botón de enviar. Además, al abrir el diálogo se detiene Lenis (`alva:dialog`) para que la rueda desplace solo el contenido del modal y no la página de fondo.
- Mapa de expansión, versión mejorada (`MapCanvas` cliente + `ExpansionMap` servidor): retícula tenue, matriz de puntos con foco de luz que sigue al puntero, rutas con flujo de guiones en movimiento (se enciende tras dibujarse), halos pulsantes en destino, y al pasar el cursor la ruta activa se engrosa, el origen se resalta, el resto se atenúa y aparece una etiqueta con las dos ciudades. En táctil el mapa recorre las rutas solo cada 3,6 s (pausa al tocar y con IntersectionObserver para no animar fuera de pantalla). Pista «Pasa el cursor sobre una ruta» que desaparece al primer uso. Los nombres de ciudad son etiquetas geográficas decorativas en el namespace `Map` (es/en); el mapa sigue `aria-hidden` y la geometría se calcula en el servidor. Con movimiento reducido: sin tour, sin flujo de guiones y sin pulsos.
- Diagrama de red de la sección Relationships (Home 05): distribución orgánica en tres clústeres alrededor del hub (noroeste, noreste y sureste), dos hubs secundarios, satélites en los bordes y enlaces largos curvos entre regiones; 24 nodos y 32 conexiones, con animación al 70 % (`data-m-slow` → `timeScale(0.7)`, unos 4 s). El tamaño se mantiene en 22 rem; el diagrama de How We Work conserva 10 nodos y el ritmo anterior.

