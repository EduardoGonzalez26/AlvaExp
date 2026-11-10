# Master Agent Prompt: Proyecto Alva (Business Expansion Partner)

## 1. Contexto y Rol del Agente Maestro
Eres el Agente Maestro responsable de orquestar a tus subagentes (Frontend, Backend, SecDevOps) para construir el sitio web corporativo de "Alva". 
Tu objetivo es entregar una aplicación web funcional, bilingüe (Inglés/Español) y con un alto nivel de pulido técnico y visual, lista para producción.

**Regla de Oro:** El contenido textual, metadatos, lógica del formulario y notas de fuentes proporcionados en este documento deben ser implementados **EXACTAMENTE** como están escritos. Está estrictamente prohibido parafrasear, resumir o "mejorar" los textos mediante IA.

## 2. Arquitectura y Stack Tecnológico
*   **Framework Principal:** Next.js (App Router recomendado).
*   **Estilos:** Tailwind CSS o similar.
*   **Internacionalización (i18n):** Utilizar `next-intl` para gestionar rutas bilingües, selector de idioma, etiquetas `hreflang` y sitemap (conforme a la documentación de Google para sitios multilingües).
*   **Backend / Formularios:** Por ahora **NO** se utilizará base de datos. Los datos del formulario de la página "Conversemos" deben enviarse a un correo electrónico mediante una API Route de Next.js (puedes instruir al agente backend para usar Resend, Nodemailer o similar).
*   **Seguridad y Accesibilidad:** Protección contra bots en el formulario, validación de campos, navegación accesible por teclado y lector de pantalla (W3C WAI).

## 3. UI/UX y Directrices de Marca
*   **Diseño:** Estilo corporativo minimalista, profesional, sofisticado y confiable. **Cero estética "generada por IA".** No usar ilustraciones genéricas de IA. Priorizar espacios en blanco, tipografías limpias y jerarquía visual estricta.
*   **Paleta de Colores (Estricta):**
    *   Azul: `#0A3161` (Color principal / acentos fuertes / texto primario).
    *   Verde: `#006847` (Acentos secundarios).
    *   Piedra: `#CFCAC1` (Fondos secundarios / bordes / tarjetas).
    *   Papel: `#F4F2EE` (Fondo principal / áreas de descanso).
*   **Tipografía:** Elegir una fuente sans-serif geométrica o humanista de nivel corporativo (ej. Inter, Roboto, Helvetica Neue).

## 4. Reglas Especiales y Feature Flags
*   **Perfil de Edgar Hintze:** Su biografía está pendiente de aprobación escrita.
    *   **Instrucción Dev:** Crea una variable de entorno `NEXT_PUBLIC_SHOW_EDGAR_PROFILE=false`.
    *   Si es `false`, oculta completamente su perfil (y ajusta el diseño para que el de Emilio se vea centrado o en formato individual). Si es `true`, muestra ambas tarjetas de igual tamaño.
*   **Perfil de Emilio:** No debe incluir ningún enlace, botón ni icono a su perfil personal.
*   **Notas de Fuente:** Los identificadores entre corchetes (ej. `[D1, D2]`) NO deben ser visibles en el frontend final. Deben ser reemplazados por una nota de fuente discreta (asterisco o número pequeño) que enlace a la URL correspondiente de la tabla de fuentes.

---

## 5. CONTENIDO DEL SITIO EN INGLÉS (Verbatim)

### Page 1 · Home
**Hero**
Alva · Business Expansion Partner
Your next move: Latin America.
We build and lead your expansion on the ground.
Alva is your business expansion partner in Latin America. We combine your vision and knowledge of your business with our commercial and financial judgment, regional perspective and leadership on the ground.
Together, we identify where the opportunity lies, shape the strategy and make the decisions that matter. Alva then leads the work in the market: validating demand, developing relationships with customers and partners, and building the commercial and operating capabilities your business needs to grow.
Validate · Build · Scale
*Primary CTA:* Talk to Alva → Start a Conversation
*Secondary CTA:* Explore how we work → How We Work

**A shared vision. A team that makes it happen.**
Every expansion starts with ambition. Bringing it to life takes market insight, commercial relationships, operating capabilities and people prepared to take responsibility for the work.
We bring together your knowledge of your business with Alva’s international perspective, commercial judgment and local experience. As partners, we define what success looks like, test the opportunity and decide how to build it.
Then Alva leads the work in the market, connecting strategy to action and keeping the business moving as it develops.
Whether you are a founder exploring venture expansion or an established company entering a new market, we shape the partnership around your business and what you want to build.

**Why companies partner with Alva**
*   **A partnership centered on your business.** We take the time to understand your vision, your business model and what you want to achieve. The strategy is built around your opportunity, your customers and the markets you want to explore.
*   **Commercial and financial judgment.** We look beyond the size of a market. We assess demand, customer behavior, pricing, channels and the economics of serving the market to develop a clear business case for the opportunity.
*   **Leadership on the ground.** We engage prospective customers and partners, develop the route to market, bring together the right capabilities and lead local execution.
*   **Continuity from opportunity to growth.** The knowledge, relationships and decisions developed during validation carry forward into the build. As the business evolves, the partnership and the team around it evolve with it.

**Latin America is a region of possibilities.**
Latin America brings together distinct markets, growing business ecosystems and customers with needs that ambitious companies can address in new ways.
For your business, the opportunity could be a new customer segment, a strategic commercial partner, a place in an established value chain or a new market for a proven solution. Our work is to find where that opportunity exists and what it takes to develop it.
667 million people · US$7.4 trillion in GDP [D1, D2]
*Source note (publish):* Latin America and the Caribbean, 2025. Source: World Bank.
*Link:* Explore the opportunity → Why Latin America

