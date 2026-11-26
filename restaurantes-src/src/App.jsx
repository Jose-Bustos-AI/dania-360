import {renderPackages} from '../../package-src/render.mjs'
import faqs from './faq.json'
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

const stats = [['365', 'días de atención con IA'], ['2', 'redes: Instagram y Facebook'], ['5', 'fichas QR para reseñas'], ['199', '€/mes Starter'], ['299', '€/mes Growth']]

const strategies = [
 ['Carta y horarios coherentes', 'Tu web y tu ficha de Google presentan la misma carta, ubicación, horarios y canal de reservas. Starter incluye el mantenimiento de esa presencia.'],
 ['Preguntas antes de reservar', 'Con Growth, la IA orienta sobre la información configurada del restaurante en web, Instagram y Facebook. Las mesas disponibles y los alérgenos los confirma tu equipo.'],
 ['Reseñas con aprobación cuando importa', 'Growth contesta las reseñas de 4 y 5 estrellas automáticamente. Las de 1 a 3 se responden solo con tu visto bueno previo.'],
 ['Una conversación que puedes continuar', 'En la app DANIA ves los mensajes y puedes contestar cuando quieras. Tu equipo conserva la confirmación de grupos, turnos y condiciones.'],
 ['Tu ficha de Google al día', 'Starter analiza y gestiona tu ficha de Google Business y Maps, con una publicación semanal en cuanto la conectas.'],
 ['Visitas y consultas por separado', 'La app muestra analíticas y visitas. Tu equipo registra qué consultas terminaron en reserva para contrastarlas con esos datos.'],
]

const kinds = [
  { id: 'menu', Icon: Soup, name: 'Restaurante de menú', title: 'Restaurante de menú del día', intro: 'El cliente decide a media mañana. El menú tiene que estar publicado antes de que salga a comer y con la información que necesita.', ideas: ['El menú de hoy con primeros, segundos, postre y precio que confirma cocina.', 'Stories del pase a mediodía y aviso de raciones limitadas cuando tú lo indicas.', 'Menús de grupo y de empresa visibles en la ficha de Google y en la web.'], dest: 'Llamada o WhatsApp para reservar mesa al mediodía.', cta: 'Consultar para mi restaurante de menú', msg: 'Hola, tengo un restaurante de menú del día en [ciudad] y quiero mantener la carta al día y atender las consultas de mis clientes. ¿Cómo lo hacéis?' },
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
 [Globe2, 'Chat de tu web', 'La recepcionista con IA de Growth responde con la información configurada; sala confirma la reserva.'],
 [Camera, 'Instagram', 'Growth atiende mensajes y comentarios. Puedes continuar la conversación desde la app DANIA.'],
 [Heart, 'Facebook y Messenger', 'Growth contesta comentarios de Facebook y mensajes de Messenger a cualquier hora.'],
 [MapPin, 'Google y Maps', 'Starter incluye ficha gestionada y una publicación semanal al conectarla. Growth añade respuesta a reseñas con las aprobaciones indicadas.'],
]

const related = [
  [Coffee, 'Cafeterías', '/gestion-redes-sociales-cafeterias/', 'Desayunos, brunch y meriendas.'],
  [Truck, 'Food trucks', '/gestion-redes-sociales-food-trucks/', 'Ubicación y horario de cada día.'],
  [Utensils, 'Catering', '/gestion-redes-sociales-catering/', 'Eventos, bodas y empresas.'],
  [Croissant, 'Panaderías', '/gestion-redes-sociales-panaderias/', 'Horneado del día y encargos.'],
  [CakeSlice, 'Pastelerías', '/gestion-redes-sociales-pastelerias/', 'Tartas por encargo y temporada.'],
  [BedDouble, 'Hoteles', '/gestion-redes-sociales-hoteles/', 'Estancias, restaurante y eventos.'],
]

