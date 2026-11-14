import { useEffect } from 'react'
import { ArrowRight, BedDouble, Bike, Bookmark, CakeSlice, CalendarDays, Camera, ChefHat, ChevronDown, Coffee, Croissant, Globe2, Heart, MapPin, Menu, MessageCircle, Search, Send, Soup, Sparkles, Star, Truck, Utensils, Video, Wine, X } from 'lucide-react'

const WA_NUMBER = '34631105772'
const EMAIL = 'hola@dania360.com'
const generalMessage = 'Hola, tengo un restaurante en [ciudad] y quiero solicitar la auditoría gratuita de mi web, redes sociales y presencia en Google. ¿Qué necesitáis para empezar?'
const waLink = (message = generalMessage) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`
const floatMessage = 'Hola, tengo un restaurante y quiero información sobre el marketing y la gestión de redes sociales de Dania360.'

// Publicaciones y chat del móvil del hero: ejemplo ilustrativo, no un restaurante real.
const posts = [
  ['arroz', 'Plato del día', 'Arroz meloso de temporada.', 'Hoy a mediodía y por la noche. Reserva por WhatsApp.'],
  ['croqueta', 'Tapa de la semana', 'Croquetas caseras.', 'De jueves a domingo, en barra y terraza.'],
  ['tarta', 'Postre de la casa', 'Tarta de queso al horno.', 'Pregunta por alérgenos al reservar.'],
]
const chat = [
  ['in', 'Hola, ¿tenéis mesa el sábado para 4 a las 21:30?'],
  ['typing'],
  ['out', '¡Hola! Te paso con el equipo para que confirme la mesa. ¿A nombre de quién?'],
  ['in', 'Laura. Una persona es celíaca.'],
  ['typing'],
  ['out', 'Anotado. El restaurante te confirma mesa y opciones sin gluten por WhatsApp.'],
]

const stats = [['30', 'publicaciones al mes'], ['4', 'redes sociales en Growth'], ['15', 'segundos por vídeo'], ['7', 'días a la semana'], ['297', '€/mes, sin permanencia']]

const strategies = [
  ['Carta y horarios iguales en todas partes', 'Si Instagram dice una cosa, Google otra y la web una tercera, el cliente duda. Mantenemos carta, horarios y forma de reservar coherentes en redes, ficha de Google y web.'],
  ['Un plato real cada día', '30 publicaciones al mes con vídeos de 15 segundos: platos, menú, equipo y sala. Con el material que nos envías y piezas creadas con IA que revisamos antes de publicar.'],
  ['Reseñas respondidas con tu tono', 'Las reseñas forman parte de la decisión. Respondemos en Google con la información y el tono que nos facilitas, y el kit QR ayuda a pedir valoraciones en sala.'],
  ['Mensajes que acaban en reserva', 'Atendemos comentarios y mensajes privados y los derivamos a tu teléfono o WhatsApp. Tu equipo confirma mesa, grupos y condiciones.'],
  ['Temporada y fechas clave', 'Menú de verano, terraza, Navidad, San Valentín, partidos o jornadas gastronómicas: el calendario anticipa cada fecha para publicarla a tiempo.'],
  ['Revisar qué genera consultas', 'El informe mensual revisa actividad y visibilidad local. Lo contrastamos con las reservas que registra tu equipo para ajustar el mes siguiente.'],
]

const kinds = [
  { id: 'menu', Icon: Soup, name: 'Restaurante de menú', title: 'Restaurante de menú del día', intro: 'El cliente decide a media mañana. El menú tiene que estar publicado antes de que salga a comer y con la información que necesita.', ideas: ['El menú de hoy con primeros, segundos, postre y precio que confirma cocina.', 'Stories del pase a mediodía y aviso de raciones limitadas cuando tú lo indicas.', 'Menús de grupo y de empresa visibles en la ficha de Google y en la web.'], dest: 'Llamada o WhatsApp para reservar mesa al mediodía.', cta: 'Consultar para mi restaurante de menú', msg: 'Hola, tengo un restaurante de menú del día en [ciudad] y quiero que publiquéis el menú cada día. ¿Cómo lo hacéis?' },
  { id: 'tapas', Icon: Wine, name: 'Tapas y bar', title: 'Bar de tapas, taberna o cervecería', intro: 'Aquí se decide en el momento: qué hay hoy en la barra, si hay terraza y hasta qué hora sirve cocina.', ideas: ['La tapa o el pincho de la semana en un vídeo de 15 segundos.', 'Terraza, partido o evento del fin de semana, con el horario de cocina.', 'Respuestas rápidas a qué hay hoy y a reservas de grupo.'], dest: 'Mensaje o llamada para grupos, celebraciones y terraza.', cta: 'Hablar de mi bar de tapas', msg: 'Hola, tengo un bar de tapas en [ciudad] y quiero dar más vida a nuestras redes sociales. ¿Qué nos proponéis?' },
  { id: 'autor', Icon: ChefHat, name: 'Cocina de autor', title: 'Cocina de autor y menú degustación', intro: 'La reserva se hace con antelación y se compara mucho. Se publica la propuesta, el producto y las personas que hay detrás.', ideas: ['El menú degustación explicado pase a pase, con temporada y producto.', 'Cocina y sala presentadas con material autorizado del equipo.', 'Reseñas de Google respondidas con cuidado y con el tono de la casa.'], dest: 'El sistema de reservas que ya utiliza el restaurante.', cta: 'Hablar de mi cocina de autor', msg: 'Hola, tengo un restaurante de cocina de autor en [ciudad] y quiero cuidar nuestra imagen en redes sociales y Google. ¿Hablamos?' },
  { id: 'delivery', Icon: Bike, name: 'Delivery', title: 'Delivery y comida para llevar', intro: 'El pedido se decide en un minuto. Horario, zona y forma de pedir tienen que estar claros en cada publicación.', ideas: ['Combos y novedades con enlace al canal de pedidos que ya utilizas.', 'Horario de pedidos y zona de reparto actualizados en Google y en la web.', 'Vídeos cortos del producto recién hecho y bien empaquetado.'], dest: 'Tu teléfono, WhatsApp o la plataforma de pedidos que uses. No gestionamos el reparto.', cta: 'Hablar de mi delivery', msg: 'Hola, tengo un restaurante con delivery y comida para llevar en [ciudad] y quiero que las redes sociales nos traigan más pedidos. ¿Cómo trabajáis?' },
]

const week = [
  ['Lun', 'Menú de la semana', 'Platos y precio que confirma cocina, en publicación y stories.'],
  ['Mar', 'Detrás de la cocina', '15 segundos de mise en place o del pase.'],
  ['Mié', 'Plato estrella', 'Cómo se emplata y qué lo hace distinto.'],
  ['Jue', 'Plan de fin de semana', 'Reserva por WhatsApp para viernes y sábado.'],
  ['Vie', 'Sala y ambiente', 'Terraza, barra o comedor con material autorizado.'],
  ['Sáb', 'El equipo', 'Quién cocina y quién atiende, si quieren salir.'],
  ['Dom', 'Reseña respondida', 'Una opinión de Google y cómo la contestamos.'],
]
const dishes = ['Arroz meloso de temporada', 'Croquetas caseras', 'Menú del día con postre', 'Tarta de queso al horno']

const networks = [
  [Camera, 'Instagram', 'La carta visual: publicaciones y stories con platos, menú del día y ambiente. El perfil enlaza a reservar.'],
  [Video, 'TikTok', 'Vídeos de 15 segundos de cocina, sala y producto para que te descubran en tu zona.'],
  [Heart, 'Facebook', 'Público local, eventos y menús de grupo. También atendemos sus comentarios y mensajes.'],
  [Bookmark, 'Pinterest', 'Ideas de celebraciones, brunch o postres que llevan a tu web y a tu carta.'],
  [MapPin, 'Perfil de Empresa en Google', 'Horarios, carta, fotos y reseñas: donde se compara antes de ir. Incluido desde Growth.'],
]

const related = [
  [Coffee, 'Cafeterías', '/gestion-redes-sociales-cafeterias/', 'Desayunos, brunch y meriendas.'],
  [Truck, 'Food trucks', '/gestion-redes-sociales-food-trucks/', 'Ubicación y horario de cada día.'],
  [Utensils, 'Catering', '/gestion-redes-sociales-catering/', 'Eventos, bodas y empresas.'],
  [Croissant, 'Panaderías', '/gestion-redes-sociales-panaderias/', 'Horneado del día y encargos.'],
  [CakeSlice, 'Pastelerías', '/gestion-redes-sociales-pastelerias/', 'Tartas por encargo y temporada.'],
  [BedDouble, 'Hoteles', '/gestion-redes-sociales-hoteles/', 'Estancias, restaurante y eventos.'],
]

const plans = [
  {
    name: 'Starter',
    price: '99',
    tagline: 'Tu página web profesional con chat inteligente, kit QR de reseñas para Google Maps, dominio y hosting incluidos.',
    networks: 'Web · Chat inteligente · Kit QR de reseñas',
    content: [
      [
        'Web',
        'profesional'
      ],
      [
        'Chat',
        'inteligente'
      ]
    ],
    features: [
      'Página web profesional: nueva, inspirada en una referencia que elijas o migrada desde tu web actual.',
      'Mantenimiento y optimización para buscadores de tu página web.',
      'Chat en tu página web: responde a tus clientes desde tu móvil con la app DANIA.',
      'Modo automático: la Inteligencia Artificial responde por ti cuando no estás disponible.',
      'Kit QR de reseñas para Google Maps: consigue más valoraciones de tus clientes.',
      '1 actualización mensual de tu página web.',
      'Dominio .com incluido.',
      'Hosting incluido, sin gastos ocultos.'
    ]
  },
  {
    name: 'Growth',
    price: '297',
    tagline: 'Todo lo del Starter más tus redes sociales activas cada día con vídeos de 15 segundos y comentarios, mensajes y reseñas gestionados.',
    networks: 'Instagram · Facebook · TikTok · Pinterest · Google',
    content: [
      [
        '30',
        'publicaciones al mes'
      ],
      [
        '15 s',
        'por vídeo'
      ]
    ],
    popular: true,
    features: [
      '1 publicación al día en Instagram, Facebook, TikTok y Pinterest, los 7 días de la semana (30 al mes), con vídeos de 15 segundos.',
      'Google Business Profile gestionado por nuestro equipo.',
      'Respondemos los comentarios de las plataformas incluidas en tu plan.',
      'Gestionamos los mensajes privados para ayudarte a generar más reservas y oportunidades.',
      'Gestión y respuesta de reseñas en Google.',
      'Derivación de clientes potenciales a tu teléfono, WhatsApp o canal de contacto preferido.',
      'Informe mensual de actividad y visibilidad local.',
      'Todo lo incluido en Starter: página web con chat inteligente, kit QR de reseñas, 1 actualización web al mes, dominio .com y hosting.'
    ]
  },
  {
    name: 'Scale',
    price: '497',
    tagline: 'Todo lo del Growth más LinkedIn, X y YouTube con vídeos de 30 segundos, optimización para ChatGPT y buscadores y SEO continuo.',
    networks: 'Instagram · Facebook · TikTok · LinkedIn · X · YouTube · Pinterest · Google',
    content: [
      [
        '30',
        'publicaciones al mes'
      ],
      [
        '30 s',
        'por vídeo'
      ]
    ],
    features: [
      '1 publicación al día en Instagram, Facebook, TikTok, LinkedIn, X, YouTube y Pinterest, los 7 días de la semana (30 al mes), con vídeos de 30 segundos.',
      'Optimización para buscadores con Inteligencia Artificial, como ChatGPT.',
      'Posicionamiento SEO continuo de tu página web.',
      'Adaptación del contenido para LinkedIn, X y YouTube.',
      'Google Business Profile gestionado por nuestro equipo.',
      'Gestión y respuesta de reseñas en Google.',
      'Gestión prioritaria de comentarios y mensajes privados.',
      'Datos estructurados para facilitar la comprensión de tu negocio por parte de buscadores.',
      'Informe mensual de posicionamiento y visibilidad.',
      'Todo lo incluido en Growth y Starter: página web con chat inteligente, kit QR de reseñas, 1 actualización web al mes, dominio .com y hosting.'
    ]
  }
]

const services = [
  { icon: Globe2, title: 'Web con carta y bot de IA incluida en Growth', text: 'Web profesional con carta, horarios y contacto. El bot responde información general cuando no estás disponible; también puedes contestar desde el móvil con la app DANIA.' },
  { icon: Sparkles, title: 'Publicaciones sobre carta, equipo y ambiente', text: 'Desde Growth creamos, revisamos y publicamos contenido sobre platos, menús, equipo, eventos y novedades del restaurante.' },
  { icon: MapPin, title: 'Ficha de Google y reseñas desde Growth', text: 'Gestionamos tu perfil de empresa y respondemos reseñas para mantener información útil y actualizada.' },
  { icon: MessageCircle, title: 'Comentarios, mensajes y consultas', text: 'Gestionamos la conversación y derivamos las consultas a tu teléfono, WhatsApp o canal de contacto preferido.' },
  { icon: Star, title: 'Respuestas a reseñas con tu tono', text: 'Respondemos reseñas y comentarios de acuerdo con la información y el tono que nos facilites.' },
  { icon: Search, title: 'SEO continuo con Scale', text: 'Con Scale trabajamos la web y sus datos estructurados para facilitar su comprensión por buscadores.' },
]

const faqs = [
  ['¿Cómo puede Dania360 ayudar a mi restaurante?', 'Hacemos que tu restaurante tenga una presencia profesional y constante en la web, las redes sociales y Google. Así aumentan las posibilidades de que más personas te encuentren, confíen y contacten o reserven.'],
  ['¿Qué hace una agencia de marketing para restaurantes?', 'Planifica y publica el contenido del restaurante, atiende comentarios y mensajes, cuida la ficha de Google y las reseñas y mantiene la carta, los horarios y la forma de reservar iguales en todos los canales. En Dania360, Growth incluye además la web con bot de IA. Tu equipo confirma platos, precios, alérgenos y reservas.'],
  ['¿Qué redes sociales debe usar un restaurante?', 'Instagram suele ser la base para platos, ambiente y stories del día; TikTok sirve para vídeos cortos de cocina y sala; Facebook ayuda con el público local y los eventos, y Pinterest con ideas de celebraciones y postres. Además, la ficha de Google es donde muchos clientes comparan horarios, carta y reseñas. Growth incluye las cuatro redes y la ficha de Google.'],
  ['¿Qué estrategias de marketing funcionan mejor en un restaurante?', 'Las que dan información fiable y constante: carta y horarios actualizados en web, Google y redes, un contenido al día con platos y equipo reales, reseñas respondidas, mensajes que llegan al canal de reservas y un calendario con temporada y eventos. No prometemos una cifra de reservas: revisamos cada mes qué contenido genera consultas.'],
  ['¿Cuánto cuesta una agencia de marketing para restaurantes?', 'Depende de lo que incluya cada propuesta. En Dania360, Growth cuesta 297 € al mes con 30 publicaciones, mensajes, reseñas, ficha de Google, web y bot de IA, y Scale cuesta 497 € al mes, sin permanencia. La inversión en anuncios no está incluida en ningún plan, así que conviene comparar propuestas con el mismo alcance.'],
  ['¿Gestionáis publicidad pagada?', 'No. En este momento nuestros planes se centran en presencia orgánica, contenido, web, Google Business Profile, reputación y posicionamiento. El presupuesto de tu plan no se destina a anuncios.'],
  ['¿Necesito tener ya una página web?', 'No. Growth, por 297 €/mes, incluye una web profesional con bot de IA, dominio .com, hosting y una actualización mensual. Si ya tienes una web compatible, revisamos cómo gestionarla. El bot atiende información general y tú puedes contestar desde la app DANIA; no confirma reservas ni disponibilidad de mesas sin el sistema o la validación del restaurante.'],
  ['¿Ayudáis a aparecer en Google y Google Maps?', 'Sí. Desde Growth trabajamos Google Business Profile, publicaciones y reseñas. Scale añade posicionamiento SEO continuo y optimización para buscadores con IA como ChatGPT.'],
  ['¿Garantizáis un número concreto de reservas?', 'No sería serio prometer una cifra exacta. Nuestro trabajo es aumentar tu visibilidad, mejorar tu imagen y crear más oportunidades de contacto. Los resultados dependen de la zona, la propuesta, la competencia y el tiempo de trabajo.'],
  ['¿Tengo que crear yo las fotos, vídeos y textos?', 'Necesitaremos la información y el material real que quieras compartir. También creamos imágenes y contenido con IA, y nuestro equipo revisa y adapta cada pieza antes de publicarla.'],
  ['¿Hay permanencia?', 'No. El servicio es mensual y puedes cancelar cuando quieras. No hay contratos largos ni gastos ocultos.'],
  ['¿Cómo empezamos?', 'Nos escribes por WhatsApp, conocemos tu restaurante y te recomendamos el plan que tenga sentido. Después conectamos tus canales y preparamos el calendario de trabajo.'],
  ['¿Cuánto cuesta la gestión de redes sociales para un restaurante?', 'La gestión de redes sociales empieza en Growth por 297 € al mes; Scale cuesta 497 € al mes. Starter cuesta 99 € al mes e incluye web, chat y kit QR de reseñas, pero no gestión de redes sociales.'],
  ['¿Cómo medís si la estrategia genera oportunidades de reserva?', 'Seguimos llamadas, conversaciones por WhatsApp, clics para reservar, solicitudes de indicaciones y consultas desde Google. También analizamos qué contenidos impulsan visitas a la carta, guardados, compartidos y contactos con intención real.'],
  ['¿Podéis promocionar la carta, menús, eventos y pedidos online?', 'Sí. El calendario puede incluir platos, menús de temporada, eventos, novedades y llamadas a reservar o pedir. Enlazamos los canales de reserva o pedido que ya utilice el restaurante, pero no gestionamos la operativa interna de cocina, sala o reparto.'],
]

// Iconos de WhatsApp y de confirmación como máscaras CSS: el dibujo se define una
// sola vez en index.css y no se repite en cada botón (presupuesto del HTML).
function WhatsAppIcon({ size = 20 }) {
  return <i className="wa-ico" style={size === 20 ? undefined : { width: size, height: size }} aria-hidden="true" />
}

function Check() {
  return <i className="tick" aria-hidden="true" />
}

function Brand({ dark = false }) {
  return <a className={`brand ${dark ? 'brand-dark' : ''}`} href="/" aria-label="Dania360, página principal"><img className="brand-logo" src="/logo-dania360-orange-black.webp" width="42" height="42" alt="" /><span>DANIA</span><b>360</b><small>para restaurantes</small></a>
}

function Navbar() {
  return <header className="nav-wrap"><nav className="navbar" aria-label="Navegación principal">
    <Brand dark />
    <div className="nav-links">
      <a href="#estrategias">Estrategias</a><a href="#tipos">Tipos de local</a><a href="#ideas">Ideas</a><a href="#planes">Planes</a><a href="#faq">Preguntas</a>
    </div>
    <a className="button nav-cta" href={waLink()} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} /> Pide tu auditoría gratis</a>
    <details className="mobile-nav" data-mobile-nav="">
      <summary className="menu-button" aria-label="Menú de navegación"><Menu className="menu-icon-open" aria-hidden="true" /><X className="menu-icon-close" aria-hidden="true" /></summary>
      <div className="mobile-nav__links">
        <a href="#estrategias">Estrategias</a><a href="#tipos">Tipos de local</a><a href="#ideas">Ideas de contenido</a><a href="#servicios">Qué gestionamos</a><a href="#planes">Planes</a><a href="#faq">Preguntas</a>
        <a className="nav-mobile-cta" href={waLink()} target="_blank" rel="noreferrer"><WhatsAppIcon /> Pide tu auditoría gratis</a>
      </div>
    </details>
  </nav></header>
}

function Hero() {
  return <section className="hero hero-section hero--static" id="inicio">
    <div className="hero-shade" />
    <div className="hero-inner"><div className="hero-copy">
      <nav className="seo-breadcrumbs" aria-label="Migas de pan"><a href="/">Inicio</a><span aria-hidden="true">›</span><a href="/gestion-redes-sociales/">Gestión de redes sociales</a><span aria-hidden="true">›</span><span aria-current="page">Restaurantes</span></nav>
      <span className="eyebrow"><i /> Especialistas en restaurantes</span>
      <h1>Marketing para restaurantes{' '}<em>en redes sociales</em></h1>
      <p>Somos la agencia de marketing para restaurantes que publica tu carta cada día en Instagram, Facebook, TikTok y Pinterest, atiende los mensajes y envía las peticiones de reserva al canal que confirma tu equipo.</p>
      <div className="hero-offer"><span>Growth</span><strong>297 <small>€/mes</small></strong><p>Redes, web con carta y bot de IA incluidos.</p></div>
      <div className="hero-actions"><a className="button button-primary" href={waLink()} target="_blank" rel="noreferrer" data-cta="restaurant-hero"><WhatsAppIcon /> Pide tu auditoría gratis <ArrowRight size={18} /></a><a className="button button-ghost" href="#growth">Qué incluye Growth por 297 €/mes</a></div>
      <small className="cta-note">Revisamos tu presencia actual · Sin compromiso</small>
      <div className="trust-row"><span><Check /> Sin permanencia</span><span><Check /> Todo gestionado</span><span><Check /> Contenido revisado</span></div>
    </div><PhoneDemo /></div>
  </section>
}

function PhoneDemo() {
  return <figure className="hero-stage" aria-label="Ejemplo ilustrativo: publicaciones de platos y chat de reservas">
    <div className="phone tilt">
      <div className="phone__profile"><b>TR</b><span><strong>turestaurante</strong><small>Publicado hoy</small></span><i className="phone__live">En directo</i></div>
      <div className="feed" data-cycle="" data-ms="3400">{posts.map(([kind, tag, title, text]) => <article className="post" key={kind}><div className={`plate plate--${kind}`}><span>{tag}</span></div><p><strong>{title}</strong> {text}</p></article>)}</div>
      <div className="phone__actions" aria-hidden="true"><Heart /><MessageCircle /><Send /><Bookmark /></div>
    </div>
    <div className="chat">
      <p className="chat__head"><MessageCircle aria-hidden="true" /> Mensajes · Reservas</p>
      <ol className="chat__list" data-cycle="stack" data-ms="1700">{chat.map(([who, text], index) => who === 'typing' ? <li className="chat__typing" data-typing="" key={index} aria-hidden="true"><i /><i /><i /></li> : <li className={`chat__msg chat__msg--${who}`} key={index}>{text}</li>)}</ol>
    </div>
    <figcaption>Propuesta visual de Dania360. No corresponde a un restaurante real.</figcaption>
  </figure>
}

function Stats() {
  return <section className="stats" aria-label="Lo que incluye Growth para un restaurante"><ul>{stats.map(([value, label], index) => <li className="reveal" style={{ '--i': index }} key={label}><b data-count={value}>{value}</b><span>{label}</span></li>)}</ul></section>
}

function Strategies() {
  return <section className="section strategies" id="estrategias" aria-labelledby="strategies-title"><div className="section-heading"><span>Marketing para restaurantes en 2026</span><h2 id="strategies-title">Estrategias de marketing para restaurantes que empiezan por tu carta.</h2><p>Antes de reservar, el cliente mira fotos, horarios, carta y reseñas. Estas son las estrategias que trabajamos cada mes, con información que confirma tu equipo.</p></div>
    <ol className="strategy-grid">{strategies.map(([title, text], index) => <li className="tilt reveal" style={{ '--i': index % 3 }} key={title}><b>{String(index + 1).padStart(2, '0')}</b><h3>{title}</h3><p>{text}</p></li>)}</ol>
  </section>
}

function Kinds() {
  return <section className="section kinds-section" id="tipos" aria-labelledby="kinds-title"><div className="section-heading"><span>Una comanda por tipo de local</span><h2 id="kinds-title">Marketing para cada tipo de restaurante.</h2><p>No se publica igual en un restaurante de menú del día que en un bar de tapas, una cocina de autor o un delivery. Elige tu tipo de local y mira qué priorizamos.</p></div>
    <div className="kinds" data-tabs="">
      <div className="kinds__list" role="tablist" aria-label="Tipos de restaurante">{kinds.map(({ id, Icon, name }, index) => <button type="button" role="tab" id={`tab-${id}`} aria-controls={`panel-${id}`} aria-selected={index === 0} tabIndex={index === 0 ? 0 : -1} key={id}><Icon aria-hidden="true" /><span>{name}</span><i className="kinds__run" /></button>)}</div>
      {kinds.map((kind, index) => <article className="ticket" role="tabpanel" id={`panel-${kind.id}`} aria-labelledby={`tab-${kind.id}`} key={kind.id}>
        <p className="ticket__no">Comanda {index + 1}/4 · {kind.name}</p>
        <h3>{kind.title}</h3><p>{kind.intro}</p>
        <p className="ticket__label">Qué publicamos</p>
        <ul>{kind.ideas.map(idea => <li key={idea}><Check /> <span>{idea}</span></li>)}</ul>
        <p className="ticket__dest"><b>Dónde acaba la conversación:</b> {kind.dest}</p>
        <a className="button button-primary" href={waLink(kind.msg)} target="_blank" rel="noreferrer" data-cta={`restaurant-kind-${kind.id}`}><WhatsAppIcon /> {kind.cta}</a>
      </article>)}
    </div>
  </section>
}

function Board() {
  return <section className="section board-section" id="ideas" aria-labelledby="board-title"><div className="section-heading"><span>Pizarra de contenidos</span><h2 id="board-title">Ideas de marketing para restaurantes: una semana en la pizarra.</h2><p>Un ejemplo de cómo repartimos los temas. Cada semana se ajusta a tu carta, tus turnos y el material que nos envías.</p></div>
    <div className="board-layout">
      <div className="board reveal">
        <div className="board__today"><span>Hoy en la pizarra</span><p className="board__dish" data-cycle="" data-ms="2800">{dishes.map(dish => <b key={dish}>{dish}</b>)}</p><small>Ejemplo · lo confirma tu cocina</small></div>
        <ol className="board__week" data-cycle="" data-ms="2200">{week.map(([day, title, text]) => <li key={day}><span>{day}</span><strong>{title}</strong><small>{text}</small></li>)}</ol>
      </div>
      <aside className="hero-panel reveal" aria-labelledby="plate-preview-title">
        <div className="panel-head"><span>Muestra editorial</span><b>De cocina a redes</b></div>
        <div className="plate-preview"><span className="plate-preview__label">Antes de publicar un plato</span><h3 id="plate-preview-title">El plato abre el apetito. La información ayuda a elegir.</h3><dl>
          <div><dt>Qué servimos</dt><dd>Ingredientes y descripción que confirma cocina.</dd></div>
          <div><dt>Cuándo se ofrece</dt><dd>Días, turnos y condiciones vigentes.</dd></div>
          <div><dt>Cómo consultar</dt><dd>El canal que atiende el restaurante para preguntas y reservas.</dd></div>
        </dl><a href="/recursos/que-publicar-redes-sociales-restaurante/#cambios-carta">Ver cómo corregimos un menú publicado</a><p className="plate-preview__note">Propuesta visual de Dania360. No corresponde a un restaurante real.</p></div>
        <a className="wa-link" href={waLink('Hola, quiero que preparéis el calendario de publicaciones de mi restaurante. Mi ciudad y el enlace a mi carta son:')} target="_blank" rel="noreferrer" data-cta="restaurant-board">Quiero mi calendario de publicaciones</a>
      </aside>
    </div>
  </section>
}

function Networks() {
  return <section className="section networks-section" id="redes" aria-labelledby="networks-title"><div className="section-heading"><span>Mejores redes sociales para restaurantes</span><h2 id="networks-title">Redes sociales para restaurantes: qué publicar en cada una.</h2><p>Growth publica a diario en Instagram, Facebook, TikTok y Pinterest y gestiona tu Perfil de Empresa en Google. Scale añade LinkedIn, X y YouTube, con vídeos de 30 segundos.</p></div>
    <ul className="network-grid">{networks.map(([Icon, name, text], index) => <li className="tilt reveal" style={{ '--i': index }} key={name}><Icon aria-hidden="true" /><h3>{name}</h3><p>{text}</p></li>)}</ul>
  </section>
}

function GrowthSummary() {
  return <section className="sector-offer" id="growth" aria-labelledby="growth-title"><div className="sector-offer__inner">
    <div><p className="sector-offer__label">Growth · Sin permanencia</p><h2 id="growth-title">Redes, carta en la web y bot de IA para tu restaurante</h2><p>El servicio parte de lo que sirves de verdad: carta vigente, horarios, ambiente y forma de reservar. Las consultas llegan al canal que ya utilizas, sin cambiar la operativa de sala.</p><p className="sector-offer__price"><strong>297 €</strong><span>/mes</span></p></div>
    <div><dl>
      <div><dt>Publicaciones y atención de mensajes</dt><dd>1 publicación al día (30 al mes) en Instagram, Facebook, TikTok y Pinterest, con vídeos de 15 segundos. Comentarios y mensajes de los canales incluidos, derivados a tu contacto.</dd></div>
      <div><dt>Web profesional con bot de IA incluido</dt><dd>Chat automático cuando no estás disponible y respuesta desde el móvil con la app DANIA. Dominio .com, hosting, una actualización web mensual y kit QR de reseñas.</dd></div>
      <div><dt>Perfil de Empresa en Google y reseñas</dt><dd>Gestión de la ficha y respuesta a reseñas, con informe mensual de actividad y visibilidad local.</dd></div>
    </dl><p className="sector-offer__scope">No incluye inversión en anuncios, una sesión de fotografía presencial ni un motor de reservas a medida. El restaurante confirma reservas, disponibilidad y alérgenos; el chat no sustituye esa confirmación.</p><a href="#planes">Ver los planes y el alcance completo</a></div>
  </div></section>
}

function HowItWorks() {
  const steps = [['01', 'Revisamos carta y canales actuales', 'Analizamos tu propuesta, zona, horarios, canales y forma de recibir reservas o pedidos.'], ['02', 'Preparamos web y calendario de contenidos', 'Organizamos la información de la web y, desde Growth, el calendario y la ficha de Google según el plan elegido.'], ['03', 'Publicamos y revisamos las consultas', 'Publicamos contenido aprobado, atendemos comentarios y mensajes y revisamos las consultas para ajustar el trabajo siguiente.']]
  return <section className="section how" id="como-funciona"><div className="section-heading"><span>Cómo funciona</span><h2>Cómo organizamos el contenido y la presencia digital de tu restaurante.</h2><p>Partimos de tu carta, tus horarios y el material autorizado para publicar información útil y facilitar la consulta o reserva.</p></div><div className="steps">{steps.map(([num, title, text], index) => <article className="reveal" style={{ '--i': index }} key={num}><b>{num}</b><Utensils /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
}

function Services() {
  return <section className="section services" id="servicios"><div className="section-heading"><span>Todo conectado</span><h2>Marketing digital para restaurantes: web, redes sociales y Google conectados.</h2><p>Growth y Scale incluyen publicaciones, mensajes y ficha de Google. Scale añade SEO continuo. La web con chat y el kit QR están incluidos desde Starter, sin gestión de redes.</p></div><div className="service-grid">{services.map((service, index) => {
    const ServiceIcon = service.icon
    return <article className="reveal" style={{ '--i': index % 3 }} key={service.title}><ServiceIcon /><h3>{service.title}</h3><p>{service.text}</p></article>
  })}</div></section>
}

function RestaurantContentExample() {
  const examples = [
    ['01', 'Carta y propuesta', 'Una pieza explica un plato o menú disponible, su precio y cómo consultar al restaurante por alérgenos. La información sale de la carta vigente, no de imágenes inventadas.'],
    ['02', 'Experiencia real', 'Un vídeo breve muestra el ambiente, el equipo o el servicio con material autorizado. La publicación indica dónde está el local y cuándo abre.'],
    ['03', 'Reserva sin fricción', 'Cada contenido dirige a la vía de reserva o pedido que ya utilice el restaurante. Revisamos clics, consultas y horarios para mejorar el calendario siguiente.'],
  ]
  return <section className="section how" aria-labelledby="restaurant-example-title"><div className="section-heading"><span>Ejemplo de calendario gastronómico</span><h2 id="restaurant-example-title">Qué publicar en las redes sociales de un restaurante para que te elijan.</h2><p>Los temas se ajustan a la carta, los horarios y el material real de cada local. Antes de publicar, el restaurante confirma platos, precios, disponibilidad y condiciones.</p></div><div className="steps">{examples.map(([num, title, text], index) => <article className="reveal" style={{ '--i': index }} key={num}><b>{num}</b><Utensils /><h3>{title}</h3><p>{text}</p>{num === '01' && <p><a className="step-guide" href="/recursos/que-publicar-redes-sociales-restaurante/#cambios-carta">Cómo corregir un menú ya publicado</a></p>}</article>)}</div></section>
}

function PlanCard({ plan }) {
  const message = `Hola, tengo un restaurante en [ciudad] y quiero solicitar la auditoría gratuita. Me interesa el plan ${plan.name} de Dania360. ¿Podéis revisar mi situación y orientarme?`
  return <article className={`plan-card ${plan.popular ? 'plan-popular' : ''}`}>{plan.popular && <span className="popular-label">Redes, web y bot de IA</span>}<div className="plan-head"><span>Plan</span><h3>{plan.name}</h3><p>{plan.tagline}</p></div><div className="price"><small>€</small>{plan.price}<span>/mes</span></div><div className="content-stats">{plan.content.map(([value, label]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}</div><p className="networks">{plan.networks}</p><ul>{plan.features.map(feature => <li key={feature}><Check /> <span>{feature}</span></li>)}</ul><a className={`button ${plan.popular ? 'button-primary' : 'button-outline'}`} href={waLink(message)} target="_blank" rel="noreferrer"><WhatsAppIcon /> Consultar este plan</a></article>
}

function RestaurantContract() {
  return <section className="section services" id="contratar-marketing-restaurante" aria-labelledby="restaurant-contract-title">
    <div className="section-heading"><span>Marketing para restaurantes</span><h2 id="restaurant-contract-title">Agencia de marketing para restaurantes: qué delegas y qué confirma tu equipo.</h2><p>Al comparar una agencia de marketing para restaurantes, pide que la propuesta distinga contenido, atención de mensajes y publicidad. Por 297 €/mes, Growth reúne la gestión orgánica de redes sociales y del perfil de Google con una web y un bot de IA.</p></div>
    <div className="service-grid">
      <article><CalendarDays /><h3>Carta, horarios y novedades</h3><p>Tu equipo confirma platos disponibles, precios, turnos y cambios de carta. Con esa información preparamos el contenido y revisamos dónde debe actualizarse. Las imágenes deben corresponder al material autorizado del negocio.</p></article>
      <article><MessageCircle /><h3>Consultas y solicitudes de reserva</h3><p>Atendemos mensajes de los canales incluidos y derivamos la solicitud al contacto del restaurante. Sala confirma mesas, grupos, disponibilidad y condiciones. Una conversación o un clic todavía no es una reserva.</p></article>
      <article><Search /><h3>Revisión del trabajo realizado</h3><p>El informe mensual permite revisar actividad y visibilidad local. Contrasta las consultas recibidas con las reservas que registra tu equipo para decidir qué información falta explicar en el siguiente calendario.</p></article>
    </div>
    <p className="currency-note">Revisa el <a href="/precios-gestion-redes-sociales/#growth">precio y alcance de Growth</a> y el <a href="/recursos/que-publicar-redes-sociales-restaurante/#mensajes-reservas">ejemplo de respuesta a una solicitud de reserva</a>. Para estudiar tu caso, comparte ciudad, carta vigente y canal de contacto.</p>
    <a className="button button-primary" href={waLink('Hola, quiero delegar las redes de mi restaurante. Mi ciudad, enlace de carta y canal de reservas son:')} target="_blank" rel="noopener noreferrer" data-cta="restaurant-contract">Revisar el marketing de mi restaurante</a>
  </section>
}

function Pricing() {
  return <section className="section pricing" id="planes"><div className="section-heading"><span>Planes mensuales</span><h2>Precio del marketing para restaurantes: gestión de redes desde 297 €/mes.</h2><p>Growth (297 €) y Scale (497 €) gestionan tus redes. Starter (99 €) ofrece web, chat y kit QR de reseñas, pero no gestión de redes sociales. Sin permanencia.</p></div><div className="plans">{plans.map(plan => <PlanCard plan={plan} key={plan.name} />)}</div><p className="currency-note">Precios mensuales expresados en euros (EUR).</p></section>
}

function Resources() {
  return <section className="seo-resources" aria-labelledby="restaurant-resources-title"><div className="seo-resources__inner"><div><span className="eyebrow">GUÍAS PARA DECIDIR</span><h2 id="restaurant-resources-title">Qué publicar y qué revisar antes de contratar redes para tu restaurante.</h2><p>Una carta actualizada, horarios fiables y contenido real ayudan a evitar dudas antes de reservar. Consulta <a href="/recursos/que-publicar-redes-sociales-restaurante/">qué publicar en las redes sociales de un restaurante</a> y <a href="/quienes-somos/">quién atiende tu cuenta en Dania360</a>.</p></div><div className="seo-resources__links"><a href="/recursos/que-publicar-redes-sociales-restaurante/">Guía de contenido para restaurantes</a><a href="/recursos/cuanto-cuesta-gestion-redes-sociales-espana/">Cuánto cuesta gestionar las redes sociales</a><a href="/recursos/que-incluye-servicio-gestion-redes-sociales/">Qué incluye un servicio profesional</a><a href="/recursos/redes-sociales-negocio-local/">Redes sociales para un negocio local</a></div></div></section>
}

function RelatedSectors() {
  return <section className="section related-section" aria-labelledby="related-title"><div className="section-heading"><span>Hostelería y alimentación</span><h2 id="related-title">Otros negocios de hostelería en los que gestionamos redes sociales.</h2><p>Mismo método, adaptado a cada mostrador. Si tu negocio combina varios, lo vemos juntos en la auditoría.</p></div>
    <ul className="related-grid">{related.map(([Icon, name, href, text], index) => <li className="reveal" style={{ '--i': index % 3 }} key={href}><a href={href}><Icon aria-hidden="true" /><strong>Gestión de redes sociales para {name.toLowerCase()}</strong><span>{text}</span></a></li>)}</ul>
    <p className="related-more">Todo el servicio en <a href="/gestion-redes-sociales/">gestión de redes sociales para empresas</a>, el detalle de <a href="/precios-gestion-redes-sociales/">precios de Growth</a> y otros <a href="/sectores/">sectores</a>.</p>
  </section>
}

function FAQ() {
  return <section className="section faq" id="faq"><div className="faq-intro"><span>Preguntas frecuentes</span><h2>Preguntas sobre marketing y redes sociales para restaurantes.</h2><p>Si tu duda depende de tu carta, tus cuentas o tu canal de reservas, podemos revisarla contigo por WhatsApp.</p><a href={waLink()} target="_blank" rel="noreferrer">Preguntar por WhatsApp <ArrowRight size={17} /></a></div><div className="accordion">{faqs.map(([question, answer], index) => <details name="restaurant-faq" open={index === 0} key={question}><summary><span>{question}</span><ChevronDown aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>
}

function Footer() {
  return <><section className="final-cta"><span><i /> ¿Hablamos de tu restaurante?</span><h2>Pide una auditoría gratuita de la web, redes y ficha de Google de tu restaurante.</h2><p>Te diremos qué información falta, qué contenido conviene priorizar y qué plan encaja con tu situación.</p><a className="button button-primary" href={waLink()} target="_blank" rel="noreferrer"><WhatsAppIcon /> Pide tu auditoría gratis <ArrowRight size={18} /></a></section><footer className="footer"><div className="footer-top"><Brand /><p>Servicio especializado de Dania360 para la gestión de redes sociales, web, Google y reputación digital de restaurantes.</p><div><a href={waLink()} target="_blank" rel="noreferrer">WhatsApp: 631 105 772</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Dania 360</span><nav aria-label="Información legal"><a href="/gestion-redes-sociales/">Servicios</a><a href="/sectores/">Sectores</a><a href="/quienes-somos/">Quiénes somos</a><a href="/aviso-legal/">Aviso legal</a><a href="/privacidad/">Privacidad</a><a href="/cookies/">Cookies</a></nav></div></footer><a className="wa-float" href={waLink(floatMessage)} target="_blank" rel="noreferrer" aria-label="Escríbenos por WhatsApp" data-cta="restaurant-float-whatsapp"><WhatsAppIcon size={28} /><span className="wa-float__label">Hablemos de tu restaurante</span></a></>
}

const pending = <strong className="pending">DATO PENDIENTE DE COMPLETAR</strong>
const legalContent = {
  'aviso-legal': { title: 'Aviso legal', intro: 'Información general sobre el titular y las condiciones de uso de dania360.com.', sections: [
    ['Titular del sitio', <><p>Nombre o razón social: {pending}</p><p>Nombre comercial: Dania 360</p><p>NIF/CIF: {pending}</p><p>Domicilio: {pending}</p><p>Contacto: <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · 631 105 772</p></>],
    ['Objeto y condiciones de uso', <p>Este sitio presenta servicios de visibilidad digital para restaurantes. El acceso implica aceptar un uso lícito, responsable y conforme a estas condiciones. La información comercial puede actualizarse sin previo aviso.</p>],
    ['Propiedad intelectual', <p>Los textos, diseños, elementos gráficos, vídeos, marcas y demás contenidos pertenecen a sus titulares o se utilizan con autorización. No está permitida su reproducción o explotación sin autorización previa.</p>],
    ['Responsabilidad', <p>No se garantizan resultados comerciales concretos. La captación de clientes depende, entre otros factores, de la zona, la competencia, la propuesta del restaurante y la continuidad del trabajo.</p>],
  ]},
  privacidad: { title: 'Política de privacidad', intro: 'Cómo tratamos los datos cuando contactas con Dania360.', sections: [
    ['Responsable', <><p>Responsable: {pending}</p><p>Marca comercial: Dania 360</p><p>Contacto de privacidad: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p></>],
    ['Datos y finalidad', <p>Cuando contactas por WhatsApp o correo podemos tratar tu nombre, teléfono, dirección de correo, información de tu restaurante y el contenido de la conversación para responder a tu consulta, preparar una propuesta y gestionar la relación comercial.</p>],
    ['Base jurídica y conservación', <p>El tratamiento se basa en tu consentimiento al contactar y, cuando corresponda, en la ejecución de medidas precontractuales o contractuales. Conservaremos los datos durante el tiempo necesario y los plazos legales aplicables.</p>],
    ['Proveedores y transferencias', <p>El contacto por WhatsApp implica el uso de servicios de Meta. Estos proveedores pueden tratar datos conforme a sus propias políticas y realizar transferencias internacionales mediante los mecanismos de garantía que indiquen.</p>],
    ['Tus derechos', <p>Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad escribiendo a <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos.</p>],
  ]},
  cookies: { title: 'Política de cookies', intro: 'Información sobre el uso de cookies y tecnologías similares.', sections: [
    ['Situación actual', <p>Actualmente dania360.com no instala cookies publicitarias ni utiliza herramientas de analítica que requieran consentimiento. Por este motivo no se muestra un banner de aceptación.</p>],
    ['Cookies técnicas', <p>El proveedor de alojamiento puede utilizar elementos estrictamente necesarios para la seguridad, funcionamiento o entrega del sitio. Estas tecnologías no se emplean para crear perfiles publicitarios.</p>],
    ['Cambios futuros', <p>Si incorporamos analítica, publicidad u otras tecnologías no esenciales, actualizaremos esta política y mostraremos un sistema de consentimiento antes de instalarlas.</p>],
    ['Contacto', <p>Para cualquier consulta sobre esta política puedes escribir a <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>],
  ]},
}

function LegalPage({ type }) {
  const content = legalContent[type]
  useEffect(() => { document.title = `${content.title} | Dania360`; const canonical = document.querySelector('link[rel="canonical"]'); if (canonical) canonical.href = `https://dania360.com/${type}/` }, [content.title, type])
  return <main className="legal-page"><header><Brand dark /><a href="/">Volver a la web</a></header><article><span>Información legal</span><h1>{content.title}</h1><p className="legal-intro">{content.intro}</p>{content.sections.map(([title, body]) => <section key={title}><h2>{title}</h2>{body}</section>)}<small>Última actualización: 29 de agosto de 2026.</small></article><footer><a href="/aviso-legal/">Aviso legal</a><a href="/privacidad/">Privacidad</a><a href="/cookies/">Cookies</a></footer></main>
}

export default function App({ initialPath }) {
  const currentPath = initialPath ?? (typeof window !== 'undefined' ? window.location.pathname : '/gestion-redes-sociales-restaurantes/')
  const path = currentPath.replace(/^\/+|\/+$/g, '')
  if (['aviso-legal', 'privacidad', 'cookies'].includes(path)) return <LegalPage type={path} />
  return <main><div className="progress" aria-hidden="true"><span /></div><Navbar /><Hero /><GrowthSummary /><Stats /><Strategies /><Kinds /><Board /><Networks /><RestaurantContentExample /><HowItWorks /><Services /><RestaurantContract /><Pricing /><Resources /><RelatedSectors /><FAQ /><Footer /></main>
}