**Validate the opportunity. Build the business. Scale what works.**
*   **Validate.** We investigate the opportunity, speak with prospective customers and partners, assess the commercial alternatives and test the assumptions that matter. Together, we use the evidence to decide how to move forward.
*   **Build.** We turn the strategy into a local presence: developing commercial relationships, building the route to market, organizing the operating capabilities and bringing in the specialists the business requires.
*   **Scale.** We keep developing the business as it grows, strengthening commercial execution, local leadership and the capabilities it needs for its next stage.
*Link:* See how the partnership works → How We Work

**The relationships and capabilities your business needs**
Entering a market takes more than understanding its size. It takes knowing who the customers are, how decisions are made, which relationships matter and how the business will serve the market.
Alva develops those conversations and brings the work together around a shared plan. From prospective buyers and channel partners to local talent and specialized support, we build the relationships and capabilities that turn a market opportunity into a business.

**Meet the people behind Alva**
*(Editorial UI: two profile cards of equal size if Edgar is active. No descriptor under the names.)*
**Emilio Rivas Garin**
Emilio brings more than a decade of experience in business development, finance and operations in the United States and Mexico. He has built regional teams and capabilities from Mexico and led a multidisciplinary organization of more than 30 professionals supporting the Americas. He holds an Executive MBA from IPADE Business School.

**Edgar Hintze** *(Condicionado por Feature Flag)*
Edgar brings experience in commercial growth, retail and ecommerce across Mexico and U.S. sales channels, with a background at Amazon, Logitech and Kellogg’s. As General Manager for Mexico at Amplified Industries, he is working to open the Mexican market. He holds an Executive MBA from IPADE Business School.
*Link:* Meet the team → About Alva

**Let’s build what comes next.**
Whether you have a market in mind or are beginning to explore Latin America, we would welcome the opportunity to learn about your business and discuss what growth in the region could look like.
*CTA:* Talk to Alva → Start a Conversation

### Page 2 · How We Work
**A partnership built to move forward.**
Every business and every expansion opportunity is different. Our approach brings clarity to the journey while leaving room to shape the work around the opportunity.
Validate · Build · Scale connects the first conversation to the relationships, capabilities and execution needed to develop a business in a new market. At the end of each step, we review the evidence together and decide the next one.

**VALIDATE: Understand the opportunity**
**1. Initial Fit**
We start by getting to know your business, your ambitions and the questions behind your interest in Latin America. Together, we explore whether there is an opportunity worth examining and whether Alva is the right partner to pursue it.
You do not need a finished expansion plan or a local team to begin. Please keep the initial conversation nonconfidential. We can agree on confidentiality terms before discussing sensitive information.
**2. Readiness Review**
We examine the business, the market or markets under consideration and the assumptions that could shape the opportunity. Together, we define what needs to be tested, what information will help us decide and the scope of the validation. Confidentiality terms are set before anything sensitive is shared.
**3. Market Validation Sprint**
Alva leads conversations with prospective customers, partners and other relevant market participants. We assess customer needs, buying behavior, competitive alternatives, pricing, channels and the commercial and operating conditions that could affect the business. You contribute product knowledge and commercial experience, and you take part in the conversations that matter.
The outcome is a clear view of the opportunity and a recommendation supported by evidence: move forward, refine the approach or decide not to proceed.

**BUILD: Turn the opportunity into a business**
**4. Local Build**
Once we decide together to move forward, Alva leads the work needed to build a local presence. Depending on the opportunity, this can include developing customer and channel relationships, organizing local roles and bringing in the people to fill them, building operating processes and coordinating legal, tax, regulatory and other specialist work with the right professionals.
Together, we shape the commercial model, the priorities and the key commitments. Alva brings the people and workstreams together around an implementation plan with clear milestones your team can follow.

**SCALE: Develop the business and its local capabilities**
**5. Operating Partnership**
As the business develops, Alva continues leading the commercial and local operating work where an ongoing relationship makes sense: strengthening relationships, coordinating capabilities, reporting against the goals we set together and helping build the team needed for the next stage, including your own local organization when the time is right.
The partnership evolves around the needs of the business and the opportunities we choose to pursue together.

**A team that stays connected to the business**
Context matters. The knowledge, relationships and decisions developed during validation carry forward into the work of building and growing the business.
You work directly with the Alva team throughout the partnership. As your business develops, we bring in and coordinate the specialists it needs, while remaining personally involved in the work.

**Questions you may have**
*   **Do we need to have chosen a country?** No. You may have a specific market in mind, several markets to compare or an interest in exploring the region. We can begin by defining the opportunity worth testing.
*   **Can we assess more than one market?** Yes. Some businesses begin with a single country; others want a regional view from the start. We shape the approach around the business and the questions that need answering, and we build the local capabilities each market requires as the opportunity develops.
*   **Do we need a local team first?** No. Alva leads the local work and brings together the capabilities the opportunity requires. Developing a dedicated local team can be part of the business as it grows.
*   **Can a venture at an early stage talk to Alva?** Yes. A first conversation helps us understand the business, its stage and whether there is an opportunity we can develop together.
*   **Is Alva a venture capital fund?** No. Alva is a business expansion partner that helps companies validate opportunities and lead their expansion in Latin America.
*   **Do you guarantee customers or market access?** We take responsibility for the work: testing the opportunity rigorously, developing the right relationships and leading the execution. Purchase decisions, authorizations and commercial outcomes depend on the market and on your company.
*   **How long does it take?** It depends on the question and the market. We define the scope and timing together before each step, and we tell you early if the evidence points to a clear answer.

*CTA:* Talk to Alva → Start a Conversation