const services = [
 {icon:Globe2,title:'Web con carta desde Starter',text:'Página nueva o migrada, con dominio propio, alojamiento y mantenimiento. Pides los cambios a DANIA.'},
 {icon:Search,title:'SEO profesional desde Starter',text:'Una página por servicio, alta en buscadores y mejoras mensuales para trabajar la visibilidad del restaurante.'},
 {icon:MapPin,title:'Google y Maps desde Starter',text:'Ficha analizada y gestionada, con una publicación semanal al conectarla y cinco fichas QR para pedir reseñas.'},
 {icon:MessageCircle,title:'Atención con IA con Growth',text:'Chat web, mensajes y comentarios de Instagram y Facebook. Tú también puedes contestar desde la app.'},
 {icon:Star,title:'Reseñas con reglas claras',text:'Growth contesta las de 4 y 5 estrellas automáticamente. Las de 1 a 3 requieren tu visto bueno previo.'},
 {icon:Sparkles,title:'Scale, próximamente',text:'Anuncios en Instagram y Facebook con 100 USD de inversión mensual y ocho piezas: cuatro vídeos de 30 segundos y cuatro imágenes. Todavía no disponible.'},
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
      <p>Presentamos tu restaurante en una web y en Google desde Starter. Con Growth, la IA atiende consultas en web, Instagram y Facebook; tu equipo confirma mesas, disponibilidad y alérgenos.</p>
      <div className="hero-offer"><span>Growth</span><strong>299 <small>€/mes</small></strong><p>Web con carta, SEO y atención con IA.</p></div>
      <div className="hero-actions"><a className="button button-primary" href={waLink()} target="_blank" rel="noreferrer" data-cta="restaurant-hero"><WhatsAppIcon /> Pide tu auditoría gratis <ArrowRight size={18} /></a><a className="button button-ghost" href="#growth">Qué incluye Growth por 299 €/mes</a></div>
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
    <figcaption>Ideas ilustrativas para tu equipo. Growth atiende consultas con IA; no incluye una cuota de publicaciones. No corresponde a un restaurante real.</figcaption>
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
        </dl><a href="/recursos/que-publicar-redes-sociales-restaurante/#cambios-carta">Ver cómo corregimos un menú publicado</a><p className="plate-preview__note">Ideas ilustrativas para tu equipo. Growth atiende consultas con IA; no incluye una cuota de publicaciones. No corresponde a un restaurante real.</p></div>
        <a className="wa-link" href={waLink('Hola, quiero que preparéis el calendario de publicaciones de mi restaurante. Mi ciudad y el enlace a mi carta son:')} target="_blank" rel="noreferrer" data-cta="restaurant-board">Quiero mi calendario de publicaciones</a>
      </aside>
    </div>
  </section>
}

function Networks() {
  return <section className="section networks-section" id="redes" aria-labelledby="networks-title"><div className="section-heading"><span>Mejores redes sociales para restaurantes</span><h2 id="networks-title">Redes sociales para restaurantes: cómo atender cada consulta.</h2><p>Growth responde a consultas en web, Instagram y Facebook. La ficha de Google se trabaja desde Starter. La producción de contenido se incorporará con Scale, todavía no disponible.</p></div>
    <ul className="network-grid">{networks.map(([Icon, name, text], index) => <li className="tilt reveal" style={{ '--i': index }} key={name}><Icon aria-hidden="true" /><h3>{name}</h3><p>{text}</p></li>)}</ul>
  </section>
}

function GrowthSummary() {
  return <section className="sector-offer" id="resumen-growth" aria-labelledby="growth-title"><div className="sector-offer__inner">
    <div><p className="sector-offer__label">Growth · Sin permanencia</p><h2 id="growth-title">Carta en la web y atención con IA para tu restaurante</h2><p>El servicio parte de lo que sirves de verdad: carta vigente, horarios, ambiente y forma de reservar. Las consultas llegan al canal que ya utilizas, sin cambiar la operativa de sala.</p><p className="sector-offer__price"><strong>299 €</strong><span>/mes</span></p></div>
    <div><dl>
      <div><dt>Atención de mensajes con IA</dt><dd>Atención con IA en el chat web, mensajes y comentarios de Instagram y Facebook, incluido Messenger. Puedes contestar desde la app DANIA.</dd></div>
      <div><dt>Web profesional con bot de IA incluido</dt><dd>Chat automático cuando no estás disponible y respuesta desde el móvil con la app DANIA. Dominio propio, alojamiento, cambios solicitados a DANIA y cinco fichas QR para reseñas.</dd></div>
      <div><dt>Perfil de Empresa en Google y reseñas</dt><dd>Ficha gestionada desde Starter, con una publicación semanal al conectarla. Growth contesta reseñas de 4 y 5 estrellas automáticamente; las de 1 a 3 requieren tu aprobación.</dd></div>
    </dl><p className="sector-offer__scope">No incluye inversión en anuncios, una sesión de fotografía presencial ni un motor de reservas a medida. El restaurante confirma reservas, disponibilidad y alérgenos; el chat no sustituye esa confirmación.</p><a href="#planes">Ver los planes y el alcance completo</a></div>
  </div></section>
}

