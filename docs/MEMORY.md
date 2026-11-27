# MEMORY

## Estado (2026-11-26)
- Último commit: 32fbf62 "Pulido de UI: Hero, Backdrop, PageHero, logos webi".
- Cambios sin commit: src/components/ui/Emphasis.tsx, src/components/ui/PageHero.tsx, src/content/en.ts, src/content/es.ts.

## Box scroll selectivo (2026-11-27, sin commit)
- Antes: todas las fronteras del home hacían bisagra 3D. Después: solo Hero→01, 02→03, 03→04 y 06→CTA. 01→02, 04→05, 05→06 y CTA→footer quedan planas.
- Cómo: `hinges` en src/app/[locale]/page.tsx marca `data-box-out`/`data-box-in`; `boxScroll()` en src/lib/motion/animations.ts solo rota caras marcadas.
- Evidencia: typecheck, lint y 132 tests OK; build OK. Playwright (next start) desktop 1440 y mobile 390: rotaciones correctas, mobile sin transform, 0 errores de consola o red, 0 overflow, foco visible con Tab.
- Deuda: en 04→05 asoma navy en los laterales por el inset de `surfaces()` (efecto previo, no es la bisagra). `next dev` con Turbopack falló una vez con 0xc0000142 (entorno Windows).

## Caras agrupadas + grafo 05 (2026-11-27, sin commit)
- Box: las secciones sin bisagra entre sí comparten cara: [Hero] [01+02] [03] [04+05+06] [CTA]. page.tsx agrupa (face > div > secciones); 01 y 02 giran en un mismo plano y siguen siendo secciones separadas (hairline intacto).
- Se descartó unir la ola 01→02 (no era el pedido); revertido.
- 05: `NetworkField` (Diagrams.tsx) a todo el ancho al pie de la sección, 1 hub principal. `networkPulse()` (animations.ts) dibuja y borra enlaces aleatorios entre nodos cercanos, en bucle; solo en vista; botón pausar/reanudar (WCAG 2.2.2, textos en content `relationships.motion`). Oculto <sm como los otros diagramas; sin bucle con reduced-motion.
- Evidencia (build previo a revertir la ola): typecheck, lint, 132 tests OK. Playwright: bucle activo (2-4 enlaces vivos), pausa congela, Enter/Espacio funcionan, foco visible, label es/en correcto, mobile y reduced-motion sin bucle ni botón, 0 overflow. Cara 01+02 con la misma rotación (bordes laterales alineados).
- Deuda: 404 de prefetch RSC `/start-a-conversation/?_rsc=` en desktop (ajeno a estos cambios, sin investigar).

## Onda de la navbar (TopRibbon) (2026-11-27, sin commit, sin verificar en navegador)
- TopRibbon.tsx ahora es cliente: oculto en "/" (es/en) vía usePathname de @/i18n/navigation; en el resto se dibuja y ondula en bucle (gsap.ticker reescribe los `d`, senos lentos de 8 s/5,3 s, borde superior fijo).
- La ondulación se pausa fuera de vista y con la pestaña oculta. Clic o toque alterna pausa/reanudar (WCAG 2.2.2, solo con puntero). Con reduced-motion queda estática. `data-m-pre` se libera en el `finally`.
- Se eliminó `ribbon()` de animations.ts y de PageMotion (el movimiento vive en el componente).
- Evidencia: typecheck, lint y 132 tests OK. Build bloqueado (abajo), Playwright pendiente.
- Fluidez (feedback del usuario: "no se ve fluida"). Antes: 7 puntos de control desplazados por separado (se quebraban las tangentes) y amplitud de ~2 px. Después: 49 muestras por curva con ola viajera (dos senos de 7 s y 4,6 s), reconstrucción Catmull-Rom a Bézier, amplitud 4,5→1,5 en la swoosh y 3,6→2 en la línea, sin tocar los clamps. Revisado solo con un script matemático, falta validarlo a ojo.
- Reemplazado a pedido del usuario: la forma ahora es fija y se animan los colores. El degradado (userSpaceOnUse, spreadMethod reflect) se desplaza con `gradientTransform` y da una vuelta completa cada 7 s (el usuario la pidió más rápida que los 14 s iniciales), con entrada suave. Se mantienen la pausa al pulsar, la pausa fuera de vista y el modo estático con reduced-motion. Typecheck, lint y tests OK; falta verlo en el navegador.

## Bloqueo activo: build Turbopack 0xc0000142
- Error literal: `TurbopackInternalError: [project]/src/app/globals.css [app-client] (css) … creating new process - node process exited before we could connect to it with exit code: 0xc0000142`.
- 2 fallos seguidos (`npm run build`), los anteriores pasaron. Hipótesis: Windows no puede crear el proceso worker de PostCSS (recursos del sistema / antivirus / heap del escritorio), no el código. Pendiente: reintentar tras cerrar terminales/reiniciar y repetir Playwright (pulse.mjs, group.mjs en %TEMP%\opencode).

## Decisiones clave
- Contenido bilingüe en src/content/{es,en}.ts; mantener ambos sincronizados.
- Grafo de conocimiento en graphify-out/ (usar `graphify query` antes de grep amplio).

## Próximo paso
- Revisar `git diff` de los 4 archivos, validar build/lint y decidir commit.

## Bloqueos
- Ninguno conocido. Docs del kit (PRD, ARCHITECTURE, etc.) no verificados.