### Page 3 · Why Latin America
**One regional vision. A strategy built for each market.**
Latin America offers companies the opportunity to reach new customers, develop strategic relationships and build new sources of growth.
Each market has its own customers, channels, business practices and operating conditions. That diversity calls for a strategy that connects your regional ambition to the specific opportunities your business can serve, whether you begin with one country or look at several.

**A region with scale**
Latin America and the Caribbean was home to approximately 667 million people and represented a US$7.4 trillion economy in 2025. [D1, D2]
The numbers show the region’s scale. The opportunity for your business depends on identifying the customers, applications and commercial models that make sense for your offering.
*Source note (publish):* World Bank, 2025. Regional figures include the Caribbean.

**What the region could mean for your business**
*   **New customers.** Businesses or consumers facing a problem your product or service can solve, and an understanding of how they make purchasing decisions.
*   **Existing value chains.** Opportunities with buyers, suppliers and partners already operating and investing in the region, who are developing their own capabilities and need solutions to do it.
*   **New channels and partnerships.** The mix of direct relationships, commercial partners, distributors or digital channels that fits your business.
*   **Local capabilities.** The commercial, operational and specialist support needed to serve customers and grow with confidence.

**From regional activity to a commercial opportunity**
Latin America and the Caribbean received approximately US$194 billion in foreign direct investment in 2025, including reinvestment by companies already present in the region. [D3]
For an expanding business, the important question is where that activity translates into relevant customers, projects or partners, and whether your solution fits their needs.
*Source note (publish):* ECLAC, 2026 report on 2025 investment. Regional figures include the Caribbean.

**Connected markets**
In 2025, 84% of the population of Latin America and the Caribbean used the internet. [D11] Digital channels can support customer discovery, sales and service before a physical presence exists. Customer expectations, payment practices and the role of local partners still vary by country, and they are part of what we validate.
*Source note (publish):* World Bank, 2025. Regional figures include the Caribbean.

**What this could look like**
*(Editorial: publish the label "Illustrative examples. These are not clients or completed projects.")*
*   **An industrial company.** The question is which buyers need its product, how they purchase it today and what delivery or service they expect. We would assess that with prospective buyers and the channels that serve them. If the opportunity supports it, Alva would develop the commercial relationships, build the route to market and lead the launch.
*   **A software venture.** The question is who faces the problem the product solves, how they buy, whether pricing holds and what implementation and support they need. We would explore that across one or more markets. If the evidence supports it, Alva would build the commercial presence the opportunity requires and develop the first customers and partners.
*   **A specialist services firm.** The question is who would trust the firm with its service locally, how it would be delivered and with whom. We would identify potential clients and delivery partners and assess local requirements. If the case holds, Alva would develop the first client relationships and set up the commercial and operating model for serving the market.

**Start with the opportunity.**
You may already have a market in mind, or you may be deciding whether Latin America belongs in your growth plans. We can begin by identifying the questions that matter.
*CTA:* Talk to Alva → Start a Conversation

### Page 4 · About Alva
**Built to develop business together.**
Alva brings together business judgment, international perspective and local execution to help companies build and grow in Latin America.
We believe an expansion is stronger when the people behind the business and the people leading the work in the market share a vision, exchange perspectives and make the important decisions together. That is how we work.

**What we bring together**
*   **Business development.** Understanding the opportunity, opening the right conversations and building relationships around a clear commercial purpose.
*   **Commercial and financial judgment.** Testing demand, pricing, channels and the economics of the business so that growth decisions have a strong foundation.
*   **Local execution.** Turning the strategy into an operating plan, developing the required capabilities and leading the work as the business takes shape.
*   **Specialized expertise.** Bringing in the commercial, legal, tax, regulatory and operating specialists each opportunity requires, integrated into the work under Alva’s coordination.

**What partnering with Alva means**
Partnering with Alva means developing the business together. We evaluate the opportunity with you, decide the commitments with you and then lead the local launch, bringing in and coordinating the people and specialists it requires, and keep building as the business evolves. We commit to the business, not just to a scope of work. The form of each partnership is shaped by the opportunity and defined together before each step begins.

**Meet the team**
*(Editorial: two profiles with equal space if Edgar active. Individual experience is presented as individual; no institutional track record for Alva is implied.)*
**Emilio Rivas Garin**
Emilio brings more than a decade of experience in commercial development, finance and operations in the United States and Mexico. His experience includes building regional teams and operating capabilities based in Mexico within a global eye care company, and leading a multidisciplinary organization of more than 30 professionals supporting North America and the Americas.
His background spans business planning, pricing, revenue management, data analysis and commercial operations. Earlier, he led sales, business development and client relationships at a marketing services agency in Miami.
Based in Mexico City, he holds an Executive MBA from IPADE Business School and works in English and Spanish.

**Edgar Hintze** *(Condicionado por Feature Flag)*
Edgar brings experience in commercial growth, retail and ecommerce across Mexico and U.S. sales channels. He serves as General Manager for Mexico at Amplified Industries, working to open the Mexican market.
He previously served as Direct to Consumer Manager at Logitech Mexico and managed U.S. ecommerce accounts with Amazon and Walmart at Mobi Muebles. At Amazon Mexico, he worked in vendor recruitment and management, including the monitors category. Earlier at Kellogg’s, he managed key retail accounts with annual sales budgets of up to MXN 320 million.
He studied International Business at Universidad Anáhuac, holds an Executive MBA from IPADE Business School and works in English and Spanish.

**How we work with you**
We define the work and the responsibilities together before committing resources. We distinguish evidence from assumptions, and we say when the evidence points to stopping. We handle sensitive information under confidentiality terms. We keep context, coordination and continuity from validation through build and beyond. And we recommend the next commitment only when the evidence supports it.
*CTA:* Talk to Alva → Start a Conversation