function HowItWorks() {
  const steps = [['01', 'Revisamos carta y canales actuales', 'Analizamos tu propuesta, zona, horarios, canales y forma de recibir reservas o pedidos.'], ['02', 'Preparamos web y atención con IA', 'Organizamos la web y la ficha de Google con Starter. Con Growth configuramos las respuestas con información confirmada del restaurante.'], ['03', 'Atendemos y revisamos las consultas', 'Atendemos comentarios y mensajes con Growth. Tu equipo confirma las reservas y puede continuar las conversaciones desde la app.']]
  return <section className="section how" id="como-funciona"><div className="section-heading"><span>Cómo funciona</span><h2>Cómo organizamos el contenido y la presencia digital de tu restaurante.</h2><p>Partimos de tu carta, tus horarios y el material autorizado para publicar información útil y facilitar la consulta o reserva.</p></div><div className="steps">{steps.map(([num, title, text], index) => <article className="reveal" style={{ '--i': index }} key={num}><b>{num}</b><Utensils /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
}

function Services() {
  return <section className="section services" id="servicios"><div className="section-heading"><span>Todo conectado</span><h2>Marketing digital para restaurantes: web, redes sociales y Google conectados.</h2><p>Starter cubre web, SEO y Google. Growth añade atención con IA. Scale incorporará anuncios y ocho piezas al mes cuando esté disponible.</p></div><div className="service-grid">{services.map((service, index) => {
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
  return <section className="section how" aria-labelledby="restaurant-example-title"><div className="section-heading"><span>Ideas de contenido para tu equipo</span><h2 id="restaurant-example-title">Qué publicar en las redes sociales de un restaurante para que te elijan.</h2><p>Estas ideas no son una cuota de publicaciones de Growth. Los temas se ajustan a la carta, los horarios y el material real de cada local. Antes de publicar, el restaurante confirma platos, precios, disponibilidad y condiciones.</p></div><div className="steps">{examples.map(([num, title, text], index) => <article className="reveal" style={{ '--i': index }} key={num}><b>{num}</b><Utensils /><h3>{title}</h3><p>{text}</p>{num === '01' && <p><a className="step-guide" href="/recursos/que-publicar-redes-sociales-restaurante/#cambios-carta">Cómo corregir un menú ya publicado</a></p>}</article>)}</div></section>
}

function RestaurantContract() {
  return <section className="section services" id="contratar-marketing-restaurante" aria-labelledby="restaurant-contract-title">
    <div className="section-heading"><span>Marketing para restaurantes</span><h2 id="restaurant-contract-title">Agencia de marketing para restaurantes: qué delegas y qué confirma tu equipo.</h2><p>Al comparar una agencia de marketing para restaurantes, pide que la propuesta distinga contenido, atención de mensajes y publicidad. Por 299 €/mes, Growth reúne todo Starter con atención con IA en web, Instagram y Facebook.</p></div>
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
 return <div dangerouslySetInnerHTML={{__html:renderPackages({context:'mi restaurante'})}} />
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
  return <><section className="final-cta"><span><i /> ¿Hablamos de tu restaurante?</span><h2>Pide una auditoría gratuita de la web, redes y ficha de Google de tu restaurante.</h2><p>Te diremos qué información falta, qué contenido conviene priorizar y qué plan encaja con tu situación.</p><a className="button button-primary" href={waLink()} target="_blank" rel="noreferrer"><WhatsAppIcon /> Pide tu auditoría gratis <ArrowRight size={18} /></a></section><footer className="footer"><div className="footer-top"><Brand /><p>Servicio especializado de Dania360 para la gestión de redes sociales, web, Google y reputación digital de restaurantes. Dania360 es una <a href="/">agencia de marketing con IA para pymes</a>.</p><div><a href={waLink()} target="_blank" rel="noreferrer">WhatsApp: 631 105 772</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Dania 360</span><nav aria-label="Información legal"><a href="/gestion-redes-sociales/">Servicios</a><a href="/sectores/">Sectores</a><a href="/quienes-somos/">Quiénes somos</a><a href="/aviso-legal/">Aviso legal</a><a href="/privacidad/">Privacidad</a><a href="/cookies/">Cookies</a></nav></div></footer><a className="wa-float" href={waLink(floatMessage)} target="_blank" rel="noreferrer" aria-label="Escríbenos por WhatsApp" data-cta="restaurant-float-whatsapp"><WhatsAppIcon size={28} /><span className="wa-float__label">Hablemos de tu restaurante</span></a></>
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
