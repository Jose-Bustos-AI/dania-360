import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, CalendarDays, Check, ChevronDown, Globe2, MapPin, Menu, MessageCircle, Search, Sparkles, Star, Utensils, X } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const WA_NUMBER = '34631105772'
const EMAIL = 'hola@dania360.com'
const generalMessage = 'Hola, he visto el servicio de Dania360 para restaurantes. Tengo un restaurante en [ciudad] y quiero mejorar mis redes sociales y conseguir más reservas. ¿Qué plan me recomendáis?'
const waLink = (message = generalMessage) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`

const plans = [
  {
    name: 'Starter', price: '99', tagline: 'La base profesional para dejar de improvisar.',
    networks: 'Instagram · Facebook', content: [['20', 'publicaciones al mes'], ['5', 'publicaciones por semana']],
    features: [
      'Página web profesional incluida o gestión de tu web actual',
      '3 posts de imagen y 2 carruseles por semana',
      'Contenido y textos creados con IA y revisados por el equipo',
      'Programación automática y calendario mensual',
      '1 actualización mensual de tu página web',
      'Informe mensual de actividad',
      'Dominio .com, hosting e imágenes con IA incluidos',
    ],
  },
  {
    name: 'Growth', price: '297', tagline: 'Para convertir tu presencia local en oportunidades.',
    networks: 'Instagram · Facebook · TikTok · Pinterest · Google', content: [['30', 'publicaciones al mes'], ['7', 'días de actividad']], popular: true,
    features: [
      'Influencer clon digital: la cara de tu restaurante creada con IA',
      '2 vídeos, 2 carruseles y 3 posts de imagen por semana',
      'Google Business Profile: 1 publicación semanal',
      'Respuesta a comentarios y mensajes privados',
      'Gestión y respuesta de reseñas en Google',
      'Republicación automática en Stories de Instagram',
      'Derivación de consultas a tu teléfono o WhatsApp',
      'Informe mensual de actividad y visibilidad local',
    ],
  },
  {
    name: 'Scale', price: '497', tagline: 'Visibilidad integral, SEO y buscadores con IA.',
    networks: 'Instagram · Facebook · TikTok · LinkedIn · X · YouTube · Pinterest · Google', content: [['60', 'publicaciones al mes'], ['2', 'publicaciones diarias']],
    features: [
      'Optimización para buscadores con IA como ChatGPT',
      'Posicionamiento SEO continuo de tu página web',
      '12 vídeos, 12 carruseles y 36 posts de imagen al mes',
      '2 publicaciones semanales en Google Business Profile',
      'Contenido adaptado para LinkedIn, X y YouTube',
      '1 contenido y 1 página optimizados para SEO al mes',
      'Gestión prioritaria de comentarios, mensajes y reseñas',
      'Informe mensual de posicionamiento y visibilidad',
    ],
  },
]

const services = [
  { icon: Globe2, title: 'Una web que abre el apetito', text: 'Creamos o gestionamos una web profesional para que tu carta, tu propuesta y tu forma de reservar se entiendan a la primera.' },
  { icon: Sparkles, title: 'Contenido siempre activo', text: 'Creamos, revisamos, programamos y publicamos contenido constante para que tu restaurante no desaparezca de la mente del cliente.' },
  { icon: MapPin, title: 'Google y Maps trabajados', text: 'Desde Growth mantenemos activa tu ficha, gestionamos reseñas y reforzamos tu visibilidad cuando alguien busca dónde comer.' },
  { icon: MessageCircle, title: 'Consultas que llegan a ti', text: 'Gestionamos la conversación y derivamos las oportunidades a tu teléfono o WhatsApp para que puedas convertirlas en reservas.' },
  { icon: Star, title: 'Reputación que genera confianza', text: 'Respondemos reseñas y comentarios con el tono de tu restaurante para que más personas se decidan por ti.' },
  { icon: Search, title: 'Visibilidad más allá de las redes', text: 'Con Scale trabajamos SEO y buscadores con IA para que tu restaurante pueda aparecer en más momentos de decisión.' },
]

const faqs = [
  ['¿Cómo puede Dania360 ayudar a mi restaurante?', 'Hacemos que tu restaurante tenga una presencia profesional y constante en la web, las redes sociales y Google. Así aumentan las posibilidades de que más personas te encuentren, confíen y contacten o reserven.'],
  ['¿Gestionáis publicidad pagada?', 'No. En este momento nuestros planes se centran en presencia orgánica, contenido, web, Google Business Profile, reputación y posicionamiento. El presupuesto de tu plan no se destina a anuncios.'],
  ['¿Necesito tener ya una página web?', 'No. El plan Starter incluye una página web profesional o, si ya tienes una compatible, podemos gestionar y actualizar la actual.'],
  ['¿Ayudáis a aparecer en Google y Google Maps?', 'Sí. Desde Growth trabajamos Google Business Profile, publicaciones y reseñas. Scale añade posicionamiento SEO continuo y optimización para buscadores con IA como ChatGPT.'],
  ['¿Garantizáis un número concreto de reservas?', 'No sería serio prometer una cifra exacta. Nuestro trabajo es aumentar tu visibilidad, mejorar tu imagen y crear más oportunidades de contacto. Los resultados dependen de la zona, la propuesta, la competencia y el tiempo de trabajo.'],
  ['¿Tengo que crear yo las fotos, vídeos y textos?', 'Necesitaremos la información y el material real que quieras compartir. También creamos imágenes y contenido con IA, y nuestro equipo revisa y adapta cada pieza antes de publicarla.'],
  ['¿Hay permanencia?', 'No. El servicio es mensual y puedes cancelar cuando quieras. No hay contratos largos ni gastos ocultos.'],
  ['¿Cómo empezamos?', 'Nos escribes por WhatsApp, conocemos tu restaurante y te recomendamos el plan que tenga sentido. Después conectamos tus canales y preparamos el calendario de trabajo.'],
]

function WhatsAppIcon({ size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-2.35-1.17-3.89-3.55-4.01-3.72-.173-.297-.018-.458.13-.606.323-.32.61-.75.744-1.04.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-2.79 3.05.87 7.53 1.27 8.06.149.198 2.096 3.2 5.077 4.487 3.6 1.55 4.33.67 5.11.6.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785a9.87 9.87 0 01-5.034-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26C2.168 6.443 6.603 2.01 12.055 2.01c5.45 0 9.88 4.44 9.88 9.89-.003 5.45-4.437 9.884-9.885 9.884M20.46 3.49A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
}

function Brand({ dark = false }) {
  return <a className={`brand ${dark ? 'brand-dark' : ''}`} href="/" aria-label="Dania360, página principal"><img className="brand-logo" src="/logo-dania360-transparent.webp" width="42" height="42" alt="" /><span>DANIA</span><b>360</b><small>para restaurantes</small></a>
}

function Navbar() {
  const [open, setOpen] = useState(false)
  return <header className="nav-wrap"><nav className="navbar" aria-label="Navegación principal">
    <Brand dark />
    <div className={`nav-links ${open ? 'nav-open' : ''}`}>
      <a href="#como-funciona" onClick={() => setOpen(false)}>Cómo funciona</a><a href="#servicios" onClick={() => setOpen(false)}>Qué gestionamos</a><a href="#planes" onClick={() => setOpen(false)}>Planes</a><a href="#faq" onClick={() => setOpen(false)}>Preguntas</a>
      <a className="nav-mobile-cta" href={waLink()} target="_blank" rel="noreferrer"><WhatsAppIcon /> Hablar por WhatsApp</a>
    </div>
    <a className="button nav-cta" href={waLink()} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} /> Quiero más clientes</a>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'}>{open ? <X /> : <Menu />}</button>
  </nav></header>
}

function Hero() {
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let st
    let raf

    document.addEventListener('touchstart', () => {
      video.play()
      video.pause()
    }, { once: true })

    video.style.transform = 'translateZ(0)'
    video.style.willChange = 'transform'
    ScrollTrigger.config({ limitCallbacks: true, syncInterval: 40 })

    const initScrub = () => {
      const dur = video.duration
      if (!dur || !isFinite(dur)) return

      setVideoReady(true)
      video.currentTime = 0

      let currentT = 0
      let targetT = 0
      const lerpFactor = 0.1

      const tick = () => {
        currentT += (targetT - currentT) * lerpFactor
        if (Math.abs(video.currentTime - currentT) > 0.015) video.currentTime = currentT
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)

      st = ScrollTrigger.create({
        trigger: '.hero-section',
        start: 'top top',
        end: '+=200%',
        scrub: 2.5,
        pin: true,
        pinSpacing: true,
        fastScrollEnd: true,
        preventOverlaps: true,
        onUpdate: (self) => { targetT = Math.min(self.progress * dur, dur - (1 / 24)) },
      })
    }

    const onReady = () => {
      video.removeEventListener('loadedmetadata', onReady)
      video.removeEventListener('loadeddata', onReady)
      requestAnimationFrame(() => initScrub())
    }

    if (video.readyState >= 1) requestAnimationFrame(() => initScrub())
    else {
      video.addEventListener('loadedmetadata', onReady)
      video.addEventListener('loadeddata', onReady)
    }

    return () => {
      video.removeEventListener('loadedmetadata', onReady)
      video.removeEventListener('loadeddata', onReady)
      if (st) st.kill()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <section className="hero hero-section" id="inicio" ref={heroRef}>
    <video ref={videoRef} className="hero-media" src="/gestion-redes-sociales-restaurantes/hero-video-scrub.mp4" muted playsInline preload="metadata" poster="/og-mas-clientes.png" style={{ opacity: videoReady ? 1 : 0, transition: 'opacity .5s ease' }} /><div className="hero-shade" />
    <div className="hero-inner"><div className="hero-copy">
      <span className="eyebrow"><i /> Especialistas en restaurantes</span>
      <h1>Gestión de redes sociales<em>para restaurantes.</em></h1>
      <p>Gestionamos el contenido, la web, Google y las reseñas de tu restaurante para mejorar su visibilidad y generar más oportunidades de contacto y reserva.</p>
      <div className="hero-actions"><a className="button button-primary" href={waLink()} target="_blank" rel="noreferrer"><WhatsAppIcon /> Quiero más reservas <ArrowRight size={18} /></a><a className="button button-ghost" href="#planes">Ver planes desde 99 USD</a></div>
      <small className="cta-note">Te orientamos por WhatsApp · Sin compromiso</small>
      <div className="trust-row"><span><Check /> Sin permanencia</span><span><Check /> Todo gestionado</span><span><Check /> Contenido revisado</span></div>
    </div><div className="hero-panel" aria-label="Resumen del servicio de Dania360 para restaurantes">
      <div className="panel-head"><span>Tu presencia digital</span><b>En marcha</b></div>
      <div className="panel-goal"><small>Objetivo</small><strong>Más clientes para tu restaurante</strong><p>Más personas te encuentran, confían y contactan.</p></div>
      <div className="panel-grid"><div><Globe2 /><small>Web</small><b>Incluida</b></div><div><CalendarDays /><small>Contenido</small><b>20–60/mes</b></div><div><MapPin /><small>Google</small><b>Growth · Scale</b></div><div><MessageCircle /><small>Consultas</small><b>A tu WhatsApp</b></div></div>
    </div></div>
  </section>
}

function HowItWorks() {
  const steps = [['01', 'Conocemos tu restaurante', 'Analizamos tu propuesta, tu zona, tus canales y qué tipo de cliente quieres atraer.'], ['02', 'Creamos tu sistema de visibilidad', 'Preparamos web, calendario, contenidos y presencia en Google según el plan elegido.'], ['03', 'Publicamos, cuidamos y mejoramos', 'Tu presencia sigue activa cada semana mientras tú te concentras en ofrecer una gran experiencia.']]
  return <section className="section how" id="como-funciona"><div className="section-heading"><span>Cómo funciona</span><h2>Más visibilidad sin convertirte en experto en marketing.</h2><p>Nos ocupamos del trabajo constante que hace que un restaurante se vea profesional y resulte fácil de elegir.</p></div><div className="steps">{steps.map(([num, title, text]) => <article key={num}><b>{num}</b><Utensils /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
}

function Services() {
  return <section className="section services" id="servicios"><div className="section-heading"><span>Todo conectado</span><h2>No necesitas publicar más por publicar. Necesitas que te encuentren y te elijan.</h2><p>Combinamos presencia, contenido, reputación y posicionamiento para acompañar al cliente desde el descubrimiento hasta el contacto.</p></div><div className="service-grid">{services.map(service => {
    const ServiceIcon = service.icon
    return <article key={service.title}><ServiceIcon /><h3>{service.title}</h3><p>{service.text}</p></article>
  })}</div><div className="manifesto"><p>Una agencia genérica vende publicaciones.</p><h2>Dania360 construye la presencia digital de tu restaurante para generar nuevas oportunidades.</h2></div></section>
}

function PlanCard({ plan }) {
  const message = `Hola, tengo un restaurante en [ciudad] y quiero mejorar mis redes sociales y conseguir más reservas. Me interesa el plan ${plan.name} de Dania360. ¿Podéis orientarme?`
  return <article className={`plan-card ${plan.popular ? 'plan-popular' : ''}`}>{plan.popular && <span className="popular-label">Más elegido</span>}<div className="plan-head"><span>Plan</span><h3>{plan.name}</h3><p>{plan.tagline}</p></div><div className="price"><small>$</small>{plan.price}<span>/mes</span></div><div className="content-stats">{plan.content.map(([value, label]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}</div><p className="networks">{plan.networks}</p><ul>{plan.features.map(feature => <li key={feature}><Check /> <span>{feature}</span></li>)}</ul><a className={`button ${plan.popular ? 'button-primary' : 'button-outline'}`} href={waLink(message)} target="_blank" rel="noreferrer"><WhatsAppIcon /> Consultar este plan</a></article>
}

function Pricing() {
  return <section className="section pricing" id="planes"><div className="section-heading"><span>Planes mensuales</span><h2>Elige hasta dónde quieres llevar la visibilidad de tu restaurante.</h2><p>Sin permanencia. Si no sabes cuál necesitas, cuéntanos tu caso por WhatsApp y te recomendaremos solo lo que tenga sentido.</p></div><div className="plans">{plans.map(plan => <PlanCard plan={plan} key={plan.name} />)}</div><p className="currency-note">Precios mensuales expresados en dólares estadounidenses (USD).</p></section>
}

function FAQ() {
  const [open, setOpen] = useState(0)
  return <section className="section faq" id="faq"><div className="faq-intro"><span>Preguntas frecuentes</span><h2>Todo claro antes de empezar.</h2><p>Si todavía te queda alguna duda, escríbenos. Te orientaremos sin compromiso y sin intentar venderte un plan que no necesitas.</p><a href={waLink()} target="_blank" rel="noreferrer">Preguntar por WhatsApp <ArrowRight size={17} /></a></div><div className="accordion">{faqs.map(([question, answer], index) => <article className={open === index ? 'faq-open' : ''} key={question}><button onClick={() => setOpen(open === index ? -1 : index)}><span>{question}</span><ChevronDown /></button><div><p>{answer}</p></div></article>)}</div></section>
}

function Footer() {
  return <><section className="final-cta"><span><i /> ¿Hablamos de tu restaurante?</span><h2>Tu próxima reserva puede empezar con una búsqueda, una publicación o una reseña.</h2><p>Hagamos que tu restaurante esté preparado para aparecer y convencer.</p><a className="button button-primary" href={waLink()} target="_blank" rel="noreferrer"><WhatsAppIcon /> Quiero más reservas <ArrowRight size={18} /></a></section><footer className="footer"><div className="footer-top"><Brand /><p>Servicio especializado de Dania360 para la gestión de redes sociales, web, Google y reputación digital de restaurantes.</p><div><a href={waLink()} target="_blank" rel="noreferrer">WhatsApp: 631 105 772</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Dania 360</span><nav aria-label="Información legal"><a href="/gestion-redes-sociales/">Servicios</a><a href="/quienes-somos/">Quiénes somos</a><a href="/aviso-legal/">Aviso legal</a><a href="/privacidad/">Privacidad</a><a href="/cookies/">Cookies</a></nav></div></footer><a className="whatsapp-float" href={waLink()} target="_blank" rel="noreferrer" aria-label="Hablar con Dania360 por WhatsApp"><WhatsAppIcon size={25} /><span>¿Hablamos?</span></a></>
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

export default function App() {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '')
  if (['aviso-legal', 'privacidad', 'cookies'].includes(path)) return <LegalPage type={path} />
  return <main><Navbar /><Hero /><HowItWorks /><Services /><Pricing /><FAQ /><Footer /></main>
}