### Page 5 · Start a Conversation
**Let’s explore what we can build together.**
Tell us about your business and the growth you want to explore in Latin America. Whether you already have a market in mind or are considering the region for the first time, we can start with a conversation about the opportunity.
You do not need a finished plan or a local team. A short, nonconfidential overview is enough to begin.

**Tell us about your business**
*Form introduction (publish):* Share a nonconfidential overview. We will set confidentiality terms before discussing anything sensitive.
*(Form fields rendered here according to Part C)*
*Button:* Send your message

**What happens next?**
We will review your message and identify a useful next step, usually an introductory conversation or a request for a little more context. No project work begins until we have defined the question, the scope and the terms together.

**Referring a company or proposing a collaboration?**
Use the same form and select the type of inquiry. For a referral, tell us about the company and why the fit seems worth exploring. For a collaboration, tell us what you bring and the kind of project where it applies.

*Success message (publish):* Thank you. We have received your message and will contact you about the next step.
*Error message (publish):* We could not send your message. Please try again. Your entries have been kept on this page.
*Privacy acknowledgement (publish):* I have read the Privacy Notice.

---

## 6. CONTENIDO DEL SITIO EN ESPAÑOL (Verbatim)

### Página 1 · Inicio
**Hero**
Alva · Business Expansion Partner
Tu siguiente paso: América Latina.
Construimos y lideramos tu expansión en el mercado.
Alva es tu Business Expansion Partner en América Latina. Unimos tu visión y conocimiento de tu negocio con nuestro criterio comercial y financiero, perspectiva regional y liderazgo en el mercado.
Juntos identificamos dónde está la oportunidad, definimos la estrategia y tomamos las decisiones que importan. Después, Alva lidera el trabajo en el mercado: valida la demanda, desarrolla relaciones con clientes y aliados, y construye las capacidades comerciales y operativas que tu negocio necesita para crecer.
Validate · Build · Scale
*CTA principal:* Hablemos de tu expansión → Conversemos
*CTA secundario:* Conoce cómo trabajamos → Cómo trabajamos

**Una visión compartida. Un equipo que la hace realidad.**
Toda expansión empieza con una ambición. Llevarla a la práctica requiere entender el mercado, desarrollar relaciones comerciales, construir capacidades operativas y contar con personas dispuestas a responder por el trabajo.
Unimos el conocimiento de tu negocio con la perspectiva internacional, el criterio comercial y la experiencia local de Alva. Como socios, definimos qué significa el éxito, probamos la oportunidad y decidimos cómo construirla.
Después, Alva lidera el trabajo en el mercado, conecta la estrategia con la acción y mantiene el negocio en movimiento conforme se desarrolla.
Ya sea que estés expandiendo un emprendimiento o lideres una empresa consolidada que busca entrar a un nuevo mercado, construimos la alianza alrededor de tu negocio y de lo que quieres lograr.

**Por qué las empresas se alían con Alva**
*   **Una alianza centrada en tu negocio.** Nos tomamos el tiempo para entender tu visión, tu modelo de negocio y lo que quieres lograr. La estrategia se construye alrededor de tu oportunidad, tus clientes y los mercados que quieres explorar.
*   **Criterio comercial y financiero.** Miramos más allá del tamaño de un mercado. Evaluamos la demanda, el comportamiento de compra, los precios, los canales y la viabilidad económica de atenderlo para construir un caso de negocio claro.
*   **Liderazgo en el mercado.** Desarrollamos relaciones con posibles clientes y aliados, construimos la ruta de entrada al mercado, reunimos las capacidades necesarias y lideramos la ejecución local.
*   **Continuidad de la oportunidad al crecimiento.** El conocimiento, las relaciones y las decisiones que desarrollamos durante la validación pasan a la construcción del negocio. Conforme el negocio evoluciona, la alianza y el equipo evolucionan con él.

**América Latina es una región de posibilidades.**
América Latina reúne mercados distintos, ecosistemas empresariales en crecimiento y clientes con necesidades que las empresas ambiciosas pueden atender de nuevas maneras.
Para tu negocio, la oportunidad puede ser un nuevo segmento de clientes, un aliado comercial estratégico, un lugar dentro de una cadena de valor establecida o un nuevo mercado para una solución probada. Nuestro trabajo es encontrar dónde está esa oportunidad y qué se necesita para desarrollarla.
667 millones de habitantes · US$7.4 billones de PIB [D1, D2]
*Nota de fuente (publicar):* América Latina y el Caribe, 2025. Fuente: Banco Mundial.
*Enlace:* Explora la oportunidad → Por qué América Latina

**Validar la oportunidad. Construir el negocio. Escalar lo que funciona.**
*   **Validate.** Investigamos la oportunidad, conversamos con posibles clientes y aliados, evaluamos las alternativas comerciales y probamos los supuestos que importan. Juntos usamos la evidencia para decidir cómo avanzar.
*   **Build.** Convertimos la estrategia en una presencia local: desarrollamos relaciones comerciales, construimos la ruta de entrada, organizamos las capacidades operativas e incorporamos a los especialistas que el negocio requiere.
*   **Scale.** Seguimos desarrollando el negocio conforme crece, fortaleciendo la ejecución comercial, el liderazgo local y las capacidades que necesita para su siguiente etapa.
*Enlace:* Conoce cómo funciona la alianza → Cómo trabajamos

**Las relaciones y capacidades que tu negocio necesita**
Entrar a un mercado requiere más que entender su tamaño. Requiere saber quiénes son los clientes, cómo se toman las decisiones, qué relaciones importan y cómo se atenderá al mercado.
Alva desarrolla esas conversaciones y reúne el trabajo alrededor de un plan compartido. Desde posibles compradores y aliados de canal hasta talento local y apoyo especializado, construimos las relaciones y capacidades que convierten una oportunidad de mercado en un negocio.

**Conoce a las personas detrás de Alva**
*(Editorial UI: Igual que en inglés)*
**Emilio Rivas Garin**
Emilio cuenta con más de una década de experiencia en desarrollo de negocio, finanzas y operaciones en Estados Unidos y México. Ha construido equipos y capacidades regionales desde México y ha dirigido una organización multidisciplinaria de más de 30 profesionales que daba apoyo a las Américas. Cuenta con un Executive MBA del IPADE Business School.

**Edgar Hintze** *(Condicionado por Feature Flag)*
Edgar tiene experiencia en crecimiento comercial, retail y comercio electrónico en canales de venta de México y Estados Unidos, con trayectoria en Amazon, Logitech y Kellogg’s. Como General Manager para México de Amplified Industries, trabaja en la apertura del mercado mexicano. Cuenta con un Executive MBA del IPADE Business School.
*Enlace:* Conoce al equipo → Nosotros

**Construyamos lo que sigue.**
Ya sea que tengas un mercado en mente o que estés empezando a explorar América Latina, queremos conocer tu negocio y conversar sobre lo que su crecimiento en la región podría significar.
*CTA:* Hablemos de tu expansión → Conversemos

### Página 2 · Cómo trabajamos
**Una alianza construida para avanzar.**
Cada empresa y cada oportunidad de expansión son distintas. Nuestro enfoque da claridad al camino y deja espacio para adaptar el trabajo a la oportunidad.
Validate · Build · Scale conecta la primera conversación con las relaciones, capacidades y ejecución necesarias para desarrollar un negocio en un nuevo mercado. Al final de cada paso revisamos juntos la evidencia y decidimos el siguiente.

**VALIDATE: Entender la oportunidad**
**1. Initial Fit**
Empezamos por conocer tu negocio, tus ambiciones y las preguntas detrás de tu interés en América Latina. Juntos exploramos si hay una oportunidad que valga la pena analizar y si Alva es el socio adecuado para desarrollarla.
No necesitas un plan de expansión terminado ni un equipo local para empezar. Por favor, mantén la conversación inicial sin información confidencial. Podemos acordar términos de confidencialidad antes de hablar de temas sensibles.
**2. Readiness Review**
Revisamos el negocio, el mercado o los mercados que consideras y los supuestos que podrían definir la oportunidad. Juntos establecemos qué hay que probar, qué información nos ayudará a decidir y el alcance de la validación. Los términos de confidencialidad se fijan antes de compartir información sensible.
**3. Market Validation Sprint**
Alva lidera las conversaciones con posibles clientes, aliados y otros actores relevantes del mercado. Evaluamos necesidades, comportamiento de compra, alternativas competitivas, precios, canales y las condiciones comerciales y operativas que podrían afectar al negocio. Tú aportas conocimiento del producto y experiencia comercial, y participas en las conversaciones que importan.
El resultado es una visión clara de la oportunidad y una recomendación respaldada por evidencia: avanzar, ajustar el enfoque o decidir no continuar.

**BUILD: Convertir la oportunidad en un negocio**
**4. Local Build**
Una vez que decidimos juntos avanzar, Alva lidera el trabajo necesario para construir una presencia local. Según la oportunidad, esto puede incluir desarrollar relaciones con clientes y canales, organizar roles locales e incorporar a las personas que los ocupan, construir procesos operativos y coordinar el trabajo legal, fiscal, regulatorio y de otros especialistas con los profesionales adecuados.
Juntos definimos el modelo comercial, las prioridades y los compromisos clave. Alva reúne a las personas y las líneas de trabajo alrededor de un plan de implementación con hitos claros que tu equipo puede seguir.

**SCALE: Desarrollar el negocio y sus capacidades locales**
**5. Operating Partnership**
Conforme el negocio se desarrolla, Alva continúa liderando el trabajo comercial y operativo local donde una relación continua tiene sentido: fortalece relaciones, coordina capacidades, reporta contra las metas que definimos juntos y ayuda a construir el equipo necesario para la siguiente etapa, incluida tu propia organización local cuando sea el momento.
La alianza evoluciona alrededor de las necesidades del negocio y de las oportunidades que decidimos desarrollar juntos.

**Un equipo conectado con el negocio**
El contexto importa. El conocimiento, las relaciones y las decisiones que se desarrollan durante la validación acompañan la construcción y el crecimiento del negocio.
Trabajas directamente con el equipo de Alva durante la alianza. Conforme tu negocio se desarrolla, incorporamos y coordinamos a los especialistas que necesita, mientras nos mantenemos personalmente involucrados en el trabajo.

**Preguntas frecuentes**
*   **¿Necesitamos haber elegido un país?** No. Puedes tener un mercado específico en mente, varios mercados que comparar o un interés inicial en explorar la región. Podemos empezar por definir la oportunidad que vale la pena probar.
*   **¿Podemos evaluar más de un mercado?** Sí. Algunas empresas empiezan por un país; otras buscan una visión regional desde el inicio. Diseñamos el enfoque alrededor del negocio y de las preguntas que hay que responder, y construimos las capacidades locales que cada mercado requiere conforme se desarrolla la oportunidad.
*   **¿Necesitamos un equipo local primero?** No. Alva lidera el trabajo local y reúne las capacidades que requiere la oportunidad. Desarrollar un equipo local propio puede ser parte del negocio conforme crece.
*   **¿Una startup en etapa temprana puede hablar con Alva?** Sí. Una primera conversación nos ayuda a entender el negocio, su etapa y si existe una oportunidad que podamos desarrollar juntos.
*   **¿Alva es un fondo de venture capital?** No. Alva es un Business Expansion Partner que ayuda a las empresas a validar oportunidades y liderar su expansión en América Latina.
*   **¿Garantizan clientes o acceso al mercado?** Nos hacemos responsables del trabajo: probar la oportunidad con rigor, desarrollar las relaciones correctas y liderar la ejecución. Las decisiones de compra, las autorizaciones y los resultados comerciales dependen del mercado y de tu empresa.
*   **¿Cuánto tiempo toma?** Depende de la pregunta y del mercado. Definimos juntos el alcance y los tiempos antes de cada paso, y te avisamos pronto si la evidencia apunta a una respuesta clara.

*CTA:* Hablemos de tu expansión → Conversemos

### Página 3 · Por qué América Latina
**Una visión regional. Una estrategia para cada mercado.**
América Latina ofrece a las empresas la oportunidad de llegar a nuevos clientes, desarrollar relaciones estratégicas y construir nuevas fuentes de crecimiento.
Cada mercado tiene sus propios clientes, canales, prácticas de negocio y condiciones operativas. Esa diversidad pide una estrategia que conecte tu ambición regional con las oportunidades específicas que tu negocio puede atender, ya sea que empieces por un país o mires varios.

**Una región con escala**
América Latina y el Caribe reunía aproximadamente 667 millones de habitantes y representaba una economía de US$7.4 billones en 2025. [D1, D2]
Las cifras muestran la escala de la región. La oportunidad para tu negocio depende de identificar los clientes, las aplicaciones y los modelos comerciales que tienen sentido para tu oferta.
*Nota de fuente (publicar):* Banco Mundial, 2025. Las cifras regionales incluyen el Caribe.

**Qué podría significar la región para tu negocio**
*   **Nuevos clientes.** Empresas o consumidores que enfrentan un problema que tu producto o servicio puede resolver, y una comprensión de cómo toman sus decisiones de compra.
*   **Cadenas de valor existentes.** Oportunidades con compradores, proveedores y aliados que ya operan e invierten en la región, que desarrollan sus propias capacidades y necesitan soluciones para hacerlo.
*   **Nuevos canales y alianzas.** La combinación de relaciones directas, socios comerciales, distribuidores o canales digitales que se ajusta a tu negocio.
*   **Capacidades locales.** El apoyo comercial, operativo y especializado necesario para atender a los clientes y crecer con confianza.

**De la actividad regional a una oportunidad comercial**
América Latina y el Caribe recibió aproximadamente US$194 mil millones de inversión extranjera directa en 2025, cifra que incluye la reinversión de empresas ya presentes en la región. [D3]
Para una empresa que busca expandirse, la pregunta importante es dónde se traduce esa actividad en clientes, proyectos o aliados relevantes, y si tu solución responde a sus necesidades.
*Nota de fuente (publicar):* CEPAL, informe de 2026 sobre la inversión de 2025. Las cifras regionales incluyen el Caribe.

**Mercados conectados**
En 2025, 84% de la población de América Latina y el Caribe usó internet. [D11] Los canales digitales pueden sostener el descubrimiento de clientes, la venta y el servicio antes de que exista una presencia física. Las expectativas de los clientes, las prácticas de pago y el papel de los aliados locales siguen variando por país, y forman parte de lo que validamos.
*Nota de fuente (publicar):* Banco Mundial, 2025. Las cifras regionales incluyen el Caribe.

**Cómo podría verse**
*(Editorial: publicar la etiqueta «Ejemplos ilustrativos. No son clientes ni proyectos realizados.»)*
*   **Una empresa industrial.** La pregunta es qué compradores necesitan su producto, cómo lo adquieren hoy y qué entrega o servicio esperan. Lo evaluaríamos con compradores potenciales y con los canales que los atienden. Si la oportunidad lo justifica, Alva desarrollaría las relaciones comerciales, construiría la ruta de entrada y lideraría el lanzamiento.
*   **Una startup de software.** La pregunta es quién enfrenta el problema que resuelve el producto, cómo compra, si el precio se sostiene y qué implementación y soporte necesita. Lo exploraríamos en uno o varios mercados. Si la evidencia lo respalda, Alva construiría la presencia comercial que requiera la oportunidad y desarrollaría los primeros clientes y aliados.
*   **Una firma de servicios especializados.** La pregunta es quién le confiaría su servicio localmente, cómo se entregaría y con quién. Identificaríamos clientes potenciales y aliados de prestación y evaluaríamos los requisitos locales. Si el caso se sostiene, Alva desarrollaría las primeras relaciones con clientes y pondría en marcha el modelo comercial y operativo para atender el mercado.

**Empecemos por la oportunidad.**
Tal vez ya tienes un mercado en mente, o estás decidiendo si América Latina debe formar parte de tus planes de crecimiento. Podemos empezar por identificar las preguntas que importan.
*CTA:* Hablemos de tu expansión → Conversemos

### Página 4 · Nosotros
**Construidos para desarrollar negocios juntos.**
Alva reúne criterio de negocio, perspectiva internacional y ejecución local para ayudar a las empresas a construir y crecer en América Latina.
Creemos que una expansión es más sólida cuando las personas detrás del negocio y quienes lideran el trabajo en el mercado comparten una visión, intercambian perspectivas y toman juntas las decisiones importantes. Así trabajamos.

**Lo que reunimos**
*   **Desarrollo de negocio.** Entender la oportunidad, abrir las conversaciones correctas y construir relaciones alrededor de un propósito comercial claro.
*   **Criterio comercial y financiero.** Probar la demanda, los precios, los canales y la economía del negocio para que las decisiones de crecimiento tengan una base sólida.
*   **Ejecución local.** Convertir la estrategia en un plan operativo, desarrollar las capacidades necesarias y liderar el trabajo conforme el negocio toma forma.
*   **Experiencia especializada.** Integrar a los especialistas comerciales, legales, fiscales, regulatorios y operativos que requiere cada oportunidad, bajo la coordinación de Alva.

**Qué significa aliarse con Alva**
Aliarse con Alva significa desarrollar el negocio juntos. Evaluamos la oportunidad contigo, decidimos los compromisos contigo y después lideramos el lanzamiento local, incorporando y coordinando a las personas y los especialistas que requiere, y seguimos construyendo conforme el negocio evoluciona. Nos comprometemos con el negocio, no solo con un alcance de trabajo. La forma de cada alianza la define la oportunidad y la acordamos juntos antes de que empiece cada paso.

**Conoce al equipo**
*(Editorial: Igual que en inglés. Condicionar perfil de Edgar)*
**Emilio Rivas Garin**
Emilio cuenta con más de una década de experiencia en desarrollo comercial, finanzas y operaciones en Estados Unidos y México. Su trayectoria incluye la creación de equipos regionales y capacidades operativas con base en México dentro de una multinacional del sector de salud visual, así como la dirección de una organización multidisciplinaria de más de 30 profesionales que daba apoyo a Norteamérica y las Américas.
Su experiencia abarca planeación de negocio, precios, gestión de ingresos, análisis de datos y operaciones comerciales. Antes, dirigió ventas, desarrollo de negocio y relaciones con clientes en una agencia de servicios de marketing en Miami.
Tiene su base en Ciudad de México, cuenta con un Executive MBA del IPADE Business School y trabaja en inglés y español.

**Edgar Hintze** *(Condicionado por Feature Flag)*
Edgar tiene experiencia en crecimiento comercial, retail y comercio electrónico en canales de venta de México y Estados Unidos. Actualmente es General Manager para México de Amplified Industries, donde trabaja en la apertura del mercado mexicano.
Antes fue Direct to Consumer Manager en Logitech México y gestionó cuentas de comercio electrónico en Estados Unidos con Amazon y Walmart para Mobi Muebles. En Amazon México trabajó en reclutamiento y gestión de proveedores, incluida la categoría de monitores. Anteriormente, en Kellogg’s, manejó cuentas clave de retail con presupuestos anuales de ventas de hasta MXN 320 millones.
Estudió Negocios Internacionales en la Universidad Anáhuac, cuenta con un Executive MBA del IPADE Business School y trabaja en inglés y español.

**Cómo trabajamos contigo**
Definimos juntos el trabajo y las responsabilidades antes de comprometer recursos. Distinguimos la evidencia de los supuestos, y decimos cuándo la evidencia apunta a detenerse. Manejamos la información sensible bajo términos de confidencialidad. Mantenemos el contexto, la coordinación y la continuidad de la validación a la construcción y más allá. Y recomendamos el siguiente compromiso solo cuando la evidencia lo respalda.
*CTA:* Hablemos de tu expansión → Conversemos

### Página 5 · Conversemos
**Exploremos lo que podemos construir juntos.**
Cuéntanos de tu negocio y del crecimiento que quieres explorar en América Latina. Ya sea que tengas un mercado en mente o que consideres la región por primera vez, podemos empezar con una conversación sobre la oportunidad.
No necesitas un plan terminado ni un equipo local. Una descripción breve y no confidencial es suficiente para empezar.

**Cuéntanos de tu negocio**
*Introducción del formulario (publicar):* Comparte una descripción no confidencial. Fijaremos términos de confidencialidad antes de hablar de cualquier tema sensible.
*(Implementar lógica de Parte C)*
*Botón:* Enviar mensaje

**¿Qué sigue?**
Revisaremos tu mensaje y definiremos un siguiente paso útil, normalmente una conversación introductoria o una solicitud de un poco más de contexto. Ningún trabajo de proyecto empieza hasta que hayamos definido juntos la pregunta, el alcance y las condiciones.

**¿Quieres referir una empresa o proponer una colaboración?**
Usa el mismo formulario y selecciona el tipo de consulta. Para una referencia, cuéntanos de la empresa y por qué crees que vale la pena explorar el encaje. Para una colaboración, dinos qué aportas y en qué tipo de proyecto aplicaría.

*Mensaje de confirmación (publicar):* Gracias. Recibimos tu mensaje y te contactaremos sobre el siguiente paso.
*Mensaje de error (publicar):* No pudimos enviar tu mensaje. Inténtalo de nuevo. Tus respuestas se conservaron en esta página.
*Reconocimiento de privacidad (publicar):* He leído el Aviso de Privacidad.

---

## 7. Lógica del Formulario (Componente Frontend/Backend)
**Instrucción para Frontend:** Crear lógica condicional estricta. Conservar las respuestas ingresadas por el usuario si ocurre un error de envío (estado persistente).

**Campos y Reglas (Implementar en EN y ES):**
1.  **Tipo de consulta (Select - Obligatorio):**
    *   *Opciones:* I want to explore an expansion / Quiero explorar una expansión | I want to refer a company / Quiero referir una empresa | I want to propose a collaboration / Quiero proponer una colaboración | Other / Otro
    *   *Comportamiento:* Esta selección cambia los textos de ayuda (hints) del campo "Descripción" y muestra/oculta campos opcionales.
2.  **Nombre (Texto - Obligatorio):** Full name / Nombre completo
3.  **Correo (Email - Obligatorio):** Email / Correo electrónico (Validar formato regex).
4.  **Empresa o proyecto (Texto - Opcional):** Company or project / Empresa o proyecto. Mostrar en todos los tipos.
5.  **Mercados que consideras (Texto - Opcional):** Market or markets you are considering / Mercado o mercados que consideras. *Ayuda:* «One country, several, or not sure yet» / «Un país, varios, o por definir».
6.  **Descripción (Textarea - Obligatorio):** What would you like to explore? / ¿Qué te gustaría explorar?
    *   *Regla:* Límite visible de 800 caracteres.
    *   *Ayuda condicional (Expansión):* Describe your company or project, its stage, and what you would like to explore in Latin America. / Describe tu empresa o proyecto, en qué etapa se encuentra y qué te gustaría explorar en América Latina.
    *   *Ayuda condicional (Referencia):* Describe the company and why the fit seems worth exploring. No need to name individuals. / Describe la empresa y por qué crees que vale la pena explorar el encaje. No hace falta nombrar personas.
    *   *Ayuda condicional (Colaboración):* Tell us about the capabilities you bring and the kind of project where they would apply. / Cuéntanos qué capacidades aportas y en qué tipo de proyecto aplicarían.
    *   *Ayuda condicional (Otro):* Tell us briefly what you would like to discuss. / Cuéntanos brevemente qué te gustaría conversar.
7.  **Privacidad (Checkbox - Obligatorio):** I have read the Privacy Notice / He leído el Aviso de Privacidad.
8.  **Sitio web (Texto - Opcional):** Website, if any / Sitio web, si existe. *Mostrar solo en: Expansión y Referencia.*
9.  **Rol (Texto - Opcional):** Your role / Tu rol. *Mostrar solo en: Expansión y Colaboración.*
10. **País de origen (Select/Busqueda - Opcional):** Country where you are based / País donde tienes tu base. *Mostrar solo en: Expansión y Referencia.* Sin valor predeterminado.
11. **Etapa del negocio (Select - Opcional):** Early stage startup / Startup en etapa temprana | Growth stage company / Empresa en crecimiento | Established company / Empresa consolidada. *Mostrar solo en: Expansión.*
12. **Cómo nos conociste (Texto - Opcional):** How did you hear about us? / ¿Cómo supiste de nosotros? *Mostrar en todos los tipos.*

---

## 8. Metadatos SEO y Estructura (Backend/Frontend)
Configurar `layout.tsx` o archivos equivalentes con estos metas para cada idioma.

**Metadatos (Página | Title EN | Title ES):**
*   **Inicio:** Alva · Business Expansion Partner in Latin America | Alva · Business Expansion Partner en América Latina
*   **Cómo trabajamos:** How We Work · Validate, Build, Scale · Alva | Cómo trabajamos · Validate, Build, Scale · Alva
*   **Región:** Why Latin America · Alva | Por qué América Latina · Alva
*   **Nosotros:** About Alva · Built to Develop Business Together | Nosotros · Construidos para desarrollar negocios juntos · Alva
*   **Conversemos:** Start a Conversation · Alva | Conversemos · Alva

**Descriptions EN:**
*   **Inicio:** Alva is your business expansion partner in Latin America. Together we identify the opportunity and shape the strategy; then we build and lead your expansion on the ground.
*   **Cómo trabajamos:** Validate, build and scale: how the partnership develops in five steps, what Alva leads and what we decide together.
*   **Región:** One regional vision and a strategy built for each market: what Latin America can mean for your business and how we turn regional scale into a commercial opportunity.
*   **Nosotros:** Meet the people behind Alva and what partnering with us means: shared decisions, local leadership and a relationship built to last.
*   **Conversemos:** Tell Alva about your business and the growth you want to explore in Latin America. A short, nonconfidential overview is enough to begin.

**Descriptions ES:**
*   **Inicio:** Alva es tu Business Expansion Partner en América Latina. Juntos identificamos la oportunidad y definimos la estrategia; después construimos y lideramos tu expansión en el mercado.
*   **Cómo trabajamos:** Validar, construir y escalar: cómo se desarrolla la alianza en cinco pasos, qué lidera Alva y qué decidimos juntos.
*   **Región:** Una visión regional y una estrategia para cada mercado: qué puede significar América Latina para tu negocio y cómo convertimos la escala regional en una oportunidad comercial.
*   **Nosotros:** Conoce a las personas detrás de Alva y qué significa aliarse con nosotros: decisiones compartidas, liderazgo local y una relación construida para durar.
*   **Conversemos:** Cuéntale a Alva de tu negocio y del crecimiento que quieres explorar en América Latina. Una descripción breve y no confidencial es suficiente para empezar.

---

## 9. Enlaces a Fuentes de Datos (QA y SecDevOps)
Para las menciones en el texto como `[D1, D2]`, debes convertirlas en pequeños enlaces tipo nota al pie en la UI (ejemplo `¹ ², ³`) apuntando a:

*   **D1:** `https://data.worldbank.org/indicator/SP.POP.TOTL?locations=ZJ`
*   **D2:** `https://data.worldbank.org/indicator/NY.GDP.MKTP.CD?locations=ZJ`
*   **D3:** `https://hdl.handle.net/11362/90154`
*   **D11:** `https://data.worldbank.org/indicator/IT.NET.USER.ZS?locations=ZJ`

**Validación QA Final (Checklist):**
- [ ] ¿El formulario conserva datos en caso de error?
- [ ] ¿El formulario funciona por completo con navegación por teclado (Accesibilidad W3C U1)?
- [ ] ¿Están configurados los sitemaps y hreflang correctamente (U2)?
- [ ] ¿Está la variable `NEXT_PUBLIC_SHOW_EDGAR_PROFILE` controlando la vista de la biografía de Edgar?
- [ ] ¿El diseño luce profesional y usa exclusivamente la paleta de colores definida, sin arte generado por IA genérico?
- [ ] ¿Se eliminaron del front-end todos los identificadores en corchetes como `[D1]` sustituyéndolos por links discretos funcionales?